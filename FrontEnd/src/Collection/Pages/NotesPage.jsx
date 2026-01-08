import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

/* ---------------- DATA ---------------- */
const NOTE_LIST = [
  {
    id: "1",
    title: "New verse",
    content: "Some line so deep, it cut through the wound",
    img: "https://img.freepik.com/free-photo/raging-river-nature_422131-102.jpg",
  },
  {
    id: "2",
    title: "Some Thought",
    content: "Beauty of the place",
    img: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
  },
  {
    id: "3",
    title: "Gajal",
    content: "Gajal main",
    img: "https://static.vecteezy.com/system/resources/thumbnails/049/855/296/small/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-photo.jpg",
  },
  {
    id: "4",
    title: "Some word harder to write",
    content: "Be the best",
    img: "https://dxcmodels.com/wp-content/uploads/2024/03/black-model44.jpg",
    isLocked: true,
  },
];

/* ---------------- PAGE ---------------- */
export default function NotesPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);


  function openNote(id) {
    navigate(`/collections/notes/view/${id}`)
    console.log(id)
  }
  // simulate API
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(t);
  }, []);

  const filteredNotes = useMemo(() => {
    return NOTE_LIST.filter(
      (n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

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
          filteredNotes.map((note) => (
            <NoteCard handleOpen={()=>openNote(note.id)}  key={note.id} {...note} />
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
    <div onClick={handleOpen}
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
          loading="lazy"
          decoding="async"
          onLoad={() => {setImgLoaded(true);}}
          className={`w-full h-full object-cover
            transition-opacity- duration-500 ease-out
            ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            group-hover:scale-110`}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-tr
          from-black/40 via-transparent to-transparent
          opacity-60 group-hover:opacity-30 transition-opacity" />

        {isLocked && (
          <div className="absolute inset-0 backdrop-blur-sm bg-black/50
          flex items-center justify-center">
            🔒
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="flex flex-col justify-center gap-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-white/60 line-clamp-2
          group-hover:text-white/80 transition-colors">
          {content}
        </p>
      </div>
    </div>
  );
}


/* ---------------- SKELETON ---------------- */
function NoteSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-2xl
    bg-[#1C2033]/80 border border-white/10">

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
