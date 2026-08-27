import { formatDateShort, getStatusColor } from '../../utils/formatters';
import './ClaimTimeline.css';

export default function ClaimTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  const statusIcons = {
    done: '✅',
    active: '⏳',
    failed: '❌',
    pending: '⬜'
  };

  return (
    <div className="timeline">
      {timeline.map((item, index) => {
        const colorClass = getStatusColor(item.status);
        return (
          <div key={index} className={`timeline-item timeline-${colorClass}`}>
            <div className="timeline-connector">
              <div className={`timeline-dot timeline-dot-${colorClass}`}>
                {statusIcons[item.status]}
              </div>
              {index < timeline.length - 1 && (
                <div className={`timeline-line timeline-line-${colorClass}`} />
              )}
            </div>
            <div className="timeline-content">
              <p className="timeline-step">{item.step}</p>
              <p className="timeline-date">{formatDateShort(item.date)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
