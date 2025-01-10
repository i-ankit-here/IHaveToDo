import 'dotenv/config'
import connectDB from "./db/db.js"
import app from './app.js';

// dotenv.config({
//     path:"/.env"
// })

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.error("Error accured while creating app: ",error);
        throw error;
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log("App is listening: ",process.env.PORT)
    });
})
.catch((error)=>{
    console.error("Error Connecting to Database ",error);
})
;














































/*
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    } catch (error) {
        console.error("ERROR: ",error);
        throw error;
    }
})()
*/