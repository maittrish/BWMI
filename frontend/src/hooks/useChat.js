import { useState, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { formatTime } from '../utils/formatters';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messageIdRef = useRef(0);

  const addMessage = useCallback((text, sender, extra = {}) => {
    const id = ++messageIdRef.current;
    const message = {
      id,
      text,
      sender,
      time: formatTime(new Date()),
      ...extra
    };
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const sendMessage = useCallback(async (text) => {
    // Add user message
    addMessage(text, 'user');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Try to detect rejection code
      const codeMatch = text.match(/RJ-\d{3}/i);

      let response;
      if (codeMatch) {
        response = await api.explain(codeMatch[0].toUpperCase());
      } else {
        response = await api.chat(text);
      }

      // Small delay for natural feel
      await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

      setIsTyping(false);

      if (response.explanation) {
        // Detailed rejection explanation
        addMessage(response.explanation, 'bot', {
          steps: response.steps,
          tips: response.tips,
          severity: response.severity,
          code: response.code,
          title: response.title
        });
      } else if (response.message) {
        addMessage(response.message, 'bot');
      }
    } catch (err) {
      setIsTyping(false);
      addMessage(
        'Sorry, I couldn\'t process that request. Please make sure the backend server is running.',
        'bot'
      );
    }
  }, [addMessage]);

  const sendClaimContext = useCallback(async (claim) => {
    if (!claim.rejectionCode) return;

    addMessage(
      `I need help with my rejected claim: ${claim.formDescription} (${claim.claimId}).\nRejection code: ${claim.rejectionCode}`,
      'user'
    );

    setIsTyping(true);

    try {
      const response = await api.explain(claim.rejectionCode);
      await new Promise(r => setTimeout(r, 800));
      setIsTyping(false);

      addMessage(response.explanation, 'bot', {
        steps: response.steps,
        tips: response.tips,
        severity: response.severity,
        code: response.code,
        title: response.title
      });
    } catch (err) {
      setIsTyping(false);
      addMessage('Sorry, I couldn\'t get the explanation. Please try again.', 'bot');
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    messageIdRef.current = 0;
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    sendClaimContext,
    clearMessages,
    addMessage
  };
}
