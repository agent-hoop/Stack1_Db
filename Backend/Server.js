
import express from 'express';
import ConnDb from './db/conn.js';
import dotenv from 'dotenv';
import Notes from './router/Notes.js'
import Entries from './router/Entries.js'

import cors from 'cors'
dotenv.config()

const app =  express()
app.use(cors({origin:true}))
app.use(express.json())
ConnDb();
// Routes
app.use('/api/notes',Notes)
app.use('/api/entries',Entries)
app.get('/',(req,res)=>{
    res.send("<center>This is working on the port 3000 </center> ")
})

app.listen(3000,()=>{
    console.log('App is running on the localhost',3000)
})