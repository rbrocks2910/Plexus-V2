import React, { useState } from 'react';

interface DiagnosisSubmissionModalProps {
  onClose: () => void;
  onSubmit: (diagnosis: string, confidence: number) => void;
}

const DiagnosisSubmissionModal: React.FC<DiagnosisSubmissionModalProps> = ({ onClose, onSubmit }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [confidence, setConfidence] = useState(50);

  const handleSubmit = () => {
    if (diagnosis.trim()) {
      onSubmit(diagnosis.trim(), confidence);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-[#161B22] border border-slate-700 rounded-lg shadow-lg w-full max-w-lg m-4 p-6">
        <h2 className="text-2xl font-bold text-cyan-300 mb-4">Submit Final Diagnosis</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-slate-300 mb-2">Final Diagnosis</label>
            <input
              type="text"
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full bg-[#0D1117] border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="e.g., Myocardial Infarction"
            />
          </div>
          <div>
            <label htmlFor="confidence" className="block text-sm font-medium text-slate-300 mb-2">Confidence Level: <span className="font-bold text-cyan-400">{confidence}%</span></label>
            <input
              type="range"
              id="confidence"
              min="0"
              max="100"
              step="1"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!diagnosis.trim()} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisSubmissionModal;