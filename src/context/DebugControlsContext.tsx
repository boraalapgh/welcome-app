import { createContext, useContext, useState, type ReactNode } from 'react';

export type DebugElement = 'particles' | 'logo' | 'welcomePauseAuto' | 'transitions' | 'slides';

interface DebugControlsContextType {
  enabledElements: Set<DebugElement>;
  isEnabled: (element: DebugElement) => boolean;
  toggle: (element: DebugElement) => void;
  enable: (element: DebugElement) => void;
  disable: (element: DebugElement) => void;
}

const DebugControlsContext = createContext<DebugControlsContextType | null>(null);

export function DebugControlsProvider({ children }: { children: ReactNode }) {
  const [enabledElements, setEnabledElements] = useState<Set<DebugElement>>(new Set());

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
    <DebugControlsContext.Provider value={{ enabledElements, isEnabled, toggle, enable, disable }}>
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
