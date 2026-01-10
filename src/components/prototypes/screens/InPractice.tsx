import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { SlideNavigation } from '../shared/SlideNavigation';

interface InPracticeProps {
  onBack: () => void;
}

// Puzzle icon component
function PuzzleIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="24" width="20" height="20" rx="2" fill="#5a14bd" />
      <rect x="24" y="8" width="20" height="20" rx="2" fill="#00D6A1" />
      <rect x="36" y="24" width="20" height="20" rx="2" fill="#FAC541" />
      <rect x="24" y="36" width="20" height="20" rx="2" fill="#EA0004" />
    </svg>
  );
}

// Lightbulb icon component
function LightbulbIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8C22.06 8 14 16.06 14 26C14 32.4 17.4 38 22.5 41.2V48C22.5 49.1 23.4 50 24.5 50H39.5C40.6 50 41.5 49.1 41.5 48V41.2C46.6 38 50 32.4 50 26C50 16.06 41.94 8 32 8Z" fill="#FAC541" />
      <rect x="24" y="52" width="16" height="4" rx="2" fill="#4d4d4d" />
      <rect x="26" y="58" width="12" height="2" rx="1" fill="#4d4d4d" />
    </svg>
  );
}

const slides = [
  {
    number: 1,
    title: 'The 3-Second Pause Rule',
    content: 'Before responding to any stakeholder comment or question, count to three in your head. This brief pause serves two purposes: it ensures the other person has completely finished their thought, and it gives your brain time to process what was actually said rather than what you expected to hear. Practice this in low-stakes conversations first — it will feel unnaturally long at first, but becomes natural with repetition.',
    howTo: 'In your next stakeholder conversation, write down one or two exact phrases they use. Repeat them back to confirm: "You mentioned the dashboard feels \'clunky\' — what makes it feel that way?"',
    icon: 'puzzle',
  },
  {
    number: 2,
    title: 'The Mirror-Back Method',
    content: 'Instead of taking notes on what you plan to say next, write down key phrases the other person uses and reflect them back. For example: "So you mentioned the dashboard feels \'clunky\' — can you help me understand what makes it feel that way?" Using their exact language shows you\'re truly listening and often prompts them to elaborate with more specific details.',
    howTo: 'In your next stakeholder conversation, write down one or two exact phrases they use. Repeat them back to confirm: "You mentioned the dashboard feels \'clunky\' — what makes it feel that way?"',
    icon: 'puzzle',
  },
  {
    number: 3,
    title: 'The Curiosity Check-In',
    content: 'Mid-conversation, ask yourself: "Am I still learning something new, or am I waiting for my turn to speak?" If it\'s the latter, redirect with a follow-up question like "What else should I know about this?" or "What would good look like from your perspective?" This keeps you in discovery mode rather than solution mode.',
    howTo: 'Before responding, ask at least two follow-up questions like "What\'s important about this to you?" or "What would good look like?" This keeps you learning instead of rushing to solutions.',
    icon: 'puzzle',
  },
  {
    number: 4,
    title: 'Sofia\'s Take-Away:',
    content: '"Remember, every conversation is a tiny user interview. The stakeholder in front of you is giving you free product research — but only if you\'re actually listening to receive it."',
    icon: 'lightbulb',
    isFinal: true,
  },
];

export function InPractice({ onBack }: InPracticeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#2e0a61]">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-6 bg-white/30 rounded-full p-2 z-10 hover:bg-white/50 transition-colors"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>

      {/* Completion check for final slide */}
      {slide.isFinal && (
        <div className="absolute top-8 right-6 bg-white rounded-full p-1 z-10">
          <Check size={20} className="text-[#5a14bd]" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-4">
        {/* Icon */}
        <div className="mb-6">
          {slide.icon === 'lightbulb' ? <LightbulbIcon /> : <PuzzleIcon />}
        </div>

        {/* Title */}
        <h2 className="font-extrabold text-xl text-white text-center mb-4">
          {slide.number && !slide.isFinal && `${slide.number}.  `}{slide.title}
        </h2>

        {/* Main content */}
        <p className="text-sm text-white leading-relaxed text-center mb-6">
          {slide.content}
        </p>

        {/* How to box */}
        {slide.howTo && (
          <div className="bg-white/10 rounded-lg p-4 w-full">
            <p className="font-bold text-sm text-white mb-2">Here's how to do it</p>
            <p className="text-xs text-white/90 leading-relaxed">
              {slide.howTo}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrev={handlePrev}
        onNext={handleNext}
        variant="light"
      />
    </div>
  );
}
