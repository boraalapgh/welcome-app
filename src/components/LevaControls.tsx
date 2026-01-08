import { createContext, useContext, ReactNode } from 'react';
import { Leva, useCreateStore, LevaPanel } from 'leva';
import { useDebugControls } from '../context/DebugControlsContext';

// Get the type from useCreateStore return type
type LevaStore = ReturnType<typeof useCreateStore>;

// Context for sharing stores across components
interface LevaStoresContextType {
  logoStore: LevaStore | null;
  particlesStore: LevaStore | null;
  transitionsStore: LevaStore | null;
  slidesStore: LevaStore | null;
}

const LevaStoresContext = createContext<LevaStoresContextType>({
  logoStore: null,
  particlesStore: null,
  transitionsStore: null,
  slidesStore: null,
});

export function useLevaStores() {
  return useContext(LevaStoresContext);
}

interface LevaControlsProviderProps {
  children: ReactNode;
}

/**
 * Provider that creates Leva stores and makes them available via context.
 * Also renders the Leva panels that show/hide based on debug toggles.
 */
export function LevaControlsProvider({ children }: LevaControlsProviderProps) {
  const { isEnabled } = useDebugControls();
  const logoDebug = isEnabled('logo');
  const particlesDebug = isEnabled('particles');
  const transitionsDebug = isEnabled('transitions');
  const slidesDebug = isEnabled('slides');

  // Create separate stores for each element type
  const logoStore = useCreateStore();
  const particlesStore = useCreateStore();
  const transitionsStore = useCreateStore();
  const slidesStore = useCreateStore();

  return (
    <LevaStoresContext.Provider value={{ logoStore, particlesStore, transitionsStore, slidesStore }}>
      {children}

      {/* Logo controls panel */}
      <LevaPanel
        store={logoStore}
        hidden={!logoDebug}
        collapsed={false}
        titleBar={{ title: 'Logo Controls' }}
        theme={{
          sizes: { rootWidth: '320px' },
        }}
      />

      {/* Particles controls panel */}
      <LevaPanel
        store={particlesStore}
        hidden={!particlesDebug}
        collapsed={false}
        titleBar={{ title: 'Particle Controls' }}
        theme={{
          sizes: { rootWidth: '320px' },
        }}
      />

      {/* Page Transitions controls panel */}
      <LevaPanel
        store={transitionsStore}
        hidden={!transitionsDebug}
        collapsed={false}
        titleBar={{ title: 'Page Transition Controls' }}
        theme={{
          sizes: { rootWidth: '320px' },
        }}
      />

      {/* Slide Transitions controls panel */}
      <LevaPanel
        store={slidesStore}
        hidden={!slidesDebug}
        collapsed={false}
        titleBar={{ title: 'Slide Transition Controls' }}
        theme={{
          sizes: { rootWidth: '320px' },
        }}
      />
    </LevaStoresContext.Provider>
  );
}

/**
 * Simple component to render the default Leva panel (for backwards compatibility).
 * Use LevaControlsProvider instead for separate stores.
 */
export function LevaControls() {
  const { isEnabled } = useDebugControls();
  const logoDebug = isEnabled('logo');
  const particlesDebug = isEnabled('particles');
  const showPanel = logoDebug || particlesDebug;

  return <Leva hidden={!showPanel} collapsed={false} />;
}
