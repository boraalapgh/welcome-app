import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  variant?: 'light' | 'dark';
}

export function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  variant = 'light',
}: SlideNavigationProps) {
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === totalSlides - 1;

  const buttonClass = variant === 'light'
    ? 'bg-white/30 text-white hover:bg-white/50'
    : 'bg-[#2e0a61] text-white hover:bg-[#5a14bd]';

  const disabledClass = 'opacity-40 cursor-not-allowed';

  return (
    <div className="flex items-center justify-between px-4 py-4">
      {/* Prev button */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={`rounded-full p-2 transition-colors ${buttonClass} ${isFirst ? disabledClass : ''}`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Slide counter */}
      <span className={`text-sm font-medium ${variant === 'light' ? 'text-white/70' : 'text-[#666]'}`}>
        {currentSlide + 1}/{totalSlides}
      </span>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={isLast}
        className={`rounded-full p-2 transition-colors ${buttonClass} ${isLast ? disabledClass : ''}`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
