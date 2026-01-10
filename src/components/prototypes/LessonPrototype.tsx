import { useState } from 'react';
import { LessonOverview } from './screens/LessonOverview';
import { QuickDive } from './screens/QuickDive';
import { DailyDilemma } from './screens/DailyDilemma';
import { InPractice } from './screens/InPractice';
import { ExpertProfileModal } from './modals/ExpertProfileModal';
import { WhatIsInItForMeModal } from './modals/WhatIsInItForMeModal';
import { PhoneFrame } from './shared/PhoneFrame';

type Screen = 'overview' | 'quick-dive' | 'daily-dilemma' | 'in-practice';
type Modal = 'expert-profile' | 'wiifm' | null;

// Asset URLs from Figma (expire in 7 days)
export const LESSON_ASSETS = {
  avatar: 'https://www.figma.com/api/mcp/asset/aeae864a-1e62-424f-99ef-d21fd2d3e80e',
  videoThumbnail: 'https://www.figma.com/api/mcp/asset/515e78a2-e4ce-48de-babf-f0cb5e25cce5',
  completionImage: 'https://www.figma.com/api/mcp/asset/65e8d4f3-7f9c-45f9-89a0-083b2a7ad490',
};

export function LessonPrototype() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('overview');
  const [activeModal, setActiveModal] = useState<Modal>(null);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setCurrentScreen('overview');
  };

  const openModal = (modal: Modal) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <PhoneFrame>
      {/* Screen content */}
      {currentScreen === 'overview' && (
        <LessonOverview
          onNavigate={navigateTo}
          onOpenExpertProfile={() => openModal('expert-profile')}
          onOpenWIIFM={() => openModal('wiifm')}
        />
      )}
      {currentScreen === 'quick-dive' && (
        <QuickDive onBack={goBack} />
      )}
      {currentScreen === 'daily-dilemma' && (
        <DailyDilemma onBack={goBack} />
      )}
      {currentScreen === 'in-practice' && (
        <InPractice onBack={goBack} />
      )}

      {/* Modals */}
      {activeModal === 'expert-profile' && (
        <ExpertProfileModal onClose={closeModal} />
      )}
      {activeModal === 'wiifm' && (
        <WhatIsInItForMeModal onClose={closeModal} />
      )}
    </PhoneFrame>
  );
}
