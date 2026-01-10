import { useState, useEffect, useRef } from 'react';
import { useControls, folder, button } from 'leva';
import { useUserType } from '../context/UserTypeContext';
import { useTransitions, easingOptions, type EasingType } from '../context/TransitionContext';
import { useLevaStores } from './LevaControls';
import {
  persistedSlideValues,
  persistSlideValues,
  clearSlideValues,
} from '../stores/levaStores';
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
  const { slidesStore } = useLevaStores();

  // Get persisted values or use defaults
  const p = persistedSlideValues as Record<string, unknown> | null;

  // Build store option - only include if store is available
  const storeOption = slidesStore ? { store: slidesStore } : {};

  // Slide transition controls
  const slideControls = useControls('Content Transition', {
    timing: folder({
      slideDuration: {
        value: (p?.slideDuration as number) ?? 200,
        min: 100,
        max: 1000,
        step: 50,
        label: 'Duration (ms)',
      },
      slideEasing: {
        value: (p?.slideEasing as EasingType) ?? 'ease-in-out',
        options: easingOptions,
        label: 'Easing',
      },
      staggerDelay: {
        value: (p?.staggerDelay as number) ?? 0,
        min: 0,
        max: 300,
        step: 10,
        label: 'Stagger (ms)',
      },
    }),
    transform: folder({
      slideDistance: {
        value: (p?.slideDistance as number) ?? 25,
        min: 0,
        max: 150,
        step: 5,
        label: 'Slide Distance (px)',
      },
      slideScaleFrom: {
        value: (p?.slideScaleFrom as number) ?? 1,
        min: 0.8,
        max: 1,
        step: 0.01,
        label: 'Scale From',
      },
    }),
  }, storeOption);

  // Prototype panel controls
  const prototypeControls = useControls('Prototype Transition', {
    prototypeDuration: {
      value: (p?.prototypeDuration as number) ?? 550,
      min: 100,
      max: 1200,
      step: 50,
      label: 'Duration (ms)',
    },
    prototypeEasing: {
      value: (p?.prototypeEasing as EasingType) ?? 'ease-in-out',
      options: easingOptions,
      label: 'Easing',
    },
    prototypeScale: {
      value: (p?.prototypeScale as number) ?? 0.97,
      min: 0.8,
      max: 1,
      step: 0.01,
      label: 'Scale From',
    },
    prototypeSlideX: {
      value: (p?.prototypeSlideX as number) ?? 10,
      min: 0,
      max: 100,
      step: 5,
      label: 'Slide X (px)',
    },
  }, storeOption);

  // Actions buttons
  useControls('Actions', {
    'Reset Slides': button(() => {
      clearSlideValues();
      window.location.reload();
    }),
    'Copy Values': button(() => {
      const storeData = slidesStore?.getData() as Record<string, { value: unknown }> | undefined;
      const getValue = (key: string, fallback: unknown) => storeData?.[key]?.value ?? fallback;

      const exportData = {
        slideTransitionsV2: {
          content: {
            duration: getValue('Content Transition.timing.slideDuration', slideControls.slideDuration),
            easing: getValue('Content Transition.timing.slideEasing', slideControls.slideEasing),
            staggerDelay: getValue('Content Transition.timing.staggerDelay', slideControls.staggerDelay),
            slideDistance: getValue('Content Transition.transform.slideDistance', slideControls.slideDistance),
            scaleFrom: getValue('Content Transition.transform.slideScaleFrom', slideControls.slideScaleFrom),
          },
          prototype: {
            duration: getValue('Prototype Transition.prototypeDuration', prototypeControls.prototypeDuration),
            easing: getValue('Prototype Transition.prototypeEasing', prototypeControls.prototypeEasing),
            scale: getValue('Prototype Transition.prototypeScale', prototypeControls.prototypeScale),
            slideX: getValue('Prototype Transition.prototypeSlideX', prototypeControls.prototypeSlideX),
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
      staggerDelay: slideControls.staggerDelay,
      slideDistance: slideControls.slideDistance,
      slideScaleFrom: slideControls.slideScaleFrom,
      prototypeDuration: prototypeControls.prototypeDuration,
      prototypeEasing: prototypeControls.prototypeEasing,
      prototypeScale: prototypeControls.prototypeScale,
      prototypeSlideX: prototypeControls.prototypeSlideX,
    };
    persistSlideValues(values);
  }, [slideControls, prototypeControls]);

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

  // Track slide direction and transition state
  const prevSlideRef = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Trigger fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Calculate the longest exit/enter duration to prevent flicker
  const getTransitionDuration = () => {
    // Use the longer of content or prototype duration
    const contentTotal = slideControls.slideDuration + slideControls.staggerDelay;
    const prototypeTotal = prototypeControls.prototypeDuration;
    return Math.max(contentTotal, prototypeTotal);
  };

  // Handle slide change with transition
  const changeSlide = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= slides.length || newIndex === currentSlide || isTransitioning) {
      return;
    }

    // Determine direction
    const direction = newIndex > currentSlide ? 'right' : 'left';
    setSlideDirection(direction);

    const transitionDuration = getTransitionDuration();

    // Start exit transition
    setIsTransitioning(true);

    // After exit animation completes (using the longest duration), change slide
    setTimeout(() => {
      prevSlideRef.current = currentSlide;
      setCurrentSlide(newIndex);

      // End transition after enter animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    }, transitionDuration);
  };

  const goToSlide = (index: number) => {
    changeSlide(index);
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onComplete, pageExitDuration);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      changeSlide(currentSlide + 1);
    } else {
      handleSkip();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      changeSlide(currentSlide - 1);
    }
  };

  // Calculate transform based on transition state and direction
  const getContentTransform = (delay: number = 0) => {
    const distance = slideControls.slideDistance;
    const scale = slideControls.slideScaleFrom;
    const direction = slideDirection === 'right' ? 1 : -1;

    if (isTransitioning) {
      // Exit: slide out in opposite direction
      return {
        opacity: 0,
        transform: `translateX(${-direction * distance}px) scale(${scale})`,
        transition: `all ${slideControls.slideDuration}ms ${slideControls.slideEasing} ${delay}ms`,
      };
    }

    if (!isMounted) {
      // Initial mount state
      return {
        opacity: 0,
        transform: `translateX(${distance}px) scale(${scale})`,
        transition: `all ${slideControls.slideDuration}ms ${slideControls.slideEasing} ${delay}ms`,
      };
    }

    // Enter/visible state
    return {
      opacity: 1,
      transform: 'translateX(0) scale(1)',
      transition: `all ${slideControls.slideDuration}ms ${slideControls.slideEasing} ${delay}ms`,
    };
  };

  const getPrototypeTransform = () => {
    const scale = prototypeControls.prototypeScale;
    const slideX = prototypeControls.prototypeSlideX;
    const direction = slideDirection === 'right' ? 1 : -1;

    if (isTransitioning) {
      return {
        opacity: 0,
        transform: `translateX(${-direction * slideX}px) scale(${scale})`,
        transition: `all ${prototypeControls.prototypeDuration}ms ${prototypeControls.prototypeEasing}`,
      };
    }

    if (!isMounted) {
      return {
        opacity: 0,
        transform: `translateX(${slideX}px) scale(${scale})`,
        transition: `all ${prototypeControls.prototypeDuration}ms ${prototypeControls.prototypeEasing}`,
      };
    }

    return {
      opacity: 1,
      transform: 'translateX(0) scale(1)',
      transition: `all ${prototypeControls.prototypeDuration}ms ${prototypeControls.prototypeEasing}`,
    };
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
        <div
          className="flex flex-col gap-14 items-start w-full relative"
          style={{
            // Smooth vertical repositioning when content height changes
            transition: `transform ${slideControls.slideDuration}ms ${slideControls.slideEasing}`,
          }}
        >
          {/* Logo + Text */}
          <div
            className="flex flex-col gap-6 items-start w-full max-lg:order-2"
            style={{
              // Smooth transition for any layout shifts due to content height changes
              transition: `all ${slideControls.slideDuration}ms ${slideControls.slideEasing}`,
            }}
          >
            {/* Experts Logo */}
            <div className="h-12 mb-8">
              <img src={ExpertsLogo} alt="GoodHabitz Experts" className="h-full w-auto" />
            </div>

            {/* Title */}
            <h1
              className="text-[41px] font-extrabold leading-[1.2] text-[#1a1a1a] w-full"
              style={getContentTransform(0)}
            >
              {slides[currentSlide].title}
            </h1>

            {/* Description */}
            <p
              className="text-lg font-medium leading-[1.2] text-[#666] w-full"
              style={getContentTransform(slideControls.staggerDelay)}
            >
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
      <div className="flex-1 flex items-center justify-center lg:bg-white max-lg:order-first">
        <div className="w-full h-full flex items-center justify-center" style={getPrototypeTransform()}>
          {renderPrototype(slides[currentSlide]?.prototype)}
        </div>
      </div>
    </div>
  );
}
