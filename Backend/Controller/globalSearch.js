// controllers/globalSearch.js
import Fuse from "fuse.js";
import Entry from "../models/Entry.js";
import { JSDOM } from "jsdom";

function stripHTML(html = "") {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent || "";
}

export async function globalSearch(req, res) {
  const q = req.query.q?.trim();
  console.log(q,"Main q")

  if (!q || q.length < 2) {
    return res.status(200).json([]);
  }

  try {
    const entries = await Entry.find(
      {},
      {
        title: 1,
        content: 1,
        category: 1,
        isLocked: 1,
      }
    ).lean();
    console.log(entries)

    // 🔥 CLEAN CONTENT FOR FUSE
    const searchable = entries.map((e) => ({
      ...e,
      content: stripHTML(e.content),
    }));

    const fuse = new Fuse(searchable, {
      keys: ["title", "content"],
      threshold: 0.35,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });

    const results = fuse.search(q).slice(0, 20);

    const formatted = results.map((r) => ({
      id: r.item._id,
      title: r.item.title,
      category: r.item.category,
      isLocked: r.item.isLocked,
      matches: r.matches,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Global search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
}
