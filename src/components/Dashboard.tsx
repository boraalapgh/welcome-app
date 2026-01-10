import { useState, useEffect } from 'react';
import { useControls, folder, button } from 'leva';
import { useLevaStores } from './LevaControls';
import { useUserType } from '@/context/UserTypeContext';
import { Search, User, Calendar, ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Send, Info } from 'lucide-react';
import {
  persistedDashboardValues,
  persistDashboardValues,
  clearDashboardValues,
} from '../stores/levaStores';
import expertsLogo from '@/assets/expertslogo.svg';

// Expert Logo using imported SVG
function ExpertLogo({ className }: { className?: string }) {
  return (
    <img src={expertsLogo} alt="GoodHabitz Experts" className={className} />
  );
}

interface LessonItem {
  id: string;
  author: string;
  title: string;
  date: string;
  status: 'draft' | 'published';
  progress: number; // 0-4 representing steps
}

// 48 lesson cards data
const mockLessons: LessonItem[] = [
  // Page 1 (1-12)
  { id: '1', author: 'John D', title: 'Active Listening', date: 'Nov 8, 2025', status: 'draft', progress: 4 },
  { id: '2', author: 'Ben L', title: 'Giving & Receiving Feedback', date: 'Nov 8, 2025', status: 'draft', progress: 4 },
  { id: '3', author: 'Chloe T', title: 'Emotional Intelligence', date: 'Nov 7, 2025', status: 'draft', progress: 3 },
  { id: '4', author: 'David H', title: 'Persuasion & Negotiation', date: 'Nov 7, 2025', status: 'draft', progress: 2 },
  { id: '5', author: 'Sam P', title: 'Time Management & Prioritization', date: 'Nov 6, 2025', status: 'draft', progress: 1 },
  { id: '6', author: 'Alex R', title: 'Teamwork & Collaboration', date: 'Nov 6, 2025', status: 'draft', progress: 1 },
  { id: '7', author: 'Aisha K', title: 'Adaptability & Flexibility', date: 'Nov 5, 2025', status: 'published', progress: 5 },
  { id: '8', author: 'Kenji T', title: 'Data Analysis Fundamentals', date: 'Nov 5, 2025', status: 'published', progress: 5 },
  { id: '9', author: 'Aisha B', title: 'Project Management Basics', date: 'Nov 4, 2025', status: 'published', progress: 5 },
  { id: '10', author: 'Maria G', title: 'Conflict Resolution', date: 'Nov 4, 2025', status: 'draft', progress: 3 },
  { id: '11', author: 'Tom W', title: 'Public Speaking Skills', date: 'Nov 3, 2025', status: 'published', progress: 5 },
  { id: '12', author: 'Lisa M', title: 'Critical Thinking', date: 'Nov 3, 2025', status: 'draft', progress: 2 },
  // Page 2 (13-24)
  { id: '13', author: 'James K', title: 'Leadership Essentials', date: 'Nov 2, 2025', status: 'published', progress: 5 },
  { id: '14', author: 'Emma S', title: 'Customer Service Excellence', date: 'Nov 2, 2025', status: 'draft', progress: 4 },
  { id: '15', author: 'Ryan P', title: 'Problem Solving Techniques', date: 'Nov 1, 2025', status: 'draft', progress: 3 },
  { id: '16', author: 'Sophie L', title: 'Communication Strategies', date: 'Nov 1, 2025', status: 'published', progress: 5 },
  { id: '17', author: 'Chris B', title: 'Remote Work Best Practices', date: 'Oct 31, 2025', status: 'draft', progress: 2 },
  { id: '18', author: 'Nina R', title: 'Design Thinking Basics', date: 'Oct 31, 2025', status: 'published', progress: 5 },
  { id: '19', author: 'Mark T', title: 'Agile Methodology', date: 'Oct 30, 2025', status: 'draft', progress: 1 },
  { id: '20', author: 'Helen C', title: 'Stress Management', date: 'Oct 30, 2025', status: 'published', progress: 5 },
  { id: '21', author: 'Paul D', title: 'Presentation Skills', date: 'Oct 29, 2025', status: 'draft', progress: 4 },
  { id: '22', author: 'Julia F', title: 'Networking Strategies', date: 'Oct 29, 2025', status: 'published', progress: 5 },
  { id: '23', author: 'Kevin H', title: 'Decision Making Framework', date: 'Oct 28, 2025', status: 'draft', progress: 3 },
  { id: '24', author: 'Anna J', title: 'Creative Problem Solving', date: 'Oct 28, 2025', status: 'published', progress: 5 },
  // Page 3 (25-36)
  { id: '25', author: 'Mike L', title: 'Meeting Facilitation', date: 'Oct 27, 2025', status: 'draft', progress: 2 },
  { id: '26', author: 'Rachel N', title: 'Coaching & Mentoring', date: 'Oct 27, 2025', status: 'published', progress: 5 },
  { id: '27', author: 'Steve O', title: 'Change Management', date: 'Oct 26, 2025', status: 'draft', progress: 1 },
  { id: '28', author: 'Diana Q', title: 'Work-Life Balance', date: 'Oct 26, 2025', status: 'published', progress: 5 },
  { id: '29', author: 'George S', title: 'Digital Literacy', date: 'Oct 25, 2025', status: 'draft', progress: 4 },
  { id: '30', author: 'Mia T', title: 'Cross-Cultural Communication', date: 'Oct 25, 2025', status: 'published', progress: 5 },
  { id: '31', author: 'Brian U', title: 'Productivity Hacks', date: 'Oct 24, 2025', status: 'draft', progress: 3 },
  { id: '32', author: 'Claire V', title: 'Interview Techniques', date: 'Oct 24, 2025', status: 'published', progress: 5 },
  { id: '33', author: 'Derek W', title: 'Personal Branding', date: 'Oct 23, 2025', status: 'draft', progress: 2 },
  { id: '34', author: 'Fiona X', title: 'Goal Setting Methods', date: 'Oct 23, 2025', status: 'published', progress: 5 },
  { id: '35', author: 'Henry Y', title: 'Delegation Skills', date: 'Oct 22, 2025', status: 'draft', progress: 1 },
  { id: '36', author: 'Isabel Z', title: 'Workplace Ethics', date: 'Oct 22, 2025', status: 'published', progress: 5 },
  // Page 4 (37-48)
  { id: '37', author: 'Jack A', title: 'Negotiation Mastery', date: 'Oct 21, 2025', status: 'draft', progress: 4 },
  { id: '38', author: 'Kate B', title: 'Emotional Resilience', date: 'Oct 21, 2025', status: 'published', progress: 5 },
  { id: '39', author: 'Leo C', title: 'Strategic Planning', date: 'Oct 20, 2025', status: 'draft', progress: 3 },
  { id: '40', author: 'Monica D', title: 'Feedback Culture', date: 'Oct 20, 2025', status: 'published', progress: 5 },
  { id: '41', author: 'Nathan E', title: 'Innovation Mindset', date: 'Oct 19, 2025', status: 'draft', progress: 2 },
  { id: '42', author: 'Olivia F', title: 'Team Building Activities', date: 'Oct 19, 2025', status: 'published', progress: 5 },
  { id: '43', author: 'Peter G', title: 'Conflict Prevention', date: 'Oct 18, 2025', status: 'draft', progress: 1 },
  { id: '44', author: 'Quinn H', title: 'Inclusive Leadership', date: 'Oct 18, 2025', status: 'published', progress: 5 },
  { id: '45', author: 'Ruby I', title: 'Time Blocking Technique', date: 'Oct 17, 2025', status: 'draft', progress: 4 },
  { id: '46', author: 'Simon J', title: 'Effective Delegation', date: 'Oct 17, 2025', status: 'published', progress: 5 },
  { id: '47', author: 'Tina K', title: 'Growth Mindset', date: 'Oct 16, 2025', status: 'draft', progress: 3 },
  { id: '48', author: 'Victor L', title: 'Continuous Learning', date: 'Oct 16, 2025', status: 'published', progress: 5 },
];

type StatusFilter = 'all' | 'published' | 'draft';
const ITEMS_PER_PAGE = 12;

function StatusBadge({ status }: { status: 'draft' | 'published' }) {
  const isDraft = status === 'draft';
  return (
    <span
      className={`px-3 py-0.5 rounded text-xs tracking-[0.5px] ${
        isDraft
          ? 'bg-[#e9f9fb] text-[#0f4f58]'
          : 'bg-[#effaeb] text-[#2e661a]'
      }`}
    >
      {isDraft ? 'Draft' : 'Published'}
    </span>
  );
}

function StepIndicator({ progress }: { progress: number }) {
  // progress: 1-4 for in-progress, 5 for complete
  const percentage = progress >= 5 ? 100 : (progress / 4) * 100;
  return (
    <div className="h-1 w-full bg-[#f2f2f2] rounded-b overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#f2f2f2] to-[#b3b3b3]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function LessonCard({ lesson, style }: { lesson: LessonItem; style?: React.CSSProperties }) {
  return (
    <div
      className="bg-white border border-[#e6e6e6] rounded-lg overflow-hidden min-w-[344px] flex flex-col"
      style={style}
    >
      <div className="flex flex-col gap-0.5 px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="flex-1 text-sm text-[#666] leading-[21px]">{lesson.author}</span>
          <StatusBadge status={lesson.status} />
          <button className="p-1 rounded hover:bg-[#f3ecfd] transition-colors">
            <MoreVertical size={24} className="text-[#5a14bd]" />
          </button>
        </div>
        <div className="pt-3 min-h-[56px] flex items-end">
          <p className="font-bold text-base text-[#1a1a1a] leading-6">{lesson.title}</p>
        </div>
        <p className="text-xs text-[#666] leading-[18px]">{lesson.date}</p>
      </div>
      <StepIndicator progress={lesson.progress} />
    </div>
  );
}

// Extract unique authors from lessons
const uniqueAuthors = Array.from(new Set(mockLessons.map((lesson) => lesson.author))).sort();

export function Dashboard() {
  const { dashboardStore } = useLevaStores();
  const { userTypeId } = useUserType();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkMode, setBulkMode] = useState(false);
  const [userFilter, setUserFilter] = useState<string>('all');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Feature restrictions: Content Owners (UT3) don't see bulk actions and user filter
  const isContentOwner = userTypeId === 'UT3';

  // Filter lessons based on search, status, and user
  const filteredLessons = mockLessons.filter((lesson) => {
    const matchesSearch = searchQuery === '' ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
    const matchesUser = userFilter === 'all' || lesson.author === userFilter;
    return matchesSearch && matchesStatus && matchesUser;
  });

  // Paginate filtered results
  const totalFilteredPages = Math.ceil(filteredLessons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLessons = filteredLessons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleUserChange = (user: string) => {
    setUserFilter(user);
    setUserDropdownOpen(false);
    setCurrentPage(1);
  };

  // Get persisted values or use defaults
  const p = persistedDashboardValues as Record<string, unknown> | null;

  // Build store option
  const storeOption = dashboardStore ? { store: dashboardStore } : {};

  // Default animation values
  const defaults = {
    fadeInDuration: 600,
    slideUpDistance: 30,
    staggerDelay: 100,
    easing: 'ease-out',
  };

  // Leva controls for dashboard animations
  const animControls = useControls('Dashboard Animation', {
    entrance: folder({
      fadeInDuration: {
        value: (p?.fadeInDuration as number) ?? defaults.fadeInDuration,
        min: 100,
        max: 2000,
        step: 50,
        label: 'Fade Duration (ms)',
      },
      slideUpDistance: {
        value: (p?.slideUpDistance as number) ?? defaults.slideUpDistance,
        min: 0,
        max: 100,
        step: 5,
        label: 'Slide Distance (px)',
      },
      staggerDelay: {
        value: (p?.staggerDelay as number) ?? defaults.staggerDelay,
        min: 0,
        max: 300,
        step: 10,
        label: 'Stagger Delay (ms)',
      },
    }),
  }, storeOption);

  // Actions buttons
  useControls('Actions', {
    'Reset Dashboard': button(() => {
      clearDashboardValues();
      window.location.reload();
    }),
    'Copy Values': button(() => {
      const exportData = {
        dashboard: {
          fadeInDuration: animControls.fadeInDuration,
          slideUpDistance: animControls.slideUpDistance,
          staggerDelay: animControls.staggerDelay,
        },
      };
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      console.log('Exported dashboard values:', exportData);
      alert('Dashboard values copied to clipboard!');
    }),
  }, storeOption);

  // Persist values on change
  useEffect(() => {
    persistDashboardValues({
      fadeInDuration: animControls.fadeInDuration,
      slideUpDistance: animControls.slideUpDistance,
      staggerDelay: animControls.staggerDelay,
    });
  }, [animControls]);

  // Trigger mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Animation helper
  const getAnimationStyle = (index: number): React.CSSProperties => ({
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'translateY(0)' : `translateY(${animControls.slideUpDistance}px)`,
    transition: `opacity ${animControls.fadeInDuration}ms ease-out, transform ${animControls.fadeInDuration}ms ease-out`,
    transitionDelay: `${index * animControls.staggerDelay}ms`,
  });

  return (
    <div className="relative w-full h-full overflow-auto">
      {/* Header */}
      <div
        className="fixed top-0 right-0 left-0 h-20 flex items-center justify-end px-8 z-20"
        style={getAnimationStyle(0)}
      >
        <div className="w-10 h-10 rounded-full bg-[#e6e6e6] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-[#5a14bd] to-[#9c43fe]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center max-w-[1280px] mx-auto px-8 pt-[168px] pb-[160px] gap-32">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-16">
          {/* Logo */}
          <div style={getAnimationStyle(1)}>
            <ExpertLogo className="h-12 w-auto" />
          </div>

          {/* Header Text */}
          <div className="flex flex-col items-center gap-6" style={getAnimationStyle(2)}>
            <div className="text-center">
              <p className="text-[22px] font-extrabold text-[#1a1a1a] leading-[26.4px]">
                Turn Internal Expertise Into
              </p>
              <p className="text-[22px] font-extrabold text-[#1a1a1a] leading-[26.4px]">
                High-Quality Training
              </p>
            </div>
            <p className="text-lg font-extrabold text-[#666] leading-[21.6px]">
              Create short and engaging training in a few simple steps
            </p>
          </div>

          {/* Task Input */}
          <div className="flex flex-col items-center pb-4" style={getAnimationStyle(3)}>
            <div className="w-[770px] h-[222px] bg-white border border-[#f3f3f3] rounded-3xl shadow-[2px_2px_3px_0px_rgba(0,0,0,0.04),1px_3px_20px_0px_rgba(21,21,21,0.07)] p-6 pb-2 flex gap-2 items-end relative z-10 -mb-4">
              <p className="flex-1 text-base text-[#666] leading-6">
                Help me create a lesson about documenting key decisions for future teams...
              </p>
              <button className="p-2 rounded-full bg-[#e6e6e6]">
                <Send size={24} className="text-[#666]" />
              </button>
            </div>
            <div className="w-[calc(100%-64px)] bg-[#e9f9fb] rounded-b-3xl shadow-[0px_2px_8px_0px_rgba(21,21,21,0.1)] px-0 pt-6 pb-2 flex items-center justify-center gap-2">
              <Info size={24} className="text-[#07282c]" />
              <p className="text-xs text-[#07282c] tracking-[0.5px]">
                You can write in any language, but you may get better results in English.
              </p>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="w-full flex flex-col gap-6" style={getAnimationStyle(4)}>
          {/* Lessons Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-[25px] font-extrabold text-[#666] leading-[30px]">Lessons</h2>
            {/* Bulk toggle - hidden for Content Owners (UT3) */}
            {!isContentOwner && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#1a1a1a]">Bulk</span>
                <button
                  onClick={() => setBulkMode(!bulkMode)}
                  className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${
                    bulkMode ? 'bg-[#5a14bd] justify-end' : 'bg-[#e6e6e6] justify-start'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full transition-colors ${
                    bulkMode ? 'bg-white' : 'bg-white'
                  }`} />
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 justify-end" style={getAnimationStyle(5)}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#1a1a1a]">Status</span>
              <div className="flex bg-white border border-[#e6e6e6] rounded-xl p-1 gap-1">
                <button
                  onClick={() => handleStatusChange('all')}
                  className={`px-3 py-0.5 rounded-lg text-base transition-colors ${
                    statusFilter === 'all' ? 'bg-[#5a14bd] text-white' : 'text-[#4d4d4d] hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleStatusChange('published')}
                  className={`px-3 py-0.5 rounded-lg text-base transition-colors ${
                    statusFilter === 'published' ? 'bg-[#5a14bd] text-white' : 'text-[#4d4d4d] hover:bg-gray-100'
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => handleStatusChange('draft')}
                  className={`px-3 py-0.5 rounded-lg text-base transition-colors ${
                    statusFilter === 'draft' ? 'bg-[#5a14bd] text-white' : 'text-[#4d4d4d] hover:bg-gray-100'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>
            {/* User filter dropdown - hidden for Content Owners (UT3) */}
            {!isContentOwner && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e6e6e6] rounded-lg h-9 min-w-[160px] justify-between"
                >
                  <div className="flex items-center gap-1">
                    <User size={20} className="text-[#1a1a1a]" />
                    <span className="text-sm text-[#1a1a1a] truncate max-w-[100px]">
                      {userFilter === 'all' ? 'All Users' : userFilter}
                    </span>
                  </div>
                  <ChevronDown size={20} className={`text-[#1a1a1a] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {userDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#e6e6e6] rounded-lg shadow-lg z-50 max-h-[240px] overflow-y-auto">
                    <button
                      onClick={() => handleUserChange('all')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-[#f3ecfd] transition-colors ${
                        userFilter === 'all' ? 'bg-[#f3ecfd] text-[#5a14bd] font-medium' : 'text-[#1a1a1a]'
                      }`}
                    >
                      All Users
                    </button>
                    {uniqueAuthors.map((author) => (
                      <button
                        key={author}
                        onClick={() => handleUserChange(author)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#f3ecfd] transition-colors ${
                          userFilter === author ? 'bg-[#f3ecfd] text-[#5a14bd] font-medium' : 'text-[#1a1a1a]'
                        }`}
                      >
                        {author}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#e6e6e6] rounded-lg h-9 min-w-[140px] justify-between">
              <div className="flex items-center gap-1">
                <Calendar size={20} className="text-[#1a1a1a]" />
                <span className="text-sm text-[#1a1a1a]">All Dates</span>
              </div>
              <ChevronDown size={20} className="text-[#1a1a1a]" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1.5 bg-white border border-[#e6e6e6] rounded-lg h-9 w-[286px]">
              <Search size={20} className="text-[#808080]" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="flex-1 text-sm text-[#1a1a1a] placeholder-[#666] bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-3 gap-6" style={getAnimationStyle(6)}>
            {paginatedLessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                style={{
                  opacity: isMounted ? 1 : 0,
                  transform: isMounted ? 'translateY(0)' : `translateY(${animControls.slideUpDistance}px)`,
                  transition: `opacity ${animControls.fadeInDuration}ms ease-out, transform ${animControls.fadeInDuration}ms ease-out`,
                  transitionDelay: `${(6 + index) * animControls.staggerDelay}ms`,
                }}
              />
            ))}
          </div>

          {/* Empty State */}
          {paginatedLessons.length === 0 && (
            <div className="text-center py-12" style={getAnimationStyle(7)}>
              <p className="text-lg text-[#666]">No lessons found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {filteredLessons.length > 0 && (
            <div className="flex items-center justify-between" style={getAnimationStyle(15)}>
              <p className="text-sm text-[#666]">
                {startIndex + 1} – {Math.min(startIndex + ITEMS_PER_PAGE, filteredLessons.length)} of {filteredLessons.length} items
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === 1
                      ? 'border-[#ccc] cursor-not-allowed'
                      : 'border-[#5a14bd] hover:bg-[#f3ecfd]'
                  }`}
                >
                  <ChevronLeft size={24} className={currentPage === 1 ? 'text-[#666]' : 'text-[#5a14bd]'} />
                </button>
                {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-[#5a14bd] text-white'
                        : 'text-[#5a14bd] hover:bg-[#f3ecfd]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalFilteredPages, p + 1))}
                  disabled={currentPage === totalFilteredPages}
                  className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${
                    currentPage === totalFilteredPages
                      ? 'border-[#ccc] cursor-not-allowed'
                      : 'border-[#5a14bd] hover:bg-[#f3ecfd]'
                  }`}
                >
                  <ChevronRight size={24} className={currentPage === totalFilteredPages ? 'text-[#666]' : 'text-[#5a14bd]'} />
                </button>
              </div>
              <button className="h-12 px-4 pr-3 border border-[#5a14bd] rounded-lg flex items-center gap-1">
                <span className="text-base font-extrabold text-[#5a14bd]">{ITEMS_PER_PAGE}</span>
                <ChevronDown size={24} className="text-[#5a14bd]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
