const path = require("path");

// Load environment variables from server/.env regardless of process cwd
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

if (!(process.env.OPENAI_API_KEY || "").trim()) {
    console.log("OpenAI API Key: not set (using built-in skill matching until OPENAI_API_KEY is added)");
} else {
    console.log("OpenAI API Key: loaded");
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
