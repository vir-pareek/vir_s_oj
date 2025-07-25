import { Submission } from "../models/submission.model.js";
import { Question } from "../models/question.model.js";
// Import the local judge functions

import fs from "fs-extra";
import { executeCpp, executeJava, executePython } from "../judge/execute.js";
import { generateFile, generateInputFile } from "../judge/generateFile.js";

// Unified helper function to run code and clean up files
const runCode = async (language, code, input) => {
    let filePath;
    let inputFilePath;
    try {
        filePath = generateFile(language, code);
        inputFilePath = generateInputFile(input);

        let output;
        if (language === 'cpp' || language === 'c') {
            output = await executeCpp(filePath, inputFilePath);
        } else if (language === 'py') {
            output = await executePython(filePath, inputFilePath);
        } else if (language === 'java') {
            output = await executeJava(filePath, inputFilePath);
        } else {
            throw new Error("Unsupported language");
        }
        return { success: true, output: output.trim() };
    } catch (error) {
        console.error("Error running code:", error);
        return { success: false, output: error.toString() };
    } finally {
        // Cleanup generated files
        if (filePath && filePath.endsWith('.java')) {
            // For Java, we remove the entire unique directory
            const jobDir = path.dirname(filePath);
            await fs.remove(jobDir);
        } else if (filePath) {
            await fs.remove(filePath);
        }
        if (inputFilePath) {
            await fs.remove(inputFilePath);
        }
    }
};

// Handles "Run" button with custom input
export const runCustomCode = async (req, res) => {
    const { language, code, input } = req.body;
    if (code === undefined) {
        return res.status(400).json({ success: false, output: "Code is required." });
    }
    const result = await runCode(language, code, input || "");
    if (result.success) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
};

// Handles "Submit" button
export const submitCode = async (req, res) => {
    const { language, code, questionId } = req.body;
    const userId = req.userId;

    if (!code) {
        return res.status(400).json({ success: false, message: "Code is required" });
    }

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        const newSubmission = await Submission.create({ userId, questionId, language, code, status: "Pending" });

        (async () => {
            let finalStatus = 'Accepted';
            let finalOutput = 'All test cases passed!';
            for (const testCase of question.testCases) {
                const result = await runCode(language, code, testCase.input);
                if (!result.success) {
                    finalStatus = 'Compilation Error';
                    finalOutput = result.output;
                    break;
                }
                if (result.output !== testCase.expectedOutput.trim()) {
                    finalStatus = 'Wrong Answer';
                    finalOutput = `Failed on test case.\nInput:\n${testCase.input}\n\nExpected Output:\n${testCase.expectedOutput}\n\nYour Output:\n${result.output}`;
                    break;
                }
            }
            await Submission.findByIdAndUpdate(newSubmission._id, { status: finalStatus, output: finalOutput });
        })();

        return res.status(201).json({ success: true, submissionId: newSubmission._id });
    } catch (error) {
        console.error("Error in submitCode controller:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Gets details for a single submission
export const getSubmissionDetails = async (req, res) => {
    const { id: submissionId } = req.params;
    const userId = req.userId;
    try {
        const submission = await Submission.findById(submissionId).populate('questionId', 'title');
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found." });
        }
        if (submission.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }
        res.status(200).json({ success: true, submission });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Gets all submissions for the logged-in user
export const getUserSubmissions = async (req, res) => {
    const userId = req.userId;
    try {
        const submissions = await Submission.find({ userId })
            .sort({ createdAt: -1 })
            .populate('questionId', 'title');
        res.status(200).json({ success: true, submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch submissions" });
    }
};