import { X } from 'lucide-react';

interface QuickDiveModalProps {
  onClose: () => void;
}

export function QuickDiveModal({ onClose }: QuickDiveModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

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
          Quick Dive (5 minutes)
        </h2>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Intro section */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Intro</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Title</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">Why Active Listening Matters More Than You Think?</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Content</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[80px]">
                <p className="text-sm text-[#1a1a1a] mb-2">Most PMs think they're good listeners, but often miss critical insights because they're mentally preparing their response instead of truly understanding what's being said.</p>
                <p className="text-sm text-[#1a1a1a]">Today we'll cover four essential techniques that will transform how you gather insights in user interviews and stakeholder meetings.</p>
              </div>
            </div>
          </div>

          {/* Quote section */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Quote</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Content</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a] italic">"Active listening is about giving the other person the feeling that their words landed — and that you care enough to reflect them back."</p>
              </div>
            </div>
          </div>

          {/* Key Components section */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Key Components</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">List Title</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">Key Components of Active Listening for PMs</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">List Content</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[100px]">
                <ul className="text-sm text-[#1a1a1a] list-disc pl-4 space-y-1">
                  <li>Pause your inner monologue — resist the urge to formulate responses while others speak.</li>
                  <li>Listen for emotions and needs, not just facts and features</li>
                  <li>Reflect back what you heard to confirm understanding</li>
                  <li>Stay curious longer than feels comfortable</li>
                </ul>
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
