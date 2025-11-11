import React from 'react';
import { AcademicCapIcon } from '../icons/PanelIcons';

interface GuidanceModalProps {
  advice: string;
  onClose: () => void;
}

const GuidanceModal: React.FC<GuidanceModalProps> = ({ advice, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-[#161B22] border border-slate-700 rounded-lg shadow-lg w-full max-w-xl m-4">
        <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
          <AcademicCapIcon className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-300">AI Guider's Advice</h2>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-slate-300 whitespace-pre-wrap">{advice}</p>
        </div>
        <div className="p-4 bg-[#161B22]/50 border-t border-slate-700 flex justify-end">
          <button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidanceModal;