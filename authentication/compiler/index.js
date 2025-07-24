const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const deleteFile = require("./utils/deleteFile");
const { generateFile, generateInputFile } = require("./generateFile");
const { executeCpp, executePython, executeJava } = require("./execute");

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
        return res.status(404).json({ success: false, message: "Code not found" });
    }
    try {
        const filePath = generateFile(language, code);
        console.log("input value", input);
        const inputFilePath = generateInputFile(input); // Generate input file if provided
        console.log("Input file path:", inputFilePath);

        if (language === 'cpp') {
            const output = await executeCpp(filePath, inputFilePath);
            return res.json({ output });
        }
        if (language === 'c') {
            const output = await executeCpp(filePath, inputFilePath);
            return res.json({ output });
        }
        if (language === 'py') {
            const output = await executePython(filePath, inputFilePath);
            return res.json({ output });
        }
        if (language === 'java') {
            const output = await executeJava(filePath, inputFilePath);
            if (await fs.pathExists(filePath)) {
                await fs.remove(filePath);
            }
            else {
                console.log("no path");
            }
            if (await fs.pathExists(inputFilePath)) {
                await fs.remove(inputFilePath);
            }
            else {
                console.log("no path");
            }
            return res.json({ output });
        }
         // Delete input file if it was created
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
module.exports = app;