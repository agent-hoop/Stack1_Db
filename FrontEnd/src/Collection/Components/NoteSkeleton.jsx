import { ArrowLeftIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoteSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <Header/>

      <main className="mx-auto relative max-w-3xl px-5 pb-20">
        {/* Hero image */}
        <div className="relative mt-3 h-60 w-full overflow-hidden rounded-2xl bg-white/10 skeleton-shimmer" />

        {/* Title + tags */}
        <div className="mt-6 space-y-4">
          <div className="h-8 w-2/3 rounded bg-white/10 skeleton-shimmer" />

          <div className="flex gap-2">
            <div className="h-5 w-14 rounded-full bg-white/10 skeleton-shimmer" />
            <div className="h-5 w-16 rounded-full bg-white/10 skeleton-shimmer" />
          </div>
        </div>

        {/* Content card */}
        <div className="relative mt-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 px-3 py-6 shadow-lg shadow-black/30">
          {/* Meta */}
          <div className="mb-6 h-3 w-24 rounded bg-white/10 skeleton-shimmer" />

          {/* Paragraph lines */}
          <div className="space-y-4">
            <div className="h-4 w-full rounded bg-white/10 skeleton-shimmer" />
            <div className="h-4 w-11/12 rounded bg-white/10 skeleton-shimmer" />
            <div className="h-4 w-10/12 rounded bg-white/10 skeleton-shimmer" />

            <div className="h-4 w-full rounded bg-white/10 skeleton-shimmer" />
            <div className="h-4 w-9/12 rounded bg-white/10 skeleton-shimmer" />

            <div className="h-4 w-full rounded bg-white/10 skeleton-shimmer" />
            <div className="h-4 w-8/12 rounded bg-white/10 skeleton-shimmer" />
          </div>
        </div>
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
