import { X } from 'lucide-react';

interface DailyDilemmaModalProps {
  onClose: () => void;
}

export function DailyDilemmaModal({ onClose }: DailyDilemmaModalProps) {
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
          Daily Dilemma (4 minutes)
        </h2>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Intro section */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Intro</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Scenario Setup</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[80px]">
                <p className="text-sm text-[#1a1a1a]">You're in a quarterly planning meeting. Sarah from Sales says: "Look, I know you think this feature is important, but honestly, none of my clients have asked for it. We're losing deals because our core product is still buggy, and you want to add more complexity? I just... I don't see how this helps."</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">The Challenge</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white">
                <p className="text-sm text-[#1a1a1a]">Learners choose how to respond from 3 options:</p>
              </div>
            </div>
          </div>

          {/* Option A */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Option A</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Card Text</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">"But Sarah, the data shows this feature will increase retention by 15%. If we can keep existing customers happy..."</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Feedback</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">You jumped straight into defending your position instead of understanding Sarah's concerns. Notice how this escalates tension?</p>
              </div>
            </div>
          </div>

          {/* Option B */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Option B</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Card Text</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">"I understand your concern about the core product. What specific bugs are your clients reporting?"</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Feedback</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">Good start asking a question, but you focused on data instead of emotions. Sarah is clearly frustrated - address that first.</p>
              </div>
            </div>
          </div>

          {/* Option C */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Option C</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Card Text</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">"Sarah, I can see you're really frustrated about this. It sounds like you're worried we're not prioritizing what your clients actually need. Can you tell me more about what you're hearing from them?"</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Feedback</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">Perfect! You acknowledged her emotion, paraphrased her concern, and opened space for her to share more. This is active listening in action.</p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="space-y-3 pt-3 border-t border-[#e6e6e6]">
            <h3 className="font-extrabold text-base text-[#1a1a1a]">Conclusion</h3>

            <div className="space-y-1">
              <label className="text-sm text-[#1a1a1a]">Follow-up</label>
              <div className="border border-[#1a1a1a] rounded-lg p-2 bg-white min-h-[60px]">
                <p className="text-sm text-[#1a1a1a]">Regardless of choice, scenario continues with Sarah opening up about specific client feedback, and learners practice more techniques.</p>
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
