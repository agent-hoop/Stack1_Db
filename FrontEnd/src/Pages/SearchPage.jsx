import React from 'react'
import { useParams } from 'react-router-dom'

export default function SearchPage() {
    const {query} =useParams();
    console.log(query)
  return (
    <div>
        {query}
    </div>
  )
}
