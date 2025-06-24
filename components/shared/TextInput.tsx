
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({ label, id, error, className, leftIcon, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {React.cloneElement(leftIcon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: 'h-5 w-5 text-gray-400' })}
            </div>
        )}
        <input
            id={id}
            type={props.type || "text"}
            className={`w-full px-3 py-2 border 
                        ${error ? 'border-red-500' : 'border-gray-300'} 
                        rounded-md shadow-sm 
                        focus:outline-none focus:ring-primary-500 focus:border-primary-500 
                        sm:text-sm 
                        bg-white 
                        text-gray-900 
                        placeholder-gray-400
                        disabled:opacity-70 disabled:cursor-not-allowed
                        ${leftIcon ? 'pl-10' : ''} ${className}`}
            {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};