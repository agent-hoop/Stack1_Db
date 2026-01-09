import express from "express";
import Entry from "../models/Entry.js";

const router = express.Router();

// GET all
router.get("/", async (_, res) => {
  const entries = await Entry.find().sort({ createdAt: -1 });
  res.json(entries);
});

// CREATE
router.post("/", async (req, res) => {
  const entry = new Entry(req.body);
  await entry.save();
  res.status(201).json(entry);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Entry.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
