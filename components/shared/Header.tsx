
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_TITLE } from '../../constants'; 
import { UserCircleIcon, LogoutIcon, BellIcon, Cog6ToothIcon, SparklesIcon, ArrowLeftIcon } from '../../assets/icons';
import { Button } from './Button';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  // Routes where the global back button should not be shown
  const noBackButtonRoutes = [
    '/',
    '/welcome',
    '/login',
    '/introduction',
    '/roadmap',
    '/pathway-selection',
    '/specific-hub' 
  ];
  const showBackButton = isAuthenticated && !noBackButtonRoutes.includes(location.pathname);

  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {showBackButton && (
              <Button 
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="mr-2 sm:mr-3 p-2 text-primary-200 hover:bg-primary-500 hover:text-white border-none"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            )}
            <SparklesIcon className="h-8 w-8 mr-2 text-accent-400" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isAuthenticated && currentUser && (
              <>
                <button
                  title="Notifications (coming soon)"
                  className="p-2 rounded-full text-primary-200 hover:bg-primary-500 hover:text-white transition-colors"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-6 w-6" />
                </button>
                 <button
                  title="Settings (coming soon)"
                  className="p-2 rounded-full text-primary-200 hover:bg-primary-500 hover:text-white transition-colors"
                  aria-label="Settings"
                >
                  <Cog6ToothIcon className="h-6 w-6" />
                </button>
              </>
            )}
            {isAuthenticated && currentUser && (
              <>
                <div className="hidden sm:flex items-center">
                  <UserCircleIcon className="h-7 w-7 mr-2 text-primary-200" />
                  <span className="text-sm font-medium text-primary-100">{currentUser.name} ({currentUser.role})</span>
                </div>
                <Button 
                    onClick={logout} 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary-100 hover:bg-primary-500 hover:text-white border-primary-500"
                >
                  <LogoutIcon className="h-5 w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
