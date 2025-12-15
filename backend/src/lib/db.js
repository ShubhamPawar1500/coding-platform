import mongoose from "mongoose";
import { ENV } from './Env.js'

export const connectDB = async () => {
    try {
        if (!ENV.DB_URL) {
            throw new Error("DB_URL not present");
        }
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("Database Connected Successfully", conn.connection.host);
    } catch (error) {
        console.error("Error Connection to DB:", error);
        process.exit(1);
    }
}