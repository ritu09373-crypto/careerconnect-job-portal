const express = require("express");

const {
    getJobMatch,
} = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/job-match", protect, getJobMatch);

module.exports = router;
