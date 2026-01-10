import express from "express";
import mongoose from "mongoose";
import Entry from "../models/Entry.js";

const router = express.Router();

/**
 * GET ALL ENTRIES
 * /api/entries?category=Notes
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) filter.category = category;

    const entries = await Entry.find(filter).sort({ createdAt: -1 });

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

/**
 * GET SINGLE ENTRY BY ID
 * /api/entries/:id
 * optional: ?category=Notes
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const filter = { _id: id };
    if (category) filter.category = category;

    const entry = await Entry.findOne(filter);

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch entry" });
  }
});

/**
 * CREATE ENTRY
 */
router.post("/", async (req, res) => {
  try {
    const entry = new Entry(req.body);
    const saved = await entry.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create entry" });
  }
});

/**
 * UPDATE ENTRY
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const updated = await Entry.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update entry" });
  }
});

/**
 * DELETE ENTRY
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const deleted = await Entry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

export default router;
