import express from 'express';
import sentimentRoutes from './routes/sentiment.routes.js';
import newsRoutes from './routes/news.routes.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Stock News Analyzer Backend is running');
});

app.use('/api/sentiment', sentimentRoutes);
app.use("/api/news", newsRoutes);


export default app;