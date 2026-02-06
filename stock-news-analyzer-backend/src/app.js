import express from 'express';
import sentimentRoutes from './routes/sentiment.routes.js';
import newsRoutes from './routes/news.routes.js';
import cors from "cors"; // Import CORS middleware

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('Stock News Analyzer Backend is running');
});

app.use('/api/sentiment', sentimentRoutes);
app.use("/api/news", newsRoutes);


export default app;