import express from 'express';
import sentimentRoutes from './routes/sentiment.routes.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Stock News Analyzer Backend is running');
});

app.use('/api/sentiment', sentimentRoutes);


export default app;