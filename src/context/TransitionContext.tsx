import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useControls, folder, button } from 'leva';
import { useLevaStores } from '../components/LevaControls';
import {
  persistedTransitionValues,
  persistTransitionValues,
  clearTransitionValues,
} from '../stores/levaStores';

// Easing function options
export const easingOptions = {
  'ease-out': 'ease-out',
  'ease-in': 'ease-in',
  'ease-in-out': 'ease-in-out',
  'linear': 'linear',
} as const;

export type EasingType = keyof typeof easingOptions;

interface PageTransitionSettings {
  pageEnterDuration: number;
  pageExitDuration: number;
  pageEasing: EasingType;
  pageScaleFrom: number;
}

interface TransitionContextType extends PageTransitionSettings {
  // Helper to generate CSS transition string
  getPageTransition: () => string;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const { transitionsStore } = useLevaStores();

  // Get persisted values or use defaults
  const p = persistedTransitionValues as Record<string, unknown> | null;

  // Build store option - only include if store is available
  const storeOption = transitionsStore ? { store: transitionsStore } : {};

  // Page transition controls (global - used by all phase components)
  const pageControls = useControls('Page Transitions', {
    timing: folder({
      pageEnterDuration: {
        value: (p?.pageEnterDuration as number) ?? 300,
        min: 100,
        max: 1000,
        step: 50,
        label: 'Enter Duration (ms)',
      },
      pageExitDuration: {
        value: (p?.pageExitDuration as number) ?? 300,
        min: 100,
        max: 1000,
        step: 50,
        label: 'Exit Duration (ms)',
      },
      pageEasing: {
        value: (p?.pageEasing as EasingType) ?? 'ease-out',
        options: easingOptions,
        label: 'Easing',
      },
    }),
    transform: folder({
      pageScaleFrom: {
        value: (p?.pageScaleFrom as number) ?? 0.98,
        min: 0.8,
        max: 1,
        step: 0.01,
        label: 'Scale From',
      },
    }, { collapsed: true }),
  }, storeOption);

  // Actions buttons
  useControls('Page Actions', {
    'Reset Page Transitions': button(() => {
      clearTransitionValues();
      window.location.reload();
    }),
    'Copy Values': button(() => {
      const exportData = {
        pageTransitions: {
          enterDuration: pageControls.pageEnterDuration,
          exitDuration: pageControls.pageExitDuration,
          easing: pageControls.pageEasing,
          scaleFrom: pageControls.pageScaleFrom,
        },
      };
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      console.log('Exported page transition values:', exportData);
      alert('Page transition values copied to clipboard! Check console for details.');
    }),
  }, storeOption);

  // Persist values on change
  useEffect(() => {
    const values = {
      pageEnterDuration: pageControls.pageEnterDuration,
      pageExitDuration: pageControls.pageExitDuration,
      pageEasing: pageControls.pageEasing,
      pageScaleFrom: pageControls.pageScaleFrom,
    };
    persistTransitionValues(values);
  }, [pageControls]);

  // Helper function
  const getPageTransition = () =>
    `all ${pageControls.pageEnterDuration}ms ${pageControls.pageEasing}`;

  const contextValue: TransitionContextType = {
    pageEnterDuration: pageControls.pageEnterDuration,
    pageExitDuration: pageControls.pageExitDuration,
    pageEasing: pageControls.pageEasing,
    pageScaleFrom: pageControls.pageScaleFrom,
    getPageTransition,
  };

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitions() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitions must be used within a TransitionProvider');
  }
  return context;
}
