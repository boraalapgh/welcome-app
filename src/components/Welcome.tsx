import { useState, useRef, useEffect } from 'react';
import { StarsCanvas } from './StarsCanvas';
import OrbOriginal from '@/components/OrbOriginal';

interface WelcomeProps {
  onComplete?: () => void;
}

export function Welcome({ onComplete }: WelcomeProps) {
  const [isExiting, setIsExiting] = useState(false);
  const logoBgRef = useRef<HTMLDivElement>(null);

  // Auto-trigger exit after animations complete + 2 second pause
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      if (logoBgRef.current) {
        logoBgRef.current.style.transition = 'opacity 0.8s ease-out';
        logoBgRef.current.style.opacity = '0';
      }
    }, 4000); // 2s for animations to complete + 2s pause

    // Call onComplete after exit animation finishes
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 4800); // 4s + 0.8s exit animation

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 z-10">
      {/* Logo with Orb and Stars */}
      <div
        className="relative w-80 h-80 z-10 opacity-0 scale-[0.5] animate-logo-appear overflow-visible"
        style={{ animationDelay: '0.5s' }}
      >
        {/* Orb and white background - both fade together */}
        <div
          ref={logoBgRef}
          className="absolute inset-0"
          style={{ zIndex: 0 }}
        >
          {/* Blurred white background for soft edges */}
          <div
            className="absolute inset-[-5%] rounded-full bg-white blur-lg opacity-70 w-[110%] h-[110%]"
          />
          {/* Orb clipped to circle */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <OrbOriginal
              hue={270}
              hoverIntensity={0.2}
              rotateOnHover={true}
              backgroundColor="#ffffff"
            />
          </div>
        </div>
        {/* Stars - can overflow during exit */}
        <StarsCanvas isExiting={isExiting} />
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
