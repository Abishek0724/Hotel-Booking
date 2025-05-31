// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();
const app = express();
app.use(cors());

// All other JSON routes
app.use(express.json());

// Clerk webhook uses raw body
app.post("/api/clerk", bodyParser.raw({ type: "application/json" }), clerkWebhooks);

app.get("/", (req, res) => res.send("API is Working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
