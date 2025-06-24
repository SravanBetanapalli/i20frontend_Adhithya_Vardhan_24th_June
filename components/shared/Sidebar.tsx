
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ModuleStage, UserRole } from '../../types';
import { APP_TITLE } from '../../constants'; 
import { MODULE_STAGES_ORDERED } from '../../constants';
import { 
    HomeIcon, 
    LightBulbIcon, 
    DocumentTextIcon, 
    TableCellsIcon, 
    BookOpenIcon,
    SparklesIcon 
} from '../../assets/icons';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';

interface NavItemConfig {
  path: string;
  name: string;
  icon: React.ReactNode;
  minStage?: ModuleStage; 
  allowedRoles?: UserRole[]; 
}

const mainNavItems: NavItemConfig[] = [
  { path: "/welcome", name: "Welcome & Hub", icon: <HomeIcon className="h-5 w-5 mr-3" /> },
  { path: "/idea", name: "IDEA Hub", icon: <LightBulbIcon className="h-5 w-5 mr-3" />, minStage: ModuleStage.IDEA_GENERATION },
  { path: "/proposal", name: "Proposal Development", icon: <DocumentTextIcon className="h-5 w-5 mr-3" />, minStage: ModuleStage.PROPOSAL_DEVELOPMENT },
  { path: "/data", name: "Data & Analysis", icon: <TableCellsIcon className="h-5 w-5 mr-3" />, minStage: ModuleStage.DATA_COLLECTION_ANALYSIS },
  { path: "/manuscript", name: "Manuscript Writing", icon: <BookOpenIcon className="h-5 w-5 mr-3" />, minStage: ModuleStage.MANUSCRIPT_WRITING },
];

export const Sidebar: React.FC = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const location = useLocation();

  const NavItem: React.FC<{ item: NavItemConfig }> = ({ item }) => {
    let isEnabled = true;
    if (item.minStage) {
        isEnabled = !currentProject 
            ? item.minStage === ModuleStage.IDEA_GENERATION 
            : (MODULE_STAGES_ORDERED.indexOf(item.minStage) <= MODULE_STAGES_ORDERED.indexOf(currentProject.currentStage));
    }
    
    if (item.path === "/idea" && !currentProject && currentUser?.role === UserRole.HCP) {
        isEnabled = true;
    } else if (item.path === "/idea" && !currentProject && currentUser?.role !== UserRole.HCP) {
        isEnabled = false; 
    }

    const baseClasses = "flex items-center px-3 py-3 rounded-lg transition-colors duration-150 ease-in-out text-sm";
    const activeClasses = "bg-primary-500 text-white shadow-md";
    const inactiveClasses = "text-gray-700 hover:bg-primary-100 hover:text-primary-700";
    const disabledClasses = "text-gray-400 cursor-not-allowed opacity-70";

    if (!isEnabled) {
        return (
            <div className={`${baseClasses} ${disabledClasses}`}>
                {item.icon}
                <span className="font-medium">{item.name}</span>
            </div>
        );
    }
    
    const isWelcomeActive = item.path === "/welcome" && (location.pathname === "/" || location.pathname.startsWith("/welcome") || location.pathname.startsWith("/introduction") || location.pathname.startsWith("/roadmap"));

    return (
      <NavLink
        to={item.path}
        className={({ isActive }) => `${baseClasses} ${(isActive || isWelcomeActive) ? activeClasses : inactiveClasses}`}
      >
        {item.icon}
        <span className="font-medium">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <aside className="w-72 bg-white shadow-xl p-5 space-y-4 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 transition-colors duration-300">
      <div className="pb-4 mb-4 border-b border-gray-200 flex items-center text-primary-700">
         <SparklesIcon className="h-7 w-7 mr-2 text-accent-500"/>
         <span className="font-semibold text-lg truncate text-gray-800" title={APP_TITLE}>{APP_TITLE}</span>
      </div>
      <nav className="space-y-2">
        {mainNavItems.map(item => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>
      
      <div className="pt-4 border-t border-gray-200 absolute bottom-0 left-0 right-0 p-5 bg-white">
        {currentProject && (
            <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
            <h4 className="text-xs font-semibold text-primary-700 mb-1">Current Project:</h4>
            <p className="text-sm text-primary-600 font-medium truncate" title={currentProject.title}>{currentProject.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">Stage: <span className="font-medium text-gray-700">{currentProject.currentStage}</span></p>
            </div>
        )}
        {!currentProject && currentUser?.role === UserRole.HCP && (
            <div className="p-3 bg-accent-50 rounded-lg border border-accent-200 text-center">
            <p className="text-xs text-accent-700">No active project.</p>
            <p className="text-xs text-accent-600">Start or select a project in the 'IDEA Hub'.</p>
            </div>
        )}
         {!currentProject && currentUser?.role !== UserRole.HCP && (
            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-center">
            <p className="text-xs text-gray-600">No active project selected or assigned.</p>
            </div>
        )}
      </div>
    </aside>
  );
};