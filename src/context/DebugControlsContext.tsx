import { createContext, useContext, useState, type ReactNode } from 'react';

export type DebugElement = 'particles' | 'logo' | 'welcomePauseAuto' | 'transitions' | 'slides' | 'dashboard';
export type OnboardingStyle = 'images' | 'prototypes' | 'video';

const ONBOARDING_STYLE_KEY = 'onboarding-style';

function getStoredOnboardingStyle(): OnboardingStyle {
  const stored = localStorage.getItem(ONBOARDING_STYLE_KEY);
  if (stored === 'images' || stored === 'prototypes' || stored === 'video') {
    return stored;
  }
  return 'prototypes';
}

interface DebugControlsContextType {
  enabledElements: Set<DebugElement>;
  isEnabled: (element: DebugElement) => boolean;
  toggle: (element: DebugElement) => void;
  enable: (element: DebugElement) => void;
  disable: (element: DebugElement) => void;
  onboardingStyle: OnboardingStyle;
  setOnboardingStyle: (style: OnboardingStyle) => void;
}

const DebugControlsContext = createContext<DebugControlsContextType | null>(null);

export function DebugControlsProvider({ children }: { children: ReactNode }) {
  const [enabledElements, setEnabledElements] = useState<Set<DebugElement>>(new Set());
  const [onboardingStyle, setOnboardingStyleState] = useState<OnboardingStyle>(getStoredOnboardingStyle);

  const setOnboardingStyle = (style: OnboardingStyle) => {
    setOnboardingStyleState(style);
    localStorage.setItem(ONBOARDING_STYLE_KEY, style);
  };

  const isEnabled = (element: DebugElement) => enabledElements.has(element);

  const toggle = (element: DebugElement) => {
    setEnabledElements((prev) => {
      const next = new Set(prev);
      if (next.has(element)) {
        next.delete(element);
      } else {
        next.add(element);
      }
      return next;
    });
  };

  const enable = (element: DebugElement) => {
    setEnabledElements((prev) => new Set(prev).add(element));
  };

  const disable = (element: DebugElement) => {
    setEnabledElements((prev) => {
      const next = new Set(prev);
      next.delete(element);
      return next;
    });
  };

  return (
    <DebugControlsContext.Provider value={{ enabledElements, isEnabled, toggle, enable, disable, onboardingStyle, setOnboardingStyle }}>
      {children}
    </DebugControlsContext.Provider>
  );
}

export function useDebugControls() {
  const context = useContext(DebugControlsContext);
  if (!context) {
    throw new Error('useDebugControls must be used within a DebugControlsProvider');
  }
  return context;
}
