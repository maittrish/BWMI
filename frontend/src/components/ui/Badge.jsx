import { getStatusColor } from '../../utils/formatters';
import './Badge.css';

export default function Badge({ status, label, size = 'sm', dot = false }) {
  const colorClass = getStatusColor(status);
  const displayLabel = label || status;

  return (
    <span className={`badge badge-${colorClass} badge-${size}`}>
      {dot && <span className="badge-dot" />}
      {displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1)}
    </span>
  );
}
