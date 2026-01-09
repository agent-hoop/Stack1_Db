import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutGrid, PenTool, Book, Film, Library, Plus, Search,
  ChevronLeft, Zap, Bell, Calendar, Image as ImageIcon,
  Video, Music, Link as LinkIcon, X
} from "lucide-react";

/* -------------------- CONSTANTS -------------------- */

const CATEGORIES = ["Dashboard", "Poems", "Stories", "Media", "Novels"];

const STATUS_COLORS = {
  Published: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Draft: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Scheduled: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  "Under Review": "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const EMPTY_FORM = {
  id: null,
  title: "",
  author: "",
  category: "Poems",
  status: "Draft",
  content: "",
  mediaType: "image",
  mediaUrl: "",
  publishDate: new Date().toISOString().split("T")[0],
  views: 0,
};

/* -------------------- APP -------------------- */

export default function AdminEntry() {
  /* ---------- DATA ---------- */

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("muse_admin_v5");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: crypto.randomUUID(),
            title: "The Obsidian Verses",
            author: "V. Sterling",
            category: "Poems",
            status: "Published",
            content: "Words like glass, sharp and clear...",
            views: 1240,
          },
        ];
  });

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [view, setView] = useState("list"); // list | editor
  const [editorMode, setEditorMode] = useState("create"); // create | edit
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  /* ---------- PERSISTENCE ---------- */

  useEffect(() => {
    localStorage.setItem("muse_admin_v5", JSON.stringify(entries));
  }, [entries]);

  /* ---------- HELPERS ---------- */

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  /* ---------- FILTERING ---------- */

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchCategory =
        activeTab === "Dashboard" || e.category === activeTab;
      const matchSearch = e.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [entries, activeTab, searchTerm]);

  /* ---------- ACTIONS ---------- */

  const handleCreateNew = () => {
    setEditorMode("create");
    setFormData({
      ...EMPTY_FORM,
      category: activeTab === "Dashboard" ? "Poems" : activeTab,
    });
    setView("editor");
  };

  const handleEdit = (entry) => {
    setEditorMode("edit");
    setFormData(entry);
    setView("editor");
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      notify("Title is required");
      return;
    }

    setEntries((prev) => {
      if (editorMode === "edit") {
        return prev.map((e) =>
          e.id === formData.id ? { ...formData } : e
        );
      }

      return [
        {
          ...formData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });

    notify(editorMode === "edit" ? "Entry updated" : "New entry created");
    setFormData(EMPTY_FORM);
    setEditorMode("create");
    setView("list");
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-white/5 p-6">
        <div className="text-xl font-black mb-10 flex items-center gap-2">
          <Zap /> MUSE.HQ
        </div>

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveTab(cat);
              setView("list");
            }}
            className={`w-full text-left px-4 py-3 rounded-xl mb-1 ${
              activeTab === cat ? "bg-white/10" : "text-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full pl-10 bg-white/5 rounded-xl py-2 outline-none"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <Bell />
            <button
              onClick={handleCreateNew}
              className="bg-white text-black px-6 py-2 rounded-xl font-bold"
            >
              <Plus size={14} /> Create New
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-10 overflow-y-auto">
          {view === "list" ? (
            <table className="w-full">
              <thead className="text-left text-slate-500">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((e) => (
                  <tr
                    key={e.id}
                    className="cursor-pointer hover:bg-white/5"
                    onClick={() => handleEdit(e)}
                  >
                    <td className="py-4 font-bold">{e.title}</td>
                    <td>{e.author || "—"}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-lg border text-xs ${STATUS_COLORS[e.status]}`}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* EDITOR */
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-2 mb-8 text-slate-400"
              >
                <ChevronLeft size={18} /> Back
              </button>

              <input
                className="w-full text-5xl font-black bg-transparent outline-none mb-6"
                placeholder="Untitled"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <textarea
                className="w-full min-h-[300px] bg-transparent outline-none text-xl"
                placeholder="Write here..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />

              <button
                onClick={handleSave}
                className="mt-10 bg-white text-black px-10 py-3 rounded-xl font-black"
              >
                {editorMode === "edit" ? "Update" : "Publish"}
              </button>
            </div>
          )}
        </div>
      </main>

      {notification && (
        <div className="fixed bottom-6 right-6 bg-slate-900 px-6 py-3 rounded-xl flex gap-2 items-center">
          <CheckIcon />
          {notification}
          <X onClick={() => setNotification(null)} />
        </div>
      )}
    </div>
  );
}
