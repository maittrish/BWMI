import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import ChatWindow from '../components/Chat/ChatWindow';

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const claimId = searchParams.get('claimId');
  const query = searchParams.get('query') || searchParams.get('prompt') || searchParams.get('q');
  const autoVoice = searchParams.get('voice') === '1' || searchParams.get('voice') === 'true';
  const { messages, isTyping, sendMessage } = useChat();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (code) {
      const contextMsg = claimId
        ? `Help me with my rejected claim ${claimId}. The rejection code is ${code}`
        : `What does rejection code ${code} mean?`;
      sendMessage(contextMsg);
    } else if (query) {
      sendMessage(query);
    }
  }, [code, claimId, query, sendMessage]);

  return (
    <ChatWindow
      messages={messages}
      isTyping={isTyping}
      onSend={sendMessage}
      autoVoice={autoVoice}
    />
  );
}
