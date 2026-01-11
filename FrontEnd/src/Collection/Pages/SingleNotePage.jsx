import { ArrowLeftIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NoteSkeleton from "../Components/NoteSkeleton";

export default function SingleNotePage() {
  const location = useLocation();
  const cachedNote = location.state?.note;
  const { id } = useParams();
  const [noteData, setData] = useState(cachedNote ?? null);

const getNoteImgByAuthor = (author = "") => {
  const map = {
    love: "https://i.pinimg.com/originals/8f/1e/f5/8f1ef52504a2bcf2e30357f8da90f3f2.jpg",
    sad: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=1000&auto=format&fit=crop",
  };
  return (
    map[author.toLowerCase()] ||
    "https://images.pexels.com/photos/762527/pexels-photo-762527.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
  );
};


  function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const API = `http://localhost:3000/api/entries/${id}`;

  useEffect(() => {
    if (cachedNote) return; // already have data

    const controller = new AbortController();

    async function getNote() {
      try {
        const res = await fetch(API, {
          signal: controller.signal,
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    }

    getNote();

    return () => controller.abort();
  }, [id]);

  // useEffect(()=>{
  //   async function getNote(){
  //     try{
  //       const data = await fetch(API)
  //       const response = await data.json();
  //       setData(response)
  //       console.log(response)
  //     }

  //   catch(err){
  //     console.log(err)

  //   }}
  //   getNote()
  // },[])

  if (!noteData) {
    return <NoteSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

      <main className="mx-auto relative max-w-3xl px-5 pb-20">
        {/* Image Header */}
        <div className="relative mt-3 h-60 w-full overflow-hidden rounded-2xl shadow-lg shadow-black/40">
          <img
            src={getNoteImgByAuthor(noteData.author)}
            className="h-full w-full object-cover scale-[1.03]"
          />

          {/* Cinematic fade */}
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/60 to-black/90" />

          {/* Title & tags */}
          <div className="absolute bottom-5 left-5 right-5 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-lg">
              {noteData?.title}
            </h1>

            <div className="flex gap-2 flex-wrap">
              {noteData.tags.length != 0 &&
                noteData.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur text-zinc-100 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
        {/* Content */}
        <article className="relative mt-6 rounded-2xl bg-white/3 backdrop-blur-xl border border-white/5 px-3 py-6 shadow-lg shadow-black/30">
          <div className="mb-4 text-xs tracking-wide text-zinc-400">
            {formatDate(noteData.updatedAt)}
          </div>

          <div
            className="
    prose prose-invert max-w-none
    prose-h1:text-4xl prose-h1:font-bold prose-h1:leading-tight
    prose-h2:text-3xl prose-h2:font-semibold
    prose-h3:text-2xl prose-h3:font-semibold
  "
            dangerouslySetInnerHTML={{ __html: noteData.content }}
          />
        </article>
      </main>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/70 border-b border-zinc-800">
      <div className="mx-auto max-w-5xl h-14 px-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-300 hover:text-white transition"
        >
          <ArrowLeftIcon size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <span className="text-xs font-semibold tracking-wide text-zinc-400">
          READING MODE
        </span>
      </div>
    </header>
  );
}
