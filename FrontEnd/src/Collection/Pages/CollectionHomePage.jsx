import React from 'react'
import Library from '../Components/Library'
import { Link } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function CollectionHomePage() {
  const RecentEntries  = [
    {
      id:1,
      title:'New Poem',
      EditTime:'2hrs ago',
      imgUrl:'https://img.freepik.com/free-photo/young-sensitive-man-thinking_23-2149459719.jpg?semt=ais_hybrid&w=740&q=90',
      Tag:'Personal',
    }
  ]
  return (
    <div>
      {/* Recent Work  */}
      <div className="recent Works comp ">
        <div className="top pt-10 px-4 flex items-center justify-between ">
          <div className="left text-xl font-semibold text-white ">Recent Work</div>
        </div>
        <div className="main p-3 ">
          {RecentEntries && RecentEntries.map((rec)=>{
            return(
              <Model key={rec.id} {...rec}/>
            )
          })}
        </div>
      </div>
      <Library/>
    </div>
  )
}

function Model({imgUrl,title,EditTime,Tag,onClick}){
  return(
    <>
      <div onClick={onClick} className="cadBox flex-col gap-3 ">
        <div className="imgModel relative w-38 h-58 rounded-xl shadow-inner  shadow-gray-900  overflow-hidden ">
          <img className='w-full h-full object-cover bg-center opacity-85 hover:opacity-80 ' src={imgUrl} alt="" />
          {Tag && <div className="absolute left-3 bottom-2.5 rounded-lg text-bold backdro text-white border px-2 border-white/30 backdrop-blur-md bg-black/5 ">{Tag}</div>}
        </div>
        <div className="titles flex-col leading-3 text-white/70 text-sm  flex px-1.5 ">
          <div className="name font-bold text-white text-lg ">{title || 'New Entry' }</div>
          Edited {  EditTime || 'now'}
        </div>

      </div>
    </>
  )
  
}