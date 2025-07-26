import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import { generateFile, generateInputFile } from "./generateFile.js";
import { executeCpp, executePython, executeJava } from "./execute.js";
import { v4 as uuid } from "uuid";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});
app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    console.log("Received body:", req.body);

    if (code === undefined) {
        return res.status(404).json({ success: false, output: "Code not found" });
    }
    try {
        const filePath = generateFile(language, code);
        const inputFilePath = generateInputFile(input);

        const cleanup = async () => {
            if (await fs.pathExists(filePath)) await fs.remove(filePath);
            if (await fs.pathExists(inputFilePath)) await fs.remove(inputFilePath);
        };

        const handleExecution = async (execFn) => {
            try {
                const output = await execFn(filePath, inputFilePath);
                await cleanup();
                return res.json({ success: true, output });
            } catch (err) {
                await cleanup();
                return res.json({ success: false, output: err.toString() });
            }
        };

        if (language === 'cpp' || language === 'c') {
            return await handleExecution(executeCpp);
        }
        if (language === 'py') {
            return await handleExecution(executePython);
        }
        if (language === 'java') {
            return await handleExecution(executeJava);
        }
        await cleanup();
        return res.json({ success: false, output: "Unsupported language" });
    } catch (error) {
        return res.status(500).json({ success: false, output: error.message });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, (error) => {
    if (error) {
        console.error("Error starting server:", error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});