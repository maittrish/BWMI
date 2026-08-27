import '../../styles/chat.css';

export default function ChatBubble({ message }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`chat-bubble-container ${message.sender}`}>
      <div className={`chat-avatar ${message.sender}`}>
        {isBot ? '🤝' : '👤'}
      </div>
      <div>
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
        </div>
        <div className="chat-time">{message.time}</div>
      </div>
    </div>
  );
}
