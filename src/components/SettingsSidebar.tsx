import { useState } from 'react';
import { useUserType } from '../context/UserTypeContext';
import { useDebugControls, type DebugElement, type OnboardingStyle } from '../context/DebugControlsContext';
import { userTypeIds, onboardingContent, type UserTypeId } from '../config/onboarding-content';
import { Switch } from '@/components/ui/switch';

const onboardingStyles: { id: OnboardingStyle; label: string; description: string }[] = [
  { id: 'images', label: 'Images', description: 'Classic carousel with images' },
  { id: 'prototypes', label: 'Prototypes', description: 'Interactive product demos' },
  { id: 'video', label: 'Video', description: 'Looping video clips' },
];

type Phase = 'welcome' | 'onboarding' | 'setup' | 'complete' | 'dashboard';

const phases: Phase[] = ['welcome', 'onboarding', 'setup', 'complete', 'dashboard'];

// Routing destinations per user type (all go to 'dashboard' phase, but content differs)
const userTypeDestinations: Record<UserTypeId, { label: string }> = {
  UT1: { label: 'Experts Studio' },
  UT2: { label: 'Experts Studio' },
  UT3: { label: 'Experts Studio (Restricted)' },
  UT4: { label: 'Learner Panel' },
};

interface SettingsSidebarProps {
  currentPhase: Phase;
  onPhaseChange?: (phase: Phase) => void;
}

const debugElements: { id: DebugElement; label: string; description: string }[] = [
  { id: 'logo', label: 'Logo Controls', description: 'Leva controls for orb (welcome & complete)' },
  { id: 'transitions', label: 'Page Transitions', description: 'Duration & easing for phase changes' },
  { id: 'slides', label: 'Slide Transitions', description: 'Onboarding carousel animation settings' },
  { id: 'dashboard', label: 'Dashboard Animation', description: 'Fade & slide-up animation settings' },
  { id: 'welcomePauseAuto', label: 'Pause Auto-Advance', description: 'Stop welcome from auto-transitioning' },
  { id: 'particles', label: 'Celebration Particles', description: 'Confetti effect on complete phase' },
];

export function SettingsSidebar({ currentPhase, onPhaseChange }: SettingsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [debugOpen, setDebugOpen] = useState(true);
  const { userTypeId, setUserType, resetFlow, config } = useUserType();
  const { isEnabled, toggle, onboardingStyle, setOnboardingStyle } = useDebugControls();

  const handleUserTypeChange = (id: UserTypeId) => {
    setUserType(id);
  };

  const currentPhaseIndex = phases.indexOf(currentPhase);
  const canGoPrev = currentPhaseIndex > 0;
  const canGoNext = currentPhaseIndex < phases.length - 1;

  const handlePrevPhase = () => {
    if (canGoPrev && onPhaseChange) {
      onPhaseChange(phases[currentPhaseIndex - 1]);
    }
  };

  const handleNextPhase = () => {
    if (canGoNext && onPhaseChange) {
      onPhaseChange(phases[currentPhaseIndex + 1]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label={isOpen ? 'Close settings' : 'Open settings'}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">
                Prototype Mode
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Settings</h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6">
          {/* Current Phase with Navigation */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Phase</p>
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevPhase}
                disabled={!canGoPrev || !onPhaseChange}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  canGoPrev && onPhaseChange
                    ? 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Previous phase"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 capitalize">{currentPhase}</p>
                <p className="text-xs text-gray-400">{currentPhaseIndex + 1} / {phases.length}</p>
              </div>
              <button
                onClick={handleNextPhase}
                disabled={!canGoNext || !onPhaseChange}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  canGoNext && onPhaseChange
                    ? 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Next phase"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Onboarding Style Selection */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Onboarding Style</p>
            <div className="flex gap-2">
              {onboardingStyles.map((style) => {
                const isSelected = style.id === onboardingStyle;
                return (
                  <button
                    key={style.id}
                    onClick={() => setOnboardingStyle(style.id)}
                    className={`flex-1 text-center px-3 py-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-[#5a14bd] bg-[#5a14bd]/5'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <p className={`text-sm font-medium ${isSelected ? 'text-[#5a14bd]' : 'text-gray-900'}`}>
                      {style.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">User Type</p>
            <div className="space-y-2">
              {userTypeIds.map((id) => {
                const typeConfig = onboardingContent[id];
                const isSelected = id === userTypeId;
                return (
                  <button
                    key={id}
                    onClick={() => handleUserTypeChange(id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-[#5a14bd] bg-[#5a14bd]/5'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${isSelected ? 'text-[#5a14bd]' : 'text-gray-900'}`}>
                          {typeConfig.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {typeConfig.steps.length} steps &rarr; {userTypeDestinations[id].label}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 bg-[#5a14bd] rounded-full flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Steps Preview */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Active Steps</p>
            <div className="flex flex-wrap gap-2">
              {config.steps.map((step) => (
                <span
                  key={step}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize"
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Debug Elements Dropdown */}
          <div className="mb-6">
            <button
              onClick={() => setDebugOpen(!debugOpen)}
              className="w-full flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider mb-3 hover:text-gray-700 transition-colors"
            >
              <span>Debug Elements</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${debugOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {debugOpen && (
              <div className="space-y-2">
                {debugElements.map((element) => {
                  const enabled = isEnabled(element.id);
                  return (
                    <button
                      key={element.id}
                      onClick={() => toggle(element.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                        enabled
                          ? 'border-[#5a14bd] bg-[#5a14bd]/5'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${enabled ? 'text-[#5a14bd]' : 'text-gray-900'}`}>
                            {element.label}
                          </p>
                          <p className="text-xs text-gray-500">{element.description}</p>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => toggle(element.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          </div>

          {/* Reset Button - Fixed at bottom */}
          <div className="flex-shrink-0 pt-4 border-t border-gray-100 mt-4">
          <button
            onClick={resetFlow}
            className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset Flow
          </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
