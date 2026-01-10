// Chat Input Component
// Reusable input field with send button for chat interfaces

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  initialValue?: string;
}

export function ChatInput({
  onSend,
  placeholder = 'Type here...',
  disabled = false,
  autoFocus = false,
  initialValue = ''
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [value]);

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSend = () => {
    const trimmedValue = value.trim();
    if (trimmedValue && !disabled) {
      onSend(trimmedValue);
      setValue('');
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Re-focus input when disabled changes to false (AI finished responding)
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="bg-white border border-[#f2f2f2] rounded-3xl shadow-[0px_-4px_250px_0px_rgba(90,20,189,0.1)] p-2">
      <div className="flex flex-col gap-4">
        {/* Input field container */}
        <div className="min-h-16 p-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-transparent text-base text-[#1a1a1a] placeholder:text-[#666] focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Actions row */}
        <div className="flex items-end justify-end">
          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`p-2 rounded-full transition-colors ${
              canSend
                ? 'bg-[#5a14bd] hover:bg-[#4a11a0]'
                : 'bg-[#e6e6e6]'
            }`}
            aria-label="Send message"
          >
            <Send
              size={24}
              className={canSend ? 'text-white' : 'text-[#666]'}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
