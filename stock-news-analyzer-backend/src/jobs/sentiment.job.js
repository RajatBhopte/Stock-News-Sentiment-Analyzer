import News from "../models/news.model.js";
import {
  analyzeSentiment,
  scoreBatch,
  BATCH_SIZE,
} from "../services/sentiment.service.js";

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [2000, 6000];

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const chunk = (items, size) => {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};

/**
 * Retries transient upstream failures (5xx, 429, timeouts) with backoff.
 * Fatal failures — dead quota, bad token, bad model name — rethrow immediately
 * so the caller can stop instead of repeating a request that cannot succeed.
 */
const withRetry = async (fn, describe) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.fatal || attempt >= MAX_ATTEMPTS) throw error;
      // On a 429 the provider tells us exactly how long to wait; guessing 2s
      // just burns another rejection. Cap it so a bad value can't stall the run.
      const wait = Math.min(
        error.retryAfterMs ?? RETRY_DELAYS_MS[attempt - 1] ?? 6000,
        70000,
      );
      console.warn(
        `[AI] ${describe} failed (${error.status ?? "network"}), retry ${attempt}/${
          MAX_ATTEMPTS - 1
        } in ${wait / 1000}s`,
      );
      await sleep(wait);
    }
  }
};

const persist = async (article, result) => {
  article.sentimentScore = result.score;
  article.sentimentLabel = result.label;
  article.processed = true;
  await article.save();
};

const runSentimentJob = async () => {
  console.log("--- Starting Sentiment Analysis Job ---");

  const totalPending = await News.countDocuments({ processed: false });
  const pendingNews = await News.find({ processed: false }).limit(100);
  console.log(
    `[AI] Processing ${pendingNews.length} of ${totalPending} pending articles...`,
  );

  if (pendingNews.length === 0) {
    console.log("--- Sentiment Analysis Job Completed ---");
    return;
  }

  let analyzed = 0;
  let skipped = 0;
  let geminiAvailable = true;
  let aborted = null;

  for (const batch of chunk(pendingNews, BATCH_SIZE)) {
    let results = null;

    // ── Primary: one Gemini call for the whole batch ──
    if (geminiAvailable) {
      try {
        results = await withRetry(
          () => scoreBatch(batch.map((a) => a.title)),
          `Gemini batch of ${batch.length}`,
        );
      } catch (error) {
        if (error.fatal) {
          // Quota gone or key/model invalid — stop trying Gemini for this run
          // rather than repeating a doomed call for every remaining batch.
          console.warn(`[AI] Gemini unavailable, falling back to FinBERT: ${error.message}`);
          geminiAvailable = false;
        } else {
          console.warn(`[AI] Gemini batch failed after retries: ${error.message}`);
        }
      }
    }

    // ── Fallback: FinBERT, one request per headline ──
    if (!results) {
      results = [];
      for (const article of batch) {
        try {
          results.push(
            await withRetry(
              () => analyzeSentiment(article.title),
              "FinBERT request",
            ),
          );
        } catch (error) {
          results.push(null);
          if (error.fatal) {
            aborted = error;
            break;
          }
          console.warn(`[AI] FinBERT failed: ${error.message}`);
        }
        await sleep(300);
      }
    }

    for (let i = 0; i < batch.length; i++) {
      const result = results[i];
      if (!result) {
        skipped++;
        continue;
      }
      await persist(batch[i], result);
      analyzed++;
      console.log(
        `✅ ${batch[i].title.substring(0, 40)}... [${result.label} ${result.score > 0 ? "+" : ""}${result.score}]`,
      );
    }

    if (aborted) break;
  }

  if (aborted) {
    console.error(
      `[AI] Run aborted — both providers are unusable: ${aborted.message}`,
    );
  }

  // Skipped articles keep processed:false, so the next run picks them up again.
  console.log(
    `[AI] Analyzed ${analyzed}, left pending ${skipped}${
      geminiAvailable ? "" : " (Gemini was unavailable this run)"
    }`,
  );
  console.log("--- Sentiment Analysis Job Completed ---");
};

export default runSentimentJob;
