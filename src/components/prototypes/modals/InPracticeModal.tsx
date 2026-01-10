import { X } from 'lucide-react';

interface InPracticeModalProps {
  onClose: () => void;
}

export function InPracticeModal({ onClose }: InPracticeModalProps) {
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
          In Practice (3 minutes)
        </h2>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Slide 1 */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Slide 1</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Title</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">The 3-Second Pause Rule</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Content</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[80px]">
                <p className="text-sm text-[#1a1a1a]">Before responding to any stakeholder comment or question, count to three in your head. This brief pause ensures the other person has completely finished their thought, and it gives your brain time to process what was actually said.</p>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Slide 2</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Title</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">The Mirror-Back Method</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Content</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[80px]">
                <p className="text-sm text-[#1a1a1a]">Instead of taking notes on what you plan to say next, write down key phrases the other person uses and reflect them back. For example: "So you mentioned the dashboard feels 'clunky' — can you help me understand what makes it feel that way?"</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Here's how to do it</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">In your next stakeholder conversation, write down one or two exact phrases they use. Repeat them back to confirm understanding.</p>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Slide 3</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Title</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">The Curiosity Check-In</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Content</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[80px]">
                <p className="text-sm text-[#1a1a1a]">Mid-conversation, ask yourself: "Am I still learning something new, or am I waiting for my turn to speak?" If it's the latter, redirect with a follow-up question like "What else should I know about this?"</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Here's how to do it</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">Before responding, ask at least two follow-up questions like "What's important about this to you?" or "What would good look like?"</p>
              </div>
            </div>
          </div>

          {/* Take-Away */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Take-Away</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Title</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">Sofia's Take-Away:</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Content</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a] italic">"Remember, every conversation is a tiny user interview. The stakeholder in front of you is giving you free product research — but only if you're actually listening to receive it."</p>
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
