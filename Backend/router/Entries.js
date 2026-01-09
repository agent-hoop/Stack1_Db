import express from "express";
import Entry from "../models/Entry.js";

const router = express.Router();

// GET all
// GET entries (filtered by category)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const entries = await Entry
      .find(filter)
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entries" });
  }
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

// Get Specific Data
// Only Notes
router.get('/notes',)



export default router;
