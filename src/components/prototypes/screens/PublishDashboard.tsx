import { Play, FileText, MessageSquare, ListChecks, Upload } from 'lucide-react';

type Modal = 'general-details' | 'expert-video' | 'quick-dive' | 'daily-dilemma' | 'in-practice' | 'export';

interface PublishDashboardProps {
  onOpenModal: (modal: Modal) => void;
  onPublish: () => void;
}

interface ReviewCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

function ReviewCard({ icon, title, description, onClick, className = '' }: ReviewCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white border border-[#f2f2f2] rounded-2xl p-4 shadow-[0px_2px_8px_rgba(21,21,21,0.1)] flex flex-col gap-3 items-start text-left hover:shadow-[0px_4px_16px_rgba(21,21,21,0.15)] transition-shadow ${className}`}
    >
      <div className="w-10 h-10 bg-[#f3ecfd] rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-extrabold text-sm text-[#1a1a1a]">{title}</h3>
        <p className="text-xs text-[#666] leading-tight">{description}</p>
      </div>
    </button>
  );
}

export function PublishDashboard({ onOpenModal, onPublish }: PublishDashboardProps) {
  return (
    <div className="flex flex-col max-w-[640px] ">
      {/* Header */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-[#f2f2f2]">
        <button
          onClick={() => onOpenModal('export')}
          className="flex items-center gap-1 px-3 py-1.5 border border-[#5a14bd] rounded-lg text-[#5a14bd] text-xs font-extrabold hover:bg-[#f3ecfd] transition-colors"
        >
          <Upload size={14} />
          Export
        </button>
        <button
          onClick={onPublish}
          className="px-4 py-1.5 bg-[#5a14bd] rounded-lg text-white text-xs font-extrabold hover:bg-[#4a10a0] transition-colors"
        >
          Publish
        </button>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {/* General Details - spans full width */}
          <ReviewCard
            icon={<Play size={16} className="text-[#1a1a1a]" />}
            title="General Details"
            description="General settings about the lesson, and upload the lesson's thumbnail."
            onClick={() => onOpenModal('general-details')}
            className="col-span-2"
          />

          {/* Expert Video */}
          <ReviewCard
            icon={<Play size={16} className="text-[#1a1a1a]" />}
            title="Expert Video"
            description="An engaging intro with key insights."
            onClick={() => onOpenModal('expert-video')}
          />

          {/* Quick Dive */}
          <ReviewCard
            icon={<FileText size={16} className="text-[#1a1a1a]" />}
            title="Quick Dive"
            description="Engaging quick dive into active listening techniques."
            onClick={() => onOpenModal('quick-dive')}
          />

          {/* Daily Dilemma */}
          <ReviewCard
            icon={<MessageSquare size={16} className="text-[#1a1a1a]" />}
            title="Daily Dilemma"
            description="Practice 'pause and paraphrase' in scenarios."
            onClick={() => onOpenModal('daily-dilemma')}
          />

          {/* In Practice */}
          <ReviewCard
            icon={<ListChecks size={16} className="text-[#1a1a1a]" />}
            title="In Practice"
            description="3 actionable tips for immediate use"
            onClick={() => onOpenModal('in-practice')}
          />
        </div>
      </div>
    </div>
  );
}
