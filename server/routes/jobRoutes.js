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

router.get("/", getAllJobs);
// Static path must come before /:id or "recruiter" is treated as an id
router.get("/recruiter/mine", protect, authorize("recruiter"), getRecruiterJobs);
router.get("/:id", getJobById);

router.post("/", protect, authorize("recruiter"), createJob);
router.patch("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

module.exports = router;
