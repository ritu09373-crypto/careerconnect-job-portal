const Application = require("../models/application");
const Job = require("../models/job");
const User = require("../models/user");
const { notifyRecruiterOfApplication, notifyApplicantOfStatus } = require("../services/mailer");

// ============================
// APPLY FOR A JOB
// ============================
const applyForJob = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        // Check job ID
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload your resume as a PDF",
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId).populate("recruiter", "name email");

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Check if job is active
        if (job.status !== "active") {
            return res.status(400).json({
                message: "This job is no longer active",
            });
        }

        // Check application deadline
        if (
            job.applicationDeadline &&
            new Date() > new Date(job.applicationDeadline)
        ) {
            return res.status(400).json({
                message: "Application deadline has passed",
            });
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id,
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this job",
            });
        }

        const baseUrl = (process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            resume: `${baseUrl}/uploads/resumes/${req.file.filename}`,
            coverLetter: coverLetter || "",
        });

        const applicant = await User.findById(req.user.id).select("name email");
        void notifyRecruiterOfApplication(job.recruiter, applicant, job);

        res.status(201).json({
            message: "Application submitted successfully",
            application,
        });
    } catch (error) {
        console.error("Apply Job Error:", error);

        res.status(500).json({
            message: "Server error while applying for job",
        });
    }
};


// ============================
// GET MY APPLICATIONS
// ============================
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user.id,
        })
            .populate("job")
            .sort({ createdAt: -1 });

        res.status(200).json({
            applications,
        });
    } catch (error) {
        console.error("Get My Applications Error:", error);

        res.status(500).json({
            message: "Server error while fetching applications",
        });
    }
};


// ============================
// UPDATE APPLICATION STATUS
// Recruiter
// ============================
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "applied",
            "shortlisted",
            "rejected",
            "accepted",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status",
            });
        }

        const application = await Application.findById(req.params.id)
            .populate("job")
            .populate("applicant", "name email");

        if (!application || !application.job || application.job.recruiter.toString() !== req.user.id) {
            return res.status(404).json({
                message: "Application not found or you do not own this job",
            });
        }

        application.status = status;
        await application.save();
        void notifyApplicantOfStatus(application.applicant, application.job, status);

        res.status(200).json({
            message: "Application status updated successfully",
            application,
        });
    } catch (error) {
        console.error("Update Application Status Error:", error);

        res.status(500).json({
            message: "Server error while updating application status",
        });
    }
};


const getRecruiterApplications = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user.id }).select("_id");
        const applications = await Application.find({ job: { $in: jobs.map((job) => job._id) } })
            .populate("job", "title company location")
            .populate("applicant", "name email phone location skills")
            .sort({ createdAt: -1 });
        res.status(200).json({ applications });
    } catch (error) {
        console.error("Get Recruiter Applications Error:", error);
        res.status(500).json({ message: "Server error while fetching applications" });
    }
};

// ============================
// EXPORT CONTROLLERS
// ============================
module.exports = {
    applyForJob,
    getMyApplications,
    updateApplicationStatus,
    getRecruiterApplications,
};
