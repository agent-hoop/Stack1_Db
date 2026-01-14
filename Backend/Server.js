
import express from 'express';
import ConnDb from './db/conn.js';
import dotenv from 'dotenv';
import Notes from './router/Notes.js'
import Entries from './router/Entries.js'
import Search from './router/Search.js'
import cors from 'cors'
import countDocs from './Controller/countDocs.js';
dotenv.config()

const app =  express()
app.use(cors({origin:true}))
app.use(express.json())
ConnDb();
// Routes
app.use('/api/notes',Notes)
app.use('/api/entries',Entries)
app.use('/api/search',Search)

app.get('/',(req,res)=>{    
    res.send("<center>This   is working on the port 3000 </center> ")
})
app.get('/count',countDocs)
app.listen(3000,()=>{
    console.log('App is running on the localhost',3000)
})