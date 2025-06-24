
import React from 'react';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, id, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-3 py-2 border 
                    ${error ? 'border-red-500' : 'border-gray-300'} 
                    rounded-md shadow-sm 
                    focus:outline-none focus:ring-primary-500 focus:border-primary-500 
                    sm:text-sm 
                    bg-white 
                    text-gray-900 
                    placeholder-gray-400
                    disabled:opacity-70 disabled:cursor-not-allowed
                    ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};