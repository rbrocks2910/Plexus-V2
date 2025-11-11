
import React from 'react';

export const EcgWaveIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      {`
        .ecg-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw 2s linear infinite;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}
    </style>
    <path className="ecg-path" d="M0 20 H15 L20 10 L25 30 L30 15 L35 22 L40 20 H50 L52 25 L55 20 L58 18 L60 20 H80" stroke="currentColor" strokeWidth="2" />
  </svg>
);
