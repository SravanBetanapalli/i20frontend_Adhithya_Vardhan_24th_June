import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { LightBulbIcon, SparklesIcon } from '../../assets/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useProject } from '../../contexts/ProjectContext';
import { IdeationMode, ResearchIdea } from '../../types';
import { ModuleWrapper } from '../core/ModuleWrapper';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { TextInput } from '../shared/TextInput';

export const IdeationHubModule: React.FC = () => {
  // --- Future House API Integration ---
  const [fhQuestion, setFhQuestion] = useState("");
  const [fhTaskId, setFhTaskId] = useState<string | null>(null);
  const [fhAnswer, setFhAnswer] = useState<string | null>(null);
  const [fhLoading, setFhLoading] = useState(false);
  const FH_API_BASE_URL = "https://your-future-house-api.com/endpoint"; // <-- Replace with your actual endpoint

  const handleFHAskQuestion = async () => {
    setFhLoading(true);
    setFhAnswer(null);
    try {
      const response = await axios.post(FH_API_BASE_URL, { question: fhQuestion });
      setFhTaskId(response.data.task_id);
      pollForFHAnswer(response.data.task_id);
    } catch (error) {
      setFhLoading(false);
      alert("Failed to send question to Future House API.");
    }
  };

  const pollForFHAnswer = (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${FH_API_BASE_URL}?task_id=${taskId}`);
        if (response.data.status === "completed") {
          setFhAnswer(response.data.answer);
          setFhLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        setFhLoading(false);
        clearInterval(interval);
        alert("Failed to fetch answer from Future House API.");
      }
    }, 2000);
  };

  // --- Original Ideation Logic and State ---
  const { currentUser } = useAuth();
  const { 
    currentProject, 
    startNewProject, 
    updateIdea, 
    isLoading: projectLoading, 
    setIsLoading: setProjectLoading, 
    error: projectError, 
    setError: setProjectError,
    assignExpert,
    setProjectStage,
    clearError
  } = useProject();
  
  const [projectTitle, setProjectTitle] = useState('');
  const [ideaInput, setIdeaInput] = useState<Partial<ResearchIdea>>({ concept: '' });
  const [selectedIdeationMode, setSelectedIdeationMode] = useState<IdeationMode | null>(null);
  
  // States for Spark Mode (AI Co-Creation)
  const [hcpProfile, setHcpProfile] = useState({ experience: '', specialty: '', interests: '' });
  // States for Insight Engine
  const [autonomousIdeas, setAutonomousIdeas] = useState<{id: string; question: string; rationale: string}[]>([]);
  const [selectedAutonomousIdea, setSelectedAutonomousIdea] = useState<string | null>(null);
  // ...rest of your original ideation logic and handlers...

  // (For brevity, paste the rest of your original component logic and handlers here)

  return (
    <ModuleWrapper 
      title="Ideation Hub" 
      icon={<LightBulbIcon />} 
      subtitle="Craft, co-create, or discover research ideas with powerful AI assistance."
    >
      {/* --- Future House API UI (always on top) --- */}
      <Card title="Ask Future House API" icon={<SparklesIcon />} className="mb-6">
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
          <TextInput
            label="Your Question"
            value={fhQuestion}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFhQuestion(e.target.value)}
            placeholder="Type your question for Future House API"
          />
          <Button onClick={handleFHAskQuestion} disabled={fhLoading || !fhQuestion} className="mt-2">
            Ask
          </Button>
          {fhLoading && <p>Waiting for answer...</p>}
          {fhAnswer && (
            <div style={{ marginTop: 24, background: "#f0f0f0", padding: 16 }}>
              <strong>Answer:</strong>
              <p>{fhAnswer}</p>
            </div>
          )}
        </div>
      </Card>
      {/* --- Original Ideation UI below --- */}
      {/* Paste your original ideation UI/cards here, as in your original file. */}
    </ModuleWrapper>
  );
};
