import './RejectionExplainer.css';

export default function RejectionExplainer({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="explainer animate-fade-in-up">
      <div className="explainer-header">
        <div className="explainer-code-badge">{explanation.code}</div>
        <h3 className="explainer-title">{explanation.title}</h3>
      </div>

      <p className="explainer-text">{explanation.explanation || explanation.description}</p>

      {explanation.steps && explanation.steps.length > 0 && (
        <div className="explainer-steps">
          <h4>How to fix this:</h4>
          <div className="steps-list">
            {explanation.steps.map((step, i) => (
              <div key={i} className="explainer-step">
                <div className="step-number">{step.step || i + 1}</div>
                <div className="step-info">
                  <h5>{step.title}</h5>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation.tips && explanation.tips.length > 0 && (
        <div className="explainer-tips">
          <h4>💡 Tips</h4>
          <ul>
            {explanation.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
