require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const User = require("../models/user");
const Job = require("../models/job");

const sampleJobs = [
    {
        title: "MERN Stack Developer",
        company: "Northline Labs",
        description:
            "Build full-stack product features with React, Node.js, and MongoDB. You will own APIs, polish UX, and ship weekly with a small product team.",
        location: "Jaipur",
        jobType: "Full-time",
        experienceLevel: "Mid Level",
        salaryMin: 600000,
        salaryMax: 1000000,
        skills: ["React", "Node.js", "MongoDB", "Express"],
        category: "Engineering",
    },
    {
        title: "Frontend Engineer",
        company: "Brightpath Soft",
        description:
            "Craft accessible, performant interfaces in React. Collaborate with design, improve design systems, and raise frontend quality across the product.",
        location: "Bengaluru",
        jobType: "Full-time",
        experienceLevel: "Entry Level",
        salaryMin: 450000,
        salaryMax: 800000,
        skills: ["React", "JavaScript", "CSS", "TypeScript"],
        category: "Engineering",
    },
    {
        title: "Data Analyst Intern",
        company: "InsightForge",
        description:
            "Support analytics projects with SQL, dashboards, and clear storytelling. Ideal for students or early-career analysts who love turning data into decisions.",
        location: "Remote",
        jobType: "Internship",
        experienceLevel: "Fresher",
        salaryMin: 150000,
        salaryMax: 250000,
        skills: ["SQL", "Excel", "Python", "Tableau"],
        category: "Data",
    },
    {
        title: "Product Designer",
        company: "Studio Orbit",
        description:
            "Design end-to-end product experiences for a hiring platform. Work closely with engineers and researchers to ship elegant, usable flows.",
        location: "Mumbai",
        jobType: "Full-time",
        experienceLevel: "Mid Level",
        salaryMin: 700000,
        salaryMax: 1200000,
        skills: ["Figma", "UX Research", "Prototyping"],
        category: "Design",
    },
    {
        title: "Backend Developer",
        company: "Cloudnest Systems",
        description:
            "Design reliable Node.js services, integrate databases, and improve API performance for a growing SaaS platform.",
        location: "Hyderabad",
        jobType: "Full-time",
        experienceLevel: "Senior Level",
        salaryMin: 1200000,
        salaryMax: 2000000,
        skills: ["Node.js", "MongoDB", "AWS", "Docker"],
        category: "Engineering",
    },
];

const run = async () => {
    await connectDB();

    const password = await bcrypt.hash("password123", 10);

    let recruiter = await User.findOne({ email: "recruiter@careerconnect.dev" });
    if (!recruiter) {
        recruiter = await User.create({
            name: "Aanya Recruiter",
            email: "recruiter@careerconnect.dev",
            password,
            role: "recruiter",
            location: "Jaipur",
            bio: "Hiring manager for growing product teams.",
        });
    }

    let seeker = await User.findOne({ email: "seeker@careerconnect.dev" });
    if (!seeker) {
        seeker = await User.create({
            name: "Rohan Seeker",
            email: "seeker@careerconnect.dev",
            password,
            role: "jobseeker",
            location: "Jaipur",
            bio: "Full-stack developer focused on React and Node.js.",
            skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        });
    }

    const existingJobs = await Job.countDocuments({ recruiter: recruiter._id });
    if (existingJobs === 0) {
        const deadline = new Date();
        deadline.setMonth(deadline.getMonth() + 2);

        await Job.insertMany(
            sampleJobs.map((job) => ({
                ...job,
                applicationDeadline: deadline,
                recruiter: recruiter._id,
                status: "active",
            }))
        );
    }

    console.log("Seed complete.");
    console.log("Recruiter: recruiter@careerconnect.dev / password123");
    console.log("Job seeker: seeker@careerconnect.dev / password123");
    process.exit(0);
};

run().catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
});