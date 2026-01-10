import { ChevronRight, Clock, Play } from 'lucide-react';
import { LESSON_ASSETS } from '../LessonPrototype';

type Screen = 'overview' | 'quick-dive' | 'daily-dilemma' | 'in-practice';

interface LessonOverviewProps {
  onNavigate: (screen: Screen) => void;
  onOpenExpertProfile: () => void;
  onOpenWIIFM: () => void;
}

interface ActivityCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

function ActivityCard({ title, description, onClick }: ActivityCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full pr-5 group"
    >
      <div className="flex-1 bg-[#f3ecfd] rounded-xl pl-4 pr-8 py-3 -mr-5 text-left">
        <p className="font-extrabold text-lg leading-tight text-[#1a1a1a]">
          {title}
        </p>
        <p className="text-xs text-[#1a1a1a] tracking-wider mt-1">
          {description}
        </p>
      </div>
      <div className="bg-[#2e0a61] rounded-full p-2 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] -mr-5 group-hover:bg-[#5a14bd] transition-colors">
        <ChevronRight size={24} className="text-white" />
      </div>
    </button>
  );
}

export function LessonOverview({ onNavigate, onOpenExpertProfile, onOpenWIIFM }: LessonOverviewProps) {
  return (
    <div className="flex flex-col h-full bg-[#2e0a61] overflow-y-auto">
      {/* Back button */}
      {/* <button className="absolute top-8 left-6 bg-white rounded-full p-2 shadow-[0px_4px_40px_rgba(0,0,0,0.16)] z-10">
        <ChevronLeft size={24} className="text-[#5a14bd]" />
      </button> */}

      {/* Main content card */}
      <div className="bg-white rounded-3xl mt-40 mx-0 flex-1 relative">
        {/* Avatar - positioned above the card */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
          <div className="w-40 h-40 rounded-full border-8 border-white overflow-hidden">
            <img
              src={LESSON_ASSETS.avatar}
              alt="Sofia Rossi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Lesson details */}
        <div className="pt-24 px-6 pb-6">
          {/* Title section */}
          <div className="text-center mb-4">
            <h1 className="font-extrabold text-[28px] leading-tight text-[#1a1a1a] mb-2">
              Active Listening for Product Managers
            </h1>

            {/* Author badge */}
            <div className="inline-flex items-center gap-1 bg-[#fff5fa] px-4 py-2 rounded-lg">
              <span className="text-sm text-[#4d4d4d]">by</span>
              <button
                onClick={onOpenExpertProfile}
                className="text-sm font-bold text-[#2e0a61] underline hover:opacity-80"
              >
                Sofia Rossi
              </button>
            </div>
          </div>

          {/* Subtitle */}
          <h2 className="font-extrabold text-xl leading-tight text-[#1a1a1a] text-center mb-4">
            Building Trust and Gathering Context Through Better Listening
          </h2>

          {/* Duration and WIIFM */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-1">
              <Clock size={24} className="text-[#5a14bd]" />
              <span className="text-xs font-medium text-[#2e0a61] tracking-wide">15 min</span>
            </div>
            <button
              onClick={onOpenWIIFM}
              className="text-xs font-medium text-[#2e0a61] underline tracking-wide hover:opacity-80"
            >
              what's in it for me?
            </button>
          </div>

          {/* Activities section */}
          <div className="mb-6">
            <h3 className="font-extrabold text-xl text-black px-2 mb-4">
              Activities
            </h3>

            {/* Video thumbnail */}
            <div className="relative mb-3 rounded-2xl overflow-hidden border-[5px] border-white shadow-[0px_4px_8px_rgba(0,0,0,0.24)]">
              <img
                src={LESSON_ASSETS.videoThumbnail}
                alt="Video preview"
                className="w-full aspect-[326/192] object-cover"
              />
              <button className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-[0px_4px_40px_rgba(0,0,0,0.16)]">
                <Play size={24} className="text-[#5a14bd] fill-[#5a14bd]" />
              </button>
            </div>

            {/* Activity cards */}
            <div className="space-y-3 px-0">
              <ActivityCard
                title="Quick Dive"
                description="The essence through the eyes of the expert"
                onClick={() => onNavigate('quick-dive')}
              />
              <ActivityCard
                title="Daily Dilemma"
                description="The expert explains. Will you make the right choices?"
                onClick={() => onNavigate('daily-dilemma')}
              />
              <ActivityCard
                title="In Practice"
                description="Ready for practice? Test your approach"
                onClick={() => onNavigate('in-practice')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recap section */}
      <div className="px-6 py-10 text-center">
        <img
          src={LESSON_ASSETS.completionImage}
          alt="Completion"
          className="w-20 h-20 mx-auto mb-4 object-contain"
        />
        <h3 className="font-extrabold text-xl text-white mb-4">
          Great job! You have completed the lesson.<br />
          Let's recap
        </h3>
        <p className="text-sm text-white leading-relaxed mb-2">
          Active listening for PMs means pausing your inner monologue, asking open-ended questions, and treating every conversation as product discovery. You learned Sofia's four-step framework and practiced recognizing when to stay curious instead of jumping to solutions.
        </p>
        <p className="text-sm text-white leading-relaxed">
          Master this skill, and you'll build stronger stakeholder relationships while uncovering insights that lead to better product decisions.
        </p>
      </div>
    </div>
  );
}
