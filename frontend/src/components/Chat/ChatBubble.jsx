import { useNavigate } from 'react-router-dom';
import '../../styles/chat.css';

export default function ChatBubble({ message, onSpeak, isSpeaking, speakingId }) {
  const isBot = message.sender === 'bot';
  const navigate = useNavigate();
  const isThisSpeaking = isSpeaking && speakingId === message.id;

  const handleSpeak = () => {
    if (onSpeak) {
      // Build speech text from text + steps
      let fullSpeech = message.text || '';
      if (message.steps && message.steps.length > 0) {
        fullSpeech += '. Follow these steps: ' + message.steps.map(s => `Step ${s.step}: ${s.title}. ${s.description}`).join('. ');
      }
      onSpeak(fullSpeech, message.id);
    }
  };

  return (
    <div className={`chat-bubble-container ${message.sender}`}>
      <div className={`chat-avatar ${message.sender}`}>
        {isBot ? '🤝' : '👤'}
      </div>
      <div className="chat-bubble-wrapper">
        <div className="chat-bubble">
          {message.text}

          {/* Render fix steps inline */}
          {message.steps && message.steps.length > 0 && (
            <div className="chat-steps">
              {message.steps.map((step, i) => (
                <div key={i} className="chat-step">
                  <div className="chat-step-number">{step.step || i + 1}</div>
                  <div className="chat-step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render tips */}
          {message.tips && message.tips.length > 0 && (
            <div className="chat-tips">
              <h4>💡 Quick Tips</h4>
              <ul>
                {message.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action button if this is a rejection explanation */}
          {message.code && (
            <div className="chat-bubble-action">
              <button
                className="chat-action-btn"
                onClick={() => navigate(`/resubmit?uan=100123456789&claimId=CLM-2024-001&code=${message.code}`)}
              >
                🔄 Start Resubmission Checklist for {message.code} →
              </button>
            </div>
          )}
        </div>

        <div className="chat-footer-row">
          <span className="chat-time">{message.time}</span>
          {isBot && onSpeak && (
            <button
              className={`chat-audio-btn ${isThisSpeaking ? 'playing' : ''}`}
              onClick={handleSpeak}
              title={isThisSpeaking ? 'Stop listening' : 'Listen to response'}
              aria-label={isThisSpeaking ? 'Stop audio' : 'Play audio'}
            >
              {isThisSpeaking ? '⏹ Stop' : '🔊 Listen'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
