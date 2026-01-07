import mongoose from "mongoose";

const  ConnDb  =  async() => {
    try{

        await mongoose.connect(process.env.DB_URL)
        console.log('Db connected')

    }
    catch(err){
        console.log('Connection error', err)
    }
}
export default ConnDb