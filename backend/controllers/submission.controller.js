import { Submission } from "../models/submission.model.js";
import { Question } from "../models/question.model.js";
import axios from "axios";



// Handles "Run" button with custom input
export const runCustomCode = async (req, res) => {
    const { language, code, input } = req.body;
    if (!code) {
        return res.status(400).json({ success: false, output: "Code is required." });
    }
    try {
        const response = await axios.post("http://localhost:5000/api/execute", { language, code, input });
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(400).json({ success: false, output: error.message });
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
                try {
                    const response = await axios.post("http://localhost:5000/api/execute", {
                        language,
                        code,
                        input: testCase.input,
                    });
                    const result = response.data;
                    if (!result.success) {
                        finalStatus = 'Compilation Error';
                        finalOutput = result.output;
                        break;
                    }
                    if (result.output.trim() !== testCase.expectedOutput.trim()) {
                        finalStatus = 'Wrong Answer';
                        finalOutput = `Failed on test case.\nInput:\n${testCase.input}\n\nExpected Output:\n${testCase.expectedOutput}\n\nYour Output:\n${result.output}`;
                        break;
                    }
                } catch (err) {
                    finalStatus = 'Error';
                    finalOutput = err.message;
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