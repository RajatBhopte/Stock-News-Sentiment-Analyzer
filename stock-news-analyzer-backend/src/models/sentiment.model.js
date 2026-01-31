import mongoose from "mongoose";

const sentimentSchema = new mongoose.Schema(
  {
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    date: {
      type: String, // format: "2026-01-31"
      required: true,
    },
    averageScore: {
      type: Number,
      default: 0, // Better than required:true if no articles exist yet
    },
    label: {
      type: String,
      enum: ["bullish", "bearish", "neutral"],
      default: "neutral",
    },
    articleCount: {
      type: Number,
      default: 0,
    },
    distribution: {
      positive: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

// This ensures we never have two records for TCS on 2026-01-31
sentimentSchema.index({ stock: 1, date: 1 }, { unique: true });

export default mongoose.model("Sentiment", sentimentSchema);
