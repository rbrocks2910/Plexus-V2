import React, { useState } from 'react';
import { PlusIcon, TrashIcon, DocumentSearchIcon } from '../icons/PanelIcons';

interface DifferentialDiagnosisPanelProps {
  diagnoses: string[];
  setDiagnoses: React.Dispatch<React.SetStateAction<string[]>>;
}

const DifferentialDiagnosisPanel: React.FC<DifferentialDiagnosisPanelProps> = ({ diagnoses, setDiagnoses }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() && !diagnoses.includes(input.trim())) {
      setDiagnoses([...diagnoses, input.trim()]);
      setInput('');
    }
  };

  const handleRemove = (dx: string) => {
    setDiagnoses(diagnoses.filter(d => d !== dx));
  };

  return (
    <div className="bg-[#161B22] border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
        <DocumentSearchIcon className="w-5 h-5 mr-2" />
        Differential Diagnosis
      </h3>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a diagnosis..."
          className="flex-1 bg-[#0D1117] border border-slate-600 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm"
        />
        <button onClick={handleAdd} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-md p-2 transition duration-300">
            <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        {diagnoses.length === 0 && <p className="text-slate-400 text-sm">Your differential list is empty.</p>}
        {diagnoses.map(dx => (
          <div key={dx} className="flex justify-between items-center text-sm p-2 bg-slate-800 rounded-md">
            <span className="text-slate-300">{dx}</span>
            <button onClick={() => handleRemove(dx)} className="text-slate-400 hover:text-red-500">
                <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DifferentialDiagnosisPanel;