import { useState, useEffect } from 'react';
import expertsLogo from '@/assets/expertslogo.svg';

interface LessonItem {
  id: string;
  author: string;
  title: string;
}

// Mock lessons for learner view
const learnerLessons: LessonItem[] = [
  { id: '1', author: 'Sofia Rossi', title: 'Active Listening for Product Managers' },
  { id: '2', author: 'Sofia Rossi', title: 'Active Listening for Product Managers' },
  { id: '3', author: 'Zayn', title: 'You had me at hello' },
  { id: '4', author: 'Sofia Rossi', title: 'Active Listening for Product Managers' },
  { id: '5', author: 'Sofia Rossi', title: 'Active Listening for Product Managers' },
  { id: '6', author: 'Marcus Chen', title: 'Effective Communication Skills' },
];

function LessonCard({ lesson }: { lesson: LessonItem }) {
  return (
    <div className="bg-white border border-[#e6e6e6] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      {/* Image Container with decorative elements */}
      <div className="aspect-[16/9] bg-[#f3ecfd] relative overflow-hidden flex items-center justify-center">
        {/* Decorative purple arc */}
        <div className="absolute -bottom-24 -right-12 w-60 h-60 rounded-full border-[24px] border-[#5a14bd]" />

        {/* AI Icon placeholder */}
        <div className="w-40 h-40 rounded-full flex items-center justify-center opacity-20">
          <svg viewBox="0 0 167 167" fill="none" className="w-full h-full">
            <circle cx="83.5" cy="83.5" r="83.5" fill="transparent" />
            {/* Sparkle icons */}
            <path d="M75 40L80 55L95 60L80 65L75 80L70 65L55 60L70 55L75 40Z" fill="#5a14bd" />
            <path d="M50 75L53 85L63 88L53 91L50 101L47 91L37 88L47 85L50 75Z" fill="#5a14bd" />
            <path d="M100 90L104 103L117 107L104 111L100 124L96 111L83 107L96 103L100 90Z" fill="#5a14bd" />
          </svg>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="px-4 pt-3 pb-4">
        <h3 className="font-extrabold text-lg text-[#1a1a1a] leading-[21.6px] mb-1">
          {lesson.title}
        </h3>
        <p className="text-xs text-[#4d4d4d] tracking-[0.5px] leading-[18px]">
          by {lesson.author}
        </p>
      </div>
    </div>
  );
}

export function LearnerPanel() {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getAnimationStyle = (index: number): React.CSSProperties => ({
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 600ms ease-out, transform 600ms ease-out',
    transitionDelay: `${index * 100}ms`,
  });

  return (
    <div className="relative w-full min-h-screen overflow-auto">
      {/* Header */}
      <header
        className="flex flex-col items-center pt-6 pb-0 relative"
        style={getAnimationStyle(0)}
      >
        <div className="w-full max-w-[1280px] px-4 flex items-center justify-center relative">
          {/* Logo centered */}
          <img
            src={expertsLogo}
            alt="GoodHabitz Experts"
            className="h-8 w-auto"
          />

          {/* Avatar on the right */}
          <div className="absolute right-4 w-10 h-10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#5a14bd] to-[#9c43fe]" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center px-6 py-10 relative">
        {/* Lessons Grid */}
        <div
          className="w-full max-w-[1140px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={getAnimationStyle(1)}
        >
          {learnerLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              style={{
                opacity: isMounted ? 1 : 0,
                transform: isMounted ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 600ms ease-out, transform 600ms ease-out',
                transitionDelay: `${(2 + index) * 100}ms`,
              }}
            >
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
