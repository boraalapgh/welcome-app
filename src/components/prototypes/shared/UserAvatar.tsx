// User Avatar Component
// Displays user photo or fallback initials

import { useState } from 'react';

interface UserAvatarProps {
  size?: number;
  imageUrl?: string;
  name?: string;
  className?: string;
}

export function UserAvatar({
  size = 32,
  imageUrl,
  name = 'User',
  className = ''
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Default placeholder image
  const defaultImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face';
  const displayImage = imageUrl || defaultImage;

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {!imageError && displayImage ? (
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-[#e6e6e6] flex items-center justify-center text-[#666] font-medium text-xs">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
