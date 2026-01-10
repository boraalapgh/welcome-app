import { useState } from 'react';
import { PublishDashboard } from './screens/PublishDashboard';
import { GeneralDetailsModal } from './modals/GeneralDetailsModal';
import { ExpertVideoModal } from './modals/ExpertVideoModal';
import { QuickDiveModal } from './modals/QuickDiveModal';
import { DailyDilemmaModal } from './modals/DailyDilemmaModal';
import { InPracticeModal } from './modals/InPracticeModal';
import { ExportModal } from './modals/ExportModal';
import { Toast } from './shared/Toast';

type Modal = 'general-details' | 'expert-video' | 'quick-dive' | 'daily-dilemma' | 'in-practice' | 'export' | null;

export function PublishPrototype() {
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [showToast, setShowToast] = useState(false);

  const openModal = (modal: Modal) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handlePublish = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="relative w-full  mx-auto h-full flex items-center justify-center">
      
        {/* Dashboard screen */}
        <PublishDashboard
          onOpenModal={openModal}
          onPublish={handlePublish}
        />

        {/* Modals */}
        {activeModal === 'general-details' && (
          <GeneralDetailsModal onClose={closeModal} />
        )}
        {activeModal === 'expert-video' && (
          <ExpertVideoModal onClose={closeModal} />
        )}
        {activeModal === 'quick-dive' && (
          <QuickDiveModal onClose={closeModal} />
        )}
        {activeModal === 'daily-dilemma' && (
          <DailyDilemmaModal onClose={closeModal} />
        )}
        {activeModal === 'in-practice' && (
          <InPracticeModal onClose={closeModal} />
        )}
        {activeModal === 'export' && (
          <ExportModal onClose={closeModal} />
        )}

        {/* Toast notification */}
        {showToast && (
          <Toast onClose={handleCloseToast} />
        )}
      
    </div>
  );
}
