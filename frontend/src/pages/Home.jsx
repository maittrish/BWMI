import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import RejectionExplainer from '../components/Claims/RejectionExplainer';
import { api } from '../services/api';
import './Home.css';

const DEMO_UANS = [
  { uan: '100123456789', name: 'Rajesh Kumar', desc: '3 claims (1 rejected - KYC Name)' },
  { uan: '100987654321', name: 'Priya Sharma', desc: '3 claims (2 rejected - Employer & Bank)' },
  { uan: '100555666777', name: 'Amit Patel', desc: '2 claims (1 rejected - Limit Exceeded)' }
];

const POPULAR_REJECTIONS = [
  { code: 'RJ-001', category: 'KYC', title: 'Name Mismatch in Aadhaar/PF', severity: 'high' },
  { code: 'RJ-004', category: 'Bank', title: 'Bank Account Not Verified', severity: 'high' },
  { code: 'RJ-007', category: 'Employer', title: 'Employer Attestation Pending', severity: 'high' },
  { code: 'RJ-005', category: 'KYC', title: 'Aadhaar Not Seeded to UAN', severity: 'high' },
  { code: 'RJ-014', category: 'Eligibility', title: 'Advance Limit Exceeded', severity: 'medium' },
  { code: 'RJ-020', category: 'Bank', title: 'Invalid Bank IFSC Code', severity: 'medium' }
];

export default function Home() {
  const [uan, setUan] = useState('');
  const [error, setError] = useState('');
  const [selectedRejection, setSelectedRejection] = useState(null);
  const [loadingRejection, setLoadingRejection] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const uanInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanUAN = uan.replace(/\s/g, '');
    if (!cleanUAN) {
      setError('Please enter your UAN number or select a demo account');
      uanInputRef.current?.focus();
      return;
    }
    if (cleanUAN.length < 10) {
      setError('UAN should be at least 10 digits');
      uanInputRef.current?.focus();
      return;
    }
    setError('');
    navigate(`/dashboard?uan=${cleanUAN}`);
  };

  const handleDemoClick = (demoUan) => {
    setUan(demoUan);
    navigate(`/dashboard?uan=${demoUan}`);
  };

  // Feature Card Actions
  const handleFeatureClick = (featureId) => {
    switch (featureId) {
      case 'track':
        // Highlight input or track first demo
        setUan('100123456789');
        uanInputRef.current?.focus();
        uanInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      case 'ai':
        navigate('/chat?query=What%20are%20the%20most%20common%20PF%20rejection%20reasons%20and%20how%20do%20I%20fix%20them?');
        break;
      case 'fix':
        handleRejectionClick('RJ-001');
        break;
      case 'voice':
        navigate('/chat?voice=1');
        break;
      default:
        break;
    }
  };

  const handleRejectionClick = async (code) => {
    setLoadingRejection(true);
    try {
      const data = await api.explain(code);
      setSelectedRejection(data);
    } catch (err) {
      console.error(err);
      navigate(`/chat?code=${code}`);
    } finally {
      setLoadingRejection(false);
    }
  };

  const filteredRejections = activeCategory === 'All'
    ? POPULAR_REJECTIONS
    : POPULAR_REJECTIONS.filter(r => r.category === activeCategory);

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <div className="home-hero animate-fade-in-up">
        <div className="hero-emoji">🤝</div>
        <h1 className="hero-title">
          <span className="gradient-text">PF Sathi</span>
        </h1>
        <p className="hero-subtitle">
          Your AI-powered PF Claims Assistant
        </p>
        <p className="hero-desc">
          Understand why your EPFO claim was rejected, get instant step-by-step fix guides, and resubmit with confidence.
        </p>
      </div>

      {/* UAN Input Card */}
      <form className="uan-form animate-fade-in-up" onSubmit={handleSubmit} style={{ animationDelay: '100ms' }}>
        <Card className="uan-card" glowing={!!uan}>
          <label className="uan-label" htmlFor="uan-input">
            Enter your UAN (Universal Account Number)
          </label>
          <div className="uan-input-wrapper">
            <input
              ref={uanInputRef}
              id="uan-input"
              type="text"
              className="uan-input"
              value={uan}
              onChange={(e) => {
                setUan(e.target.value.replace(/[^0-9]/g, ''));
                setError('');
              }}
              placeholder="e.g. 100123456789"
              maxLength={15}
              inputMode="numeric"
              autoComplete="off"
            />
          </div>
          {error && <p className="uan-error">{error}</p>}
          <Button type="submit" variant="primary" size="lg" fullWidth icon="🔍">
            Check My Claims Status
          </Button>
        </Card>
      </form>

      {/* Interactive Feature Cards */}
      <div className="features-section animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="section-header-row">
          <h2 className="section-heading">Core Features</h2>
          <span className="section-badge">Tap any feature to explore</span>
        </div>
        <div className="features-grid stagger-children">
          <div
            className="feature-item feature-interactive"
            onClick={() => handleFeatureClick('track')}
            role="button"
            tabIndex={0}
          >
            <div className="feature-top">
              <span className="feature-icon">🔍</span>
              <span className="feature-badge">Track</span>
            </div>
            <h3>Track Claims</h3>
            <p>Check claim status, amounts, and visual progress timelines</p>
            <span className="feature-action-hint">Enter UAN →</span>
          </div>

          <div
            className="feature-item feature-interactive"
            onClick={() => handleFeatureClick('ai')}
            role="button"
            tabIndex={0}
          >
            <div className="feature-top">
              <span className="feature-icon">🤖</span>
              <span className="feature-badge feature-badge-cyan">AI Chat</span>
            </div>
            <h3>AI Explanations</h3>
            <p>Understand cryptic rejection codes in plain language</p>
            <span className="feature-action-hint">Ask AI Sathi →</span>
          </div>

          <div
            className="feature-item feature-interactive"
            onClick={() => handleFeatureClick('fix')}
            role="button"
            tabIndex={0}
          >
            <div className="feature-top">
              <span className="feature-icon">🛠️</span>
              <span className="feature-badge feature-badge-amber">Fix Guides</span>
            </div>
            <h3>Step-by-Step Fix</h3>
            <p>Interactive 5-step walkthroughs to resolve rejection reasons</p>
            <span className="feature-action-hint">View Walkthrough →</span>
          </div>

          <div
            className="feature-item feature-interactive"
            onClick={() => handleFeatureClick('voice')}
            role="button"
            tabIndex={0}
          >
            <div className="feature-top">
              <span className="feature-icon">🎤</span>
              <span className="feature-badge feature-badge-pink">Voice Assistant</span>
            </div>
            <h3>Voice Support</h3>
            <p>Speak in your natural voice and listen to spoken audio advice</p>
            <span className="feature-action-hint">Speak Now →</span>
          </div>
        </div>
      </div>

      {/* Demo Accounts */}
      <div className="demo-section animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <p className="demo-label">⚡ Click a demo account to test:</p>
        <div className="demo-cards stagger-children">
          {DEMO_UANS.map(demo => (
            <Card
              key={demo.uan}
              hoverable
              className="demo-card"
              onClick={() => handleDemoClick(demo.uan)}
            >
              <div className="demo-info">
                <span className="demo-name">{demo.name}</span>
                <span className="demo-desc">{demo.desc}</span>
              </div>
              <span className="demo-uan">{demo.uan}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Rejections Explorer */}
      <div className="rejections-section animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="section-header-row">
          <h2 className="section-heading">Browse Rejection Codes</h2>
          <span className="section-badge">Tap code to see fix</span>
        </div>

        {/* Category Filters */}
        <div className="category-filter-bar">
          {['All', 'KYC', 'Bank', 'Employer', 'Eligibility'].map(cat => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="rejections-grid stagger-children">
          {filteredRejections.map(item => (
            <div
              key={item.code}
              className="rejection-pill-card glass"
              onClick={() => handleRejectionClick(item.code)}
              role="button"
              tabIndex={0}
            >
              <div className="rejection-pill-header">
                <span className="rejection-code-chip">{item.code}</span>
                <span className="rejection-cat-tag">{item.category}</span>
              </div>
              <p className="rejection-pill-title">{item.title}</p>
              <span className="rejection-pill-link">See Fix Steps →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection Fix Modal */}
      <Modal
        isOpen={!!selectedRejection}
        onClose={() => setSelectedRejection(null)}
        title={selectedRejection?.title || 'Rejection Details'}
      >
        {selectedRejection && (
          <div className="home-modal-content">
            <RejectionExplainer explanation={selectedRejection} />
            <div className="home-modal-actions">
              <Button
                variant="primary"
                fullWidth
                icon="💬"
                onClick={() => {
                  const code = selectedRejection.code;
                  setSelectedRejection(null);
                  navigate(`/chat?code=${code}`);
                }}
              >
                Ask Sathi About {selectedRejection.code}
              </Button>
              <Button
                variant="secondary"
                fullWidth
                icon="🔄"
                onClick={() => {
                  setSelectedRejection(null);
                  navigate(`/resubmit?uan=100123456789&claimId=CLM-2024-001&code=${selectedRejection.code}`);
                }}
              >
                Go to Resubmission Checklist
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
