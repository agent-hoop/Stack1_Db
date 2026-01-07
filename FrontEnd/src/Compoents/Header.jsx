import React, { useState } from "react";
import { useNavigate,useLocation, NavLink } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate()
  const cStat = useLocation()
const [search, setSearch] = useState('')

function handleSubmit(e) {
  e.preventDefault()
  if (!search) return;
  console.log(search);
  // Corrected line to pass the string value of the search variable
  navigate(`/search/${search}`)
  setSearch('')
}

function handleAdd() {
  navigate('/add');
}

  return (
    <div>
    {   cStat !== 'search/:query' &&
      <div className="nav w-full h-14 border px-6 flex justify-between items-center  ">
        <div className="menu flex gap-2 items-center justify-between ">
          <NavLink to={'/'} className="home cursor-pointer px-4 py-2 hover:border-blue-500 hover:text-gray-400  rounded  transition-all border-b   ">
            <div  className="w-full rounded h-full     shadow active:scale-95 ">Home</div>
          </NavLink>
          <NavLink to={'/personal'} className="home px-4 py-2 rounded border-b  hover:border-blue-500 hover:text-gray-400  ">
            <div className="w-full h-full shadow ">
              Personal
            </div>
          </NavLink>
          <div className="home px-4 py-2 rounded border-b hover:border-blue-500 hover:text-gray-400  ">
            <button className="w-full h-full shadow ">About</button>
          </div>
        </div>
            <form onSubmit={handleSubmit}  >
        <div className="search w-52 h-14 py-2 rounded-xl ">

                <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Type somethings" type="text" className="px-3.5 rounded-xl h-full w-full font-semibold  outline-none text-sm  border border-gray-500 focus:border-blue-600 text-gray-300" />
        </div>
            </form>
        <div className="add">
            <button onClick={handleAdd} className="px-4 py-2 rounded-xl shadow-md text-white font-semibold bg-green-500" >Add Notes</button>
        </div>
      </div>
}    </div>
  );
}
