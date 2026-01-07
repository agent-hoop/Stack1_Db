import React, { useState } from "react";
import {MoveLeft} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import useApi from "../useApi";

export default function AddPage() {
  const navigate = useNavigate()
  // const data = useApi();
const [Notes, setNotes] = useState({ title: '', content: '', noteType: '' });
async function handleClick() {
    // Check if both title and content are empty
    if (!Notes.title.trim() && !Notes.content.trim()) {
        alert('Please add a title or content before saving.');
        return; // Stop the function execution
    }

    console.log('Sending Note Data:', Notes);

    try {
        const response = await fetch('http://localhost:3000/api/notes/add', {
            method: 'POST',
            headers: {
                // This header is crucial for the server to understand the data format
                'Content-Type': 'application/json',
            },
            // The body needs to be stringified for a POST request
            body: JSON.stringify(Notes),
        });

        // Check if the response was successful (status in the 200s)
        if (response.ok) {
            // Optional: Clear the form after a successful submission
            setNotes({
                title: '',
                content: '',
                noteType: ''
            });
        } else {
            // Handle server errors or bad requests
            const errorData = await response.json();
            // Attempt to read the error message from the server
            alert(`Error: ${errorData.message || 'Failed to create note'}`);
        }
    } catch (ERR) {
        // Handle network errors (e.g., server is down, no internet)
        console.error('Error creating data:', ERR);
        alert('Network Error: Could not connect to the server.');
    }
}

  return (
    <div>
      <div className="h-screen   md:px-12 p-4 w-full bg-zinc-900 text-white">
        <div className="box flex flex-col relative gap-3 justify-center p-3 w-full h-full rounded  border-gray-500 border">

          <div className="top flex items-center justify-between ">
            <div className="back  hover:scale-105 flex items-center active:scale-95 w-12 h-12 transition-all left-5 rounded-full  text-white   " onClick={()=>{navigate (-1)}} > <MoveLeft size={18} /> </div>
            <div className="created  rounded-xl">
              <button onClick={(handleClick)} className="px-4 py-2 rounded-xl bg-green-500 text-white font-bold">Create</button>
            </div>
          </div>    
            <div className="title w-full p-1 mb-2 h-14 "> 
                <input value={Notes.title} onChange={(e)=>setNotes({...Notes,title:e.target.value})} placeholder="Type somethings" type="text" className="px-3.5 py-2 rounded-xl h-full w-full font-semibold  outline-none text-sm  border border-gray-500 focus:border-blue-600 text-gray-300" />
                
            </div>

            <div className="content overflow-y-scroll flex- ">
             <textarea value={Notes.content} onChange={(e)=>{setNotes({...Notes,content:e.target.value})}} rows={17}  name="content" className="p-3 w-full border outline-none focus:border-blue-500 border-gray-500 rounded-xl h-full text-white text-md ">
               {/* <input type="text" className=""  /> */}
              </textarea>
            </div>
        </div>
      </div>
    </div>
  );
}
