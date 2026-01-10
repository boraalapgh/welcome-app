import { useState, useEffect } from 'react';
import { useUserType } from '../context/UserTypeContext';
import { useTransitions } from '../context/TransitionContext';
import ExpertsLogo from '../assets/expertslogo.svg';
import { ChevronRight } from 'lucide-react';
import { LessonPrototype } from './prototypes/LessonPrototype';
import { AIInterviewPrototype } from './prototypes/AIInterviewPrototype';
import { PublishPrototype } from './prototypes/PublishPrototype';
import type { PrototypeType } from '../config/onboarding-content';

interface OnboardingSlidesV2Props {
  onComplete: () => void;
}

export function OnboardingSlidesV2({ onComplete }: OnboardingSlidesV2Props) {
  const { config } = useUserType();
  const { pageExitDuration, pageScaleFrom, getPageTransition } = useTransitions();

  // Map config slides to component format
  const slides = config.slides.map((slide) => ({
    title: slide.title,
    description: slide.description,
    prototype: slide.prototype as PrototypeType | undefined,
  }));

  // Render prototype component based on type
  const renderPrototype = (prototypeType: PrototypeType | undefined) => {
    switch (prototypeType) {
      case 'lesson':
        return <LessonPrototype />;
      case 'ai-interview':
        return <AIInterviewPrototype />;
      case 'publish':
        return <PublishPrototype />;
      case 'none':
      default:
        return null;
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Trigger fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onComplete, pageExitDuration);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleSkip();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div
      className="relative z-10 w-full lg:h-full grid lg:grid-cols-2 max-lg:gap-12 "
      style={{
        transition: getPageTransition(),
        opacity: !isMounted || isExiting ? 0 : 1,
        transform: !isMounted || isExiting ? `scale(${pageScaleFrom})` : 'scale(1)',
      }}
    >
  

      {/* Left Panel - Text Content */}
      <div className="flex-1 flex flex-col items-center lg:justify-end lg:pb-24 max-lg:pt-12 max-lg:order-first px-[72px] relative">
            {/* Skip button - positioned top center-right area */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6  flex items-center gap-1 text-sm font-extrabold text-[#5a14bd] hover:opacity-80 transition-opacity z-20"
      >
        Skip
      <ChevronRight size={24} strokeWidth={1.5} className="text-[#5a14bd]" />
      </button>
        {/* Content container */}
        <div className="flex flex-col gap-14 items-start w-full relative ">
          {/* Logo + Text */}
          <div className="flex flex-col gap-6 items-start w-full max-lg:order-2">
            {/* Experts Logo */}
            <div className="h-12 mb-8">
              <img src={ExpertsLogo} alt="GoodHabitz Experts" className="h-full w-auto" />
            </div>

            {/* Title */}
            <h1 className="text-[41px] font-extrabold leading-[1.2] text-[#1a1a1a] w-full">
              {slides[currentSlide].title}
            </h1>

            {/* Description */}
            <p className="text-lg font-medium leading-[1.2] text-[#666] w-full">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-10 justify-center w-full max-lg:order-1">
            {/* Left chevron */}
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                currentSlide === 0
                  ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                  : 'border-[#5a14bd] text-[#5a14bd] hover:bg-[#5a14bd]/5'
              }`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Dot indicators - radio style */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full border-2 border-[#5a14bd] flex items-center justify-center transition-all ${
                    index === currentSlide ? '' : 'hover:bg-[#5a14bd]/10'
                  }`}
                >
                  {index === currentSlide && (
                    <div className="w-2 h-2 rounded-full bg-[#5a14bd]" />
                  )}
                </button>
              ))}
            </div>

            {/* Right chevron */}
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-lg border border-[#5a14bd] flex items-center justify-center text-[#5a14bd] hover:bg-[#5a14bd]/5 transition-all"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Interactive Prototype Area */}
      <div className="flex-1 flex items-center justify-center lg:bg-white max-lg:order-first  ">
        {renderPrototype(slides[currentSlide]?.prototype)}
      </div>
    </div>
  );
}
