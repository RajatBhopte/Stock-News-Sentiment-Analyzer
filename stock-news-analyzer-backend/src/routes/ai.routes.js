import express from "express";
import { getStockAISummary, getStockPricePrediction } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/summary/:stockId", getStockAISummary);
router.get("/predict/:stockId", getStockPricePrediction);

export default router;
