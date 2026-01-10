import { useState, useEffect } from 'react';
import { useControls, folder, button } from 'leva';
import { useUserType } from '../context/UserTypeContext';
import { useTransitions, easingOptions, type EasingType } from '../context/TransitionContext';
import { useLevaStores } from './LevaControls';
import {
  persistedSlideValues,
  persistSlideValues,
  clearSlideValues,
} from '../stores/levaStores';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
  const { config } = useUserType();
  const { pageExitDuration, pageScaleFrom, getPageTransition } = useTransitions();
  const { slidesStore } = useLevaStores();

  // Get persisted values or use defaults
  const p = persistedSlideValues as Record<string, unknown> | null;

  // Build store option - only include if store is available
  const storeOption = slidesStore ? { store: slidesStore } : {};

  // Slide transition controls
  const slideControls = useControls('Slide Carousel', {
    timing: folder({
      slideDuration: {
        value: (p?.slideDuration as number) ?? 500,
        min: 100,
        max: 1500,
        step: 50,
        label: 'Duration (ms)',
      },
      slideEasing: {
        value: (p?.slideEasing as EasingType) ?? 'ease-out',
        options: easingOptions,
        label: 'Easing',
      },
    }),
    inactive: folder({
      slideScaleInactive: {
        value: (p?.slideScaleInactive as number) ?? 0.9,
        min: 0.5,
        max: 1,
        step: 0.05,
        label: 'Inactive Scale',
      },
      slideOpacityInactive: {
        value: (p?.slideOpacityInactive as number) ?? 0.2,
        min: 0,
        max: 1,
        step: 0.1,
        label: 'Inactive Opacity',
      },
    }),
  }, storeOption);

  // Card animation controls
  const cardControls = useControls('Card Animation', {
    cardTransitionDuration: {
      value: (p?.cardTransitionDuration as number) ?? 500,
      min: 100,
      max: 1500,
      step: 50,
      label: 'Duration (ms)',
    },
    cardEasing: {
      value: (p?.cardEasing as EasingType) ?? 'ease-out',
      options: easingOptions,
      label: 'Easing',
    },
  }, storeOption);

  // Step animation controls (shared with AccountSetup)
  const stepControls = useControls('Step Animation', {
    stepTranslateDistance: {
      value: (p?.stepTranslateDistance as number) ?? 16,
      min: 0,
      max: 100,
      step: 4,
      label: 'Translate (px)',
    },
    stepScaleFrom: {
      value: (p?.stepScaleFrom as number) ?? 1,
      min: 0.8,
      max: 1,
      step: 0.02,
      label: 'Scale From',
    },
  }, storeOption);

  // Actions buttons
  useControls('Actions', {
    'Reset Slides': button(() => {
      clearSlideValues();
      window.location.reload();
    }),
    'Copy Values': button(() => {
      // Read current values from store to avoid stale closure
      // getData() returns full metadata, extract .value from each
      const storeData = slidesStore?.getData() as Record<string, { value: unknown }> | undefined;
      const getValue = (key: string, fallback: unknown) => storeData?.[key]?.value ?? fallback;

      const exportData = {
        slideTransitions: {
          carousel: {
            duration: getValue('Slide Carousel.timing.slideDuration', slideControls.slideDuration),
            easing: getValue('Slide Carousel.timing.slideEasing', slideControls.slideEasing),
            scaleInactive: getValue('Slide Carousel.inactive.slideScaleInactive', slideControls.slideScaleInactive),
            opacityInactive: getValue('Slide Carousel.inactive.slideOpacityInactive', slideControls.slideOpacityInactive),
          },
          card: {
            duration: getValue('Card Animation.cardTransitionDuration', cardControls.cardTransitionDuration),
            easing: getValue('Card Animation.cardEasing', cardControls.cardEasing),
          },
          step: {
            translateDistance: getValue('Step Animation.stepTranslateDistance', stepControls.stepTranslateDistance),
            scaleFrom: getValue('Step Animation.stepScaleFrom', stepControls.stepScaleFrom),
          },
        },
      };
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      console.log('Exported slide transition values:', exportData);
      alert('Slide transition values copied to clipboard! Check console for details.');
    }),
  }, storeOption);

  // Persist values on change
  useEffect(() => {
    const values = {
      slideDuration: slideControls.slideDuration,
      slideEasing: slideControls.slideEasing,
      slideScaleInactive: slideControls.slideScaleInactive,
      slideOpacityInactive: slideControls.slideOpacityInactive,
      cardTransitionDuration: cardControls.cardTransitionDuration,
      cardEasing: cardControls.cardEasing,
      stepTranslateDistance: stepControls.stepTranslateDistance,
      stepScaleFrom: stepControls.stepScaleFrom,
    };
    persistSlideValues(values);
  }, [slideControls, cardControls, stepControls]);

  // Map config slides to component format
  const slides = config.slides.map((slide, index) => ({
    image: slide.image || `/onboarding-${index + 1}.jpg`,
    headline: slide.title,
    body: slide.description,
  }));
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
      className="relative z-10 w-full h-full flex flex-col items-center justify-center"
      style={{
        transition: getPageTransition(),
        opacity: !isMounted || isExiting ? 0 : 1,
        transform: !isMounted || isExiting ? `scale(${pageScaleFrom})` : 'scale(1)',
      }}
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
            className="flex items-center gap-14"
            style={{
              // marginLeft centers the first card, translateX shifts for navigation
              marginLeft: `calc(50% - min(35vw, 540px) / 2)`,
              transform: `translateX(calc(${-currentSlide} * (min(35vw, 540px) + 56px)))`,
              transition: `transform ${slideControls.slideDuration}ms ${slideControls.slideEasing}`,
            }}
          >
            {slides.map((slide, index) => {
              const isCurrent = index === currentSlide;

              return (
                <div
                  key={index}
                  className="shrink-0 origin-center"
                  style={{
                    width: 'min(35vw, 540px)',
                    transform: `scale(${isCurrent ? 1 : slideControls.slideScaleInactive})`,
                    opacity: isCurrent ? 1 : slideControls.slideOpacityInactive,
                    transition: `all ${cardControls.cardTransitionDuration}ms ${cardControls.cardEasing}`,
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
