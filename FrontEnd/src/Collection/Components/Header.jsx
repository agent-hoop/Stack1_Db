import { FolderIcon, Home, Search, SettingsIcon, User2 } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <div className="flex flex-col justify-between">
      <div
        className="h-16 w-full flex items-center  backdrop-blur-xl bg-white/10
         border-white/20 shadow-xl shadow-black/30 justify-between px-4 border-b "
      >
        <div className="left text-2xl cursor-default text-white font-bold ">
          My Collections
        </div>
        <div className="right flex items-center gap-4 ">
          <div className="search">
            
            <Search />
          </div>
          <div className="user">
            
            <User2 />
          </div>
        </div>
      </div>
    </div>
  );
}
