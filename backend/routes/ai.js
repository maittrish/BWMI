const express = require('express');
const router = express.Router();
const aiExplainer = require('../services/aiExplainer');

/**
 * POST /api/ai/explain
 * Explain a rejection code
 * Body: { rejectionCode: "RJ-001" }
 */
router.post('/explain', (req, res) => {
  const { rejectionCode } = req.body;

  if (!rejectionCode) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a rejectionCode in the request body.'
    });
  }

  const explanation = aiExplainer.explain(rejectionCode);
  res.json(explanation);
});

/**
 * POST /api/ai/chat
 * Chat with PF Sathi
 * Body: { message: "Why was my claim rejected?" }
 */
router.post('/chat', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a message.'
    });
  }

  const response = aiExplainer.chat(message);
  res.json(response);
});

module.exports = router;
