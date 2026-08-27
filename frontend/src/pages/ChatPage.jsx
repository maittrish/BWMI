import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import ChatWindow from '../components/Chat/ChatWindow';

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const claimId = searchParams.get('claimId');
  const { messages, isTyping, sendMessage, addMessage } = useChat();

  // Auto-send context if navigated from a rejected claim
  useEffect(() => {
    if (code && messages.length === 0) {
      const contextMsg = claimId
        ? `Help me with my rejected claim ${claimId}. The rejection code is ${code}`
        : `What does rejection code ${code} mean?`;
      sendMessage(contextMsg);
    }
  }, []); // Only on mount

  return <ChatWindow messages={messages} isTyping={isTyping} onSend={sendMessage} />;
}
