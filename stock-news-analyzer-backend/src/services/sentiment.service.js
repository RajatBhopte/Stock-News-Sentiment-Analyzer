import axios from "axios";

const HF_URL =
  "https://router.huggingface.co/hf-inference/models/ProsusAI/finbert";

// Tried in order. The lite model matches the full flash model's calibration on
// mixed headlines at ~1/12th the latency, and free-tier request quotas are
// per-model — so a spent quota on the first still leaves the second usable.
const GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.6-flash"];

const geminiUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

// How many headlines go into a single Gemini call. Keeps the prompt well inside
// token limits while cutting 100 articles down from 100 requests to 5.
export const BATCH_SIZE = 20;

// Statuses that will never succeed on a retry (bad token, wrong model name,
// dead billing). 429 is deliberately NOT here — it is retryable, just later.
const FATAL_STATUSES = new Set([400, 401, 402, 403, 404]);

const VALID_LABELS = new Set(["positive", "negative", "neutral"]);

/**
 * Wraps an upstream failure with what the job needs to decide what to do:
 * retry it, wait longer first, or give up on this provider entirely.
 */
class SentimentError extends Error {
  constructor(message, { fatal = false, status = null, retryAfterMs = null } = {}) {
    super(message);
    this.name = "SentimentError";
    this.fatal = fatal;
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

/** Gemini reports how long to wait on a 429 — honour it instead of guessing. */
const parseRetryAfter = (error) => {
  const details = error.response?.data?.error?.details;
  if (Array.isArray(details)) {
    for (const d of details) {
      const secs = parseFloat(d?.retryDelay);
      if (Number.isFinite(secs)) return Math.ceil(secs * 1000);
    }
  }
  const match = /retry in ([\d.]+)s/i.exec(
    error.response?.data?.error?.message || "",
  );
  return match ? Math.ceil(parseFloat(match[1]) * 1000) : null;
};

const toSentimentError = (error, provider) => {
  const status = error.response?.status ?? null;
  const detail =
    error.response?.data?.error?.message ||
    error.response?.data?.error ||
    error.message;
  return new SentimentError(
    `${provider} failed${status ? ` (${status})` : ""}: ${
      typeof detail === "string" ? detail : JSON.stringify(detail)
    }`,
    {
      fatal: status !== null && FATAL_STATUSES.has(status),
      status,
      retryAfterMs: status === 429 ? parseRetryAfter(error) : null,
    },
  );
};

/**
 * Forces every result inside the News schema's constraints. sentimentScore is
 * min:-1/max:1 and sentimentLabel is an enum, so an out-of-range score or a
 * stray label (e.g. "bullish") would throw a ValidationError on save.
 */
const normalize = (rawScore, rawLabel) => {
  let score = Number(rawScore);
  if (!Number.isFinite(score)) score = 0;
  score = Number(Math.max(-1, Math.min(1, score)).toFixed(2));

  let label = String(rawLabel ?? "").toLowerCase();
  if (!VALID_LABELS.has(label)) {
    label = score > 0.15 ? "positive" : score < -0.15 ? "negative" : "neutral";
  }
  return { score, label };
};

const buildPrompt = (headlines) =>
  [
    "You are a financial sentiment classifier for Indian stock market news.",
    "For EACH numbered headline, judge the likely impact on that company's share price.",
    "Rules:",
    "- score: float from -1.00 (very bearish) to 1.00 (very bullish). Use the full range;",
    "  reflect genuine uncertainty with values near 0 rather than saturating at +/-1.",
    "- label: exactly one of positive, negative, neutral.",
    "- Purely factual or scheduling news with no directional implication is neutral, score near 0.",
    "- Mixed news (good result, weak guidance) should net out, not blindly pick one side.",
    "Return one object per headline, in the same order, with its 1-based index.",
    "",
    ...headlines.map((h, i) => `${i + 1}. ${h}`),
  ].join("\n");

const RESPONSE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      index: { type: "INTEGER" },
      score: { type: "NUMBER" },
      label: { type: "STRING", enum: ["positive", "negative", "neutral"] },
    },
    required: ["index", "score", "label"],
  },
};

const callGemini = async (model, headlines) => {
  const key = process.env.Gemini_API.trim();
  let data;
  try {
    ({ data } = await axios.post(
      `${geminiUrl(model)}?key=${key}`,
      {
        contents: [{ parts: [{ text: buildPrompt(headlines) }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      },
      { headers: { "Content-Type": "application/json" }, timeout: 90000 },
    ));
  } catch (error) {
    throw toSentimentError(error, `Gemini/${model}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    // An empty candidate usually means blocked or truncated output — transient
    // enough to be worth another attempt.
    throw new SentimentError(`Gemini/${model} returned no content`, {
      fatal: false,
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new SentimentError(`Gemini/${model} returned unparseable JSON`, {
      fatal: false,
    });
  }

  const results = new Array(headlines.length).fill(null);
  for (const item of Array.isArray(parsed) ? parsed : []) {
    const i = Number(item?.index) - 1;
    if (Number.isInteger(i) && i >= 0 && i < headlines.length) {
      results[i] = normalize(item.score, item.label);
    }
  }
  return results;
};

/**
 * Scores a batch of headlines in a single Gemini call, walking GEMINI_MODELS
 * until one answers.
 * @param {string[]} headlines
 * @returns {Promise<Array<{score:number,label:string}|null>>} aligned to input
 *   order; an entry is null when the model skipped that headline.
 */
export const scoreBatch = async (headlines) => {
  if (!process.env.Gemini_API?.trim()) {
    throw new SentimentError("Gemini_API is not set in .env", { fatal: true });
  }

  let lastError;
  for (const model of GEMINI_MODELS) {
    try {
      return await callGemini(model, headlines);
    } catch (error) {
      lastError = error;
      // A problem with this specific model (bad name, or its own quota spent)
      // still leaves the next one worth trying.
      if (error.fatal || error.status === 429) continue;
      throw error;
    }
  }
  throw lastError;
};

/**
 * Single-headline scoring via FinBERT on Hugging Face. Kept as the fallback
 * path for when every Gemini model is unavailable.
 * @param {string} text
 * @returns {Promise<{score:number,label:string}>}
 */
export const analyzeSentiment = async (text) => {
  let response;
  try {
    response = await axios.post(
      HF_URL,
      { inputs: text.substring(0, 512) },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );
  } catch (error) {
    throw toSentimentError(error, "HuggingFace");
  }

  const predictions = response.data?.[0];
  if (!Array.isArray(predictions) || predictions.length === 0) {
    throw new SentimentError("HuggingFace returned an unexpected payload", {
      fatal: false,
    });
  }

  const top = predictions.reduce((prev, curr) =>
    curr.score > prev.score ? curr : prev,
  );

  const label = String(top.label).toLowerCase();
  const signed =
    label === "positive" ? top.score : label === "negative" ? -top.score : 0;

  return normalize(signed, label);
};

export { SentimentError };
export default analyzeSentiment;
