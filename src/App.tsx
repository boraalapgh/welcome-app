import { useState, useCallback } from 'react';
import { Welcome } from './components/Welcome';
import { OnboardingSlides } from './components/OnboardingSlides';
import { OnboardingSlidesV2 } from './components/OnboardingSlidesV2';
import { OnboardingSlidesV3 } from './components/OnboardingSlidesV3';
import { AccountSetup } from './components/AccountSetup';
import { Complete } from './components/Complete';
import { Dashboard } from './components/Dashboard';
import { LearnerPanel } from './components/LearnerPanel';
import { SettingsSidebar } from './components/SettingsSidebar';
import { BlurredBackground } from './components/BlurredBackground';
import { UserTypeProvider, useUserType } from './context/UserTypeContext';
import { DebugControlsProvider, useDebugControls } from './context/DebugControlsContext';
import { TransitionProvider } from './context/TransitionContext';
import { LevaControlsProvider } from './components/LevaControls';

type Phase = 'welcome' | 'onboarding' | 'setup' | 'complete' | 'dashboard';

// Inner component that has access to UserType and DebugControls context
function PhaseRenderer({
  phase,
  onPhaseChange,
}: {
  phase: Phase;
  onPhaseChange: (phase: Phase) => void;
}) {
  const { userTypeId } = useUserType();
  const { onboardingStyle } = useDebugControls();

  const handleWelcomeComplete = () => {
    onPhaseChange('onboarding');
  };

  const handleOnboardingComplete = () => {
    onPhaseChange('setup');
  };

  const handleSetupComplete = () => {
    onPhaseChange('complete');
  };

  const handleCompleteFinished = () => {
    onPhaseChange('dashboard');
  };

  // Determine if user should see Learner Panel or Experts Studio based on user type
  const isLearner = userTypeId === 'UT4';

  return (
    <>
      {phase === 'welcome' && (
        <Welcome onComplete={handleWelcomeComplete} />
      )}
      {phase === 'onboarding' && (
        onboardingStyle === 'video'
          ? <OnboardingSlidesV3 onComplete={handleOnboardingComplete} />
          : onboardingStyle === 'prototypes'
            ? <OnboardingSlidesV2 onComplete={handleOnboardingComplete} />
            : <OnboardingSlides onComplete={handleOnboardingComplete} />
      )}
      {phase === 'setup' && (
        <AccountSetup onComplete={handleSetupComplete} />
      )}
      {phase === 'complete' && (
        <Complete onComplete={handleCompleteFinished} />
      )}
      {/* Dashboard phase shows different content based on user type */}
      {phase === 'dashboard' && (
        isLearner ? <LearnerPanel /> : <Dashboard />
      )}
    </>
  );
}

function AppContent() {
  const [phase, setPhase] = useState<Phase>('welcome');

  const handleFlowReset = useCallback(() => {
    setPhase('welcome');
  }, []);

  return (
    <UserTypeProvider onFlowReset={handleFlowReset}>
      <div className="relative w-screen lg:h-screen flex flex-col items-center justify-center">
        {/* Settings Sidebar - Prototype Only */}
        <SettingsSidebar currentPhase={phase} onPhaseChange={setPhase} />

        {/* Persistent background floating elements */}
        <BlurredBackground />

        {/* Phase-specific content */}
        <PhaseRenderer phase={phase} onPhaseChange={setPhase} />
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
