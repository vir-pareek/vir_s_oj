import express from "express";
import axios from "axios";
const router = express.Router();

// POST /api/execute
router.post("/execute", async (req, res) => {
  const { code, language, input } = req.body;
  try {
    // Forward the request to the compiler service
    const response = await axios.post("http://localhost:8000/run", {
      code,
      language,
      input,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
