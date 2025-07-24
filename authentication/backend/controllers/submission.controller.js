// Change 1: Add .js to the import path, which is required in ES Modules
import { Submission } from "../models/submission.model.js";
import { Question } from "../models/question.model.js";
import axios from "axios";
import { generateFile, generateInputFile } from "../../compiler/generateFile.js";
import { executeCpp, executeJava, executePython } from "../../compiler/execute.js";
import fs from "fs-extra"; // Ensure you have this package installed

// Change 2: Renamed function for clarity and fixed the parameter name
const runCodeAgainstTestCase = async (code, language, testCaseInput) => {
    try {
        const response = await axios.post('http://localhost:8000/run', {
            language,
            code,
            // Change 3: Use the correct parameter 'testCaseInput' that is passed to this function
            input: testCaseInput
        });
        // The .trim() is VERY important to remove trailing newlines
        return { success: true, output: response.data.output.trim() };
    } catch (error) {
        // This catches compilation or runtime errors from the compiler service
        const errorMessage = error.response?.data?.message || 'An unknown error occurred while running code';
        // Change 4: Use console.error() which is a function, not a property
        console.error("Error from compiler service:", errorMessage);
        // Change 5: Return the error message in a consistent 'output' field for easier handling
        return { success: false, output: errorMessage };
    }
};
const runCode = async (language, code, input) => {
    try {
        const filePath = generateFile(language, code);
        const inputFilePath = generateInputFile(input);

        let output;
        if (language === 'cpp') {
            output = await executeCpp(filePath, inputFilePath);
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
        }
        else if (language === 'c') {
            output = await executeCpp(filePath, inputFilePath);
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
        }
         else if (language === 'py') {
            output = await executePython(filePath, inputFilePath);
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
        } else if (language === 'java') {
            output = await executeJava(filePath, inputFilePath);
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
        } else {
            throw new Error("Unsupported language");
        }
        return { success: true, output: output.trim() };
    } catch (error) {
        console.error("Error running code:", error);
        return { success: false, output: error.toString() };
    }
};

// This function handles a "dry run" against custom input.
export const runCustomCode = async (req, res) => {
    const { language, code, input } = req.body;

    if (code === undefined) {
        return res.status(400).json({ success: false, output: "Code is required." });
    }

    try {
        // We can reuse the same helper function from the submission logic
        const result = await runCode(language, code, input || ""); // Use empty string if input is null/undefined

        if (result.success) {
            return res.status(200).json({ success: true, output: result.output });
        } else {
            // If there was a compilation/runtime error, send it back with a 400 status
            return res.status(400).json({ success: false, output: result.output });
        }
    } catch (error) {
        console.error("Error in runCustomCode controller:", error);
        return res.status(500).json({ success: false, output: "An internal server error occurred." });
    }
};

export const submitCode = async (req, res) => {
    const { language, code, questionId } = req.body;
    // Change 6: Use req.userId to match what your verifyToken middleware provides
    const userId = req.userId;

    if (!code) {
        return res.status(400).json({ success: false, message: "Code is required" });
    }

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        // 1. Create a submission record with "Pending" status
        const newSubmission = await Submission.create({
            userId,
            questionId,
            language,
            code,
            status: 'Pending',
        });

        // 2. Asynchronously run the judging logic
        (async () => {
            let finalStatus = 'Accepted';
            let finalOutput = 'All test cases passed!';

            for (const testCase of question.testCases) {
                // Change 7: Pass the actual input string from the test case
                const result = await runCodeAgainstTestCase(code, language, testCase.input);

                if (!result.success) {
                    // This now handles both compilation and runtime errors
                    finalStatus = 'Compilation Error'; // Or could be 'Runtime Error'
                    finalOutput = result.output; // The error message is now correctly read from result.output
                    break; // Stop on first error
                }

                if (result.output !== testCase.expectedOutput.trim()) {
                    finalStatus = 'Wrong Answer';
                    finalOutput = `Failed on test case.\nInput:\n${testCase.input}\n\nExpected Output:\n${testCase.expectedOutput}\n\nYour Output:\n${result.output}`;
                    break; // Stop on first wrong answer
                }
            }

            // 3. Update the submission with the final verdict
            await Submission.findByIdAndUpdate(newSubmission._id, {
                status: finalStatus,
                output: finalOutput,
            });
        })();

        // 4. Immediately return the submission ID to the frontend
        return res.status(201).json({ success: true, submissionId: newSubmission._id, message: "Submission received and is being processed." });

    } catch (error) {
        console.error("Error in submitCode controller:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const getSubmissionStatus = async (req, res) => {
    const { id: submissionId } = req.params;
    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }
        // Return the full verdict object so the frontend can display details
        return res.status(200).json({ status: submission.status, output: submission.output });
    } catch (error) {
        console.error("Error in getSubmissionStatus controller:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};