import React from 'react';
import type { PatientCase } from '../../types';
import { UserIcon, ClipboardListIcon } from '../icons/PanelIcons';

interface PatientInfoPanelProps {
  patientCase: PatientCase;
}

const PatientInfoPanel: React.FC<PatientInfoPanelProps> = ({ patientCase }) => {
  const { demographics, chiefComplaint } = patientCase;
  
  return (
    <div className="bg-[#161B22] border border-slate-700 rounded-lg p-4 h-full">
      <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
        <UserIcon className="w-5 h-5 mr-2" />
        Patient Information
      </h3>
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-semibold text-slate-400">Name: </span>
          <span className="text-slate-200">{demographics.name}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-400">Age: </span>
          <span className="text-slate-200">{demographics.age}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-400">Gender: </span>
          <span className="text-slate-200">{demographics.gender}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-400">Occupation: </span>
          <span className="text-slate-200">{demographics.occupation}</span>
        </div>
      </div>
      
      <hr className="my-4 border-slate-700" />
      
      <div>
        <h4 className="font-bold text-slate-300 mb-2 flex items-center">
          <ClipboardListIcon className="w-5 h-5 mr-2" />
          Presentation
        </h4>
        <div className="text-sm space-y-2">
            <div>
                <p className="font-semibold text-slate-400">Chief Complaint:</p>
                <p className="text-slate-200">{chiefComplaint}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoPanel;