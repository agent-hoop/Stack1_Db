import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: String,
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      enum: ["Poems", "Stories", "Media", "Notes"],
      required: true,
    },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
    content: String,
    mediaType: String,
    mediaUrl: String,
    views: { type: Number, default: 0 },
    publishDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Entry", EntrySchema);
