const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        jobType: {
            type: String,
            enum: [
                "Full-time",
                "Part-time",
                "Internship",
                "Contract",
                "Freelance",
            ],
            required: true,
        },

        experienceLevel: {
            type: String,
            enum: [
                "Fresher",
                "Entry Level",
                "Mid Level",
                "Senior Level",
            ],
            required: true,
        },

        salaryMin: {
            type: Number,
            default: null,
        },

        salaryMax: {
            type: Number,
            default: null,
        },

        skills: {
            type: [String],
            default: [],
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        applicationDeadline: {
            type: Date,
            required: true,
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "closed"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Job", jobSchema);