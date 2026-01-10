import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { LESSON_ASSETS } from '../LessonPrototype';

interface DailyDilemmaProps {
  onBack: () => void;
}

// Background illustration from Figma
const DILEMMA_ASSETS = {
  background: 'https://www.figma.com/api/mcp/asset/d76b4b2f-8a87-4ac8-ab50-256dad44913f',
};

type SlideType = 'anecdote' | 'dilemma' | 'feedback';

interface Slide {
  type: SlideType;
  bubbleText?: string;
  optionA?: string;
  optionB?: string;
  correctAnswer?: 'A' | 'B';
  feedbackCorrect?: string;
  feedbackWrong?: string;
}

const slides: Slide[] = [
  {
    type: 'anecdote',
    bubbleText: "You're in a weekly stakeholder meeting where Sarah from Customer Success says, \"The new onboarding flow isn't working. Our customers are confused.\"",
  },
  {
    type: 'anecdote',
    bubbleText: "You immediately think of three potential fixes. Better tooltips? Simplified flow? Checklist walkthrough? Something feels right...",
  },
  {
    type: 'dilemma',
    bubbleText: 'You have two options for how to respond:',
    optionA: "I've been tracking some of those issues too. Let me walk you through the three main problems I've identified and some solutions we could implement next sprint.",
    optionB: "That sounds really frustrating for both you and the customers. Can you help me understand what specific part of the flow is causing the most confusion?",
    correctAnswer: 'B',
  },
  {
    type: 'feedback',
    feedbackCorrect: "Perfect application of active listening! You acknowledged the emotion and asked an open question to gather context before jumping to solutions.",
    feedbackWrong: "You jumped straight into solution mode. While your intentions are good, you missed an opportunity to understand the real problem first.",
  },
];

export function DailyDilemma({ onBack }: DailyDilemmaProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);

  const slide = slides[currentSlide];
  const isCompleted = currentSlide === slides.length - 1;
  const totalSlides = slides.length;

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      // On dilemma slide, require selection before moving
      if (slide.type === 'dilemma' && !selectedAnswer) {
        return;
      }
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSelectAnswer = (answer: 'A' | 'B') => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="relative flex flex-col h-full bg-[#2e0a61] overflow-hidden">
      {/* Background illustration */}
      <div className="absolute inset-0 opacity-70">
        <img
          src={DILEMMA_ASSETS.background}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-6 bg-white rounded-full p-2 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] z-20 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={24} className="text-[#5a14bd]" />
      </button>

      {/* Completion check */}
      {isCompleted && (
        <div className="absolute top-8 right-6 bg-white rounded-full p-1 z-20">
          <Check size={20} className="text-[#5a14bd]" />
        </div>
      )}

      {/* Content area */}
      <div className="relative flex-1 flex flex-col pt-28 px-6 z-10">
        {/* Avatar and speech bubble */}
        <div className="mb-8">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-[6px] border-white overflow-hidden shadow-lg mb-8">
            <img
              src={LESSON_ASSETS.avatar}
              alt="Sofia"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Speech bubble */}
          <div className="relative max-w-[315px]">
            {/* Triangle pointer */}
            <div className="absolute -top-5 left-6 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[20px] border-b-white/95" />

            {/* Bubble content */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
              {slide.type === 'feedback' && selectedAnswer ? (
                <p className="text-sm text-[#1a1a1a] leading-relaxed">
                  {selectedAnswer === slides[2].correctAnswer
                    ? slide.feedbackCorrect
                    : slide.feedbackWrong}
                </p>
              ) : (
                <p className="text-sm text-[#1a1a1a] leading-relaxed">
                  {slide.bubbleText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* A/B Cards - only show on dilemma slide */}
        {slide.type === 'dilemma' && (
          <div className="flex-1 flex items-center justify-center -mx-6 overflow-visible">
            <div className="relative flex items-center justify-center w-full">
              {/* Card A - tilted left */}
              <button
                onClick={() => handleSelectAnswer('A')}
                className={`absolute left-4 transform -rotate-[9deg] transition-all duration-200 ${
                  selectedAnswer === 'A' ? 'scale-105 z-10' : 'hover:scale-102'
                }`}
              >
                <div className={`w-[165px] h-[268px] bg-white rounded-2xl p-6 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] border-[6px] ${
                  selectedAnswer === 'A' ? 'border-[#5a14bd]' : 'border-[#5a14bd]/50'
                }`}>
                  <p className="font-extrabold text-4xl text-[#5a14bd] mb-2">A</p>
                  <p className="text-xs text-[#1a1a1a] leading-relaxed tracking-wide">
                    {slide.optionA}
                  </p>
                </div>
              </button>

              {/* Card B - tilted right */}
              <button
                onClick={() => handleSelectAnswer('B')}
                className={`absolute right-4 transform rotate-[9deg] transition-all duration-200 ${
                  selectedAnswer === 'B' ? 'scale-105 z-10' : 'hover:scale-102'
                }`}
              >
                <div className={`w-[165px] h-[268px] bg-white rounded-2xl p-6 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] border-[6px] ${
                  selectedAnswer === 'B' ? 'border-[#5a14bd]' : 'border-[#5a14bd]/50'
                }`}>
                  <p className="font-extrabold text-4xl text-[#5a14bd] mb-2">B</p>
                  <p className="text-xs text-[#1a1a1a] leading-relaxed tracking-wide">
                    {slide.optionB}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation - fixed at bottom */}
      <div className="relative z-20 flex items-center justify-between px-6 pb-4">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className={`bg-white rounded-full p-4 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] transition-opacity ${
            currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          <ChevronLeft size={24} className="text-[#5a14bd]" />
        </button>

        {/* Pagination pill */}
        <div className="bg-black/15 backdrop-blur-md rounded-full px-4 py-2">
          <span className="text-xs font-medium text-white tracking-wide">
            {currentSlide + 1}/{totalSlides}
          </span>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1 || (slide.type === 'dilemma' && !selectedAnswer)}
          className={`bg-white rounded-full p-4 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] transition-opacity ${
            currentSlide === slides.length - 1 || (slide.type === 'dilemma' && !selectedAnswer)
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-gray-50'
          }`}
        >
          <ChevronRight size={24} className="text-[#5a14bd]" />
        </button>
      </div>
    </div>
  );
}
