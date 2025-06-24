
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';
// Icons removed: LightBulbIcon, Cog6ToothIcon

export const IntroductionScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/roadmap');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 flex flex-col items-center justify-center p-6 text-white text-center overflow-hidden transition-colors duration-300">
      {/* Icons and complex layout removed */}
      
      <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight mb-6" style={{ letterSpacing: '0.05em' }}>
        IDEA TO OUTPUT
      </h1>
      
      <p className="text-xl sm:text-2xl text-primary-100 max-w-3xl mx-auto mb-12">
        Transforming Research into Reality—From Ideation to Impact!
      </p>
      
      <Button 
        onClick={handleStart} 
        size="lg"
        variant="ghost"
        className="bg-white text-primary-600 hover:bg-gray-200 shadow-xl px-10 py-4 text-lg font-semibold transform hover:scale-105 transition-transform duration-150"
      >
        Get Started
      </Button>
      
      <footer className="absolute bottom-6 text-center text-sm text-primary-200 w-full px-4">
        <p>&copy; {new Date().getFullYear()} I2O Cloud Platform. Streamlining Discovery.</p>
      </footer>
      {/* Removed style tag for spin animation as icons are gone */}
    </div>
  );
};