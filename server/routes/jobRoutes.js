const express = require("express");

const {
    createJob,
    getAllJobs,
    getJobById,
    getRecruiterJobs,
    updateJob,
    deleteJob,
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all active jobs
router.get("/", getAllJobs);

// Get single job by ID
router.get("/:id", getJobById);

router.get("/recruiter/mine", protect, authorize("recruiter"), getRecruiterJobs);

// Create job - recruiter only
router.post("/", protect, authorize("recruiter"), createJob);
router.patch("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

module.exports = router;
