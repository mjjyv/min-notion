import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import pageRoutes from "./routes/pages.js";

dotenv.config();
const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pages", pageRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
