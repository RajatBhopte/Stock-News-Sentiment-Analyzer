// routes/indicesRoutes.js
import express from "express";
import { getIndices, getSingleIndex } from "../controllers/indicesController.js";

const router = express.Router();

// GET /api/indices - Get all indices
router.get("/", getIndices);

// GET /api/indices/:name - Get single index (e.g., /api/indices/nifty-50)
router.get("/:name", getSingleIndex);

export default router;
