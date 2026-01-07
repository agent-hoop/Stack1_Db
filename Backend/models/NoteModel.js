import mongoose from "mongoose";


const note = new mongoose.Schema({
    title:{
        type:String,
        default:'New Data',
        require:true
    },
    content:{type:String},
    noteType:{type:String,default:"Personal"}
},{timestamps:true})

export default mongoose.model('note',note)

