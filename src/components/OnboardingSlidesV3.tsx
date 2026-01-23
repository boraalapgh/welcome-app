import { useState, useEffect, useRef, useCallback } from 'react';
import { useControls, button } from 'leva';
import { useUserType } from '../context/UserTypeContext';
import { useTransitions, easingOptions, type EasingType } from '../context/TransitionContext';
import { useLevaStores } from './LevaControls';
import {
  persistedVideoSlideValues,
  persistVideoSlideValues,
  clearVideoSlideValues,
} from '../stores/levaStores';
import { ChevronRight } from 'lucide-react';

interface OnboardingSlidesV3Props {
  onComplete: () => void;
}

export function OnboardingSlidesV3({ onComplete }: OnboardingSlidesV3Props) {
  const { config } = useUserType();
  const { pageExitDuration, pageScaleFrom, getPageTransition } = useTransitions();
  const { videoSlidesStore } = useLevaStores();

  // Get persisted values or use defaults
  const p = persistedVideoSlideValues as Record<string, unknown> | null;

  // Build store option - only include if store is available
  const storeOption = videoSlidesStore ? { store: videoSlidesStore } : {};

  // Timer Controls
  const timerControls = useControls('Timer', {
    autoAdvanceDuration: {
      value: (p?.autoAdvanceDuration as number) ?? 5000,
      min: 2000,
      max: 15000,
      step: 500,
      label: 'Duration (ms)',
    },
    pauseOnHover: {
      value: (p?.pauseOnHover as boolean) ?? true,
      label: 'Pause on Hover',
    },
  }, storeOption);

  // Slide Fade Transition Controls
  const fadeControls = useControls('Slide Fade', {
    fadeDuration: {
      value: (p?.fadeDuration as number) ?? 400,
      min: 100,
      max: 1000,
      step: 50,
      label: 'Duration (ms)',
    },
    fadeEasing: {
      value: (p?.fadeEasing as EasingType) ?? 'ease-out',
      options: easingOptions,
      label: 'Easing',
    },
  }, storeOption);

  // Text Animation Controls
  const textControls = useControls('Text Animation', {
    titleDelay: {
      value: (p?.titleDelay as number) ?? 0,
      min: 0,
      max: 500,
      step: 50,
      label: 'Title Delay (ms)',
    },
    descriptionDelay: {
      value: (p?.descriptionDelay as number) ?? 100,
      min: 0,
      max: 500,
      step: 50,
      label: 'Desc Delay (ms)',
    },
    translateY: {
      value: (p?.translateY as number) ?? 12,
      min: 0,
      max: 40,
      step: 4,
      label: 'Translate Y (px)',
    },
  }, storeOption);

  // Video Card Controls
  const videoControls = useControls('Video Card', {
    rotation: {
      value: (p?.videoRotation as number) ?? -12,
      min: -25,
      max: 25,
      step: 1,
      label: 'Rotation (deg)',
    },
    scale: {
      value: (p?.videoScale as number) ?? 1,
      min: 0.5,
      max: 1.5,
      step: 0.05,
      label: 'Scale',
    },
    cardFade: {
      value: (p?.cardFade as boolean) ?? true,
      label: 'Fade Card Too',
    },
  }, storeOption);

  // Actions buttons
  useControls('Actions', {
    'Reset Video Slides': button(() => {
      clearVideoSlideValues();
      window.location.reload();
    }),
    'Copy Values': button(() => {
      const storeData = videoSlidesStore?.getData() as Record<string, { value: unknown }> | undefined;
      const getValue = (key: string, fallback: unknown) => storeData?.[key]?.value ?? fallback;

      const exportData = {
        videoSlidesV3: {
          timer: {
            autoAdvanceDuration: getValue('Timer.autoAdvanceDuration', timerControls.autoAdvanceDuration),
            pauseOnHover: getValue('Timer.pauseOnHover', timerControls.pauseOnHover),
          },
          slideFade: {
            duration: getValue('Slide Fade.fadeDuration', fadeControls.fadeDuration),
            easing: getValue('Slide Fade.fadeEasing', fadeControls.fadeEasing),
          },
          textAnimation: {
            titleDelay: getValue('Text Animation.titleDelay', textControls.titleDelay),
            descriptionDelay: getValue('Text Animation.descriptionDelay', textControls.descriptionDelay),
            translateY: getValue('Text Animation.translateY', textControls.translateY),
          },
          videoCard: {
            rotation: getValue('Video Card.rotation', videoControls.rotation),
            scale: getValue('Video Card.scale', videoControls.scale),
            cardFade: getValue('Video Card.cardFade', videoControls.cardFade),
          },
        },
      };
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      console.log('Exported video slide values:', exportData);
      alert('Video slide values copied to clipboard! Check console for details.');
    }),
  }, storeOption);

  // Persist values on change
  useEffect(() => {
    const values = {
      autoAdvanceDuration: timerControls.autoAdvanceDuration,
      pauseOnHover: timerControls.pauseOnHover,
      fadeDuration: fadeControls.fadeDuration,
      fadeEasing: fadeControls.fadeEasing,
      titleDelay: textControls.titleDelay,
      descriptionDelay: textControls.descriptionDelay,
      translateY: textControls.translateY,
      videoRotation: videoControls.rotation,
      videoScale: videoControls.scale,
      cardFade: videoControls.cardFade,
    };
    persistVideoSlideValues(values);
  }, [timerControls, fadeControls, textControls, videoControls]);

  // Map config slides to component format
  const slides = config.slides.map((slide) => ({
    title: slide.title,
    description: slide.description,
    videoUrl: slide.videoUrl,
    posterUrl: slide.posterUrl,
  }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [displaySlide, setDisplaySlide] = useState(0); // The slide actually being shown
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle slide transition with fade
  useEffect(() => {
    if (currentSlide !== displaySlide && !isTransitioning) {
      // Start fade out
      setIsTransitioning(true);

      // After fade out, change the display slide and fade in
      const fadeOutTimer = setTimeout(() => {
        setDisplaySlide(currentSlide);

        // Small delay to ensure DOM updates, then fade in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, fadeControls.fadeDuration);

      return () => clearTimeout(fadeOutTimer);
    }
  }, [currentSlide, displaySlide, isTransitioning, fadeControls.fadeDuration]);

  // Auto-advance timer
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, timerControls.autoAdvanceDuration);
  }, [slides.length, timerControls.autoAdvanceDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start timer on mount and when slide changes
  useEffect(() => {
    // Don't start timer until component is fully mounted
    if (!isMounted) return;

    if (!isHovered || !timerControls.pauseOnHover) {
      startTimer();
    }
    return () => stopTimer();
  }, [currentSlide, isHovered, timerControls.pauseOnHover, startTimer, stopTimer, isMounted]);

  // Handle hover pause
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timerControls.pauseOnHover) {
      stopTimer();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timerControls.pauseOnHover) {
      startTimer();
      setProgressKey((k) => k + 1);
    }
  };

  // Handle slide change via title click
  const goToSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setCurrentSlide(index);
    setProgressKey((k) => k + 1);
  };

  const handleSkip = () => {
    setIsExiting(true);
    stopTimer();
    setTimeout(onComplete, pageExitDuration);
  };

  // Get video card style
  const getCardStyle = () => {
    const shouldFade = videoControls.cardFade && isTransitioning;
    return {
      opacity: (!isMounted || shouldFade) ? 0 : 1,
      transform: `rotate(${videoControls.rotation}deg) scale(${videoControls.scale})`,
      transition: `opacity ${fadeControls.fadeDuration}ms ${fadeControls.fadeEasing}, transform 300ms ease-out`,
    };
  };

  return (
    <div
      className="relative z-10 w-full lg:h-full grid lg:grid-cols-2 max-lg:gap-8"
      style={{
        transition: getPageTransition(),
        opacity: !isMounted || isExiting ? 0 : 1,
        transform: !isMounted || isExiting ? `scale(${pageScaleFrom})` : 'scale(1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Panel - Video Card */}
      <div className="flex-1 flex items-center justify-center lg:justify-end lg:pr-16 max-lg:order-first max-lg:pt-8">
        <div
          className="relative origin-center"
          style={getCardStyle()}
        >
          {/* Video Card with shadow */}
          <div className="relative w-[420px] h-[300px] rounded-2xl overflow-hidden bg-white shadow-[0_25px_80px_-12px_rgba(0,0,0,0.25)]">
            <video
              ref={videoRef}
              key={slides[displaySlide]?.videoUrl}
              src={slides[displaySlide]?.videoUrl}
              poster={slides[displaySlide]?.posterUrl}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex flex-col items-start lg:justify-center lg:pl-16 max-lg:px-8 relative">
        {/* Skip button - top right */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-8 flex items-center gap-0.5 text-sm font-semibold text-[#1a1a1a] hover:text-[#5a14bd] transition-colors z-20"
        >
          Skip
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        {/* Main Content Area */}
        <div className="flex flex-col max-w-md">
          {/* Navigation Items - each with title, description, and progress bar */}
          <nav className="flex flex-col gap-6">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="text-left group relative flex flex-col"
                  disabled={isTransitioning}
                >
                  {/* Title */}
                  <span
                    className={`text-[20px] font-bold transition-colors duration-200 ${
                      isActive
                        ? 'text-[#1a1a1a]'
                        : 'text-[#b3b3b3] hover:text-[#888888]'
                    }`}
                  >
                    {slide.title}
                  </span>

                  {/* Description - below title */}
                  <span
                    className={`text-[15px] leading-relaxed mt-1 transition-colors duration-200 ${
                      isActive
                        ? 'text-[#666666]'
                        : 'text-[#c4c4c4] hover:text-[#999999]'
                    }`}
                  >
                    {slide.description}
                  </span>

                  {/* Progress bar - purple gradient line, only on active item */}
                  {isActive && (
                    <div className="mt-3 h-[3px] w-full rounded-full overflow-hidden">
                      <div
                        key={progressKey}
                        className="h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #5a14bd 0%, #8b5cf6 100%)',
                          animation: isHovered && timerControls.pauseOnHover
                            ? 'none'
                            : `progressFill ${timerControls.autoAdvanceDuration}ms linear forwards`,
                          animationPlayState: isHovered && timerControls.pauseOnHover ? 'paused' : 'running',
                        }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
