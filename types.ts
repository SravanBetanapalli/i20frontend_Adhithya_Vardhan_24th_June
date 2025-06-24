
export enum UserRole {
  HCP = "Healthcare Professional (HCP)",
  RESEARCHER = "Experienced Researcher",
  STATISTICIAN = "Statistician",
  DATA_ENGINEER = "Data Engineer/Custodian",
  ADMIN = "System Administrator",
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export enum ModuleStage {
  IDEA_GENERATION = "Idea Generation & Validation", 
  PROPOSAL_DEVELOPMENT = "Proposal Development & Ethics",
  DATA_COLLECTION_ANALYSIS = "Data Collection, Aggregation & Analysis",
  MANUSCRIPT_WRITING = "Manuscript Writing & Publication",
}

export enum IdeationMode {
  CLINICIAN_LED = "Clinician-Led Ideation (AI-Assisted)",
  AI_CO_CREATION = "AI Co-Creation Partnership",
  AUTONOMOUS_AI = "Autonomous AI Exploration",
}

export enum IdeaValidationStage {
  PRELIMINARY_SCREENING = "Preliminary Screening",
  IN_DEPTH_ANALYSIS = "In-depth Analysis",
}

export enum DataCollectionPathway {
  PATHWAY_A = "Pathway A: Engineer-Assisted & AI-Powered Querying",
  PATHWAY_B = "Pathway B: AI-Assisted GUI Extraction",
}

export interface ResearchIdea {
  concept: string;
  background?: string;
  objective?: string;
  methodology?: string;
  significance?: string;
  expectedOutcomes?: string;
  aiReport?: AIReport;
  isNovel?: boolean; 
  expertAssigned?: boolean;
  ideationMode?: IdeationMode;
  noveltyScore?: number; 
  similarityScore?: number; 
  validationStage?: IdeaValidationStage;
}

export interface AIReport {
  literatureSummary: string;
  researchGaps: string;
  noveltyRating?: string; 
  similarityRating?: string; 
  feasibilityAssessment: string;
  aiSuggestions?: string; 
}

export interface Proposal {
  title: string;
  sections: { [key: string]: string }; 
  ethicsStatus: "Not Submitted" | "Submitted" | "Feedback Received" | "Approved" | "Rejected";
  ethicsFeedback?: string;
  statisticianAssigned?: boolean;
  precedentComparisonReport?: string; 
}

export interface DataSet {
  name: string;
  description: string;
  sourceQuery?: string; 
  simulatedData?: Record<string, any>[]; 
  collectionPathway?: DataCollectionPathway;
  dataEngineerReviewed?: boolean; 
  dataEngineerApproved?: boolean; 
}

export interface StatisticalAnalysis {
  plan: string; 
  testTypes?: string[];
  measuresToReport?: string[];
  figuresAndTablesPlan?: string[];
  isPlanLocked?: boolean;
  results?: string; 
  tables?: string; 
  figures?: string; 
  statisticianInterpretation?: string;
  isValidated?: boolean;
}

export interface Manuscript {
  title: string;
  targetJournal?: string;
  sections: { [key: string]: string }; 
  references?: string;
  status: "Drafting" | "Review" | "Ready for Submission";
  keywords?: string;
  authors?: string; 
  affiliations?: string; 
  acknowledgements?: string;
  authorContributions?: string;
  conflictOfInterestStatement?: string;
  fundingStatement?: string;
  recommendedArticleType?: string;
  recommendedWordCounts?: string;
  recommendedFigureTypes?: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  hcpId: string; 
  currentStage: ModuleStage; 
  idea?: ResearchIdea;
  proposal?: Proposal;
  dataSet?: DataSet;
  analysis?: StatisticalAnalysis;
  manuscript?: Manuscript;
  assignedResearcher?: string; 
  assignedStatistician?: string; 
  assignedDataEngineer?: string; 
  createdAt: Date;
  updatedAt: Date;
}

export interface GeminiResponse {
  text: string;
  error?: string;
  groundingChunks?: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  metadata?: Record<string, any>; 
}

export interface JournalSuggestion {
    name: string;
    scope: string;
    impactFactor?: string;
    country?: string;
    aimsLink?: string;
    rationale?: string;
}