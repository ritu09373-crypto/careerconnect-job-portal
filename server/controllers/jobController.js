const Job = require("../models/job");

// ============================
// CREATE JOB
// Recruiter only
// ============================
const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            description,
            location,
            jobType,
            experienceLevel,
            salaryMin,
            salaryMax,
            skills,
            category,
            applicationDeadline,
        } = req.body;

        // Check required fields
        if (
            !title ||
            !company ||
            !description ||
            !location ||
            !jobType ||
            !experienceLevel ||
            !category ||
            !applicationDeadline
        ) {
            return res.status(400).json({
                message: "Please provide all required job fields",
            });
        }

        // Only recruiters can create jobs
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can create jobs",
            });
        }

        // Validate salary range
        if (
            salaryMin !== undefined &&
            salaryMax !== undefined &&
            salaryMin !== null &&
            salaryMax !== null &&
            Number(salaryMin) > Number(salaryMax)
        ) {
            return res.status(400).json({
                message: "Minimum salary cannot be greater than maximum salary",
            });
        }

        // Create job
        const job = await Job.create({
            title: title.trim(),
            company: company.trim(),
            description: description.trim(),
            location: location.trim(),
            jobType,
            experienceLevel,
            salaryMin:
                salaryMin !== undefined && salaryMin !== ""
                    ? Number(salaryMin)
                    : null,
            salaryMax:
                salaryMax !== undefined && salaryMax !== ""
                    ? Number(salaryMax)
                    : null,
            skills: Array.isArray(skills) ? skills : [],
            category: category.trim(),
            applicationDeadline,
            recruiter: req.user.id,
        });

        res.status(201).json({
            message: "Job created successfully",
            job,
        });
    } catch (error) {
        console.error("Create Job Error:", error);

        res.status(500).json({
            message: "Server error while creating job",
        });
    }
};

const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ============================
// GET ALL ACTIVE JOBS
// Public
// ============================
const getAllJobs = async (req, res) => {
    try {
        const { query, location, category, jobType, experience } = req.query;
        const filter = { status: "active" };

        if (location) filter.location = new RegExp(`^${escapeRegex(location)}$`, "i");
        if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
        if (jobType) filter.jobType = jobType;
        if (experience) filter.experienceLevel = experience;
        if (query) {
            const q = new RegExp(escapeRegex(query), "i");
            filter.$or = [
                { title: q },
                { company: q },
                { description: q },
                { skills: q },
                { category: q },
            ];
        }

        const jobs = await Job.find(filter)
            .populate("recruiter", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error("Get Jobs Error:", error);

        res.status(500).json({
            message: "Server error while fetching jobs",
        });
    }
};

// ============================
// GET SINGLE JOB BY ID
// Public
// ============================
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiter", "name email");

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json({
            job,
        });
    } catch (error) {
        console.error("Get Job By ID Error:", error);

        res.status(500).json({
            message: "Server error while fetching job",
        });
    }
};

const getRecruiterJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ jobs });
    } catch (error) {
        console.error("Get Recruiter Jobs Error:", error);
        res.status(500).json({ message: "Server error while fetching your jobs" });
    }
};

const updateJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, recruiter: req.user.id });
        if (!job) return res.status(404).json({ message: "Job not found or you do not own it" });
        const allowed = ["title", "company", "description", "location", "jobType", "experienceLevel", "salaryMin", "salaryMax", "skills", "category", "applicationDeadline", "status"];
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) job[field] = field === "skills"
                ? (Array.isArray(req.body[field]) ? req.body[field] : []) : req.body[field];
        });
        if (job.salaryMin != null && job.salaryMax != null && Number(job.salaryMin) > Number(job.salaryMax)) {
            return res.status(400).json({ message: "Minimum salary cannot be greater than maximum salary" });
        }
        await job.save();
        res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
        console.error("Update Job Error:", error);
        res.status(500).json({ message: "Server error while updating job" });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.user.id });
        if (!job) return res.status(404).json({ message: "Job not found or you do not own it" });
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({ message: "Server error while deleting job" });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    getRecruiterJobs,
    updateJob,
    deleteJob,
};
