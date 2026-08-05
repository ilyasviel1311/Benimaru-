import React from 'react';

interface RetroToastProps {
  message: string | null;
  onClose?: () => void;
}

export const RetroToast: React.FC<RetroToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-bounce sm:animate-none sm:translate-y-0 transition-all duration-300">
      <div className="retro-window bg-[#F4F1DE] text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Title Bar */}
        <div className="retro-titlebar px-2 py-1 bg-[#df551f] text-white flex justify-between items-center select-none font-mono-retro text-xs font-bold border-b-2 border-black">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">notifications_active</span>
            <span>SYSTEM_ALERT.EXE</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onClose}
              className="w-4 h-4 bg-[#c0c0c0] text-black border border-black flex items-center justify-center text-[10px] font-bold hover:bg-white"
            >
              X
            </button>
          </div>
        </div>

        {/* Toast Body */}
        <div className="p-3 bg-white font-mono-retro text-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00A896] text-white border-2 border-black flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">info</span>
          </div>
          <div className="flex-grow font-bold text-black leading-snug">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
