const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// ============================
// REGISTER USER
// ============================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        // Check required fields
        if (!name || !normalizedEmail || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: role || "jobseeker",
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            message: "Server error during registration",
        });
    }
};

// ============================
// LOGIN USER
// ============================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        // Check required fields
        if (!normalizedEmail || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // Find user
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error during login",
        });
    }
};
// ============================
// GET CURRENT USER
// ============================
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            user,
        });
    } catch (error) {
        console.error("Get Current User Error:", error);

        res.status(500).json({
            message: "Server error while fetching user",
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, location, bio, skills, profileImage } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = String(name).trim();
        if (phone !== undefined) updates.phone = String(phone).trim();
        if (location !== undefined) updates.location = String(location).trim();
        if (bio !== undefined) updates.bio = String(bio).trim();
        if (profileImage !== undefined) updates.profileImage = String(profileImage).trim();
        if (skills !== undefined) updates.skills = Array.isArray(skills)
            ? skills.map((skill) => String(skill).trim()).filter(Boolean) : [];

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
            .select("-password");
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error while updating profile" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
};
