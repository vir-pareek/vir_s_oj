import { Question } from "../models/question.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getHint = async (req, res) => {
    const { questionId } = req.body;

    if (!questionId) {
        return res.status(400).json({ message: "Question ID is required." });
    }

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        // Construct a detailed prompt for better results
        const prompt = `
            You are a helpful programming assistant for an Online Judge platform.
            A user is stuck on the following programming problem and has requested a hint.

            Provide a concise, high-level hint to guide them in the right direction.
            Do NOT give away the full solution or write any code.
            Focus on the general approach, a key data structure, or an important observation they might be missing.

            Problem Title: ${question.title}
            Problem Description: ${question.description}

            Hint:
        `;

        const result = await model.generateContent(prompt);
        console.log("result: ", result);
        const response = await result.response;
        console.log("response: ", response);
        const hintText = response.text();
        console.log("hintText: ", hintText);

        res.status(200).json({ hint: hintText });

    } catch (error) {
        console.error("Error generating hint from Gemini API:", error);
        res.status(500).json({ message: "Failed to generate hint. Please try again later." });
    }
};