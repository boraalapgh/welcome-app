import { X, Play } from 'lucide-react';

interface ExpertVideoModalProps {
  onClose: () => void;
}

// Video thumbnail from Figma
const VIDEO_THUMBNAIL = 'https://www.figma.com/api/mcp/asset/eadd43e4-73a9-447f-bb32-28b0c1043278';

export function ExpertVideoModal({ onClose }: ExpertVideoModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal content */}
      <div className="relative bg-white rounded-2xl mx-3 p-5 w-full max-h-[90%] max-w-[640px] overflow-hidden flex flex-col shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <X size={18} className="text-[#5a14bd]" />
        </button>

        {/* Title */}
        <h2 className="font-extrabold text-lg text-[#1a1a1a] mb-4 pr-8">
          Expert Video (2 minutes 18 seconds)
        </h2>

        {/* Video preview */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="relative w-full aspect-video rounded-xl border-4 border-[#e6e6e6] overflow-hidden bg-gray-100">
            <img
              src={VIDEO_THUMBNAIL}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-12 h-12 bg-[#5a14bd] rounded-lg flex items-center justify-center hover:bg-[#4a10a0] transition-colors">
                <Play size={24} className="text-white ml-1" fill="white" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#5a14bd] rounded-lg text-white text-sm font-extrabold hover:bg-[#4a10a0] transition-colors">
              Re-record
            </button>
            <button className="px-4 py-2 border border-[#5a14bd] rounded-lg text-[#5a14bd] text-sm font-extrabold hover:bg-[#f3ecfd] transition-colors">
              Re-upload
            </button>
          </div>
        </div>

        {/* Button group */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#f2f2f2]">
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
