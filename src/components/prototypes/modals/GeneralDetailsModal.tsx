import { X, Upload } from 'lucide-react';

interface GeneralDetailsModalProps {
  onClose: () => void;
}

export function GeneralDetailsModal({ onClose }: GeneralDetailsModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 w-full h-full" onClick={onClose} />

      {/* Modal content */}
      <div className="relative bg-white rounded-2xl mx-3 p-5 w-full max-h-[90%] overflow-hidden flex flex-col shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <X size={18} className="text-[#5a14bd]" />
        </button>

        {/* Title */}
        <h2 className="font-extrabold text-lg text-[#1a1a1a] mb-4 pr-8">
          General Details
        </h2>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Lesson Card section */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Lesson Card</h3>

            {/* Upload zone */}
            <div className="border border-dashed border-[#b3b3b3] rounded-lg bg-[#f2f2f2] p-6 flex flex-col items-center justify-center gap-2">
              <Upload size={20} className="text-[#4d4d4d]" />
              <p className="text-sm text-[#666] text-center">
                Click to upload or drag and drop
              </p>
            </div>

            <p className="text-xs text-[#1a1a1a]">
              <span className="font-bold">Guidelines:</span> 1920x1080 or 4:3 ratio
            </p>
          </div>

          {/* Details section */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Details</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Title</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">Active Listening for Product Managers</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Subtitle</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">Building Trust and Gathering Context Through Better Listening</p>
              </div>
            </div>
          </div>

          {/* Sub Sections */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Sub Sections</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">What is in it for me?</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">As a PM, better listening builds trust with stakeholders, surfaces sharper insights, and helps you solve the right problems faster.</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Recap</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[80px]">
                <p className="text-sm text-[#1a1a1a] mb-2">Active listening for PMs means pausing your inner monologue, asking open-ended questions, and treating every conversation as product discovery.</p>
                <p className="text-sm text-[#1a1a1a]">Master this skill, and you'll build stronger stakeholder relationships while uncovering insights that lead to better product decisions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Button group */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#f2f2f2]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5a14bd] rounded-lg text-white text-sm font-extrabold hover:bg-[#4a10a0] transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#5a14bd] rounded-lg text-[#5a14bd] text-sm font-extrabold hover:bg-[#f3ecfd] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
