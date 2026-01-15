import React, { useState } from "react";
import NoteSkeleton from "../Components/NoteSkeleton";
import useApi from "../useApi";

const getNoteImgByAuthor = (author = "") => {
  const map = {
    love: "https://i.pinimg.com/originals/8f/1e/f5/8f1ef52504a2bcf2e30357f8da90f3f2.jpg",
    sad: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=50&w=1000&auto=format&fit=crop",
  };
  return (
    map[author.toLowerCase()] ||
    ""
  );
};
export default function PoemPage() {
  const { data, loading, error } = useApi(
    "http://localhost:3000/api/entries","Poems"
  );
  if(loading) return(
    <>
      {[1,2].map((q,i)=>{
        return(
         <PoemCardSkeleton key={i} />

        )
      })}
    </>
  )
  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto max-w-md flex flex-col gap-6">
        {/* Poem with image */}
        {data.length && data?.map((res)=>{
          return(
            <>
              <PoemCard key={res._id} imageUrl={getNoteImgByAuthor(res.author)} meta={'This is a best'} quote={'Sometime , There are hallenge in the life'} title={'This is a title'}  tags={['1','2']}  />
            </>
          )
        })}
      </div>
    </div>
  );
}

export function PoemCard({
  imageUrl,
  title,
  meta,
  quote,
  tags = [],
  noImage = false,
}) {
  const hasImage = Boolean(imageUrl) && !noImage;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl ring-1 ring-white/10
      transition-all duration-300 hover:shadow-xl
      ${
        hasImage
          ? "bg-zinc-900 bg-linear-to-br from-green-400/40 via-gray-800/70 to-zinc-900 hover:ring-primary/50"
          : "bg-gradient-to-br from-green-900/40 via-zinc-900 to-zinc-900 hover:ring-green-400/40"
      }`}
    >
      {/* IMAGE */}
      {hasImage && (
        <div
          className="relative h-52 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      )}

      {/* CONTENT */}
      <div
        className={`relative flex flex-col gap-4 ${
          hasImage ? "-mt-12 px-5 pb-5 pt-3" : "p-6"
        }`}
      >
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium
                text-white ring-1 ring-white/15"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold text-white leading-tight mb-1">
            {title}
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {meta}
          </p>
        </div>

        {/* Quote */}
        <p className="border-l-2 border-blue-500/40 pl-4 italic text-zinc-300 leading-relaxed line-clamp-3">
          {quote}
        </p>
      </div>
    </article>
  );
}

export function PoemCardSkeleton({ noImage = false }) {
  const hasImage = !noImage;

  return (
    <article
      className={`relative md:w-3xl flex ml-auto mr-auto flex-col overflow-hidden rounded-2xl mt-6 ring-1 ring-white/10
      animate-pulse
      ${
        hasImage
          ? "bg-zinc-900"
          : "bg-gradient-to-br from-zinc-800/60 to-zinc-900"
      }`}
    >
      {/* IMAGE SKELETON */}
      {hasImage && (
        <div className="relative h-52 m w-full bg-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      )}

      {/* CONTENT */}
      <div
        className={`relative flex flex-col gap-4 ${
          hasImage ? "-mt-12 px-5 pb-5 pt-3" : "p-6"
        }`}
      >
        {/* TAGS */}
        <div className="flex gap-2">
          <span className="h-5 w-14 rounded-md bg-white/10" />
          <span className="h-5 w-10 rounded-md bg-white/10" />
          <span className="h-5 w-12 rounded-md bg-white/10" />
        </div>

        {/* TITLE */}
        <div>
          <div className="h-5 w-3/4 rounded bg-white/15 mb-2" />
          <div className="h-3 w-1/3 rounded bg-white/10" />
        </div>

        {/* QUOTE */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-11/12 rounded bg-white/10" />
          <div className="h-3 w-4/5 rounded bg-white/10" />
        </div>
      </div>
    </article>
  );
}
