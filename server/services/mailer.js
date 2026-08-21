const nodemailer = require("nodemailer");

const transporter = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
    : null;

const sendMail = async (message) => {
    if (!transporter) return;
    try {
        await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.SMTP_USER, ...message });
    } catch (error) {
        console.error("Email Notification Error:", error.message);
    }
};

const notifyRecruiterOfApplication = (recruiter, applicant, job) => sendMail({
    to: recruiter.email,
    subject: `New application for ${job.title}`,
    text: `Hi ${recruiter.name}, ${applicant.name} has applied for ${job.title}. Sign in to CareerConnect to review the application.`,
});

const notifyApplicantOfStatus = (applicant, job, status) => sendMail({
    to: applicant.email,
    subject: `Application update: ${job.title}`,
    text: `Hi ${applicant.name}, your application for ${job.title} is now marked ${status}. Sign in to CareerConnect for details.`,
});

module.exports = { notifyRecruiterOfApplication, notifyApplicantOfStatus };
