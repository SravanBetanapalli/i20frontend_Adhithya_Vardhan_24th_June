
import React from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '../../assets/icons'; 

interface NotificationBannerProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning'; 
  onDismiss?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, type, onDismiss }) => {
  const baseClasses = "p-4 rounded-md shadow-md flex items-center justify-between mb-4 border";
  
  const typeClasses = {
    success: "bg-success-light text-success-textLight border-green-200",
    error: "bg-error-light text-error-textLight border-red-200",
    info: "bg-info-light text-info-textLight border-blue-200",
    warning: "bg-warning-light text-warning-textLight border-amber-200",
  };

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6 mr-3 text-success" />,
    error: <XCircleIcon className="h-6 w-6 mr-3 text-error" />,
    info: <InformationCircleIcon className="h-6 w-6 mr-3 text-info" />,
    warning: <InformationCircleIcon className="h-6 w-6 mr-3 text-warning" /> 
  };

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-center">
        {icons[type]}
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          aria-label="Dismiss notification"
        >
          <XCircleIcon className="h-5 w-5" /> 
        </button>
      )}
    </div>
  );
};