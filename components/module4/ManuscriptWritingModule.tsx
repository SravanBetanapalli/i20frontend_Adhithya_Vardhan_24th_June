
import React, { useState, useEffect, useCallback } from 'react';
import { ModuleWrapper } from '../core/ModuleWrapper';
import { BookOpenIcon, SparklesIcon, PaperAirplaneIcon, BellIcon } from '../../assets/icons';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { TextAreaInput } from '../shared/TextAreaInput';
import { TextInput } from '../shared/TextInput';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useProject } from '../../contexts/ProjectContext';
import { Manuscript, UserRole, ModuleStage, JournalSuggestion } from '../../types';
import { generateTextWithRAG, generateText, generateJsonOutput } from '../../services/geminiService';
import { MOCK_KNOWLEDGE_BASES, MOCK_USERS } from '../../constants';
import { NotificationBanner } from '../shared/NotificationBanner';
import { useAuth } from '../../contexts/AuthContext';


const MANUSCRIPT_SECTIONS = [
    { id: "abstract", name: "Abstract", placeholder: "Structured abstract (Background, Methods, Results, Conclusion)." },
    { id: "introduction", name: "Introduction", placeholder: "Background, rationale, objectives of the study." },
    { id: "methods", name: "Methods", placeholder: "Detailed description of study design, participants, interventions, outcomes, statistical analysis." },
    { id: "results", name: "Results", placeholder: "Presentation of findings, referring to tables and figures." },
    { id: "discussion", name: "Discussion", placeholder: "Interpretation of results, comparison with other studies, limitations, implications." },
    { id: "conclusions", name: "Conclusions", placeholder: "Summary of key findings and their significance." },
    { id: "references", name: "References", placeholder: "List of cited works. Use AI to help format." },
];

export const ManuscriptWritingModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    currentProject, 
    updateManuscript,
    isLoading, 
    setIsLoading, 
    error, 
    setError,
    clearError
  } = useProject();

  const [manuscript, setManuscript] = useState<Partial<Manuscript>>({ sections: {}, status: "Drafting" });
  const [activeSection, setActiveSection] = useState<string | null>(MANUSCRIPT_SECTIONS[0].id);
  const [journalSuggestions, setJournalSuggestions] = useState<JournalSuggestion[]>([]);
  const [targetJournal, setTargetJournal] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [showMeetingPlaceholder, setShowMeetingPlaceholder] = useState(false);


  useEffect(() => {
    if (currentProject?.manuscript) {
      setManuscript(currentProject.manuscript);
      setTargetJournal(currentProject.manuscript.targetJournal || '');
    } else if (currentProject?.analysis?.results) {
      setManuscript(prev => ({
        ...prev,
        title: currentProject.title ? `Manuscript: ${currentProject.title}` : "Research Manuscript",
        sections: {
          ...prev.sections,
          introduction: currentProject.proposal?.sections?.background || '',
          methods: `${currentProject.proposal?.sections?.methodology || ''}\n\nAnalysis Plan:\n${currentProject.analysis?.plan || ''}`,
          results: currentProject.analysis?.results || '', 
        },
        status: "Drafting",
      }));
    } else {
      setManuscript({ sections: {}, status: "Drafting" });
    }

    if (currentProject?.assignedResearcher && currentProject.analysis?.isValidated && !currentProject.manuscript) {
        setShowMeetingPlaceholder(true);
    }

  }, [currentProject]);

  const handleSectionChange = (sectionId: string, value: string) => {
    setManuscript(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: value,
      },
    }));
  };

  const handleSaveManuscript = () => {
    if (!currentProject) return;
    updateManuscript({ ...manuscript, targetJournal });
    setNotification({ message: "Manuscript draft saved!", type: 'success' });
  };

  const getAISectionHelp = async (sectionId: string, helpType: 'structure' | 'language' | 'references') => {
    if (!currentProject || !manuscript.sections) {
      setError("No active project or manuscript.");
      return;
    }
    setIsLoading(true);
    clearError();
    setNotification(null);

    const currentSectionContent = manuscript.sections[sectionId] || '';
    const studySummary = `
        Project Title: ${currentProject.title}
        Key Findings: ${currentProject.analysis?.statisticianInterpretation || currentProject.analysis?.results?.substring(0, 500) || 'N/A'}
        Target Journal: ${targetJournal || 'Not specified'}
    `;

    let systemInstruction = "";
    let promptAction = "";

    if (helpType === 'structure') {
        systemInstruction = `You are an AI manuscript writing assistant. Provide structural guidance for the '${MANUSCRIPT_SECTIONS.find(s=>s.id===sectionId)?.name || sectionId}' section.`;
        promptAction = `Provide an outline or key structural elements. If content exists, suggest improvements to its structure.`;
    } else if (helpType === 'language') {
        systemInstruction = `You are an AI language editor. Refine the language for clarity, conciseness, academic tone. Correct grammar and spelling.`;
        promptAction = `Refine the following text:`;
    } else { 
        systemInstruction = `You are an AI referencing assistant. Format for in-text citations and bibliography (simulate Vancouver or APA).`;
        promptAction = `Format the following references or text with citations:`;
    }
    
    const prompt = `Study Summary:
    ${studySummary}
    Current content for section "${MANUSCRIPT_SECTIONS.find(s=>s.id===sectionId)?.name || sectionId}":
    ---
    ${currentSectionContent}
    ---
    ${promptAction}`;

    const response = await generateText(prompt, systemInstruction);

    if (response.text && !response.error) {
        handleSectionChange(sectionId, response.text);
        setNotification({ message: `AI ${helpType} assistance applied to '${sectionId}'.`, type: 'info' });
    } else {
        setError(response.error || `Failed to get AI ${helpType} help.`);
        setNotification({ message: `Error: ${response.error}`, type: 'error' });
    }
    setIsLoading(false);
  };

  const suggestJournals = async () => {
    if (!currentProject || !currentProject.analysis?.results) {
        setError("Need study results to suggest journals.");
        return;
    }
    setIsLoading(true);
    clearError();
    setNotification(null);

    const systemInstruction = "You are an AI research assistant for publication strategy. Based on the abstract/summary, suggest 3-5 suitable journals. Provide name, scope, impact factor (simulated), and rationale. Use RAG with simulated journal databases. Output as JSON: [{name, scope, impactFactor, rationale}, ...]";
    const studyAbstract = manuscript.sections?.abstract || manuscript.sections?.introduction || currentProject.idea?.concept || "Abstract not yet written.";
    const prompt = `Study Abstract/Summary:
    ---
    ${studyAbstract}
    ---
    Keywords: (Infer or use: ${currentProject.idea?.concept || ""})
    Simulated RAG context: Journal A (Cardiology, IF 50), Journal B (General Med, IF 10), Conf Z (Specialty Y)
    Suggest suitable journals/conferences.`;

    const response = await generateJsonOutput<JournalSuggestion[]>(prompt, systemInstruction);
    if (response.data) {
        setJournalSuggestions(response.data);
        setNotification({ message: "AI suggested potential journals/venues.", type: 'success' });
    } else {
        setError(response.error || "Failed to get journal suggestions. Raw: " + response.rawText);
        setNotification({ message: `Error: ${response.error}`, type: 'error' });
    }
    setIsLoading(false);
  };
  
  const markReadyForSubmission = () => {
      if(!currentProject) return;
      updateManuscript({ status: "Ready for Submission" });
      setNotification({ message: "Manuscript marked as 'Ready for Submission' (Simulated).", type: 'success' });
  };

  const canEdit = currentUser?.role === UserRole.HCP || currentUser?.role === UserRole.RESEARCHER;

  if (!currentProject || !currentProject.analysis?.isValidated) {
    return (
      <ModuleWrapper title="Manuscript Writing & Publication" icon={<BookOpenIcon />}>
        <Card>
          <p className="text-gray-600 text-center py-8">
            Validated statistical analysis is required to begin manuscript writing.
          </p>
        </Card>
      </ModuleWrapper>
    );
  }

  return (
    <ModuleWrapper title="Manuscript Writing & Publication" icon={<BookOpenIcon />} subtitle={`For project: ${currentProject.title}`}>
      {notification && <NotificationBanner type={notification.type} message={notification.message} onDismiss={() => setNotification(null)} />}
      {error && <NotificationBanner type="error" message={error} onDismiss={clearError} />}

      {showMeetingPlaceholder && (
          <Card title="Manuscript Strategy Meeting" icon={<BellIcon />} className="mb-6 bg-info-light border-info-light">
              <p className="text-info-textLight">
                  An Experienced Researcher (<strong>{MOCK_USERS.find(u => u.id === currentProject.assignedResearcher)?.name || 'Expert'}</strong>) is available.
                  A (simulated) collaborative meeting should occur.
              </p>
              <Button onClick={() => setShowMeetingPlaceholder(false)} size="sm" variant="secondary" className="mt-3">Mark as Met (Simulated)</Button>
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card title="Manuscript Sections">
            <nav className="space-y-1">
              {MANUSCRIPT_SECTIONS.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${activeSection === section.id 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {section.name}
                </button>
              ))}
            </nav>
             {canEdit && (
                <Button onClick={handleSaveManuscript} isLoading={isLoading} className="w-full mt-6" variant="primary">
                    Save Draft Manuscript
                </Button>
            )}
          </Card>

          <Card title="Publication Strategy">
            <div className="space-y-3">
              <Button onClick={suggestJournals} isLoading={isLoading} leftIcon={<SparklesIcon/>} className="w-full" variant="secondary">
                AI Suggest Journals/Venues
              </Button>
              {journalSuggestions.length > 0 && (
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto p-1">
                  {journalSuggestions.map((j, idx) => (
                    <div key={idx} className="p-2 border rounded-md bg-gray-50 text-xs">
                      <h5 className="font-semibold text-primary-700">{j.name} (IF: {j.impactFactor || 'N/A'})</h5>
                      <p className="text-gray-600">{j.scope}</p>
                      {j.rationale && <p className="text-gray-500 italic mt-1">Rationale: {j.rationale}</p>}
                    </div>
                  ))}
                </div>
              )}
              <TextInput 
                label="Selected Target Journal" 
                value={targetJournal} 
                onChange={e => setTargetJournal(e.target.value)}
                placeholder="Enter name of chosen journal"
                disabled={!canEdit || isLoading}
              />
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          {activeSection && MANUSCRIPT_SECTIONS.find(s => s.id === activeSection) && (
            <Card 
                title={`Editing: ${MANUSCRIPT_SECTIONS.find(s => s.id === activeSection)?.name}`}
                actions={canEdit && (
                    <div className="flex space-x-1 sm:space-x-2">
                        <Button onClick={() => getAISectionHelp(activeSection, 'structure')} isLoading={isLoading} size="sm" variant="ghost" title="AI Structure Help"><SparklesIcon className="h-4 w-4 sm:mr-1"/>Structure</Button>
                        <Button onClick={() => getAISectionHelp(activeSection, 'language')} isLoading={isLoading} size="sm" variant="ghost" title="AI Language Refinement"><SparklesIcon className="h-4 w-4 sm:mr-1"/>Language</Button>
                        <Button onClick={() => getAISectionHelp(activeSection, 'references')} isLoading={isLoading} size="sm" variant="ghost" title="AI Reference Formatting"><SparklesIcon className="h-4 w-4 sm:mr-1"/>Refs</Button>
                    </div>
                )}
            >
              <TextAreaInput
                value={manuscript.sections?.[activeSection] || ''}
                onChange={e => handleSectionChange(activeSection, e.target.value)}
                placeholder={MANUSCRIPT_SECTIONS.find(s => s.id === activeSection)?.placeholder}
                rows={20}
                className="min-h-[400px]"
                disabled={!canEdit || isLoading}
              />
              {!canEdit && <p className="text-sm text-red-500 mt-2">You do not have permission to edit this manuscript.</p>}
            </Card>
          )}
        </div>
      </div>
      
      {isLoading && <LoadingSpinner message="AI is assisting..." />}

      <Card title="Manuscript Status & Submission" icon={<PaperAirplaneIcon/>} className="mt-6">
          <p className="text-sm text-gray-700 mb-2">Current Status: 
            <span className={`ml-2 font-semibold px-2 py-0.5 rounded-full text-xs
                ${manuscript.status === "Ready for Submission" 
                    ? "bg-success-light text-success-textLight" 
                    : "bg-yellow-100 text-yellow-700"}`}>
                {manuscript.status}
            </span>
          </p>
          {manuscript.status !== "Ready for Submission" && canEdit && (
              <Button onClick={markReadyForSubmission} isLoading={isLoading} variant="primary">
                  Mark as Ready for Submission (Simulated)
              </Button>
          )}
          {manuscript.status === "Ready for Submission" && (
              <p className="text-success font-medium">This manuscript draft is ready for final co-author review and submission to '{targetJournal || 'the selected journal'}'.</p>
          )}
          <p className="text-xs text-gray-500 mt-3">
              The I2O Cloud Platform aims for a validated idea to manuscript draft in under 48 working hours of combined effort.
          </p>
      </Card>

    </ModuleWrapper>
  );
};