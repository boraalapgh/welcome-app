import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  onClose: () => void;
  autoHideDuration?: number;
}

export function Toast({ onClose, autoHideDuration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [onClose, autoHideDuration]);

  return (
    <div className="absolute bottom-4 right-4 left-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-[#5a14bd] rounded-lg p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={20} className="text-white shrink-0" />
          <p className="flex-1 font-bold text-sm text-white">
            Lesson is Published
          </p>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-white/90 pl-7">
          Active Listening lesson has been published and available for learners
        </p>
      </div>
    </div>
  );
}
