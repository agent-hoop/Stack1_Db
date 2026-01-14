import React,{useState} from 'react'
import { useEffect } from 'react'

export default function useApi(api,cat='') {
    const [data, setData] = useState([])
    const [loading,setLoading] = useState(true)
    const [error, setError] = useState([])

    useEffect(()=>{
        async function getData() {
            try{
                const data = await fetch(`${api}?category=${cat}`);
                const res = await data.json();
                setData(res);
            }
            catch(err){
                setError({error:err})
            }finally{
                setLoading(false)
            }
        }
        getData()
    },[])
  return {data,error,loading}
}
