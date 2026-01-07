import React from "react";
import {
  LucideMenu,
  BookIcon,
  Edit3Icon,
  BookOpenTextIcon,
  ImagesIcon,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const libraryData = [
  {
    id: 1,
    name: "Notes",
    count: 12,
    icon: BookIcon,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-primary",
  },
  {
    id: 2,
    name: "Poems",
    count: 45,
    icon: Edit3Icon,
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: 3,
    name: "Stories",
    count: 8,
    icon: BookOpenTextIcon,
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    id: 4,
    name: "Media",
    count: 23,
    icon: ImagesIcon,
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    textColor: "text-pink-600 dark:text-pink-400",
  },
];

export default function Library() {
  const navigate  = useNavigate()
  return (
    <div className="p-4 ">
      <section className="px-1">
        <h2 className="text-lg font-bold mb-4">Library</h2>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {libraryData.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ icon: Icon, name, count, bgColor, textColor }) {
  const navigate  = useNavigate()


  return (
    <div onClick={()=>{navigate('/collections/notes')} } className="group relative hover:scale-[1.01] active:scale-95 overflow-hidden bg-surface-light dark:bg-surface-dark rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-all cursor-pointer">

      {/* Animated top border */}
      <span
        className={`
          absolute top-0 left-0 h-.5 w-full
          bg-linear-to-r from-current to-transparent
          ${textColor}
          origin-left scale-x-0
          transition-transform duration-300 ease-out
          group-hover:scale-x-100
        `}
      />

      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={textColor} size={20} />
        </div>

        <LucideMenu className="text-slate-400" size={18} />
      </div>

      <div>
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {count} items
        </p>
      </div>
    </div>
  );
}
