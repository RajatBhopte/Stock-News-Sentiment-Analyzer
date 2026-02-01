import News from "../models/news.model.js";

export const getLatestStockNews = async (req, res) => {
  try {
    const { stockId } = req.params;

    const latestNews = await News.find({
      stock: stockId,
      processed: true,
    })
      .sort({ publishedAt: -1 }) // Get the most recent first
      .limit(5);

    res.status(200).json(latestNews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching news", error: error.message });
  }
};
