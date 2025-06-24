
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleWrapper } from './ModuleWrapper';
import { Card } from '../shared/Card';
import { 
    LightBulbIcon, 
    DocumentTextIcon, 
    TableCellsIcon, 
    BookOpenIcon,
    SquaresPlusIcon 
} from '../../assets/icons';
import { APP_TITLE } from '../../constants';
import { useProject } from '../../contexts/ProjectContext'; 

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  onClick: (path: string) => void;
}

const ModuleNavigationCard: React.FC<ModuleCardProps> = ({ title, description, icon, path, onClick }) => {
  return (
    <Card 
        className="h-full transform transition-all duration-300 hover:-translate-y-1" // Removed explicit cursor-pointer as Card handles it
        onClick={() => onClick(path)}
    >
      <div className="flex items-center mb-3">
        {React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: 'h-8 w-8 text-primary-600 mr-3' })}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </Card>
  );
};

const modules = [
  { 
    title: "IDEA Hub", 
    description: "Generate, validate, and refine your research ideas with AI assistance.", 
    icon: <LightBulbIcon />, 
    path: "/idea" 
  },
  { 
    title: "Proposal Development", 
    description: "Craft comprehensive research proposals and manage ethics submissions.", 
    icon: <DocumentTextIcon />, 
    path: "/proposal" 
  },
  { 
    title: "Data & Analysis", 
    description: "Collect data, perform statistical analysis, and visualize results.", 
    icon: <TableCellsIcon />, 
    path: "/data" 
  },
  { 
    title: "Manuscript Writing", 
    description: "Write, refine, and prepare your research manuscript for publication.", 
    icon: <BookOpenIcon />, 
    path: "/manuscript" 
  },
];

export const SpecificAutomationHub: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject } = useProject(); 

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <ModuleWrapper
      title="Specific Module Automation Hub"
      icon={<SquaresPlusIcon />}
      subtitle={`Select a specific module to work on within ${currentProject ? `project: ${currentProject.title}` : APP_TITLE}.`}
    >
      { !currentProject && (
        <Card className="mb-6 border-accent-200 bg-accent-50">
            <p className="text-accent-700 text-sm">
                <strong>Note:</strong> You don't have an active project. Some modules may require you to start or select a project first from the 'IDEA Hub'. This hub provides direct navigation to modules.
            </p>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(module => (
          <ModuleNavigationCard
            key={module.title}
            title={module.title}
            description={module.description}
            icon={module.icon}
            path={module.path}
            onClick={handleNavigate}
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Remember, some modules might have prerequisites from earlier stages. The system will guide you if needed.
        </p>
      </div>
    </ModuleWrapper>
  );
};
