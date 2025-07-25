import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Wrap the entire application startup in a try...catch block ---
try {
    // These imports must be inside the try block in case they fail
    const { connectDB } = await import('./db/connectDB.js');
    const authRoutes = await import("./routes/auth.route.js");
    const questionRoutes = await import("./routes/question.route.js");
    const submissionRoutes = await import("./routes/submission.route.js");
    const aiRoutes = await import("./routes/ai.route.js");
    // const judgeRoutes = await import("./routes/judge.route.js"); // REMOVED - This was the error

    dotenv.config();

    const app = express();
    const PORT = process.env.PORT || 10000;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
        console.error("FATAL ERROR: MONGO_URI and JWT_SECRET must be defined in your Render environment variables.");
        throw new Error("Missing critical environment variables.");
    }

    app.use(cors({
        origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
        credentials: true,
    }));

    app.use(express.json());
    app.use(cookieParser());

    app.use("/api/auth", authRoutes.default);
    app.use("/api/questions", questionRoutes.default);
    app.use("/api/submissions", submissionRoutes.default);
    app.use("/api/ai", aiRoutes.default);
    // app.use("/api/judge", judgeRoutes.default); // REMOVED - This was the error

    if (process.env.NODE_ENV === "production") {
        const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
        app.use(express.static(frontendDistPath));
        app.get("*", (req, res) => {
            res.sendFile(path.resolve(frontendDistPath, "index.html"));
        });
    }

    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log("Server is running on port: ", PORT);
        });
    }).catch(err => {
        console.error("!!! FAILED TO CONNECT TO MONGODB !!!");
        console.error(err);
        process.exit(1);
    });

} catch (error) {
    console.error("!!! FATAL STARTUP ERROR !!!");
    console.error(error);
    process.exit(1);
}