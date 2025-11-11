import React, { useState } from 'react';
import { AcademicCapIcon } from '../icons/PanelIcons';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import GuidanceModal from '../modals/GuidanceModal';

interface AIGuiderPanelProps {
  onGetAdvice: () => Promise<string>;
}

const AIGuiderPanel: React.FC<AIGuiderPanelProps> = ({ onGetAdvice }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setAdvice(null);
    try {
      const newAdvice = await onGetAdvice();
      setAdvice(newAdvice);
    } catch (error) {
      console.error("Error getting AI guidance:", error);
      setAdvice("Sorry, I'm unable to provide guidance at this moment. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#161B22] border border-slate-700 rounded-lg p-4 text-center">
      <h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center justify-center">
        <AcademicCapIcon className="w-5 h-5 mr-2" />
        AI Guider
      </h3>
      <p className="text-sm text-slate-400 mb-4">Stuck? Ask a senior physician for advice.</p>
      <button 
        onClick={handleGetAdvice}
        disabled={isLoading}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-500 flex items-center justify-center"
      >
        {isLoading ? <><SpinnerIcon className="w-5 h-5 mr-2" /> Requesting...</> : 'Request Guidance'}
      </button>

      {advice && !isLoading && (
        <GuidanceModal advice={advice} onClose={() => setAdvice(null)} />
      )}
    </div>
  );
};

export default AIGuiderPanel;