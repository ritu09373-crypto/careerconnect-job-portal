// Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

if (!process.env.OPENAI_API_KEY) {
    console.log("OpenAI API Key: not set (AI matching disabled until OPENAI_API_KEY is added)");
}

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
        : true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);

app.use((error, req, res, next) => {
    if (error) {
        console.error("Request Error:", error.message);
        return res.status(400).json({ message: error.message || "Request could not be processed" });
    }
    next();
});

// Home route
app.get("/", (req, res) => {
    res.send("CareerConnect Backend API is running...");
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
