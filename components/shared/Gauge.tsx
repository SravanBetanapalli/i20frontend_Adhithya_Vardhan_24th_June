
import React from 'react';

interface GaugeProps {
  value: number; // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  colorOverride?: string; 
  lowerIsBetter?: boolean;
}

const getRatingColors = (value: number, lowerIsBetter: boolean = false): {bg: string, text: string} => {
  if (lowerIsBetter) { 
    if (value < 33) return { bg: 'bg-green-500', text: 'text-green-600'}; 
    if (value < 66) return { bg: 'bg-yellow-500', text: 'text-yellow-600'};
    return { bg: 'bg-red-500', text: 'text-red-600'}; 
  } else { 
    if (value > 80) return { bg: 'bg-green-500', text: 'text-green-600'};
    if (value > 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600'};
    if (value > 30) return { bg: 'bg-orange-500', text: 'text-orange-600'}; 
    return { bg: 'bg-red-500', text: 'text-red-600'};
  }
};

export const Gauge: React.FC<GaugeProps> = ({ value, label, size = 'md', colorOverride, lowerIsBetter }) => {
  const heightClasses = {
    sm: 'h-2.5',
    md: 'h-4',
    lg: 'h-6',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const normalizedValue = Math.max(0, Math.min(100, value));
  const ratingColors = getRatingColors(normalizedValue, lowerIsBetter ?? label?.toLowerCase().includes('similarity'));
  const barColorClasses = colorOverride ? colorOverride : ratingColors.bg;
  const textColorClasses = colorOverride ? colorOverride.replace('bg-','text-') : ratingColors.text;


  return (
    <div className="w-full">
      {label && (
        <div className={`flex justify-between mb-1 ${textClasses[size]}`}>
          <span className="font-medium text-gray-700">{label}</span>
          <span className={`font-semibold ${textColorClasses}`}>{normalizedValue.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[size]} overflow-hidden shadow-inner`}>
        <div
          className={`${barColorClasses} ${heightClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${normalizedValue}%` }}
          role="progressbar"
          aria-valuenow={normalizedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Gauge value'}
        ></div>
      </div>
    </div>
  );
};