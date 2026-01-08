import { AlignRightIcon, FolderIcon, Home, MoveLeftIcon, Search, SettingsIcon, User2 } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const homePath = pathname.split("/");
  return (
    <div className="flex flex-col  justify-between">
      <div
        className="h-16 w-full flex items-center  backdrop-blur-xl bg-white/10
         border-white/20 shadow-xl shadow-black/30 justify-between px-4 border-b "
      >
        {
          !homePath[2] ?
          <>  

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
          </> : 
        <>
          <div className="left font-bold text-white text-2xl ">
            {homePath[2] == 'novel' && 'Novel'}
            {homePath[2] === 'notes' && 'Notes'}
            {homePath[2] === 'poem' && 'Poems'}
            {homePath[2] === 'media' && 'My Media'}
          </div>
          <div className="right">
            <AlignRightIcon/>
          </div>
        </>
        }
        </div>
    </div>
  );
}
