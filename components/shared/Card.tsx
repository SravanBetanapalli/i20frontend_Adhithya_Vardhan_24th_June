
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void; // Added onClick prop
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon, actions, onClick }) => {
  return (
    <div 
      className={`bg-white 
                  shadow-lg 
                  rounded-xl overflow-hidden 
                  border border-transparent 
                  transition-all duration-300 ease-in-out
                  ${onClick ? 'cursor-pointer hover:shadow-xl hover:border-gray-300' : ''}
                  ${className}`}
      onClick={onClick} // Apply onClick handler
      tabIndex={onClick ? 0 : undefined} // Make clickable cards focusable
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined} // Keyboard accessibility for click
      role={onClick ? 'button' : undefined} // ARIA role
    >
      {(title || icon || actions) && (
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            {icon && <span className="mr-3 text-primary-600">{React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: 'h-6 w-6' })}</span>}
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6 text-gray-700">
        {children}
      </div>
    </div>
  );
};
