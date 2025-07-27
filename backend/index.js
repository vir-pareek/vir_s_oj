import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser'

import { connectDB } from './db/connectDB.js';

import authRoutes from "./routes/auth.route.js"
import questionRoutes from "./routes/question.route.js";
import submissionRoutes from "./routes/submission.route.js";
import aiRoutes from "./routes/ai.route.js";
import executeRoutes from "./routes/execute.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "https://vir-s-oj.vercel.app",
    credentials: true, //allows cookies to be sent with requests
}));

app.use(express.json()); //allows us to parse incoming req with json payloads or allows parsing incoming requests : req.body
app.use(cookieParser()); //allows us to parse cookies from incoming requests

app.use("/api/auth", authRoutes)
app.use("/api/questions", questionRoutes) // Assuming you want to use the same routes for questions, adjust as necessary
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", executeRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port: ", PORT);

})
