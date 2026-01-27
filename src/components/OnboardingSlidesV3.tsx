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

  // Clear old persisted values on first load to ensure clean state
  useEffect(() => {
    const hasCleared = sessionStorage.getItem('video-slides-cleared');
    if (!hasCleared) {
      clearVideoSlideValues();
      sessionStorage.setItem('video-slides-cleared', 'true');
    }
  }, []);

  // Get persisted values or use defaults (but ignore rotation/cardFade - always use new defaults)
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
      value: 0, // Always 0 - no rotation per design
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
      value: false, // Disabled - keep video container always visible
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
  const [progressKey, setProgressKey] = useState(0);
  const [cardOpacity, setCardOpacity] = useState(1); // For card container fade

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle slide transition with fade - simplified to always sync displaySlide
  useEffect(() => {
    if (currentSlide !== displaySlide) {
      // Start fade out - card fades away
      setCardOpacity(0);

      // After fade out, change the display slide and fade in
      const fadeOutTimer = setTimeout(() => {
        setDisplaySlide(currentSlide);

        // Small delay to ensure DOM updates, then fade in
        setTimeout(() => {
          setCardOpacity(1);
        }, 50);
      }, fadeControls.fadeDuration / 2); // Half duration for fade out

      return () => clearTimeout(fadeOutTimer);
    }
  }, [currentSlide, displaySlide, fadeControls.fadeDuration]);

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
    if (index === currentSlide) return; // Only skip if clicking the already active slide
    setCurrentSlide(index);
    setProgressKey((k) => k + 1);
  };

  const handleSkip = () => {
    setIsExiting(true);
    stopTimer();
    setTimeout(onComplete, pageExitDuration);
  };

  // Get video card style - uses cardOpacity for fade transitions
  const getCardStyle = () => {
    return {
      opacity: !isMounted ? 0 : cardOpacity,
      transform: `rotate(${videoControls.rotation}deg) scale(${videoControls.scale})`,
      transition: `opacity ${fadeControls.fadeDuration / 2}ms ${fadeControls.fadeEasing}, transform 300ms ease-out`,
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
    >
      {/* Left Panel - Video Card */}
      <div className="flex-1 flex items-center justify-center lg:justify-end lg:pr-16 max-lg:order-first max-lg:pt-8">
        <div
          className="relative origin-center"
          style={getCardStyle()}
        >
          {/* Video Card with shadow */}
          <div className="relative w-[471px] h-[628px] rounded-[24px] overflow-hidden bg-white shadow-[1px_4px_12px_0px_rgba(0,0,0,0.25)]">
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
        <div className="flex flex-col w-[338px] pt-10">
          {/* Navigation Items - each with title, description, and progress bar */}
          <nav
            className="flex flex-col"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              const isLast = index === slides.length - 1;
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`text-left group relative flex flex-col px-4 py-4 ${
                    !isActive ? 'cursor-pointer hover:bg-gray-50' : ''
                  }`}
                >
                  {/* Title - smooth color transition with Leva-controlled timing */}
                  <span
                    className="text-[25px] font-extrabold leading-[30px]"
                    style={{
                      color: isActive ? '#1a1a1a' : '#666666',
                      transform: isActive ? 'translateY(0)' : `translateY(${textControls.translateY}px)`,
                      transition: `color ${fadeControls.fadeDuration}ms ${fadeControls.fadeEasing} ${textControls.titleDelay}ms, transform ${fadeControls.fadeDuration}ms ${fadeControls.fadeEasing} ${textControls.titleDelay}ms`,
                    }}
                  >
                    {slide.title}
                  </span>

                  {/* Description - fade in/out with Leva-controlled timing */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: isActive ? '100px' : '0px',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : `translateY(${textControls.translateY}px)`,
                      transition: `max-height ${fadeControls.fadeDuration}ms ${fadeControls.fadeEasing} ${textControls.descriptionDelay}ms, opacity ${fadeControls.fadeDuration}ms ${fadeControls.fadeEasing} ${textControls.descriptionDelay}ms, transform ${fadeControls.fadeDuration}ms ${fadeControls.fadeEasing} ${textControls.descriptionDelay}ms`,
                    }}
                  >
                    <span className="block text-[18px] font-medium leading-[27px] mt-2 text-[#1a1a1a]">
                      {slide.description}
                    </span>
                  </div>

                  {/* Border line - animates height between 1px (inactive) and 3px (active) */}
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: isActive ? '3px' : isLast ? '0px' : '1px',
                      background: isActive
                        ? 'linear-gradient(90deg, #b3b3b3 0%, #999999 100%)'
                        : '#e6e6e6',
                      transition: `height ${fadeControls.fadeDuration}ms ${fadeControls.fadeEasing}, background ${fadeControls.fadeDuration}ms ${fadeControls.fadeEasing}`,
                    }}
                  >
                    {/* Progress fill - animates over the grey border when active */}
                    {isActive && (
                      <div
                        key={progressKey}
                        className="h-full"
                        style={{
                          background: 'linear-gradient(90deg, #b3b3b3 0%, #666666 100%)',
                          animation: isHovered && timerControls.pauseOnHover
                            ? 'none'
                            : `progressFill ${timerControls.autoAdvanceDuration}ms linear forwards`,
                          animationPlayState: isHovered && timerControls.pauseOnHover ? 'paused' : 'running',
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
