import axios from "axios";

const HF_URL =
  "https://router.huggingface.co/hf-inference/models/ProsusAI/finbert";

const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post(
      HF_URL,
      {
        inputs: text.substring(0, 512), // correct key
      },
      {
        headers: {
          // ✅ correct key
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    // HF returns nested array
    const predictions = response.data[0];

    // get highest score
    const top = predictions.reduce((prev, curr) =>
      curr.score > prev.score ? curr : prev,
    );

    let score = 0;
    if (top.label === "positive") score = top.score;
    if (top.label === "negative") score = -top.score;

    return {
      score: Number(score.toFixed(2)),
      label: top.label,
    };
  } catch (error) {
    console.error("Sentiment Analysis Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return null;
  }
};

export default analyzeSentiment;
