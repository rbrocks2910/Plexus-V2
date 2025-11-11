import React, { useState } from 'react';
import type { Investigation } from '../../types';
import { INVESTIGATIONS_LIST } from '../../constants';
import { BeakerIcon, FilmIcon, StethoscopeIcon } from '../icons/PanelIcons';
import InvestigationResultsModal from '../modals/InvestigationResultsModal';

interface InvestigationsPanelProps {
  investigations: Investigation[];
  onOrderInvestigation: (name: string, type: 'Lab' | 'Imaging' | 'Exam' | 'Custom') => void;
}

type Tab = 'labs' | 'imaging' | 'exams';

const InvestigationsPanel: React.FC<InvestigationsPanelProps> = ({ investigations, onOrderInvestigation }) => {
  const [activeTab, setActiveTab] = useState<Tab>('labs');
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null);

  interface TabButtonProps {
    tabName: Tab;
    currentTab: Tab;
    setTab: (tab: Tab) => void;
    children: React.ReactNode;
  }

  const TabButton: React.FC<TabButtonProps> = ({ tabName, currentTab, setTab, children }) => (
    <button
      onClick={() => setTab(tabName)}
      className={`flex-1 py-2 text-sm font-medium transition-colors duration-200 ${
        currentTab === tabName ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  const renderInvestigationList = (list: string[], type: 'Lab' | 'Imaging' | 'Exam') => (
    <div className="space-y-2">
      {list.map(item => (
        <button
          key={item}
          onClick={() => onOrderInvestigation(item, type)}
          className="w-full text-left bg-slate-800/80 hover:bg-slate-700/80 p-2 rounded-md text-slate-300 text-sm transition-colors"
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-[#161B22] border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-bold text-cyan-400 mb-4">Clinical Investigations</h3>
      <div className="border-b border-slate-700 mb-4">
        <div className="flex -mb-px">
            <TabButton tabName="labs" currentTab={activeTab} setTab={setActiveTab}><BeakerIcon className="inline w-4 h-4 mr-1"/>Labs</TabButton>
            <TabButton tabName="imaging" currentTab={activeTab} setTab={setActiveTab}><FilmIcon className="inline w-4 h-4 mr-1"/>Imaging</TabButton>
            <TabButton tabName="exams" currentTab={activeTab} setTab={setActiveTab}><StethoscopeIcon className="inline w-4 h-4 mr-1"/>Exams</TabButton>
        </div>
      </div>

      <div className="max-h-36 overflow-y-auto pr-2">
        {activeTab === 'labs' && renderInvestigationList(INVESTIGATIONS_LIST.labs, 'Lab')}
        {activeTab === 'imaging' && renderInvestigationList(INVESTIGATIONS_LIST.imaging, 'Imaging')}
        {activeTab === 'exams' && renderInvestigationList(INVESTIGATIONS_LIST.exams, 'Exam')}
      </div>
      
      <hr className="my-4 border-slate-700" />
      
      <h4 className="font-semibold text-slate-300 mb-2">Ordered Tests</h4>
      <div className="space-y-2 max-h-28 overflow-y-auto pr-2">
        {investigations.length === 0 && <p className="text-slate-400 text-sm">No investigations ordered yet.</p>}
        {investigations.map(inv => (
          <div key={inv.id} className="flex justify-between items-center text-sm p-2 bg-slate-800 rounded-md">
            <span className="text-slate-300">{inv.name}</span>
            {inv.status === 'Complete' ? (
              <button onClick={() => setSelectedInvestigation(inv)} className="text-cyan-400 hover:underline">View</button>
            ) : (
              <span className="text-yellow-400 animate-pulse text-xs">Pending...</span>
            )}
          </div>
        ))}
      </div>
      {selectedInvestigation && (
          <InvestigationResultsModal investigation={selectedInvestigation} onClose={() => setSelectedInvestigation(null)} />
      )}
    </div>
  );
};

export default InvestigationsPanel;