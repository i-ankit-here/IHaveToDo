import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const Connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("MONGO DB Connected!! \nDB host: ",Connection.connection.host);
        // console.log(Connection);
    } catch (error) {
        console.error("ERROR: ",error);
        process.exit(1);
        throw error;
    }
}

export default connectDB;