import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './Home.css';

const DEMO_UANS = [
  { uan: '100123456789', name: 'Rajesh Kumar', desc: '3 claims (1 rejected)' },
  { uan: '100987654321', name: 'Priya Sharma', desc: '3 claims (2 rejected)' },
  { uan: '100555666777', name: 'Amit Patel', desc: '2 claims (1 rejected)' }
];

export default function Home() {
  const [uan, setUan] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUAN = uan.replace(/\s/g, '');
    if (!cleanUAN) {
      setError('Please enter your UAN number');
      return;
    }
    if (cleanUAN.length < 10) {
      setError('UAN should be at least 10 digits');
      return;
    }
    setError('');
    navigate(`/dashboard?uan=${cleanUAN}`);
  };

  const handleDemoClick = (demoUan) => {
    setUan(demoUan);
    navigate(`/dashboard?uan=${demoUan}`);
  };

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
          Understand why your EPFO claim was rejected and get step-by-step guidance to fix it.
        </p>
      </div>

      {/* UAN Input */}
      <form className="uan-form animate-fade-in-up" onSubmit={handleSubmit} style={{ animationDelay: '100ms' }}>
        <Card className="uan-card">
          <label className="uan-label" htmlFor="uan-input">
            Enter your UAN (Universal Account Number)
          </label>
          <div className="uan-input-wrapper">
            <input
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
            Check My Claims
          </Button>
        </Card>
      </form>

      {/* Demo UANs */}
      <div className="demo-section animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <p className="demo-label">Try a demo account:</p>
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

      {/* Features */}
      <div className="features-section animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="features-grid stagger-children">
          <div className="feature-item">
            <span className="feature-icon">🔍</span>
            <h3>Track Claims</h3>
            <p>See all your PF claims and their current status</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <h3>AI Explanations</h3>
            <p>Understand rejection codes in plain language</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛠️</span>
            <h3>Step-by-Step Fix</h3>
            <p>Follow guided instructions to resolve issues</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎤</span>
            <h3>Voice Support</h3>
            <p>Speak your questions — no typing needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
