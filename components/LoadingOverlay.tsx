
import React, { useState, useEffect } from 'react';
import { LOADING_TIPS } from '../constants';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  const [tip, setTip] = useState(LOADING_TIPS[0]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTip(LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]);
    }, 4000);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
      <SpinnerIcon className="w-16 h-16 text-cyan-400" />
      <p className="text-xl font-semibold mt-4 text-white">{message}</p>
      <p className="text-md text-slate-300 mt-2 max-w-sm text-center italic">"{tip}"</p>
    </div>
  );
};

export default LoadingOverlay;
