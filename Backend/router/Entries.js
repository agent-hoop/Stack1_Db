import express from "express";
import mongoose from "mongoose";
import Entry from "../models/Entry.js";
import { globalSearch } from "../Controller/globalSearch.js";
import redis from "../redis.js";



const router = express.Router();
/**
 * GET ALL ENTRIES
 * /api/entries?category=Notes
 */
const entriesKey = (category) =>
  category ? `entries:category:${category}` : "entries:all";

const entryKey = (id, category) =>
  category ? `entry:${id}:${category}` : `entry:${id}`;


router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const cacheKey = entriesKey(category);

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(cached)
      return res.json(JSON.parse(cached));
    }

    const filter = {};
    if (category) filter.category = category;

    const entries = await Entry.find(filter).sort({ createdAt: -1 });

    await redis.setEx(cacheKey, 120, JSON.stringify(entries));

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
    the data
    const cacheKey = entryKey(id, category);
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const filter = { _id: id };
    if (category) filter.category = category;

    const entry = await Entry.findOne(filter);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    await redis.setEx(cacheKey, 300, JSON.stringify(entry));

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

    // invalidate lists
    await redis.del("entries:all");
    if (saved.category) {
      await redis.del(`entries:category:${saved.category}`);
    }

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

    // invalidate caches
    await redis.del(`entry:${id}`);
    await redis.del("entries:all");
    if (updated.category) {
      await redis.del(`entries:category:${updated.category}`);
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

    await redis.del(`entry:${id}`);
    await redis.del("entries:all");
    if (deleted.category) {
      await redis.del(`entries:category:${deleted.category}`);
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

// Get the count part of the document
router.get("/search", globalSearch);

export default router;
