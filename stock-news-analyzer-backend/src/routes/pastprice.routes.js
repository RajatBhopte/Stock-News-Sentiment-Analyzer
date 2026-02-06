import express from "express"; 

const router = express.Router();
import getPriceSentimentData from "../controllers/paststockprice.controller.js";

router.get("/price-sentiment/:stockId", getPriceSentimentData);
export default router;
