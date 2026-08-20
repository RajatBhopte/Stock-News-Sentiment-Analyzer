import News from "../models/news.model.js";
import analyzeSentiment  from "../services/sentiment.service.js";

const runSentimentJob = async () => {
  console.log("--- Starting Sentiment Analysis Job ---");

  // Find news that haven't been analyzed yet
  const totalPending = await News.countDocuments({ processed: false });
  const pendingNews = await News.find({ processed: false }).limit(100);
  console.log(`[AI] Processing ${pendingNews.length} of ${totalPending} pending articles...`);

  for (const article of pendingNews) {
    const result = await analyzeSentiment(article.title);

    if (result) {
      article.sentimentScore = result.score;
      article.sentimentLabel = result.label;
      article.processed = true;
      await article.save();
      console.log(
        `✅ Analyzed: ${article.title.substring(0, 30)}... [${result.label}]`,
      );
    }

    // Small delay to respect Hugging Face free tier rate limits
    await new Promise((res) => setTimeout(res, 500));
  }

  console.log("--- Sentiment Analysis Job Completed ---");
};

export default runSentimentJob;

