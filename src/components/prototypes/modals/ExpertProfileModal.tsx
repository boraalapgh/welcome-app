import { X, Sparkles, Briefcase } from 'lucide-react';

interface ExpertProfileModalProps {
  onClose: () => void;
}

export function ExpertProfileModal({ onClose }: ExpertProfileModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-2xl mx-6 p-6 w-full max-w-sm shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#2e0a61] rounded-full p-1.5 hover:bg-[#5a14bd] transition-colors"
        >
          <X size={16} className="text-white" />
        </button>

        {/* Expert info */}
        <div className="pr-8">
          <h2 className="font-extrabold text-2xl text-[#1a1a1a] mb-4">
            Sofie Rossie
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-[#5a14bd] mt-0.5 shrink-0" />
              <p className="text-sm text-[#1a1a1a]">
                <span className="font-bold">More than 10 years</span> of experience in Product Management
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Briefcase size={16} className="text-[#5a14bd] mt-0.5 shrink-0" />
              <p className="text-sm text-[#1a1a1a] font-bold">
                Senior Product Manager
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
