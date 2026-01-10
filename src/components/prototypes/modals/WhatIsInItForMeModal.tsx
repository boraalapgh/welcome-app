import { X } from 'lucide-react';

interface WhatIsInItForMeModalProps {
  onClose: () => void;
}

export function WhatIsInItForMeModal({ onClose }: WhatIsInItForMeModalProps) {
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

        {/* Content */}
        <div className="pr-8">
          <h2 className="font-extrabold text-xl text-[#1a1a1a] mb-4">
            What's in it for me?
          </h2>

          <p className="text-sm text-[#4d4d4d] leading-relaxed">
            As a PM, better listening builds trust with stakeholders, surfaces sharper insights, and helps you solve the right problems faster.
          </p>
        </div>
      </div>
    </div>
  );
}
