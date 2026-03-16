import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in .env file");
        }
        await mongoose.connect(MONGODB_URL);
        console.log("✅ MongoDB connected successfully to:", MONGODB_URL.split('@')[1] || "Cloud Instance");

    } catch (error) {
        console.error("❌ MongoDB connection failed!");
        console.error("Error Detail:", error.message);
        console.error("Please check:");
        console.error("1. Your internet connection");
        console.error("2. If your IP address is whitelisted in MongoDB Atlas");
        console.error("3. If the connection string in .env is correct");
        process.exit(1);
    }   
}
export default connectDB;