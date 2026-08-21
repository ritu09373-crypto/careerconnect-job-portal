const OpenAI = require("openai");
const Job = require("../models/job");
const User = require("../models/user");

const getOpenAIClient = () => {
    if (!process.env.OPENAI_API_KEY) return null;
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};


// ============================
// AI JOB MATCHING
// ============================
const getJobMatch = async (req, res) => {
    try {
        const openai = getOpenAIClient();
        if (!openai) {
            return res.status(503).json({
                message: "AI job matching is not configured. Add OPENAI_API_KEY to enable it.",
            });
        }
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
            });
        }

        // Get job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Get logged-in user
        const user = await User.findById(req.user.id).select(
            "name bio skills"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const candidateSkills = Array.isArray(user.skills)
            ? user.skills.join(", ")
            : "";

        const requiredSkills = Array.isArray(job.skills)
            ? job.skills.join(", ")
            : "";

        const prompt = `
You are an AI career assistant.

Compare the candidate with the job and calculate how suitable the candidate is.

CANDIDATE:
Name: ${user.name || "Candidate"}
Bio: ${user.bio || "Not provided"}
Skills: ${candidateSkills || "No skills provided"}

JOB:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description || "Not provided"}
Experience: ${job.experienceLevel || "Not specified"}
Category: ${job.category || "Not specified"}
Required Skills: ${requiredSkills || "Not specified"}

Return ONLY valid JSON in this format:

{
  "matchScore": 85,
  "matchingSkills": ["React", "Node.js"],
  "missingSkills": ["Docker"],
  "recommendation": "You are a strong match for this position. Improve Docker skills to increase your chances."
}

Rules:
- matchScore must be between 0 and 100.
- matchingSkills must contain relevant skills the candidate already has.
- missingSkills must contain important skills required by the job that the candidate does not have.
- recommendation must be short and useful.
- Return ONLY JSON.
`;

        const response = await openai.responses.create({
            // A configurable model lets production use a different supported model if needed.
            model: process.env.OPENAI_MODEL || "gpt-5-mini",
            input: prompt,
        });

        let result;

        try {
            result = JSON.parse(response.output_text);
        } catch (error) {
            console.error("AI JSON Parse Error:", error);

            return res.status(500).json({
                message: "AI returned an invalid response",
            });
        }

        res.status(200).json({
            message: "AI job match generated successfully",
            result,
        });

    } catch (error) {
        console.error("AI Job Match Error:", error.status || "unknown", error.message);

        res.status(error.status || 500).json({
            message: error.status === 401
                ? "OpenAI rejected the API key. Add a newly created key and restart the server."
                : error.status === 429
                    ? "OpenAI usage limit reached. Check your API billing and usage limits."
                    : error.status === 404
                        ? "The configured OpenAI model is unavailable. Set OPENAI_MODEL=gpt-5-mini and restart the server."
                        : "AI job matching failed. Check the server terminal for the detailed error.",
        });
    }
};


module.exports = {
    getJobMatch,
};
