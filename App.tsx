import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { Header } from './components/shared/Header';
import { Sidebar } from './components/shared/Sidebar';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { IdeaHubModule } from './components/idea/IdeaHubModule';
import { ProposalDevelopmentModule } from './components/module2/ProposalDevelopmentModule';
import { DataAnalysisModule } from './components/module3/DataAnalysisModule';
import { ManuscriptWritingModule } from './components/module4/ManuscriptWritingModule';
import { IntroductionScreen } from './components/introduction/IntroductionScreen';
import { RoadmapScreen } from './components/introduction/RoadmapScreen';
import { PathwaySelectionScreen } from './components/core/PathwaySelectionScreen';
import { SpecificAutomationHub } from './components/core/SpecificAutomationHub';
import { APP_SUBTITLE, APP_TITLE } from './constants';
import { Card } from './components/shared/Card';
import { SparklesIcon } from './assets/icons';

const MainAppLayout: React.FC = () => {
  const { currentProject } = useProject();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const showStartProjectMessage = isAuthenticated &&
    !currentProject &&
    location.pathname !== '/welcome' && 
    location.pathname !== '/idea' &&
    location.pathname !== '/specific-hub';

  return (
    <div className="flex h-screen pt-16 bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-72 overflow-y-auto">
        {showStartProjectMessage && (
             <div className="p-4 sm:p-6 lg:p-8">
                <Card 
                    title="No Active Project" 
                    icon={<SparklesIcon className="text-primary-500"/>} 
                    className="text-center border-primary-200 bg-primary-50" 
                >
                    <p className="text-md text-gray-700 mb-2">Welcome to the {APP_TITLE}!</p>
                    <p className="text-gray-600">To get started, please navigate to the <Link to="/idea" className="text-primary-600 hover:underline font-semibold">IDEA Hub</Link> to begin a new research project or select an existing one if available.</p>
                    <p className="text-gray-600 mt-1">Alternatively, you can go to the <Link to="/specific-hub" className="text-primary-600 hover:underline font-semibold">Specific Module Hub</Link> to jump to a particular stage.</p>
                </Card>
            </div>
        )}
        <Outlet /> 
      </main>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const noHeaderPaths = ['/pathway-selection', '/login', '/introduction', '/roadmap'];
  // Show Header if authenticated AND not on one of the noHeaderPaths
  const showHeader = isAuthenticated && !noHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />} {/* Global Header based on auth and path */}
      <Routes>
        {/* Routes that DO NOT use MainAppLayout */}
        <Route path="/introduction" element={<IntroductionScreen />} />
        <Route path="/roadmap" element={<RoadmapScreen />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/pathway-selection" replace /> : <LoginScreen />} 
        />
        <Route 
            path="/pathway-selection" 
            element={isAuthenticated ? <PathwaySelectionScreen /> : <Navigate to="/login" replace />} 
        />

        {/* This parent route handles all authenticated routes that use MainAppLayout */}
        <Route
          path="/*" // Use "/*" to ensure it acts as a layout for all sub-paths
          element={
            isAuthenticated ? <MainAppLayout /> : <Navigate to="/introduction" replace />
          }
        >
          {/* Nested routes that render inside MainAppLayout's Outlet */}
          {/* Default route for "/" when authenticated and inside MainAppLayout */}
          <Route index element={<Navigate to="/welcome" replace />} /> 
          <Route path="welcome" element={<WelcomeScreen />} />
          <Route path="specific-hub" element={<SpecificAutomationHub />} />
          <Route path="idea" element={<IdeaHubModule />} />
          <Route path="proposal" element={<ProposalDevelopmentModule />} />
          <Route path="data" element={<DataAnalysisModule />} />
          <Route path="manuscript" element={<ManuscriptWritingModule />} />
          {/* Fallback for any other authenticated path not matched above, within MainAppLayout */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Route>
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
          <HashRouter>
            <AppRouter />
          </HashRouter>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;