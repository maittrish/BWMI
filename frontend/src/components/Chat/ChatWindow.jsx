import { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import '../../styles/chat.css';

const SUGGESTIONS = [
  'What is RJ-001?',
  'How to check claim status?',
  'Help me fix my claim',
  'What is UAN?',
  'How long does PF take?'
];

export default function ChatWindow({ messages, isTyping, onSend }) {
  const scrollRef = useRef(null);

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
      <div className="chat-window" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-welcome">
            <span className="chat-welcome-icon">🤝</span>
            <h2>Hi! I'm <span className="gradient-text">PF Sathi</span></h2>
            <p>Ask me about your PF claim rejection codes, and I'll explain what went wrong and how to fix it.</p>
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
          <ChatBubble key={msg.id} message={msg} />
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

      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
}
