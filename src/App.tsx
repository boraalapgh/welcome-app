import { useState, useCallback } from 'react';
import { Welcome } from './components/Welcome';
import { OnboardingSlides } from './components/OnboardingSlides';
import { AccountSetup } from './components/AccountSetup';
import { SettingsSidebar } from './components/SettingsSidebar';
import { UserTypeProvider } from './context/UserTypeContext';
import { DebugControlsProvider } from './context/DebugControlsContext';
import { TransitionProvider } from './context/TransitionContext';
import { CelebrationParticles } from './components/CelebrationParticles';
import { CompleteLogo } from './components/CompleteLogo';
import { LevaControlsProvider } from './components/LevaControls';

type Phase = 'welcome' | 'onboarding' | 'setup' | 'complete';

function AppContent() {
  const [phase, setPhase] = useState<Phase>('welcome');

  const handleFlowReset = useCallback(() => {
    setPhase('welcome');
  }, []);

  const handleWelcomeComplete = () => {
    setPhase('onboarding');
  };

  const handleOnboardingComplete = () => {
    setPhase('setup');
  };

  const handleSetupComplete = () => {
    setPhase('complete');
  };

  return (
    <UserTypeProvider onFlowReset={handleFlowReset}>
      <div className="relative w-screen h-screen flex flex-col items-center justify-center">
        {/* Settings Sidebar - Prototype Only */}
        <SettingsSidebar currentPhase={phase} onPhaseChange={setPhase} />

        {/* Persistent background floating elements */}
        <div className="fixed inset-0 opacity-15 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[30vw] h-[30vw] rounded-full blur-[80px] animate-wander-1"
            style={{
              background: 'rgba(234, 0, 4, 1)',
              bottom: '10%',
              right: '20%',
            }}
          />
          <div
            className="absolute w-[25vw] h-[25vw] rounded-full blur-[80px] animate-wander-2"
            style={{
              background: 'rgba(0, 214, 161, 1)',
              top: '15%',
              right: '25%',
            }}
          />
          <div
            className="absolute w-[50vw] h-[50vw] rounded-full blur-[80px] animate-wander-3"
            style={{
              background: 'rgba(250, 197, 65, 1)',
              top: '20%',
              left: '10%',
            }}
          />
        </div>

        {/* Phase-specific content */}
        {phase === 'welcome' && (
          <Welcome onComplete={handleWelcomeComplete} />
        )}
        {phase === 'onboarding' && (
          <OnboardingSlides onComplete={handleOnboardingComplete} />
        )}
        {phase === 'setup' && (
          <AccountSetup onComplete={handleSetupComplete} />
        )}
        {phase === 'complete' && (
          <>
            <CelebrationParticles />
            <div className="flex flex-col items-center z-10 animate-fade-in">
              <CompleteLogo />
              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#1a1a1a]">You're all set!</h1>
                <p className="text-lg text-[#666] mt-2">Welcome to Experts Studio</p>
              </div>
            </div>
          </>
        )}
      </div>
    </UserTypeProvider>
  );
}

function App() {
  return (
    <DebugControlsProvider>
      <LevaControlsProvider>
        <TransitionProvider>
          <AppContent />
        </TransitionProvider>
      </LevaControlsProvider>
    </DebugControlsProvider>
  );
}

export default App;
