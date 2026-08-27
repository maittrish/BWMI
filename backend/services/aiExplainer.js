const rejectionCodes = require('../data/rejection-codes.json');
const fixSteps = require('../data/fix-steps.json');

/**
 * AI Explainer Service
 * Maps rejection codes and user queries to plain-language explanations
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
   * Get all rejection codes
   */
  getAllCodes() {
    return rejectionCodes;
  }

  /**
   * Get a full explanation for a rejection code
   */
  explain(rejectionCode) {
    const normalizedCode = rejectionCode ? rejectionCode.trim().toUpperCase() : '';
    const codeInfo = this.rejectionMap[normalizedCode];
    const steps = fixSteps[normalizedCode];

    if (!codeInfo) {
      return {
        success: false,
        message: `Sorry, I don't recognize rejection code "${rejectionCode}". Please select or ask about codes like RJ-001 (Name Mismatch), RJ-004 (Bank Not Verified), RJ-007 (Employer Attestation), or RJ-014 (Advance Limit Exceeded).`
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
    if (!message) {
      return {
        success: true,
        type: 'greeting',
        message: 'Hello! I\'m PF Sathi, your AI claims assistant. How can I help you today?'
      };
    }

    // Extract rejection code from message if present (e.g., RJ-001, RJ001, rj-004)
    const codeMatch = message.match(/RJ-?\s?(\d{3})/i);
    if (codeMatch) {
      const code = `RJ-${codeMatch[1]}`;
      return this.explain(code);
    }

    const lowerMsg = message.toLowerCase();

    // Natural query for Name Mismatch
    if (lowerMsg.includes('name') && (lowerMsg.includes('mismatch') || lowerMsg.includes('wrong') || lowerMsg.includes('spelling') || lowerMsg.includes('diff'))) {
      return this.explain('RJ-001');
    }

    // Natural query for Date of birth
    if (lowerMsg.includes('dob') || lowerMsg.includes('date of birth') || lowerMsg.includes('birth date')) {
      return this.explain('RJ-002');
    }

    // Natural query for Bank Account / IFSC
    if (lowerMsg.includes('bank') || lowerMsg.includes('ifsc') || lowerMsg.includes('cheque') || lowerMsg.includes('passbook') || lowerMsg.includes('account number')) {
      return this.explain('RJ-004');
    }

    // Natural query for Employer Attestation / HR not signing
    if (lowerMsg.includes('employer') || lowerMsg.includes('attest') || lowerMsg.includes('company') || lowerMsg.includes('hr') || lowerMsg.includes('boss')) {
      return this.explain('RJ-007');
    }

    // Natural query for Aadhaar linking
    if (lowerMsg.includes('aadhaar') || lowerMsg.includes('aadhar') || lowerMsg.includes('uidai') || lowerMsg.includes('seed')) {
      return this.explain('RJ-005');
    }

    // Common rejection codes overview
    if (lowerMsg.includes('common') || lowerMsg.includes('rejection reasons') || lowerMsg.includes('why rejected') || lowerMsg.includes('reasons') || lowerMsg.includes('codes')) {
      return {
        success: true,
        type: 'info',
        message: 'Top 5 reasons why EPFO claims get rejected:\n\n1️⃣ RJ-001: Name Mismatch (Aadhaar/PAN vs PF records)\n2️⃣ RJ-004: Bank Account Unverified / Name mismatch on passbook\n3️⃣ RJ-007: Employer Attestation Pending (HR did not approve)\n4️⃣ RJ-005: Aadhaar not seeded or linked with UAN\n5️⃣ RJ-014: Advance amount requested exceeds eligible limit\n\nAsk me about any of these (e.g. "Explain RJ-001") for full step-by-step fix instructions!'
      };
    }

    if (lowerMsg.includes('uan') && (lowerMsg.includes('forgot') || lowerMsg.includes('find') || lowerMsg.includes('lost') || lowerMsg.includes('what is'))) {
      return {
        success: true,
        type: 'info',
        message: 'Universal Account Number (UAN) is your 12-digit permanent EPFO identifier:\n\n1. Check your monthly salary slip (printed near PF No.)\n2. Ask your employer\'s HR department\n3. Visit https://unifiedportal-mem.epfindia.gov.in → Click "Know Your UAN"\n4. Call EPFO Toll-free helpline: 1800-118-005'
      };
    }

    if (lowerMsg.includes('status') || lowerMsg.includes('track') || lowerMsg.includes('check')) {
      return {
        success: true,
        type: 'info',
        message: 'To track your claim status:\n\n1. Use PF Sathi Home page: Enter your UAN to see real-time claim cards and visual timelines!\n2. EPFO Member Portal: https://passbook.epfindia.gov.in\n3. UMANG Mobile App: Search "EPFO" → "Track Claim"\n4. SMS: Send `EPFOHO UAN ENG` to 7738299899'
      };
    }

    if (lowerMsg.includes('how long') || lowerMsg.includes('time') || lowerMsg.includes('days') || lowerMsg.includes('duration')) {
      return {
        success: true,
        type: 'info',
        message: 'Typical EPFO settlement timelines:\n\n• Online Claim (Form 19 / 31 / 10C): 10 to 20 working days\n• Auto-settled Advances (Illness/Education): 3 to 5 days\n• KYC Name / DOB Corrections: 7 to 15 working days\n• EPFiGMS Grievance resolution: Up to 30 days'
      };
    }

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('help') || lowerMsg.includes('hey') || lowerMsg.includes('namaste')) {
      return {
        success: true,
        type: 'greeting',
        message: 'Namaste & Hello! I\'m PF Sathi, your AI-powered PF Claims Assistant. 🤝\n\nI can help you with:\n• 🔍 Explaining why your claim was rejected in plain English & Hindi\n• 🛠️ 5-step fix guides to get your money released\n• 📊 Tracking claims with visual status timelines\n• 🎤 Voice assistant for hands-free queries\n\nTry clicking any suggestion below or ask me about a rejection code like RJ-001!'
      };
    }

    return {
      success: true,
      type: 'fallback',
      message: `I understand you're asking about "${message}".\n\nHere are some things I can help you with immediately:\n• Type any code like "RJ-001", "RJ-004", or "RJ-007"\n• Ask "What are the common rejection codes?"\n• Ask "How do I fix name mismatch?"\n• Ask "How to track my claim status?"\n\nOr click the Claims tab in the bottom bar to review your claims!`
    };
  }
}

module.exports = new AIExplainer();
