const express = require("express");

const {
    applyForJob,
    getMyApplications,
    updateApplicationStatus,
    getRecruiterApplications,
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middleware/authMiddleware");
const uploadResume = require("../middleware/resumeUpload");

const router = express.Router();

// Apply for a job
router.post("/", protect, authorize("jobseeker"), uploadResume.single("resume"), applyForJob);

// Get applications submitted by logged-in user
router.get("/my", protect, getMyApplications);
router.get("/recruiter", protect, authorize("recruiter"), getRecruiterApplications);

// Update application status
router.patch("/:id/status", protect, authorize("recruiter"), updateApplicationStatus);

module.exports = router;
