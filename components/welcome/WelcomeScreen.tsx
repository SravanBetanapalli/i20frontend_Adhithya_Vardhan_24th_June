
import React, { useState } from 'react';
import { ModuleWrapper } from '../core/ModuleWrapper';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { PLACEHOLDER_EXPLANATORY_VIDEO_URL, EXTERNAL_LEARNING_RESOURCES, PLATFORM_INTEGRATED_COURSES, APP_TITLE } from '../../constants';
import { PlayCircleIcon, AcademicCapIcon, SparklesIcon, HomeIcon } from '../../assets/icons';

interface LearningResourceCardProps {
  title: string;
  description: string;
  link?: string;
  duration?: string;
  source?: string;
  isPlatformIntegrated?: boolean;
}

const LearningResourceCard: React.FC<LearningResourceCardProps> = ({ title, description, link, duration, source, isPlatformIntegrated }) => {
  return (
    <Card className="h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex-grow">
        <div className="flex items-center mb-2">
          {isPlatformIntegrated ? (
            <SparklesIcon className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0" />
          ) : (
            <AcademicCapIcon className="h-6 w-6 text-accent-500 mr-2 flex-shrink-0" />
          )}
          <h4 className="text-md font-semibold text-gray-800">{title}</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      </div>
      <div className="mt-auto pt-3 border-t border-gray-100">
        {duration && <p className="text-xs text-gray-500 mb-1">Estimated Duration: {duration}</p>}
        {source && <p className="text-xs text-gray-500">Source: <span className="font-medium">{source}</span></p>}
        {link && (
          <Button 
            variant="accent" 
            size="sm" 
            onClick={() => window.open(link, '_blank')}
            className="w-full mt-2"
          >
            Go to Resource
          </Button>
        )}
        {isPlatformIntegrated && !link && (
            <Button variant="primary" size="sm" className="w-full mt-2" disabled>Start Course (Coming Soon)</Button>
        )}
      </div>
    </Card>
  );
};

export const WelcomeScreen: React.FC = () => {
  const [showVideo, setShowVideo] = useState(true);

  return (
    <ModuleWrapper 
      title="Research Accelerator: Introduction & Learning"
      icon={<HomeIcon />}
      subtitle="Your centralized hub for AI-accelerated clinical research, learning resources, and project management."
    >
      <Card 
        title="From Idea to Generation: An Overview of the Research Accelerator Platform"
        icon={<PlayCircleIcon />}
        actions={
          <Button onClick={() => setShowVideo(!showVideo)} variant="ghost" size="sm">
            {showVideo ? 'Hide Video' : 'Show Video'}
          </Button>
        }
        className="mb-8 shadow-lg border border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50"
      >
        {showVideo && (
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md mt-2 border border-gray-200">
            <iframe
              src={PLACEHOLDER_EXPLANATORY_VIDEO_URL}
              title="From Idea to Generation: An Overview of the Research Accelerator Platform"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-4">
          This video provides a comprehensive overview of the {APP_TITLE}, guiding you through each module and showcasing how AI can streamline your research lifecycle from initial concept to final publication.
        </p>
      </Card>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-1 flex items-center">
          <AcademicCapIcon className="h-7 w-7 text-accent-600 mr-2" />
          Research Certification & Learning Hub
        </h3>
        <p className="text-sm text-gray-500 mb-4">Enhance your research skills with these curated courses and resources.</p>
        
        <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-3 ml-1">Platform Integrated Certifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PLATFORM_INTEGRATED_COURSES.map(course => (
                    <LearningResourceCard key={course.title} {...course} />
                ))}
            </div>
        </div>
        
        <div>
            <h4 className="text-lg font-medium text-gray-700 mb-3 ml-1">External Premier Research Courses</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXTERNAL_LEARNING_RESOURCES.map(resource => (
                <LearningResourceCard key={resource.title} {...resource} />
                ))}
            </div>
        </div>
      </div>
      
    </ModuleWrapper>
  );
};