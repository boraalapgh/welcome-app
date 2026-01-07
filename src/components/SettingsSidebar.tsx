import { useState } from 'react';
import { useUserType } from '../context/UserTypeContext';
import { userTypeIds, onboardingContent, type UserTypeId } from '../config/onboarding-content';

interface SettingsSidebarProps {
  currentPhase: string;
}

export function SettingsSidebar({ currentPhase }: SettingsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { userTypeId, setUserType, resetFlow, config } = useUserType();

  const handleUserTypeChange = (id: UserTypeId) => {
    setUserType(id);
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
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">
                Prototype Mode
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Settings</h2>
          </div>

          {/* Current State */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Phase</p>
            <p className="text-sm font-medium text-gray-900 capitalize">{currentPhase}</p>
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
                          {typeConfig.steps.length} steps
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

          {/* Spacer */}
          <div className="flex-1" />

          {/* Reset Button */}
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
