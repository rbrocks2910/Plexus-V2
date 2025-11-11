import React from 'react';
import { EcgWaveIcon } from './icons/EcgWaveIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-[#161B22]/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <EcgWaveIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Plexus
          </h1>
        </div>
        <p className="hidden md:block text-sm text-cyan-400/80">AI Medical Patient Simulator</p>
      </div>
    </header>
  );
};

export default Header;