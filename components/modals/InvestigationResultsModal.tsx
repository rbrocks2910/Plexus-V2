import React from 'react';
import type { Investigation } from '../../types';

interface InvestigationResultsModalProps {
  investigation: Investigation;
  onClose: () => void;
}

const InvestigationResultsModal: React.FC<InvestigationResultsModalProps> = ({ investigation, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-[#161B22] border border-slate-700 rounded-lg shadow-lg w-full max-w-2xl m-4">
        <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-cyan-300">{investigation.results?.reportTitle || investigation.name}</h2>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-slate-300 whitespace-pre-wrap">{investigation.results?.findings || "Results are not available."}</p>
        </div>
        <div className="p-4 bg-[#161B22]/50 border-t border-slate-700 flex justify-end">
          <button onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestigationResultsModal;