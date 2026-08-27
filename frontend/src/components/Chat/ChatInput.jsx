import { useState, useEffect, useRef } from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import '../../styles/chat.css';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const { isListening, transcript, isSupported, toggleListening, setTranscript } = useSpeech();
  const inputRef = useRef(null);

  // Update input when speech transcript changes
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  // When listening stops and we have text, auto-fill
  useEffect(() => {
    if (!isListening && transcript) {
      setText(transcript);
      setTranscript('');
    }
  }, [isListening, transcript, setTranscript]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        {isSupported && (
          <button
            className={`chat-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? '⏹' : '🎤'}
          </button>
        )}
        <textarea
          ref={inputRef}
          className="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : 'Ask about a rejection code...'}
          rows={1}
          disabled={disabled}
        />
      </div>
      <button
        className="chat-send-btn"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        aria-label="Send message"
      >
        ➤
      </button>
    </div>
  );
}
