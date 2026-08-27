const API_BASE = '/api';

async function request(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please make sure the backend is running on port 3001.');
    }
    throw error;
  }
}

export const api = {
  // Claims
  getClaims: (uan) => request(`/claims/${uan}`),
  getClaim: (uan, claimId) => request(`/claims/${uan}/${claimId}`),

  // AI
  explain: (rejectionCode) => request('/ai/explain', {
    method: 'POST',
    body: JSON.stringify({ rejectionCode })
  }),
  chat: (message) => request('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  }),

  // Resubmit
  resubmit: (uan, claimId, corrections) => request('/resubmit', {
    method: 'POST',
    body: JSON.stringify({ uan, claimId, corrections })
  }),

  // Rejections catalog
  getRejections: () => request('/ai/rejections'),

  // Demo
  getDemoUans: () => request('/demo-uans'),

  // Health
  health: () => request('/health')
};
