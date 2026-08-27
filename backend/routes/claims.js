const express = require('express');
const router = express.Router();
const claims = require('../data/mock-claims.json');
const rejectionCodes = require('../data/rejection-codes.json');

// Build lookup map
const rejectionMap = {};
rejectionCodes.forEach(code => {
  rejectionMap[code.code] = code;
});

/**
 * GET /api/claims/:uan
 * Returns all claims for a given UAN
 */
router.get('/:uan', (req, res) => {
  const { uan } = req.params;
  const userClaims = claims.filter(c => c.uan === uan);

  if (userClaims.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No claims found for UAN: ${uan}. Please check your UAN and try again.`
    });
  }

  // Enrich claims with rejection details
  const enriched = userClaims.map(claim => ({
    ...claim,
    rejectionDetails: claim.rejectionCode ? rejectionMap[claim.rejectionCode] || null : null
  }));

  res.json({
    success: true,
    uan,
    memberName: userClaims[0].memberName,
    totalClaims: userClaims.length,
    claims: enriched
  });
});

/**
 * GET /api/claims/:uan/:claimId
 * Returns a single claim with full details
 */
router.get('/:uan/:claimId', (req, res) => {
  const { uan, claimId } = req.params;
  const claim = claims.find(c => c.uan === uan && c.claimId === claimId);

  if (!claim) {
    return res.status(404).json({
      success: false,
      message: `Claim ${claimId} not found for UAN: ${uan}`
    });
  }

  res.json({
    success: true,
    claim: {
      ...claim,
      rejectionDetails: claim.rejectionCode ? rejectionMap[claim.rejectionCode] || null : null
    }
  });
});

module.exports = router;
