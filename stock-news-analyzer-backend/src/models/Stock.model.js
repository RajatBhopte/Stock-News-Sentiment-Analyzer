import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true, // Fast lookup by symbol (e.g., 'TCS')
    },
    name: { type: String, required: true },
    keywords: [{ type: String }], // Keywords for RSS/API searching
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Stock", stockSchema);
