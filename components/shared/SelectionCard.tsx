
import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface SelectionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  isSelected: boolean;
  tooltipText?: string;
  className?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  icon,
  onSelect,
  isSelected,
  tooltipText,
  className = '',
}) => {
  return (
    <button
      onClick={onSelect}
      className={`p-4 sm:p-5 border rounded-xl text-left transition-all duration-200 w-full h-full flex flex-col 
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500
        ${isSelected 
          ? 'bg-primary-500 text-white shadow-xl ring-2 ring-primary-400 ring-offset-1 border-transparent' 
          : 'bg-white hover:bg-primary-50 text-gray-800 border-gray-300 hover:border-primary-300 hover:shadow-lg'
        } ${className}`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          {icon && React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { 
            className: `h-7 w-7 sm:h-8 sm:w-8 mr-3 flex-shrink-0 ${isSelected ? 'text-white' : 'text-primary-500'}` 
          })}
          <h4 className={`text-md sm:text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>{title}</h4>
        </div>
        {tooltipText && (
          <div className="ml-2 flex-shrink-0">
            <InfoTooltip text={tooltipText} position="top" className={isSelected ? "text-primary-100" : ""} />
          </div>
        )}
      </div>
      <p className={`text-sm flex-grow ${isSelected ? 'text-primary-100' : 'text-gray-600'}`}>
        {description}
      </p>
    </button>
  );
};