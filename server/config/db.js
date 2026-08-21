const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use reliable public DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MONGO_URI is not defined in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);

        console.log("✅ MongoDB Connected Successfully");
        console.log(`📦 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;