const OpenAI = require("openai");
const Job = require("../models/job");
const User = require("../models/user");

const getOpenAIClient = () => {
    const apiKey = (process.env.OPENAI_API_KEY || "").trim();
    if (!apiKey) return null;
    return new OpenAI({ apiKey });
};

const normalizeSkills = (skills) =>
    (Array.isArray(skills) ? skills : String(skills || "").split(","))
        .map((skill) => skill.trim())
        .filter(Boolean);

const parseAiJson = (text) => {
    const cleaned = String(text || "").replace(/```json|```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) {
        throw new Error("AI returned an invalid response");
    }
    return JSON.parse(cleaned.slice(start, end + 1));
};

const localJobMatch = (user, job) => {
    const candidateSkills = normalizeSkills(user.skills);
    const requiredSkills = normalizeSkills(job.skills);
    const candidateSet = candidateSkills.map((skill) => skill.toLowerCase());

    const matchingSkills = requiredSkills.filter((skill) =>
        candidateSet.some((owned) => owned.includes(skill.toLowerCase()) || skill.toLowerCase().includes(owned))
    );
    const missingSkills = requiredSkills.filter((skill) => !matchingSkills.includes(skill));

    let matchScore = 35;
    if (requiredSkills.length) {
        matchScore = Math.round((matchingSkills.length / requiredSkills.length) * 70) + 20;
    }

    const bio = `${user.bio || ""} ${candidateSkills.join(" ")}`.toLowerCase();
    const jobText = `${job.title || ""} ${job.description || ""} ${job.category || ""}`.toLowerCase();
    const keywords = jobText.split(/[^a-z0-9+]+/).filter((word) => word.length > 3);
    const overlap = new Set(keywords.filter((word) => bio.includes(word))).size;
    if (overlap) {
        matchScore = Math.min(96, matchScore + Math.min(15, overlap * 2));
    }
    if (!candidateSkills.length) {
        matchScore = Math.max(18, matchScore - 20);
    }

    let recommendation;
    if (matchScore >= 75) {
        recommendation = "Strong alignment with this role. Highlight the matching skills on your resume and apply.";
    } else if (matchScore >= 50) {
        recommendation = missingSkills.length
            ? `Decent fit. Strengthen ${missingSkills.slice(0, 3).join(", ")} to improve your chances.`
            : "Decent fit. Add more skills and a short bio on your profile for a sharper score.";
    } else {
        recommendation = missingSkills.length
            ? `This role needs more of ${missingSkills.slice(0, 3).join(", ")}. Update your profile skills and try again.`
            : "Add your skills and a short bio in Profile so matching can score this role more accurately.";
    }

    return {
        matchScore,
        matchingSkills,
        missingSkills,
        recommendation,
        source: "local",
    };
};

const requestOpenAIMatch = async (openai, prompt) => {
    const model = (process.env.OPENAI_MODEL || "gpt-4o-mini").trim();

    try {
        const response = await openai.responses.create({
            model,
            input: prompt,
        });
        return parseAiJson(response.output_text);
    } catch (error) {
        if (error.status === 404 || /responses/i.test(error.message || "")) {
            const completion = await openai.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: "Return only valid JSON." },
                    { role: "user", content: prompt },
                ],
                temperature: 0.3,
            });
            return parseAiJson(completion.choices?.[0]?.message?.content);
        }
        throw error;
    }
};

const getJobMatch = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        const user = await User.findById(req.user.id).select("name bio skills");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const candidateSkills = normalizeSkills(user.skills).join(", ");
        const requiredSkills = normalizeSkills(job.skills).join(", ");
        const openai = getOpenAIClient();

        if (openai) {
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

            try {
                const result = await requestOpenAIMatch(openai, prompt);
                return res.status(200).json({
                    message: "AI job match generated successfully",
                    result: { ...result, source: "openai" },
                });
            } catch (error) {
                console.error("OpenAI Job Match Error:", error.status || "unknown", error.message);
            }
        }

        return res.status(200).json({
            message: "AI job match generated successfully",
            result: localJobMatch(user, job),
        });
    } catch (error) {
        console.error("AI Job Match Error:", error.status || "unknown", error.message);

        res.status(error.status || 500).json({
            message: "AI job matching failed. Check the server terminal for the detailed error.",
        });
    }
};

module.exports = {
    getJobMatch,
};
