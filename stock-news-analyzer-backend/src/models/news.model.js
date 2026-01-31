import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    content: String,

    publishedAt: {
      type: Date,
      required: true,
    },

    contentHash: {
      type: String,
      unique: true,
      required: true,
    },

    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
      default: null,
    },

    sentimentLabel: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: null,
    },

    processed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

newsSchema.index({ stock: 1, publishedAt: -1 });

export default mongoose.model("News", newsSchema);
