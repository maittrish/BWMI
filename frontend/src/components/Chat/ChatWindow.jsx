import { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { useSpeech } from '../../hooks/useSpeech';
import '../../styles/chat.css';

const QUICK_CODES = [
  { code: 'RJ-001', label: 'Name Mismatch' },
  { code: 'RJ-004', label: 'Bank Not Verified' },
  { code: 'RJ-007', label: 'Employer Attestation' },
  { code: 'RJ-005', label: 'Aadhaar Not Seeded' },
  { code: 'RJ-014', label: 'Advance Limit' }
];

const SUGGESTIONS = [
  'What is RJ-001?',
  'Top PF rejection reasons',
  'How to check claim status?',
  'How long does PF settlement take?',
  'What is my UAN?'
];

export default function ChatWindow({ messages, isTyping, onSend, autoVoice = false }) {
  const scrollRef = useRef(null);
  const { isSpeaking, speakingId, speakText } = useSpeech();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-page">
      {/* Quick Code Bar */}
      <div className="chat-quick-codes">
        <span className="quick-codes-label">Quick Codes:</span>
        <div className="quick-codes-scroll">
          {QUICK_CODES.map(item => (
            <button
              key={item.code}
              className="quick-code-pill"
              onClick={() => onSend(`Explain ${item.code}`)}
              title={`Ask about ${item.code} (${item.label})`}
            >
              <strong>{item.code}</strong> <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="chat-window" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-welcome">
            <span className="chat-welcome-icon">🤝</span>
            <h2>Hi! I'm <span className="gradient-text">PF Sathi</span></h2>
            <p>Ask me about your PF claim rejection codes, and I'll explain what went wrong and provide a step-by-step fix.</p>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="chat-suggestion-btn"
                  onClick={() => onSend(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <ChatBubble
            key={msg.id}
            message={msg}
            onSpeak={speakText}
            isSpeaking={isSpeaking}
            speakingId={speakingId}
          />
        ))}

        {isTyping && (
          <div className="chat-bubble-container bot">
            <div className="chat-avatar bot">🤝</div>
            <div className="chat-bubble">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput onSend={onSend} disabled={isTyping} autoVoice={autoVoice} />
    </div>
  );
}
