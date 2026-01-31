import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Stock News Analyzer Backend is running');
});

export default app;