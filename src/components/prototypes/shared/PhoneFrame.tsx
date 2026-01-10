import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {/* Phone device frame */}
      <div
        className="relative w-full max-w-[390px] h-full max-h-[844px] min-h-[640px] bg-[#2e0a61] rounded-[48px] border-8 border-[#b3b3b3] shadow-[0px_8px_40px_rgba(21,21,21,0.15)] overflow-hidden"
      >
        {/* Content area */}
        <div className="w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
