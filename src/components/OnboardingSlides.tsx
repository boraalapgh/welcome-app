import { useState, useEffect } from 'react';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

const slides = [
  {
    image: '/onboarding-1.jpg',
    headline: 'Capture your knowledge:',
    body: 'Transform your expertise into structured, shareable content that scales beyond your time.',
  },
  {
    image: '/onboarding-2.jpg',
    headline: 'Build engaging courses:',
    body: 'Create interactive learning experiences with videos, quizzes, and hands-on exercises.',
  },
  {
    image: '/onboarding-3.jpg',
    headline: 'Grow your audience:',
    body: 'Reach learners worldwide and build a community around your unique knowledge.',
  },
];

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
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
    setTimeout(onComplete, 300);
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
      className={`relative z-10 w-full h-full flex flex-col items-center justify-center transition-all duration-300 ease-out ${
        !isMounted || isExiting ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Skip button - fixed top right */}
      <button
        onClick={handleSkip}
        className="fixed top-6 right-8 flex items-center gap-1 text-sm font-extrabold text-[#5a14bd] hover:opacity-80 transition-opacity z-20"
      >
        Skip
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

      {/* Main content area */}
      <div className="flex flex-col items-center w-full px-6 gap-14">
        {/* Image carousel - 3 cards visible with 56px gap */}
        <div className="relative w-full overflow-visible">
          <div
            className="flex items-center gap-14 transition-transform duration-500 ease-out"
            style={{
              // marginLeft centers the first card, translateX shifts for navigation
              marginLeft: `calc(50% - min(35vw, 540px) / 2)`,
              transform: `translateX(calc(${-currentSlide} * (min(35vw, 540px) + 56px)))`,
            }}
          >
            {slides.map((slide, index) => {
              const isCurrent = index === currentSlide;

              return (
                <div
                  key={index}
                  className="shrink-0 transition-all duration-500 ease-out origin-center"
                  style={{
                    width: 'min(35vw, 540px)',
                    transform: `scale(${isCurrent ? 1 : 0.9})`,
                    opacity: isCurrent ? 1 : 0.2,
                  }}
                >
                  <div className="w-full rounded-3xl shadow-[0px_6px_24px_0px_rgba(21,21,21,0.15)] overflow-hidden bg-white">
                    <div className="relative w-full aspect-[600/338] bg-gray-100">
                      <img
                        src={slide.image}
                        alt={slide.headline}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Text content */}
        <div className="text-center ">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-3">
            {slides[currentSlide].headline}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-md">
            {slides[currentSlide].body}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-10">
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
  );
}
