// Chat Message Component
// Renders AI or user messages with appropriate styling

import type { ReactNode } from 'react';
import { AiAvatar } from './AiAvatar';
import { UserAvatar } from './UserAvatar';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  userName?: string;
  userImage?: string;
  isNew?: boolean;
  isStreaming?: boolean;
  showReasoning?: boolean;
}

export function ChatMessage({
  role,
  content,
  reasoning,
  userName = 'You',
  userImage,
  isNew = false,
  isStreaming = false,
  showReasoning = true
}: ChatMessageProps) {
  const isAi = role === 'assistant';

  // Simple markdown-like formatting for AI messages
  const formatContent = (text: string): ReactNode[] => {
    // Split by lines and process
    const lines = text.split('\n');
    const elements: ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc ml-6 mb-2 space-y-1">
            {listItems.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const formatInline = (text: string): ReactNode[] => {
      // Handle bold text with **text**
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Check for list items (- or •)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        listItems.push(trimmedLine.slice(2));
      } else if (trimmedLine.startsWith('* ')) {
        listItems.push(trimmedLine.slice(2));
      } else {
        flushList();
        if (trimmedLine) {
          elements.push(
            <p key={`p-${index}`} className="mb-2 last:mb-0">
              {formatInline(trimmedLine)}
            </p>
          );
        }
      }
    });

    flushList();
    return elements;
  };

  return (
    <div
      className={`flex gap-2 w-full ${isAi ? 'justify-start pr-16' : 'justify-end pl-16'} ${
        isNew ? 'animate-fade-in' : ''
      }`}
    >
      {isAi && <AiAvatar size={32} className="mt-1" />}

      <div className="flex flex-col gap-2 max-w-[720px]">
        {/* Reasoning section - collapsible */}
        {isAi && reasoning && showReasoning && (
          <details className="group">
            <summary className="cursor-pointer text-xs font-medium text-[#5a14bd] flex items-center gap-1 hover:opacity-80">
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              View reasoning
            </summary>
            <div className="mt-2 px-3 py-2 bg-[#f3ecfd] rounded-lg text-sm text-[#4d4d4d] leading-5">
              {reasoning}
            </div>
          </details>
        )}

        {/* Main message content */}
        <div
          className={`px-4 py-3 rounded-lg ${
            isAi
              ? 'text-black'
              : 'bg-white border border-[#e6e6e6] text-[#1a1a1a]'
          }`}
        >
          <div className="text-base leading-6 font-medium">
            {isAi ? formatContent(content) : content}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-0.5 bg-[#5a14bd] animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {!isAi && <UserAvatar size={32} imageUrl={userImage} name={userName} className="mt-1" />}
    </div>
  );
}
