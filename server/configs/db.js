// configs/db.js
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = `${process.env.MONGODB_URI}/hotel-booking`;
        console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);

        mongoose.connection.on('connected', () => console.log("MongoDB database connected successfully!"));
        mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err));
        mongoose.connection.on('disconnected', () => console.warn("MongoDB disconnected!"));

        await mongoose.connect(mongoUri);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        // It's often good practice to exit the process if DB connection fails on startup
        // process.exit(1); 
    }
}

export default connectDB;
