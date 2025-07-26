import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db/connectDB.js';

console.log("--- [Step 1] Server process started ---");

// Wrap the entire application in a self-executing async function
const startServer = async () => {
    try {
        console.log("--- [Step 2] Importing routes... ---");
        const authRoutes = await import("./routes/auth.route.js");
        const questionRoutes = await import("./routes/question.route.js");
        const submissionRoutes = await import("./routes/submission.route.js");
        const aiRoutes = await import("./routes/ai.route.js");
        console.log("--- [Step 3] Route imports successful ---");

        dotenv.config();
        console.log("--- [Step 4] Dotenv configured ---");

        if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
            console.error("FATAL ERROR: MONGO_URI or JWT_SECRET is not defined.");
            throw new Error("Missing critical environment variables.");
        }
        console.log("--- [Step 5] Environment variables checked ---");

        const app = express();
        const PORT = process.env.PORT || 10000;
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        app.use(cors({
            origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
            credentials: true,
        }));
        app.use(express.json());
        app.use(cookieParser());
        console.log("--- [Step 6] Middleware configured ---");

        app.use("/api/auth", authRoutes.default);
        app.use("/api/questions", questionRoutes.default);
        app.use("/api/submissions", submissionRoutes.default);
        app.use("/api/ai", aiRoutes.default);
        console.log("--- [Step 7] API routes configured ---");

        if (process.env.NODE_ENV === "production") {
            const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
            app.use(express.static(frontendDistPath));
            app.get("*", (req, res) => {
                res.sendFile(path.resolve(frontendDistPath, "index.html"));
            });
            console.log("--- [Step 8] Production frontend static files configured ---");
        }

        console.log("--- [Step 9] Connecting to MongoDB... ---");
        await connectDB();
        console.log("--- [Step 10] MongoDB connected successfully ---");

        app.listen(PORT, () => {
            console.log(`--- [Step 11] Server is now listening on port: ${PORT} ---`);
        });

    } catch (error) {
        console.error("!!! FATAL STARTUP ERROR !!!");
        console.error(error);
        process.exit(1);
    }
};

startServer();