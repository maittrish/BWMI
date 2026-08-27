import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useClaims } from '../hooks/useClaims';
import ClaimCard from '../components/Claims/ClaimCard';
import ClaimTimeline from '../components/Claims/ClaimTimeline';
import RejectionExplainer from '../components/Claims/RejectionExplainer';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { formatCurrency, formatDate, maskUAN } from '../utils/formatters';
import { api } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uan = searchParams.get('uan');
  const { claims, memberName, loading, error, fetchClaims } = useClaims();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    if (uan) {
      fetchClaims(uan);
    }
  }, [uan, fetchClaims]);

  const handleClaimClick = async (claim) => {
    setSelectedClaim(claim);
    setExplanation(null);

    if (claim.rejectionCode) {
      setLoadingExplanation(true);
      try {
        const data = await api.explain(claim.rejectionCode);
        setExplanation(data);
      } catch (err) {
        console.error('Failed to get explanation:', err);
      } finally {
        setLoadingExplanation(false);
      }
    }
  };

  const handleChatAbout = (claim) => {
    navigate(`/chat?uan=${uan}&claimId=${claim.claimId}&code=${claim.rejectionCode}`);
  };

  if (!uan) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="page">
        <Loader text="Fetching your claims..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page dashboard-page">
        <div className="dashboard-error animate-scale-in">
          <span className="error-icon">😕</span>
          <h2>No Claims Found</h2>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/')} icon="←">
            Try Another UAN
          </Button>
        </div>
      </div>
    );
  }

  const rejectedCount = claims.filter(c => c.status === 'rejected').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;
  const processingCount = claims.filter(c => c.status === 'processing').length;

  return (
    <div className="page dashboard-page">
      {/* Member Info */}
      <div className="member-header animate-fade-in-down">
        <div className="member-info">
          <h2>Welcome, {memberName} 👋</h2>
          <p className="member-uan">UAN: {maskUAN(uan)}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="stat-chip stat-total">
          <span className="stat-value">{claims.length}</span>
          <span className="stat-label">Total</span>
        </div>
        {rejectedCount > 0 && (
          <div className="stat-chip stat-rejected">
            <span className="stat-value">{rejectedCount}</span>
            <span className="stat-label">Rejected</span>
          </div>
        )}
        {approvedCount > 0 && (
          <div className="stat-chip stat-approved">
            <span className="stat-value">{approvedCount}</span>
            <span className="stat-label">Approved</span>
          </div>
        )}
        {processingCount > 0 && (
          <div className="stat-chip stat-processing">
            <span className="stat-value">{processingCount}</span>
            <span className="stat-label">Processing</span>
          </div>
        )}
      </div>

      {/* Claims List */}
      <div className="claims-list stagger-children">
        {claims.map(claim => (
          <ClaimCard
            key={claim.claimId}
            claim={claim}
            onClick={handleClaimClick}
          />
        ))}
      </div>

      {/* Claim Detail Modal */}
      <Modal
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        title={selectedClaim?.formDescription}
      >
        {selectedClaim && (
          <div className="claim-detail">
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <Badge status={selectedClaim.status} dot size="md" />
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount</span>
              <span className="detail-value">{formatCurrency(selectedClaim.amount)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Claim ID</span>
              <span className="detail-value">{selectedClaim.claimId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Submitted</span>
              <span className="detail-value">{formatDate(selectedClaim.submittedDate)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Employer</span>
              <span className="detail-value">{selectedClaim.employerName}</span>
            </div>

            <h4 className="detail-section-title">Claim Timeline</h4>
            <ClaimTimeline timeline={selectedClaim.timeline} />

            {selectedClaim.rejectionCode && (
              <>
                <h4 className="detail-section-title">Rejection Details</h4>
                {loadingExplanation ? (
                  <Loader size="sm" text="Getting explanation..." />
                ) : (
                  explanation && <RejectionExplainer explanation={explanation} />
                )}
                <div className="detail-actions">
                  <Button
                    variant="primary"
                    fullWidth
                    icon="💬"
                    onClick={() => handleChatAbout(selectedClaim)}
                  >
                    Chat with PF Sathi
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    icon="🔄"
                    onClick={() => navigate(`/resubmit?uan=${uan}&claimId=${selectedClaim.claimId}`)}
                  >
                    Resubmit Claim
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
