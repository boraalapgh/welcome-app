import { ChevronLeft } from 'lucide-react';
import { LESSON_ASSETS } from '../LessonPrototype';

interface QuickDiveProps {
  onBack: () => void;
}

export function QuickDive({ onBack }: QuickDiveProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-6 bg-white rounded-full p-2 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] z-10 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={24} className="text-[#5a14bd]" />
      </button>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pt-20 px-6 pb-8">
        {/* Expert image */}
        <div className="flex justify-center mb-6">
          <img
            src={LESSON_ASSETS.avatar}
            alt="Sofia Rossi"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {/* Main title */}
        <h1 className="font-extrabold text-2xl text-[#1a1a1a] mb-6">
          Why Active Listening Matters More Than You Think?
        </h1>

        {/* Introduction */}
        <p className="text-sm text-[#4d4d4d] leading-relaxed mb-6">
          As product managers, we're trained to be solution-oriented. We analyze problems, build features, and move fast to jump into action. But this eagerness becomes a weakness when we're not actually gathering information.
        </p>

        <p className="text-sm text-[#4d4d4d] leading-relaxed mb-8">
          Active listening isn't just about paying attention — it's a strategic information-gathering disguised as a conversation.
        </p>

        {/* Key Components section */}
        <div className="mb-8">
          <h2 className="font-extrabold text-lg text-[#5a14bd] mb-4">
            Key Components of Active Listening for PMs:
          </h2>
          <ul className="space-y-2 text-sm text-[#4d4d4d]">
            <li className="flex items-start gap-2">
              <span className="text-[#5a14bd] mt-1">•</span>
              <span>Pause your inner monologue: resist the urge to formulate responses while others speak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#5a14bd] mt-1">•</span>
              <span>Listen for emotions and needs, not just facts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#5a14bd] mt-1">•</span>
              <span>Reflect back what you heard to confirm understanding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#5a14bd] mt-1">•</span>
              <span>Stay curious longer than feels comfortable</span>
            </li>
          </ul>
        </div>

        {/* Quote section */}
        <div className="bg-[#f3ecfd] rounded-xl p-6 mb-8">
          <p className="text-lg font-extrabold text-[#2e0a61] leading-relaxed mb-4">
            Active listening is about giving the other person the feeling that their words matter — and that you care enough to reflect them back.
          </p>
          <p className="text-sm text-[#4d4d4d]">— Sofia Rossi</p>
        </div>

        {/* The Theoretical Foundation */}
        <h2 className="font-extrabold text-lg text-[#1a1a1a] mb-4">
          The Theoretical Foundation: Why PMs Struggle with Listening
        </h2>

        <p className="text-sm text-[#4d4d4d] leading-relaxed mb-6">
          The PM Paradox: The same skills that make us effective PMs — pattern recognition, quick problem-solving, and connecting disparate information — can work against us in conversations. We're so eager to achieve and solve problems that we sometimes miss what the other person is actually saying.
        </p>

        <p className="text-sm text-[#4d4d4d] leading-relaxed mb-8">
          Start treating every stakeholder conversation as a product discovery. Just like you wouldn't launch a feature without user research, don't jump to solutions without first truly understanding the problem being presented.
        </p>

        {/* Common PM Traps */}
        <h3 className="font-extrabold text-base text-[#1a1a1a] mb-4">
          Common PM Listening Traps:
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-bold text-xs text-[#5a14bd] mb-1">1/3</p>
            <p className="font-bold text-sm text-[#1a1a1a] mb-2">The Solution Jump</p>
            <p className="text-xs text-[#4d4d4d]">Rushing to fix before understanding</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-bold text-xs text-[#5a14bd] mb-1">2/3</p>
            <p className="font-bold text-sm text-[#1a1a1a] mb-2">The Assumption Trap</p>
            <p className="text-xs text-[#4d4d4d]">Assuming you know the root cause</p>
          </div>
        </div>

        {/* The 4-Step Process */}
        <h2 className="font-extrabold text-lg text-[#1a1a1a] mb-4">
          The Four-Step Active Listening Process:
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#5a14bd] flex items-center justify-center text-white text-xs font-bold shrink-0">1</div>
            <div>
              <p className="font-bold text-sm text-[#1a1a1a]">Pause</p>
              <p className="text-xs text-[#4d4d4d]">Wait 3 seconds before responding</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#5a14bd] flex items-center justify-center text-white text-xs font-bold shrink-0">2</div>
            <div>
              <p className="font-bold text-sm text-[#1a1a1a]">Ask open-ended questions</p>
              <p className="text-xs text-[#4d4d4d]">"What else should I know?"</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#5a14bd] flex items-center justify-center text-white text-xs font-bold shrink-0">3</div>
            <div>
              <p className="font-bold text-sm text-[#1a1a1a]">Paraphrase</p>
              <p className="text-xs text-[#4d4d4d]">"So what I'm hearing is..."</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#5a14bd] flex items-center justify-center text-white text-xs font-bold shrink-0">4</div>
            <div>
              <p className="font-bold text-sm text-[#1a1a1a]">Validate</p>
              <p className="text-xs text-[#4d4d4d]">"That makes sense because..."</p>
            </div>
          </div>
        </div>

        {/* Pro tip */}
        <div className="bg-[#5a14bd] rounded-xl p-6">
          <p className="font-bold text-white mb-2">Pro tip</p>
          <p className="text-sm text-white/90 leading-relaxed">
            Curiosity is your best listening tool. The moment you think you know what someone is going to say, that's when you need to stay curious — it may be that you're misread something.
          </p>
        </div>
      </div>
    </div>
  );
}
