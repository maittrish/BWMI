import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { api } from '../services/api';
import './Resubmit.css';

export default function Resubmit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uan = searchParams.get('uan');
  const claimId = searchParams.get('claimId');

  const [step, setStep] = useState(1);
  const [corrections, setCorrections] = useState({
    kycUpdated: false,
    bankVerified: false,
    documentsAttached: false,
    detailsConfirmed: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheckbox = (field) => {
    setCorrections(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const allChecked = Object.values(corrections).every(Boolean);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data = await api.resubmit(uan, claimId, corrections);
      setResult(data);
      setStep(3);
    } catch (err) {
      alert('Resubmission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!uan || !claimId) {
    return (
      <div className="page resubmit-page">
        <div className="resubmit-error">
          <p>Missing claim information. Please go back to the dashboard.</p>
          <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page resubmit-page">
      <h2 className="resubmit-title animate-fade-in-down">
        {step === 3 ? '🎉 Success!' : '🔄 Resubmit Claim'}
      </h2>
      <p className="resubmit-subtitle">
        {step === 3 ? 'Your claim has been resubmitted' : `Claim ${claimId}`}
      </p>

      {/* Progress */}
      {step < 3 && (
        <div className="resubmit-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="progress-dot">1</div>
            <span>Review</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="progress-dot">2</div>
            <span>Confirm</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="progress-dot">3</div>
            <span>Done</span>
          </div>
        </div>
      )}

      {/* Step 1: Checklist */}
      {step === 1 && (
        <div className="resubmit-checklist animate-fade-in-up">
          <p className="checklist-desc">
            Before resubmitting, please confirm you've completed these corrections:
          </p>
          <Card className="checklist-card">
            {[
              { field: 'kycUpdated', label: 'KYC details updated and verified', emoji: '📋' },
              { field: 'bankVerified', label: 'Bank account verified (green tick)', emoji: '🏦' },
              { field: 'documentsAttached', label: 'Required documents attached', emoji: '📎' },
              { field: 'detailsConfirmed', label: 'All form details are correct', emoji: '✅' }
            ].map(item => (
              <label key={item.field} className="checklist-item" htmlFor={item.field}>
                <input
                  type="checkbox"
                  id={item.field}
                  checked={corrections[item.field]}
                  onChange={() => handleCheckbox(item.field)}
                  className="checklist-checkbox"
                />
                <span className="checklist-emoji">{item.emoji}</span>
                <span className="checklist-label">{item.label}</span>
              </label>
            ))}
          </Card>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!allChecked}
            onClick={() => setStep(2)}
            icon="→"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Confirm */}
      {step === 2 && (
        <div className="resubmit-confirm animate-fade-in-up">
          <Card className="confirm-card">
            <div className="confirm-icon">📤</div>
            <h3>Ready to Resubmit?</h3>
            <p>
              Your claim <strong>{claimId}</strong> will be resubmitted to EPFO for processing.
              You'll receive an SMS notification with the status update.
            </p>
          </Card>
          <div className="confirm-actions">
            <Button variant="secondary" size="lg" fullWidth onClick={() => setStep(1)} icon="←">
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              onClick={handleSubmit}
              icon="📤"
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && result && (
        <div className="resubmit-success animate-scale-in">
          <Card className="success-card" glowing>
            <div className="success-icon">✅</div>
            <h3>{result.message}</h3>
            <div className="success-details">
              <div className="success-row">
                <span>New Claim ID</span>
                <strong>{result.resubmission.newClaimId}</strong>
              </div>
              <div className="success-row">
                <span>Status</span>
                <strong className="gradient-text">Submitted</strong>
              </div>
              <div className="success-row">
                <span>Est. Processing</span>
                <strong>{result.resubmission.estimatedProcessingDays} days</strong>
              </div>
            </div>
            <p className="success-note">{result.resubmission.trackingMessage}</p>
          </Card>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate(`/dashboard?uan=${uan}`)}
            icon="📋"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
