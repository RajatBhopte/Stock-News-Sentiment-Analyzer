import express from "express";
import { getLatestStockNews } from "../controllers/news.controller.js";

const router = express.Router();

// GET /api/news/latest/:stockId
// This will return the top 5 headlines for the specific stock
router.get("/latest/:stockId", getLatestStockNews);

export default router;
