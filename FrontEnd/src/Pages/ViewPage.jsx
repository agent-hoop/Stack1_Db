import { MoveLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export default function ViewPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()


  const { id } = useParams()

  useEffect(() => {
    const viewNotes = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:3000/api/notes/${id}`)

        if (!res.ok) {
          throw new Error("Failed to fetch note")
        }

        const response = await res.json()
        setData(response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    viewNotes()
  }, [id])

  if (loading) return <p className="p-4">Loading…</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="main w-full">
        <div className="h-screen   md:px-12 p-4 w-full bg-zinc-900 text-white">
              <div className="box flex flex-col relative gap-3 justify-center p-3 w-full h-full rounded  border-gray-500 border">
      
                <div className="top flex items-center justify-between ">
                  <div className="back  hover:scale-105 flex items-center active:scale-95 w-12 h-12 transition-all left-5 rounded-full  text-white   " onClick={()=>{navigate (-1)}} > <MoveLeft size={18} /> </div>
                  <div className="created  rounded-xl">
                   
                  </div>
                </div>    
                  <div className="title w-full p-1 mb-2 h-14 "> 
                      <div  className="px-3.5 py-2 rounded-xl h-full w-full font-semibold  outline-none text-sm  border border-gray-500 focus:border-blue-600 text-gray-300" > {data.title} </div>
                      
                  </div>
      
                  <div className="content overflow-y-scroll flex-1 ">
                   <div    name="content" className="p-3 w-full border outline-none focus:border-blue-500 border-gray-500 rounded-xl h-full text-white text-md ">
                     {/* <input type="text" className=""  /> */}
                     {data.content}
                    </div>
                  </div>
              </div>
            </div>
    </div>
  )
}
