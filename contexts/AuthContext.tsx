
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  currentUser: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    // Simulate login by finding a mock user with the selected role
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    } else {
      // Fallback if no specific mock user for role, create a generic one
      setCurrentUser({ id: `simulated-${role}`, name: `Simulated ${role} User`, role });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = useMemo(() => !!currentUser, [currentUser]);

  const value = useMemo(() => ({ currentUser, login, logout, isAuthenticated }), [currentUser, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
    