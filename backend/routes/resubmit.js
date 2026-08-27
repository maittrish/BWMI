const express = require('express');
const router = express.Router();

/**
 * POST /api/resubmit
 * Simulate claim resubmission
 * Body: { uan, claimId, corrections: { ... } }
 */
router.post('/', (req, res) => {
  const { uan, claimId, corrections } = req.body;

  if (!uan || !claimId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide uan and claimId.'
    });
  }

  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Your claim has been resubmitted successfully!',
      resubmission: {
        originalClaimId: claimId,
        newClaimId: `CLM-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
        uan,
        corrections: corrections || {},
        submittedAt: new Date().toISOString(),
        estimatedProcessingDays: 15,
        status: 'submitted',
        trackingMessage: 'You will receive an SMS update within 3-5 working days. Track status on the UAN portal.'
      }
    });
  }, 1000);
});

module.exports = router;
