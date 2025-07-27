import bcryptjs from 'bcryptjs';
// crypto is no longer needed for this file if you remove password reset
// import crypto from 'crypto'; 

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utis/generateTokenAndSetCookie.js";
// import { question } from '../models/question.model.js';
// Email functions are no longer needed for signup
// import { sendVerificationEmail } from "../mailtrap/emails.js";


export const signup = async (req, res) => {
    const { email, password, name, adminCode } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const isAdmin = adminCode === process.env.ADMIN_SECRET;

        // Logic for verificationToken has been removed.
        const user = new User({
            email,
            password: hashedPassword,
            name,
            isAdmin
        })

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        // The call to send a verification email has been removed.

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("Error in signup controller: ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- The rest of your controller functions (login, logout, etc.) ---

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("Error in login ", error);

        res.status(400).json({ success: false, message: "Invalid credentials" });
    }
}

// export const logout = async (req, res) => {
//     res.clearCookie("token")
//     res.status(200).json({ success: true, message: "Logged out successfully" });
// }
// In controllers/auth.controller.js

// --- (Your signup and login functions are above this) ---

export const logout = async (req, res) => {
    try {
        // Determine if running in production to set cookie options correctly
        const isProduction = process.env.NODE_ENV === 'production';

        // To clear the cookie, you must pass the same options used to set it.
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction, // Must be true in production (HTTPS)
            sameSite: isProduction ? "none" : "lax", // 'none' for cross-site, 'lax' for local
        });

        res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in logout controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// --- (Your checkAuth function is below this) ---

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

