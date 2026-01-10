import { useState, useRef, useEffect } from 'react';
import { Logo, LogoRef } from './Logo';
import { useDebugControls } from '../context/DebugControlsContext';

interface WelcomeProps {
  onComplete?: () => void;
}

export function Welcome({ onComplete }: WelcomeProps) {
  const [isExiting, setIsExiting] = useState(false);
  const logoRef = useRef<LogoRef>(null);
  const { isEnabled } = useDebugControls();

  const pauseAutoAdvance = isEnabled('welcomePauseAuto');

  // Auto-trigger exit after animations complete + 2 second pause
  useEffect(() => {
    // Skip auto-advance if paused
    if (pauseAutoAdvance) return;

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      logoRef.current?.fadeOutOrb();
    }, 4000); // 2s for animations to complete + 2s pause

    // Call onComplete after exit animation finishes
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 4800); // 4s + 0.8s exit animation

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, pauseAutoAdvance]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center gap-6 z-10">
      {/* Logo with Orb and Stars */}
      <div
        className="relative z-10 animate-logo-appear overflow-visible"
        style={{ animationDelay: '0.5s' }}
      >
        <Logo ref={logoRef} isExiting={isExiting} />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-2 z-10">
        <h1
          className={`text-[46px] font-extrabold text-[#1a1a1a] leading-[72px] text-center opacity-0 scale-[0.8] animate-text-appear ${
            isExiting ? 'animate-text-fade-out' : ''
          }`}
          style={{ animationDelay: isExiting ? '0s' : '0.8s' }}
        >
          Welcome to Experts Studio
        </h1>
        <p
          className={`text-lg font-semibold text-[#666] leading-[21.6px] text-center opacity-0 scale-[0.8] animate-text-appear ${
            isExiting ? 'animate-text-fade-out' : ''
          }`}
          style={{ animationDelay: isExiting ? '0.1s' : '1.1s' }}
        >
          Build something Teachable
        </p>
      </div>
    </div>
  );
}
