import { useState, useEffect, useRef } from 'react';
import { Logo, LogoRef } from './Logo';
import { CelebrationParticles } from './CelebrationParticles';

interface CompleteProps {
  onComplete: () => void;
}

export function Complete({ onComplete }: CompleteProps) {
  const [isExiting, setIsExiting] = useState(false);
  const logoRef = useRef<LogoRef>(null);

  // Auto-trigger exit after a delay
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      logoRef.current?.fadeOutOrb();
    }, 3000); // Show celebration for 3 seconds

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3800); // 3s + 0.8s exit animation

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <>
      <CelebrationParticles />
      <div
        className="flex flex-col items-center z-10"
        style={{
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'translateY(-20px)' : 'translateY(0)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <div className="animate-fade-in">
          <Logo ref={logoRef} isExiting={isExiting} className="mb-6" />
        </div>
        <div
          className="text-center animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <h1 className="text-3xl font-bold text-[#1a1a1a]">You're all set!</h1>
          <p className="text-lg text-[#666] mt-2">Welcome to Experts Studio</p>
        </div>
      </div>
    </>
  );
}
