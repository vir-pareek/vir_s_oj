import express from 'express';
import { submitCode, getSubmissionStatus, runCustomCode } from '../controllers/submission.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
router.post("/run", verifyToken, runCustomCode);
router.post('/submit', verifyToken, submitCode);
router.get('/:id', verifyToken, getSubmissionStatus);

export default router;