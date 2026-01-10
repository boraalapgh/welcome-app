// Chat Screen - Phase 2 of AI Interview
// Full chat interface with messages and input

import { useRef, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { ChatMessage } from '../../shared/ChatMessage';
import { ChatInput } from '../../shared/ChatInput';
import { AiAvatar } from '../../shared/AiAvatar';
import type { ChatMessage as ChatMessageType } from '../../../../services/aiChatService';

interface ChatScreenProps {
  messages: ChatMessageType[];
  streamingContent?: string; // Currently streaming message content
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onReset?: () => void;
}

export function ChatScreen({
  messages,
  streamingContent,
  onSendMessage,
  isLoading,
  onReset
}: ChatScreenProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent, isLoading]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header - fixed at top */}
      <div className="shrink-0 bg-white pt-4 pb-4 px-4 z-10 border-b border-gray-100">
        <div className="relative flex flex-col gap-2 items-center text-center">
          {/* Reset button - top right */}
          {onReset && (
            <button
              onClick={onReset}
              className="absolute top-0 right-0 p-2 rounded-full border border-[#e6e6e6] bg-white hover:bg-gray-50 transition-colors"
              aria-label="Reset conversation"
              title="Start over"
            >
              <RotateCcw size={18} className="text-[#5a14bd]" />
            </button>
          )}
          <h2 className="text-[22px] font-extrabold leading-[1.2] text-[#1a1a1a]">
            AI Assistant
          </h2>
          <p className="text-base font-medium text-[#666]">
            Let's define the scope together
          </p>
        </div>
      </div>

      {/* Chat area - scrollable, messages stick to bottom */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4"
      >
        {/* Spacer to push messages to bottom when few messages */}
        <div className="min-h-full flex flex-col justify-end">
          {/* Messages */}
          <div className="flex flex-col gap-4 py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role === 'assistant' ? 'assistant' : 'user'}
                content={message.content}
                reasoning={message.reasoning}
              />
            ))}

            {/* Streaming message - show while content is being received */}
            {streamingContent && (
              <ChatMessage
                role="assistant"
                content={streamingContent}
                isStreaming
              />
            )}

            {/* Typing indicator - show when loading but not yet streaming */}
            {isLoading && !streamingContent && (
              <div className="flex gap-2 items-end pr-16">
                <AiAvatar size={32} className="mt-1" />
                <div className="px-4 py-3">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="shrink-0 p-4 pt-2 border-t border-gray-100">
        <ChatInput
          onSend={onSendMessage}
          placeholder="Type here..."
          disabled={isLoading}
          autoFocus
        />
      </div>
    </div>
  );
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center">
      <div className="w-2 h-2 rounded-full bg-[#5a14bd] animate-bounce [animation-delay:0ms]" />
      <div className="w-2 h-2 rounded-full bg-[#5a14bd] animate-bounce [animation-delay:150ms]" />
      <div className="w-2 h-2 rounded-full bg-[#5a14bd] animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
