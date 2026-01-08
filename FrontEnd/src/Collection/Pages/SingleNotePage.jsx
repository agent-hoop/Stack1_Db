import { ArrowLeftIcon } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SingleNotePage({tags,bgImg,content,title,time}) {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header />

      <main className="mx-auto relative max-w-3xl px-5 pb-20">
        {/* Image Header */}
        <div className="relative mt-3 h-60 w-full overflow-hidden rounded-2xl shadow-lg shadow-black/40">
          <img
            src="https://img.freepik.com/free-photo/galaxy-wallpaper-warm-colors_23-2151769491.jpg?semt=ais_hybrid&w=740&q=90"
            alt=""
            className="h-full w-full object-cover scale-[1.03]"
          />

          {/* Cinematic fade */}
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/90" />

          {/* Title & tags */}
          <div className="absolute bottom-5 left-5 right-5 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-lg">
              Aja ko prem, kasai ko dayn
            </h1>

            <div className="flex gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur text-zinc-100 border border-white/10">
                Home
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur text-zinc-100 border border-white/10">
                Love
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="relative mt-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 px-3 py-6 shadow-lg shadow-black/30">
          <div className="mb-4 text-xs tracking-wide text-zinc-400">
            Oct 30 · 
          </div>

          <div className="prose prose-invert prose-zinc max-w-none font-sans">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
              quibusdam consequuntur quasi ratione. Similique exercitationem
              voluptatem aut, quisquam dolorem, rerum eaque placeat nam ut quia
              excepturi labore autem ratione reiciendis.
            </p>

            <p>
              Consequuntur maxime sapiente, dolorem quo adipisci blanditiis
              ducimus explicabo minima? Explicabo dolorem maiores delectus
              voluptatibus beatae impedit vitae quasi neque.
            </p>
          </div>
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
