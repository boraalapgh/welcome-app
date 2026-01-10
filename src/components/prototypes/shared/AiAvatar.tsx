// AI Avatar Component - Purple sparkle stars icon
// Used in chat messages for AI responses

interface AiAvatarProps {
  size?: number;
  className?: string;
}

export function AiAvatar({ size = 32, className = '' }: AiAvatarProps) {
  return (
    <div
      className={`bg-[#f3ecfd] rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.65}
        height={size * 0.65}
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Main star - center right */}
        <path
          d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"
          fill="#5a14bd"
          transform="translate(4, 2) scale(0.7)"
        />
        {/* Small star - top left */}
        <path
          d="M12 2L12.55 5.13L15.5 5.5L12.55 5.87L12 9L11.45 5.87L8.5 5.5L11.45 5.13L12 2Z"
          fill="#5a14bd"
          transform="translate(-4, 0) scale(0.5)"
        />
        {/* Small star - bottom */}
        <path
          d="M12 2L12.55 5.13L15.5 5.5L12.55 5.87L12 9L11.45 5.87L8.5 5.5L11.45 5.13L12 2Z"
          fill="#5a14bd"
          transform="translate(2, 10) scale(0.45)"
        />
      </svg>
    </div>
  );
}
