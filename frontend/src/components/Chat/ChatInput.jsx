import { useState, useEffect, useRef } from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import '../../styles/chat.css';

export default function ChatInput({ onSend, disabled, autoVoice = false }) {
  const [text, setText] = useState('');
  const { isListening, transcript, isSupported, startListening, stopListening, toggleListening, setTranscript } = useSpeech();
  const inputRef = useRef(null);

  // Auto-start voice if requested
  useEffect(() => {
    if (autoVoice && isSupported) {
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoVoice, isSupported, startListening]);

  // Update input when speech transcript changes
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  // When listening stops and we have text, auto-send or set text
  useEffect(() => {
    if (!isListening && transcript) {
      setText(transcript);
      setTranscript('');
    }
  }, [isListening, transcript, setTranscript]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    if (isListening) {
      stopListening();
    }
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
      {isListening && (
        <div className="voice-listening-bar animate-fade-in-up">
          <div className="voice-pulse-ring" />
          <span className="voice-listening-text">🎤 Listening to your voice... (speak now)</span>
          <button className="voice-done-btn" onClick={toggleListening}>Done</button>
        </div>
      )}
      <div className="chat-input-wrapper">
        <button
          type="button"
          className={`chat-mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          title={isListening ? 'Stop listening' : 'Speak your question'}
        >
          {isListening ? '⏹' : '🎤'}
        </button>
        <textarea
          ref={inputRef}
          className="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening to your speech...' : 'Type or speak a rejection code / query...'}
          rows={1}
          disabled={disabled}
        />
      </div>
      <button
        type="button"
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
