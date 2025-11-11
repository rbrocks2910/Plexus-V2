import React, { useState } from 'react';
import type { Specialty, Rarity } from '../types';
import { SPECIALTIES, RARITIES } from '../constants';

interface CaseSelectionProps {
  onCaseStart: (specialty: Specialty, rarity: Rarity) => void;
}

const CaseSelection: React.FC<CaseSelectionProps> = ({ onCaseStart }) => {
  const [specialty, setSpecialty] = useState<Specialty>('Cardiology');
  const [rarity, setRarity] = useState<Rarity>('Common');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCaseStart(specialty, rarity);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
      <div className="bg-[#161B22] border border-slate-700 rounded-lg shadow-2xl shadow-cyan-500/10 p-8 text-center">
        <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">Plexus</h2>
        <p className="text-slate-400 mb-8">Hone your diagnostic skills. Select a specialty and case rarity to begin.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-slate-300 text-left mb-2">Medical Specialty</label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value as Specialty)}
              className="w-full bg-[#0D1117] border border-slate-600 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            >
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label htmlFor="rarity" className="block text-sm font-medium text-slate-300 text-left mb-2">Case Rarity</label>
            <select
              id="rarity"
              value={rarity}
              onChange={(e) => setRarity(e.target.value as Rarity)}
              className="w-full bg-[#0D1117] border border-slate-600 rounded-md py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            >
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Generate Patient Case
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaseSelection;