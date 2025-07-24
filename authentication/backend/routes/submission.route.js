import express from 'express';
import { submitCode, getSubmissionStatus } from '../controllers/submission.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/submit', verifyToken, submitCode);
router.get('/:id', verifyToken, getSubmissionStatus);

export default router;