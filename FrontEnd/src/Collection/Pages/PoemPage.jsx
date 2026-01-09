import React, { useState } from "react";

export default function PoemPage() {
  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto max-w-md flex flex-col gap-6">

        {/* Poem with image */}
        <PoemCard
          imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBx_2K1A3aJDTIhFo3hds1H4r1ttyy58_z1CezZF39cgpOg5zt_9KvaF7rPlanD4n0Upv69beXndToLorlCJJAtdK4jHqaGmXvji2m_4urQ77O2DEiYc0fuSmDWt3WrPES4lM98bhs2mbVvnjh5D4T4IiibVtHd3xagNVjVBNVRGurSW2A-_f6S2yd_zzcbXNcofkkBpwQEZA-ewe0GCtaUbtK6Mdm0n8blwhCENjuj0Yay9Yd2Qx9HeNK_vkCfKS8SFTIJtQNpamEr"
          title="The Silent Morning"
          meta="Oct 24 • 2 min read"
          quote="The fog crept in on little cat feet, sitting looking over harbor and city..."
          tags={["Nature", "Free Verse"]}
        />

        {/* Poem without image */}
        <PoemCard
          title="Spring Awakening"
          meta="Mar 15 • Draft"
          quote="Green shoots emerge from the frozen earth, signaling a time of rebirth. The air is crisp with promise..."
          tags={["Spring", "Hope"]}
          noImage
        />

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
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl ring-1 ring-white/10
      transition-all duration-300 hover:shadow-xl
      ${
        noImage
          ? "bg-gradient-to-br from-green-900/40 via-zinc-900 to-zinc-900 hover:ring-green-400/40"
          : "bg-zinc-900 bg-linear-to-br from-green-400/40 via-gray-800/70 to-zinc-900 hover:ring-primary/50"
      }`}
    >
      {/* IMAGE (only if exists) */}
      {!noImage && imageUrl && (
        <div
          className="relative h-52 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        </div>
      )}

      {/* CONTENT */}
      <div className={`${noImage ? "p-6" : "-mt-12 px-5 pb-5 pt-3"} relative flex flex-col gap-4`}>

        {/* Tags + menu */}
        <div className="flex justify-between items-start">
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

        </div>

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
          “{quote}”
        </p>

      
      </div>
    </article>
  );
}
