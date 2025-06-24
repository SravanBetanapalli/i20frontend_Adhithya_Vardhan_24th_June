
import React from 'react';

interface ModuleWrapperProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // For top-right actions in header
}

export const ModuleWrapper: React.FC<ModuleWrapperProps> = ({ title, icon, subtitle, children, actions }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-300">
        <div>
          <div className="flex items-center mb-1">
            {icon && React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: 'h-8 w-8 text-primary-600 mr-3' })}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-1 ml-11 sm:ml-0">{subtitle}</p>}
        </div>
        {actions && <div className="mt-3 sm:mt-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
};