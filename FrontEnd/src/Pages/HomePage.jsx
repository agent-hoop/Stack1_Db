import React from 'react'
import NoteCard from '../Compoents/NoteCard'
import useApi from '../useApi'
import { useNavigate } from 'react-router-dom'
export default function HomePage() {
  const {data,fetchApi} = useApi()
  const navigate = useNavigate()
  async function handleOpen(id) {
    navigate(`/view/${id}`)
    console.log('Note Id is ',id)

    
  }
  async function delNote(id) {
  try{
    const del = await fetch(`http://localhost:3000/api/notes/${id}`,{method:'DELETE'})
    // alert('Success')
    console.log(del)
    fetchApi()
  }
  catch(err){
    console.log('Err',err)
  }}
  return (
    <div>
      <div className="P-6 grid grid-cols-3">
        {
          data && (
            data.map((notes,i)=>(
              <NoteCard key={i} onOpen={()=>handleOpen(notes._id)} handleDelet={()=>delNote(notes._id)} content={notes?.content} title={notes?.title} noteType={notes?.noteType} />
            ))
          )
        }
      </div>
    </div>
  )
}
