const rejectionCodes = require('../data/rejection-codes.json');
const fixSteps = require('../data/fix-steps.json');

/**
 * AI Explainer Service
 * Rule-based engine that maps rejection codes to plain-language explanations
 * and step-by-step fix instructions.
 */
class AIExplainer {
  constructor() {
    this.rejectionMap = {};
    rejectionCodes.forEach(code => {
      this.rejectionMap[code.code] = code;
    });
  }

  /**
   * Get a full explanation for a rejection code
   */
  explain(rejectionCode) {
    const codeInfo = this.rejectionMap[rejectionCode];
    const steps = fixSteps[rejectionCode];

    if (!codeInfo) {
      return {
        success: false,
        message: `Sorry, I don't recognize rejection code "${rejectionCode}". Please check the code and try again.`
      };
    }

    return {
      success: true,
      code: codeInfo.code,
      title: codeInfo.title,
      description: codeInfo.description,
      severity: codeInfo.severity,
      category: codeInfo.category,
      explanation: this._generateExplanation(codeInfo),
      steps: steps ? steps.steps : this._generateGenericSteps(codeInfo),
      tips: this._getTips(codeInfo.category)
    };
  }

  /**
   * Generate a friendly, conversational explanation
   */
  _generateExplanation(codeInfo) {
    const explanations = {
      KYC: `Your claim was rejected because of a KYC (Know Your Customer) issue: "${codeInfo.title}". ${codeInfo.description} This is one of the most common reasons for PF claim rejection, but don't worry — it's fixable! Follow the steps below to resolve this.`,
      Bank: `Your claim was rejected due to a banking issue: "${codeInfo.title}". ${codeInfo.description} This usually happens when bank details aren't updated or verified on the EPFO portal. Here's how to fix it:`,
      Employer: `Your claim was rejected because of an employer-related issue: "${codeInfo.title}". ${codeInfo.description} This requires coordination with your employer (or former employer). Here's what you can do:`,
      Eligibility: `Your claim was rejected because of an eligibility issue: "${codeInfo.title}". ${codeInfo.description} Let me explain the rules and what options you have:`,
      Form: `Your claim was rejected due to a form/documentation issue: "${codeInfo.title}". ${codeInfo.description} This is usually easy to fix. Here's how:`,
      Process: `Your claim was rejected due to a process issue: "${codeInfo.title}". ${codeInfo.description} Here's how to resolve this:`
    };

    return explanations[codeInfo.category] || `Your claim was rejected: "${codeInfo.title}". ${codeInfo.description}`;
  }

  /**
   * Generate generic fix steps when specific ones aren't available
   */
  _generateGenericSteps(codeInfo) {
    return [
      {
        step: 1,
        title: 'Login to UAN Portal',
        description: 'Go to https://unifiedportal-mem.epfindia.gov.in and login with your UAN and password.'
      },
      {
        step: 2,
        title: 'Check your KYC details',
        description: 'Navigate to Manage → KYC and verify all your details are correct and verified.'
      },
      {
        step: 3,
        title: 'Contact employer if needed',
        description: 'If corrections need employer approval, contact your HR department.'
      },
      {
        step: 4,
        title: 'Resubmit your claim',
        description: 'Once the issue is resolved, submit a fresh claim through Online Services → Claim.'
      }
    ];
  }

  /**
   * Category-specific tips
   */
  _getTips(category) {
    const tips = {
      KYC: [
        'Always ensure your name is spelled exactly the same across Aadhaar, PAN, and PF records.',
        'KYC corrections usually take 7-15 working days to process.',
        'You can track correction status on the UAN portal.'
      ],
      Bank: [
        'Use a bank account where the name matches your PF records exactly.',
        'After bank mergers, IFSC codes may change — check with your bank.',
        'Penny-drop verification is usually instant.'
      ],
      Employer: [
        'If your employer is not responding, file a grievance at https://epfigms.gov.in',
        'You can also visit your regional EPFO office for help.',
        'Keep copies of all communication with your employer.'
      ],
      Eligibility: [
        'Full PF withdrawal requires 2 months of unemployment after leaving.',
        'Partial advances have different eligibility rules based on purpose.',
        'Check the EPFO website for the latest withdrawal rules.'
      ],
      Form: [
        'Double-check all fields before submitting the form.',
        'Ensure you use the correct form type for your withdrawal purpose.',
        'Upload clear, legible copies of supporting documents.'
      ],
      Process: [
        'EPFO servers work best during off-peak hours (early morning/late night).',
        'Keep your claim reference number for tracking.',
        'Most process issues resolve within a few days.'
      ]
    };

    return tips[category] || ['Contact your regional EPFO office if you need further assistance.'];
  }

  /**
   * Chat-style response for conversational queries
   */
  chat(message) {
    // Extract rejection code from message if present
    const codeMatch = message.match(/RJ-\d{3}/i);
    if (codeMatch) {
      return this.explain(codeMatch[0].toUpperCase());
    }

    // Keyword-based responses
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('uan') && (lowerMsg.includes('forgot') || lowerMsg.includes('find') || lowerMsg.includes('lost'))) {
      return {
        success: true,
        type: 'info',
        message: 'To find your UAN:\n1. Check your salary slip — UAN is usually printed there\n2. Ask your employer\'s HR department\n3. Visit https://unifiedportal-mem.epfindia.gov.in → "Know Your UAN" (needs Aadhaar/PAN/Member ID)\n4. Call EPFO helpline: 1800-118-005'
      };
    }

    if (lowerMsg.includes('status') || lowerMsg.includes('track') || lowerMsg.includes('check')) {
      return {
        success: true,
        type: 'info',
        message: 'To check your claim status:\n1. Login to https://passbook.epfindia.gov.in\n2. Or use the UMANG app\n3. Or SMS: EPFOHO UAN ENG to 7738299899\n4. I can also show you the status — just enter your UAN on the home page!'
      };
    }

    if (lowerMsg.includes('how long') || lowerMsg.includes('time') || lowerMsg.includes('days')) {
      return {
        success: true,
        type: 'info',
        message: 'Typical PF claim processing times:\n• Online claims: 10-20 working days\n• KYC corrections: 7-15 working days\n• Grievance resolution: 30 days\n• Employer attestation: depends on employer (file grievance after 7 days)'
      };
    }

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('help')) {
      return {
        success: true,
        type: 'greeting',
        message: 'Hello! I\'m PF Sathi, your PF claims assistant. 🤝\n\nI can help you with:\n• Understanding why your claim was rejected\n• Step-by-step guidance to fix issues\n• Tracking your claim status\n• Answering PF-related questions\n\nTry asking me about a specific rejection code (e.g., "What is RJ-001?") or describe your problem!'
      };
    }

    return {
      success: true,
      type: 'fallback',
      message: 'I\'m not sure I understood that. Could you try:\n• Asking about a specific rejection code (e.g., "Explain RJ-001")\n• Describing your problem (e.g., "My name doesn\'t match")\n• Asking about claim status or UAN\n\nOr enter your UAN on the home page to see your claims!'
    };
  }
}

module.exports = new AIExplainer();
