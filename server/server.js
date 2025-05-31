// server.js
import express from "express";
import cors from "cors";
import "dotenv/config"; // Make sure this is at the very top to load environment variables
import bodyParser from "body-parser";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

// Load environment variables from .env file
// Ensure this is the first thing that runs to make process.env available
// If using 'dotenv/config', it automatically loads. Otherwise, use:
// import dotenv from 'dotenv';
// dotenv.config();

connectDB(); // Attempt to connect to the database

const app = express();
app.use(cors());

// All other JSON routes
app.use(express.json());

// Clerk webhook uses raw body
// IMPORTANT: bodyParser.raw must be used for Clerk webhooks before express.json()
// for this specific route, as Clerk sends raw JSON that needs verification.
app.post("/api/clerk", bodyParser.raw({ type: "application/json" }), clerkWebhooks);

app.get("/", (req, res) => res.send("API is Working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));