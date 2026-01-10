import { X, Info } from 'lucide-react';
import { useState } from 'react';

interface ExportModalProps {
  onClose: () => void;
}

export function ExportModal({ onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'csv'>('excel');

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
        <div className="mb-4 pr-8">
          <h2 className="font-extrabold text-lg text-[#1a1a1a]">
            Export the lesson
          </h2>
          <p className="text-sm text-[#4d4d4d] mt-1">
            The lesson will be saved as a zip file in SCORM format.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Info banner */}
          <div className="flex items-center gap-2 bg-[#e9f9fb] rounded-lg px-4 py-3">
            <Info size={18} className="text-[#0f4f58] shrink-0" />
            <p className="text-sm text-[#0f4f58]">
              Only Published lessons will be exported
            </p>
          </div>

          {/* Format selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                checked={selectedFormat === 'excel'}
                onChange={() => setSelectedFormat('excel')}
                className="w-4 h-4 text-[#5a14bd] border-2 border-[#5a14bd] focus:ring-[#5a14bd]"
              />
              <span className="text-sm text-[#1a1a1a]">Excel</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                checked={selectedFormat === 'csv'}
                onChange={() => setSelectedFormat('csv')}
                className="w-4 h-4 text-[#5a14bd] border-2 border-[#5a14bd] focus:ring-[#5a14bd]"
              />
              <span className="text-sm text-[#1a1a1a]">CSV</span>
            </label>
          </div>
        </div>

        {/* Button group */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#f2f2f2]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5a14bd] rounded-lg text-white text-sm font-extrabold hover:bg-[#4a10a0] transition-colors"
          >
            Export
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
