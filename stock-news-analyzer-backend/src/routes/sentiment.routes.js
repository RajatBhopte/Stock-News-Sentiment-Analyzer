import express from "express";
import { getStockSentimentTrend } from "../controllers/sentiment.controller.js";

const router = express.Router();

// GET /api/sentiment/trend/:stockId
router.get("/trend/:stockId", getStockSentimentTrend);

export default router;
