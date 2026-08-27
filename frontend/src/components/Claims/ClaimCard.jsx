import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './ClaimCard.css';

export default function ClaimCard({ claim, onClick }) {
  const formEmoji = {
    'Form 19': '📄',
    'Form 31': '💰',
    'Form 10C': '👴'
  };

  return (
    <Card hoverable onClick={() => onClick(claim)} className="claim-card">
      <div className="claim-card-header">
        <div className="claim-card-form">
          <span className="claim-form-emoji">{formEmoji[claim.formType] || '📋'}</span>
          <div>
            <h3 className="claim-form-type">{claim.formType}</h3>
            <p className="claim-form-desc">{claim.formDescription}</p>
          </div>
        </div>
        <Badge status={claim.status} dot />
      </div>

      <div className="claim-card-body">
        <div className="claim-amount">{formatCurrency(claim.amount)}</div>
        <div className="claim-meta">
          <span>ID: {claim.claimId}</span>
          <span>•</span>
          <span>{formatDate(claim.submittedDate)}</span>
        </div>
      </div>

      {claim.rejectionCode && claim.rejectionDetails && (
        <div className="claim-rejection-preview">
          <span className="rejection-code-tag">{claim.rejectionCode}</span>
          <span className="rejection-title">{claim.rejectionDetails.title}</span>
        </div>
      )}

      <div className="claim-card-footer">
        <span className="claim-employer">{claim.employerName}</span>
        {claim.status === 'rejected' && (
          <span className="claim-fix-hint">Tap to fix →</span>
        )}
      </div>
    </Card>
  );
}
