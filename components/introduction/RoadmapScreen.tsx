
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { 
    LightBulbIcon, 
    DocumentTextIcon, 
    BookOpenIcon, 
    SparklesIcon,
    ClipboardDocumentListIcon, 
    ChartBarIcon,             
    CheckBadgeIcon,
    ArrowLeftIcon            
} from '../../assets/icons';

interface RoadmapStageItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const roadmapStageDetails: RoadmapStageItem[] = [
  {
    id: "idea-generation",
    icon: <LightBulbIcon className="h-7 w-7 mb-1 sm:h-8 sm:w-8 sm:mb-2" />,
    title: "Idea Generation",
    description: "Spark and refine your research questions. Leverage AI to assess novelty, feasibility, and existing literature, ensuring a strong foundation for your study."
  },
  {
    id: "proposal-development",
    icon: <DocumentTextIcon className="h-7 w-7 mb-1 sm:h-8 sm:w-8 sm:mb-2" />,
    title: "Proposal Development",
    description: "Craft compelling research proposals with AI assistance. Structure content effectively, adhere to institutional guidelines, and prepare for ethics committee submissions."
  },
  {
    id: "data-collection",
    icon: <ClipboardDocumentListIcon className="h-7 w-7 mb-1 sm:h-8 sm:w-8 sm:mb-2" />,
    title: "Data Collection",
    description: "Gathering the necessary information for your study. This phase involves executing data extraction plans, ensuring data quality, and organizing datasets for subsequent analysis."
  },
  {
    id: "analysis",
    icon: <ChartBarIcon className="h-7 w-7 mb-1 sm:h-8 sm:w-8 sm:mb-2" />,
    title: "Analysis",
    description: "Transforming raw data into meaningful insights. This involves applying statistical methods, interpreting results, and generating tables and figures to support your research conclusions."
  },
  {
    id: "manuscript-writing",
    icon: <BookOpenIcon className="h-7 w-7 mb-1 sm:h-8 sm:w-8 sm:mb-2" />,
    title: "Manuscript Writing",
    description: "Accelerate your path to publication. AI aids in drafting manuscript sections, refining language, formatting references, and suggesting suitable target journals for impact."
  },
  {
    id: "final-output",
    icon: <CheckBadgeIcon className="h-7 w-7 mb-1 sm:h-8 sm:w-8 sm:mb-2" />,
    title: "Final Output",
    description: "The culmination of your research: a validated, published manuscript or report, ready to make an impact in the clinical and scientific community. Your findings are now contributing to the body of knowledge."
  }
];

const ChevronRight: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-6 h-6 sm:w-8 sm:h-8 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

export const RoadmapScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState<RoadmapStageItem | null>(roadmapStageDetails[0]); 

  const handleContinue = () => {
    navigate('/login');
  };

  const handleBackToIntro = () => {
    navigate('/introduction');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300 relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Button
            onClick={handleBackToIntro}
            variant="secondary"
            size="md"
            className="bg-white hover:bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-400"
            leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
        >
            Back to Introduction
        </Button>
      </div>
      
      <header className="text-center mb-6 sm:mb-10 mt-12 sm:mt-16"> {/* Added margin-top for spacing from back button */}
        <SparklesIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 mx-auto mb-2 sm:mb-3" />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Your Research Journey, Supercharged</h1>
        <p className="text-sm sm:text-md lg:text-lg text-gray-600 mt-2 max-w-2xl">
          Follow these AI-enhanced stages to take your clinical research from initial concept to impactful publication.
        </p>
      </header>

      <div className="w-full max-w-6xl mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-2">
          {roadmapStageDetails.map((item, index) => (
            <React.Fragment key={item.id}>
              <div
                className="w-full lg:w-auto"
                onMouseEnter={() => setActiveStage(item)}
                onFocusCapture={() => setActiveStage(item)} 
                tabIndex={0} 
                role="button"
                aria-label={`Select stage: ${item.title}`}
              >
                <div 
                  className={`p-3 sm:p-4 rounded-lg text-center transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer min-w-[130px] sm:min-w-[150px] h-full flex flex-col justify-center items-center
                    ${activeStage?.id === item.id 
                        ? 'bg-primary-500 text-white shadow-2xl ring-2 ring-primary-400' 
                        : 'bg-white hover:shadow-xl shadow-md'}`}
                >
                  <div className={`mx-auto ${activeStage?.id === item.id ? 'text-white' : 'text-primary-500'}`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-xs sm:text-sm font-semibold ${activeStage?.id === item.id ? 'text-white' : 'text-gray-700'}`}>
                    {item.title}
                  </h3>
                </div>
              </div>
              {index < roadmapStageDetails.length - 1 && (
                <div className="text-gray-300 lg:mx-1 xl:mx-2 transform lg:rotate-0 rotate-90">
                    <ChevronRight className={activeStage?.id === item.id || activeStage?.id === roadmapStageDetails[index+1].id ? "text-primary-400" : ""} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {activeStage && (
        <Card 
            className="w-full max-w-3xl mb-6 sm:mb-10 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200 shadow-lg transition-all duration-500 ease-in-out" 
            title={
                <span className="font-bold text-primary-700">
                    Exploring: {activeStage.title}
                </span>
            }
        >
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed min-h-[50px] sm:min-h-[70px]">
            {activeStage.description}
          </p>
        </Card>
      )}

      <Button 
        onClick={handleContinue} 
        size="lg"
        variant="primary"
        className="px-8 py-3 text-base sm:text-lg"
      >
        Continue to Login
      </Button>
      
      <footer className="mt-8 sm:mt-12 text-center text-xs text-gray-500">
        <p>I2O Cloud Platform © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};
