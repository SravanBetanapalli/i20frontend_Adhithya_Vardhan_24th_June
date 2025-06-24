import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { USER_ROLES_CONFIG, APP_SUBTITLE, APP_TITLE } from '../../constants'; 
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { UserCircleIcon, SparklesIcon } from '../../assets/icons'; 
import { useNavigate } from 'react-router-dom';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate('/pathway-selection', { replace: true }); // Navigate to pathway selection
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center mb-10">
        <div className="flex justify-center items-center mb-4">
            <SparklesIcon className="h-16 w-16 sm:h-20 sm:w-20 text-accent-300 mr-3"/>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{APP_TITLE}</h1>
        </div>
        <p className="mt-2 text-lg text-primary-100 max-w-2xl mx-auto">{APP_SUBTITLE}</p>
      </div>
      
      <Card 
        className="w-full max-w-md" 
        title="Select Your Role to Begin" 
        icon={<UserCircleIcon />}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This platform adapts its features based on your role. Please select the role that best describes you.
          </p>
          
          <div className="space-y-3">
            {USER_ROLES_CONFIG.map(({ role, description }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left p-4 border rounded-lg transition-all duration-150 ease-in-out
                  ${selectedRole === role 
                    ? 'bg-primary-500 text-white border-primary-600 shadow-lg ring-2 ring-primary-400 ring-offset-1' 
                    : 'bg-gray-50 hover:bg-primary-50 text-gray-700 border-gray-300 hover:border-primary-300'}`}
              >
                <h3 className="font-semibold text-md">{role}</h3>
                <p className={`text-xs ${selectedRole === role ? 'text-primary-100' : 'text-gray-500'}`}>{description}</p>
              </button>
            ))}
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={!selectedRole}
            className="w-full mt-6"
            size="lg"
            variant="primary"
          >
            Login as {selectedRole || '...'}
          </Button>
        </div>
      </Card>
      <footer className="mt-12 text-center text-sm text-primary-200">
        <p>&copy; {new Date().getFullYear()} I2O Cloud Platform. Revolutionizing Clinical Research.</p>
        <p className="mt-1 text-xs">Powered by AI, driven by experts.</p>
      </footer>
    </div>
  );
};