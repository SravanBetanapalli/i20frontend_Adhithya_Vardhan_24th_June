
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { APP_TITLE } from '../../constants';
import { SparklesIcon, ArrowRightIcon, SquaresPlusIcon, ArrowLeftIcon } from '../../assets/icons'; 

export const PathwaySelectionScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPathway = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleBackToRoleSelection = () => {
    navigate('/login'); // Navigate back to the login screen to change role
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 flex flex-col items-center justify-center p-4 text-white">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Button
            onClick={handleBackToRoleSelection}
            variant="ghost"
            size="md"
            className="text-primary-100 hover:bg-primary-500 hover:text-white border-primary-400 hover:border-primary-300"
            leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
        >
            Back to Role Selection
        </Button>
      </div>
      
      <div className="text-center mb-10">
        <SparklesIcon className="h-16 w-16 sm:h-20 sm:w-20 text-accent-300 mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Welcome to {APP_TITLE}!</h1>
        <p className="text-lg sm:text-xl text-primary-100">Choose how you'd like to proceed:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">
        <Card 
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 transform hover:scale-105"
          onClick={() => handleSelectPathway('/welcome')}
        >
          <div className="p-6 text-center">
            <ArrowRightIcon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-700 mb-2">End-to-End Automation</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Follow a guided, sequential path through the entire research lifecycle, from idea generation to manuscript writing. Ideal for new projects.
            </p>
            <Button variant="primary" size="lg" className="w-full sm:w-auto" tabIndex={-1}>
              Start Full Pathway
            </Button>
          </div>
        </Card>

        <Card 
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 transform hover:scale-105"
          onClick={() => handleSelectPathway('/specific-hub')}
        >
          <div className="p-6 text-center">
            <SquaresPlusIcon className="h-12 w-12 text-accent-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-accent-700 mb-2">Specific Module Automation</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Jump directly to a specific research stage or combine modules as needed. Perfect for focusing on particular tasks or existing work.
            </p>
            <Button variant="accent" size="lg" className="w-full sm:w-auto" tabIndex={-1}>
              Select Modules
            </Button>
          </div>
        </Card>
      </div>
      <footer className="mt-16 text-center text-sm text-primary-200">
        <p>&copy; {new Date().getFullYear()} I2O Cloud Platform. Your research, your way.</p>
      </footer>
    </div>
  );
};
