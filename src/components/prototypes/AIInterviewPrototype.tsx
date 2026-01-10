// AI Interview Prototype
// Interactive chat-based interview for gathering lesson information
// Uses AI SDK for streaming responses

import { useState, useCallback, useEffect } from 'react';
import { TopicInputScreen } from './screens/ai-interview/TopicInputScreen';
import { ChatScreen } from './screens/ai-interview/ChatScreen';
import { aiChatService, ChatMessage } from '../../services/aiChatService';

type Phase = 'topic-input' | 'chat';

export function AIInterviewPrototype() {
  const [phase, setPhase] = useState<Phase>('topic-input');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset conversation when component mounts
  useEffect(() => {
    aiChatService.resetConversation();
  }, []);

  // Stream a message and handle the response
  const streamAIResponse = useCallback((userMessage: string) => {
    setIsLoading(true);
    setStreamingContent('');
    setError(null);

    aiChatService.streamMessage(
      userMessage,
      // onTextChunk - called for each streamed chunk
      (_chunk, fullText) => {
        setStreamingContent(fullText);
      },
      // onComplete - called when streaming is done
      (finalMessage) => {
        setMessages(prev => [...prev, finalMessage]);
        setStreamingContent('');
        setIsLoading(false);
      },
      // onError - called if something goes wrong
      (err) => {
        setError(err.message);
        setStreamingContent('');
        setIsLoading(false);
        console.error('AI Chat Error:', err);
      }
    );
  }, []);

  // Handle topic submission from Phase 1
  const handleTopicSubmit = useCallback((topic: string) => {
    // Create user message
    const userMessage = aiChatService.createUserMessage(topic);
    setMessages([userMessage]);

    // Start transition to chat phase
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase('chat');
      setIsTransitioning(false);
      // Start streaming AI response after transition
      streamAIResponse(topic);
    }, 300);
  }, [streamAIResponse]);

  // Handle message send from Phase 2
  const handleSendMessage = useCallback((content: string) => {
    // Create and add user message
    const userMessage = aiChatService.createUserMessage(content);
    setMessages(prev => [...prev, userMessage]);

    // Stream AI response
    streamAIResponse(content);
  }, [streamAIResponse]);

  // Handle reset - back to topic input
  const handleReset = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase('topic-input');
      setMessages([]);
      setStreamingContent('');
      aiChatService.resetConversation();
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Check if API is configured
  const isApiConfigured = aiChatService.isConfigured();

  return (
    <div className="w-full h-full max-w-[800px] mx-auto ">
      {/* API not configured warning */}
      {!isApiConfigured && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-amber-100 border border-amber-300 rounded-lg p-3 text-sm text-amber-800">
          <strong>API Key Required:</strong> Add VITE_OPENAI_API_KEY to your .env file
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-100 border border-red-300 rounded-lg p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Phase content with transitions */}
      <div
        className="w-full h-full"
        style={{
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        {phase === 'topic-input' ? (
          <TopicInputScreen onSubmit={handleTopicSubmit} />
        ) : (
          <ChatScreen
            messages={messages}
            streamingContent={streamingContent}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
