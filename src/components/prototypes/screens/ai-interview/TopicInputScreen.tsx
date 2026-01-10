// Topic Input Screen - Phase 1 of AI Interview
// Centered input for entering the lesson topic

import { useState, KeyboardEvent } from 'react';
import { Send, Info } from 'lucide-react';

interface TopicInputScreenProps {
  onSubmit: (topic: string) => void;
}

export function TopicInputScreen({ onSubmit }: TopicInputScreenProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = () => {
    const trimmedTopic = topic.trim();
    if (trimmedTopic) {
      onSubmit(trimmedTopic);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = topic.trim().length > 0;

  return (
    <div className="flex flex-col h-full items-center justify-center px-12">
      {/* Content wrapper */}
      <div className="flex flex-col gap-14 items-center w-full max-w-[960px]">
        {/* Header text */}
        <div className="flex flex-col gap-6 items-center text-center">
          <h2 className="text-[22px] font-extrabold leading-[1.2] text-[#1a1a1a]">
            Turn Internal Expertise Into<br />High-Quality Training
          </h2>
          <p className="text-lg font-medium text-[#666]">
            Test me quickly with a topic
          </p>
        </div>

        {/* Input card stack */}
        <div className="flex flex-col items-center w-full pb-4">
          {/* Main input card */}
          <div className="relative w-full bg-white rounded-3xl border border-[#f3f3f3] shadow-[2px_2px_3px_0px_rgba(0,0,0,0.04),1px_3px_20px_0px_rgba(21,21,21,0.07)] mb-[-16px] z-20">
            <div className="flex gap-2 items-end justify-end p-2 pr-2 pl-6 pt-6 h-[222px]">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Help me create a lesson about documenting key decisions for future teams..."
                className="flex-1 h-full resize-none bg-transparent text-base font-medium text-[#1a1a1a] placeholder:text-[#666] focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`p-2 rounded-full shrink-0 transition-colors ${
                  canSubmit
                    ? 'bg-[#5a14bd] hover:bg-[#4a11a0]'
                    : 'bg-[#e6e6e6]'
                }`}
                aria-label="Submit topic"
              >
                <Send
                  size={24}
                  className={canSubmit ? 'text-white' : 'text-[#666]'}
                />
              </button>
            </div>
          </div>

          {/* Info banner (behind the card) */}
          <div className="w-[calc(100%-64px)] mx-8 bg-[#e9f9fb] rounded-b-3xl shadow-[0px_2px_8px_0px_rgba(21,21,21,0.1)] pt-6 pb-2 px-0 z-10">
            <div className="flex items-center justify-center gap-2">
              <Info size={24} className="text-[#07282c]" />
              <span className="text-xs font-medium text-[#07282c] tracking-[0.5px]">
                * We won't save your chat or use it later.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
