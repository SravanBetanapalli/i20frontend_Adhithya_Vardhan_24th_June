
import React, { useState } from 'react';
import { InformationCircleIcon } from '../../assets/icons';

interface InfoTooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string; 
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-gray-400 hover:text-primary-600 focus:outline-none"
        aria-label="Information"
      >
        <InformationCircleIcon className="h-5 w-5" />
      </button>
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-20 w-64 p-2 text-sm text-white bg-gray-800 rounded-md shadow-lg ${positionClasses[position]}`}
        >
          {text}
          <div 
            className={`absolute ${
              position === 'top' ? 'left-1/2 -translate-x-1/2 top-full' :
              position === 'bottom' ? 'left-1/2 -translate-x-1/2 bottom-full' :
              position === 'left' ? 'top-1/2 -translate-y-1/2 left-full' :
              'top-1/2 -translate-y-1/2 right-full'
            } w-0 h-0 border-8 border-transparent ${
              position === 'top' ? 'border-t-gray-800' :
              position === 'bottom' ? 'border-b-gray-800' :
              position === 'left' ? 'border-l-gray-800' :
              'border-r-gray-800'
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};