import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, FileText, ChevronRight, Search, CloudOff } from "lucide-react";

/* ---------------- GLOBAL STATE (Outside Component) ---------------- */
let notesCache = null;
let activePromise = null; // Used to deduplicate overlapping requests

const API = "http://localhost:3000/api/entries?category=Notes";

/* ---------------- UTILS ---------------- */
const getNoteImgByAuthor = (author = "") => {
  const map = {
    love: "https://i.pinimg.com/originals/8f/1e/f5/8f1ef52504a2bcf2e30357f8da90f3f2.jpg",
    sad: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=50&w=1000&auto=format&fit=crop",
  };
  return map[author.toLowerCase()] || "https://images.unsplash.com/photo-1470252649358-96752a786133?q=80&w=1000&auto=format&fit=crop";
};

const getPlainText = (html = "") => {
  return new DOMParser().parseFromString(html, "text/html").body.textContent || "";
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function NotesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [data, setData] = useState(notesCache || []);
  const [loading, setLoading] = useState(!notesCache);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNotes() {
      // 1. If we already have a request in flight, just wait for it
      if (activePromise) {
        try {
          const json = await activePromise;
          setData(json);
          return;
        } catch (e) {
          // If the shared promise failed, we continue to try a new fetch
        }
      }

      // 2. Start a new request if no promise is active
      try {
        if (!notesCache) setLoading(true);

        activePromise = fetch(API, { signal: controller.signal }).then((res) => {
          if (!res.ok) throw new Error("Network Error");
          return res.json();
        });

        const json = await activePromise;
        
        notesCache = json;
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch failed:", err);
        }
      } finally {
        activePromise = null; // Clear the shared promise
        setLoading(false);
      }
    }

    fetchNotes();

    return () => {
      // We only abort if the cache is still empty to prevent 
      // interrupting the "background refresh" for existing users
      if (!notesCache) controller.abort();
    };
  }, []);

  /* ---------------- SEARCH LOGIC ---------------- */
  const searchableData = useMemo(() => {
    return data.map((n) => ({
      ...n,
      __search: `${n.title || ""} ${getPlainText(n.content)}`.toLowerCase(),
    }));
  }, [data]);

  const filteredNotes = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return searchableData;
    return searchableData.filter((n) => n.__search.includes(q));
  }, [searchableData, query]);

  const openNote = (note) => {
    navigate(`/collections/notes/view/${note._id}`, { state: { note } });
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-4xl font-black italic text-white tracking-tight">My Notes</h1>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your thoughts..."
            className="w-full h-16 pl-12 pr-5 rounded-2xl bg-[#15192d] border border-white/5 text-white placeholder:text-white/40 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 outline-none transition-all"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {loading && data.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => <NoteSkeleton key={i} />)
        ) : filteredNotes.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-white/20 gap-4">
            <CloudOff size={48} strokeWidth={1} />
            <p className="font-medium">No thoughts found matching that criteria</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} onOpen={() => openNote(note)} />
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

function NoteCard({ note, onOpen }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { title, content, author, isLocked } = note;

  const img = useMemo(() => getNoteImgByAuthor(author), [author]);
  const preview = useMemo(() => getPlainText(content), [content]);

  return (
    <div
      onClick={onOpen}
      className="group flex flex-col sm:flex-row gap-6 p-5 rounded-[2rem] bg-[#15192d]/40 border border-white/10 backdrop-blur-md hover:bg-[#1c2033] hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative w-full sm:w-28 h-44 sm:h-28 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/5">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-white/5 flex items-center justify-center">
            <FileText className="text-white/10" size={24} />
          </div>
        )}
        <img
          src={img}
          alt={title}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Lock className="text-amber-400" size={18} />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-400 transition-colors">
            {title || "Untitled Entry"}
          </h3>
          <ChevronRight className="text-white/10 group-hover:text-white/50 transition-all group-hover:translate-x-1" size={20} />
        </div>
        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed italic mb-4">
          {preview || "No content provided..."}
        </p>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-lg border border-blue-400/20">
            {author || "personal"}
          </span>
        </div>
      </div>
    </div>
  );
}

function NoteSkeleton() {
  return (
    <div className="flex gap-6 p-5 rounded-[2rem] bg-[#15192d]/20 border border-white/5">
      <div className="w-28 h-28 rounded-2xl bg-white/5 animate-pulse shrink-0" />
      <div className="flex flex-col justify-center flex-1 space-y-3">
        <div className="h-5 w-1/3 bg-white/10 rounded-full animate-pulse" />
        <div className="h-3 w-full bg-white/5 rounded-full animate-pulse" />
        <div className="h-3 w-2/3 bg-white/5 rounded-full animate-pulse" />
      </div>
    </div>
  );
}