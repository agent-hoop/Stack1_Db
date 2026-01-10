import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

/* ---------------- DATA ---------------- */

const API = "http://localhost:3000/api/entries?category=Notes";
/* ---------------- PAGE ---------------- */
export default function NotesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  function getNoteImgByAuthor(author = "") {
  switch (author.toLowerCase()) {
    case "love":
      return "https://i.pinimg.com/originals/8f/1e/f5/8f1ef52504a2bcf2e30357f8da90f3f2.jpg";

    case "sad":
      return "https://lh3.googleusercontent.com/proxy/1wK08M0S23pBPrwGSobh8JSc2xAY5oeZjqLbvSspTE-WEXQQhFandGv6B_llGDyv4p0gneubWd9FHOGgHmp523Pt0Yx_VvodmSo4wP-hDwCIcoGLFBrJgd-GC2ge_Cwq1ZFKBU4dwxIvG2RP3OBnctv-5lnF6-jsXus";

    default:
      return "https://st2.depositphotos.com/2001755/8564/i/450/depositphotos_85647140-stock-photo-beautiful-landscape-with-birds.jpg";
  }
}



  function preloadImages(urls = []) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        })
    )
  );
}


  useEffect(() => {
  async function getData() {
    try {
      setLoading(true);
      const res = await fetch(API);
      const json = await res.json();

      // preload images
      const imageUrls = json.map((note) =>
        getNoteImgByAuthor(note.author)
      );

      await preloadImages(imageUrls);

      setData(json);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  getData();
}, []);


  function openNote(note) {
    navigate(`/collections/notes/view/${note._id}`, {
  state: { note }
});

  }

  const filteredNotes = useMemo(() => {
    return data.filter((n) => {
      const title = n.title?.toLowerCase() || "";
      const content = n.content?.toLowerCase() || "";

      return (
        title.includes(query.toLowerCase()) ||
        content.includes(query.toLowerCase())
      );
    });
  }, [data, query]);

  return (
    <div className="w-full p-2 space-y-6">
      {/* Search stays visible (UX rule) */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your thoughts..."
          className="w-full h-14 pl-12 pr-4 rounded-2xl 
          bg-[#1C2033] border border-white/10
          text-white placeholder:text-white/40
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
          outline-none transition-all"
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {/* REAL skeleton rendering */}
        {loading ? (
          Array.from({ length: filteredNotes.length }).map((_, i) => (
            <NoteSkeleton key={i} />
          ))
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-white/50">No notes found</p>
        ) : (
          filteredNotes.map((note, i) => (
            <NoteCard
              img={getNoteImgByAuthor(note.author)}

              handleOpen={() => openNote(note)}
              key={note._id}
              {...note}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */

function NoteCard({ title, content, img, isLocked, handleOpen }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={handleOpen}
      className="group flex gap-4 p-4 rounded-2xl
      bg-[#1C2033]/90 border border-white/10
      hover:bg-[#23294a] hover:border-blue-500/40
      transition-all duration-200 cursor-pointer
      will-change-transform"
    >
      {/* IMAGE */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-black/20">
        {/* Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton-shimmer bg-black/20" />
        )}

        <img
          src={img}
          alt={title}
          loading="eager"
          decoding="sync"
          onLoad={() => {
            setImgLoaded(true);
          }}
          className={`w-full h-full object-cover
            transition-opacity- duration-500 ease-out
            ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            group-hover:scale-110`}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-linear-to-tr
          from-black/40 via-transparent to-transparent
          opacity-50 group-hover:opacity-30 transition-opacity"
        />

        {isLocked && (
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/50
          flex items-center justify-center"
          >
            🔒
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="flex flex-col justify-center gap-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p
          className="text-sm text-white/60 line-clamp-2
          group-hover:text-white/80 transition-colors"
        >
          {content}
        </p>
      </div>
    </div>
  );
}

/* ---------------- SKELETON ---------------- */
function NoteSkeleton() {
  return (
    <div
      className="flex gap-4 p-4 rounded-2xl
    bg-[#1C2033]/80 border border-white/10"
    >
      {/* image */}
      <div className="w-20 h-20 rounded-xl bg-white/10 skeleton-shimmer" />

      {/* text */}
      <div className="flex flex-col gap-3 flex-1">
        <div className="h-4 w-1/3 rounded bg-white/10 skeleton-shimmer" />
        <div className="h-3 w-full rounded bg-white/10 skeleton-shimmer" />
        <div className="h-3 w-2/3 rounded bg-white/10 skeleton-shimmer" />
      </div>
    </div>
  );
}
