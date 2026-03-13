import express from "express";
import { getSectorHeatmap } from "../controllers/sector.controller.js";

const router = express.Router();

router.get("/heatmap", getSectorHeatmap);

export default router;
