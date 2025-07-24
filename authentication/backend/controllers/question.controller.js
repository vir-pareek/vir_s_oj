// backend/controllers/question.controller.js
import { question } from "../models/question.model.js";

// Create
export const createQuestion = async (req, res) => {
    const { qid, title, description, input, output, constraints, company } = req.body;
    try {
        if (!qid || !title || !description) {
            throw new Error("qid, title, and description are required");
        }
        if (await question.findOne({ qid })) {
            return res.status(400).json({ success: false, message: "Question already exists" });
        }
        const newQ = await new question(req.body).save();
        res.status(201).json({ success: true, question: newQ });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// List all
export const listQuestions = async (req, res) => {
    try {
        const all = await question.find().sort({ createdAt: -1 });
        res.json({ success: true, questions: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get one
export const getQuestion = async (req, res) => {
    try {
        const q = await question.findById(req.params.id);
        if (!q) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, question: q });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update
export const updateQuestion = async (req, res) => {
    try {
        const updated = await question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, question: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete
export const deleteQuestion = async (req, res) => {
    try {
        const removed = await question.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
