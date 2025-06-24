
import React, { useState, useEffect, useCallback } from 'react';
import { ModuleWrapper } from '../core/ModuleWrapper';
import { TableCellsIcon, SparklesIcon, CheckCircleIcon, BellIcon, Cog6ToothIcon } from '../../assets/icons';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { TextAreaInput } from '../shared/TextAreaInput';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useProject } from '../../contexts/ProjectContext';
import { DataSet, StatisticalAnalysis, UserRole, ModuleStage } from '../../types';
import { generateText, generateJsonOutput } from '../../services/geminiService';
import { NotificationBanner } from '../shared/NotificationBanner';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_USERS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';


const MOCK_DATA_SAMPLE = [
  { name: 'Group A', value: 400, pv: 2400, amt: 2400 },
  { name: 'Group B', value: 300, pv: 1398, amt: 2210 },
  { name: 'Group C', value: 200, pv: 9800, amt: 2290 },
  { name: 'Group D', value: 278, pv: 3908, amt: 2000 },
  { name: 'Group E', value: 189, pv: 4800, amt: 2181 },
];


export const DataAnalysisModule: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    currentProject, 
    updateDataSet,
    updateAnalysis,
    isLoading, 
    setIsLoading, 
    error, 
    setError,
    setProjectStage,
    clearError
  } = useProject();

  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [dataPreview, setDataPreview] = useState<Record<string, any>[] | null>(null);
  const [showMeetingPlaceholder, setShowMeetingPlaceholder] = useState(false);

  const [analysisPlan, setAnalysisPlan] = useState('');
  const [statisticalResults, setStatisticalResults] = useState<Partial<StatisticalAnalysis>>({});
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    if (currentProject?.dataSet) {
      setGeneratedSQL(currentProject.dataSet.sourceQuery || '');
      setDataPreview(currentProject.dataSet.simulatedData || null);
    }
    if (currentProject?.analysis) {
      setAnalysisPlan(currentProject.analysis.plan || '');
      setStatisticalResults(currentProject.analysis);
    }
    if (currentProject?.assignedStatistician && (!currentProject.dataSet || !currentProject.analysis)) {
        setShowMeetingPlaceholder(true);
    }
  }, [currentProject]);

  const handleQueryGeneration = async () => {
    if (!currentProject || !naturalLanguageQuery.trim()) {
      setError("Please provide a natural language query for data extraction.");
      return;
    }
    setIsLoading(true);
    clearError();
    setNotification(null);

    const systemInstruction = "You are an AI data assistant. Translate the user's natural language request into an SQL query. Assume a generic relational database schema. Output only the SQL query.";
    const prompt = `Natural Language Request: "${naturalLanguageQuery}" \nTranslate this into an SQL query.`;
    
    const response = await generateText(prompt, systemInstruction);

    if (response.text && !response.error) {
      const extractedSQL = response.text.replace(/```sql\n?|\n?```/g, '').trim();
      setGeneratedSQL(extractedSQL);
      updateDataSet({ name: "Extracted Dataset", description: `Data from query: ${naturalLanguageQuery}`, sourceQuery: extractedSQL });
      setNotification({ message: "SQL query generated. Review before 'execution'.", type: 'info' });
    } else {
      setError(response.error || "Failed to generate SQL query.");
      setNotification({ message: `Error: ${response.error}`, type: 'error' });
    }
    setIsLoading(false);
  };

  const simulateDataExtraction = () => {
    if (!generatedSQL) {
        setError("No SQL query to execute.");
        return;
    }
    setIsLoading(true);
    setTimeout(() => {
        const simulatedData = MOCK_DATA_SAMPLE.map(item => ({
            ...item,
            id: Math.random().toString(36).substring(7),
            diagnosis_code: `ICD10-${Math.floor(Math.random() * 100)}`,
            hba1c: (Math.random() * 5 + 5).toFixed(1) 
        }));
        setDataPreview(simulatedData);
        updateDataSet({ simulatedData: simulatedData });
        setNotification({ message: "Data extraction simulated successfully. Preview below.", type: 'success' });
        setIsLoading(false);
    }, 1500);
  };

  const handleStatisticalAnalysis = async () => {
    if (!currentProject || !analysisPlan.trim() || !dataPreview) {
      setError("Please define an analysis plan and ensure data is 'extracted'.");
      return;
    }
    setIsLoading(true);
    clearError();
    setNotification(null);

    const systemInstruction = "You are an AI statistical analysis engine. Generate textual statistical results, formatted tables (markdown), and suggest graphical visualizations.";
    const dataSampleForPrompt = `Data Sample (first 3 rows):\n${JSON.stringify(dataPreview.slice(0,3), null, 2)}`;
    const prompt = `Analysis Plan:
    ---
    ${analysisPlan}
    ---
    ${dataSampleForPrompt}
    
    Execute this plan. Provide:
    1. Descriptive Statistics.
    2. Inferential Test Results.
    3. Formatted Tables (Markdown).
    4. Suggestions for Graphical Visualizations.
    `;
    
    const response = await generateText(prompt, systemInstruction, false);

    if (response.text && !response.error) {
        const newAnalysisResults = { 
            plan: analysisPlan,
            results: response.text, 
            tables: "See results section for Markdown tables.", 
            figures: "Bar chart of group values (see visualization). Histogram of HBa1c.",
            isValidated: false 
        };
        setStatisticalResults(newAnalysisResults);
        updateAnalysis(newAnalysisResults);
        setNotification({ message: "AI statistical analysis performed. Results ready for review.", type: 'info' });
    } else {
      setError(response.error || "Failed to perform AI statistical analysis.");
      setNotification({ message: `Error: ${response.error}`, type: 'error' });
    }
    setIsLoading(false);
  };

  const validateAnalysis = () => {
    if (!currentProject || !currentProject.analysis) return;
    updateAnalysis({ isValidated: true, statisticianInterpretation: statisticalResults.statisticianInterpretation || "Validated by Statistician." });
    setNotification({ message: "Statistical analysis validated by Statistician (Simulated).", type: 'success' });
  };

  const proceedToManuscript = () => {
    if (currentProject?.analysis?.isValidated) {
        setProjectStage(ModuleStage.MANUSCRIPT_WRITING);
        setNotification({ message: "Proceeding to Manuscript Writing.", type: 'success' });
        navigate('/manuscript');
    } else {
        setError("Statistical analysis must be validated by a Statistician before proceeding.");
        setNotification({ message: "Statistical analysis must be validated by a Statistician before proceeding.", type: 'error' });
    }
  };

  const isStatistician = currentUser?.role === UserRole.STATISTICIAN;
  const canQuery = currentUser?.role === UserRole.HCP || currentUser?.role === UserRole.RESEARCHER || isStatistician;
  const chartTextColor = '#374151'; // gray-700 for light mode

  if (!currentProject || currentProject.proposal?.ethicsStatus !== "Approved") {
    return (
      <ModuleWrapper title="Data Collection, Aggregation & Analysis" icon={<TableCellsIcon />}>
        <Card>
          <p className="text-gray-600 text-center py-8">
            An approved research proposal is required to begin data collection and analysis.
          </p>
        </Card>
      </ModuleWrapper>
    );
  }
  
  return (
    <ModuleWrapper title="Data Collection, Aggregation & Analysis" icon={<TableCellsIcon />} subtitle={`For project: ${currentProject.title}`}>
      {notification && <NotificationBanner type={notification.type} message={notification.message} onDismiss={() => setNotification(null)} />}
      {error && <NotificationBanner type="error" message={error} onDismiss={clearError} />}

      {showMeetingPlaceholder && (
          <Card title="Data Planning Meeting" icon={<BellIcon />} className="mb-6 bg-info-light border-info-light">
              <p className="text-info-textLight">
                  A Statistician (<strong>{MOCK_USERS.find(u => u.id === currentProject.assignedStatistician)?.name || 'Expert'}</strong>) is assigned.
                  A (simulated) collaborative meeting should occur.
              </p>
              <Button onClick={() => setShowMeetingPlaceholder(false)} size="sm" variant="secondary" className="mt-3">Mark as Met (Simulated)</Button>
          </Card>
      )}

      <Card title="Data Collection - Pathway A: AI Query Generation" icon={<Cog6ToothIcon/>} className="mb-6">
        <div className="space-y-4">
          <TextAreaInput
            label="Describe Data Requirements (Natural Language)"
            value={naturalLanguageQuery}
            onChange={e => setNaturalLanguageQuery(e.target.value)}
            placeholder="e.g., Extract age, gender, diagnosis codes, and latest HbA1c for patients with Type 2 Diabetes..."
            rows={3}
            disabled={isLoading || !canQuery}
          />
          <Button onClick={handleQueryGeneration} isLoading={isLoading} disabled={!naturalLanguageQuery.trim() || !canQuery} leftIcon={<SparklesIcon />} variant="primary">
            Generate SQL Query
          </Button>
          {!canQuery && <p className="text-sm text-red-500">You do not have permission to generate queries.</p>}

          {generatedSQL && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700">Generated SQL Query (for review):</h4>
              <pre className="bg-gray-900 text-white p-3 rounded-md text-sm overflow-x-auto my-2"><code>{generatedSQL}</code></pre>
              <p className="text-xs text-gray-500">Review by data custodian or Statistician before execution.</p>
              <Button onClick={simulateDataExtraction} isLoading={isLoading} className="mt-2" variant="secondary">
                Simulate Data Extraction
              </Button>
            </div>
          )}
        </div>
      </Card>
      
       <Card title="Data Collection - Pathway B: AI-Assisted GUI Extraction (Conceptual)" icon={<Cog6ToothIcon/>} className="mb-6 opacity-60">
           <p className="text-sm text-gray-500">
               This pathway is for systems without direct DB/API access. AI would use GUI automation. (Conceptual placeholder)
           </p>
       </Card>

      {dataPreview && (
        <Card title="Data Preview (Simulated)" className="mb-6">
          <p className="text-sm text-gray-600 mb-2">A small sample of the 'extracted' data:</p>
          <div className="overflow-x-auto max-h-60 border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(dataPreview[0] || {}).map(key => (
                    <th key={key} className="px-4 py-2 text-left font-medium text-gray-500 tracking-wider">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataPreview.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2 whitespace-nowrap text-gray-700">{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {dataPreview.length > 5 && <p className="text-xs text-gray-500 mt-1">Showing first 5 of {dataPreview.length} rows.</p>}
        </Card>
      )}
      
      <Card title="Statistical Analysis" icon={<SparklesIcon/>} className="mb-6">
        <div className="space-y-4">
          <TextAreaInput
            label="Define Detailed Analysis Plan (by Statistician)"
            value={analysisPlan}
            onChange={e => setAnalysisPlan(e.target.value)}
            placeholder="e.g., Descriptive statistics. T-tests for continuous outcomes. Chi-square for categorical. Alpha = 0.05."
            rows={4}
            disabled={isLoading || !isStatistician}
          />
           {!isStatistician && <p className="text-sm text-red-500">Only Statisticians can define the analysis plan.</p>}
          
          <Button onClick={handleStatisticalAnalysis} isLoading={isLoading} disabled={!analysisPlan.trim() || !dataPreview || !isStatistician} variant="primary">
            Perform AI Statistical Analysis
          </Button>

          {isLoading && !statisticalResults.results && <LoadingSpinner message="AI performing analysis..." />}

          {statisticalResults.results && (
            <div className="mt-4 space-y-3">
              <h4 className="font-semibold text-gray-700">AI Generated Statistical Output:</h4>
              <div className="prose prose-sm max-w-none p-3 border rounded-md bg-gray-50 overflow-auto max-h-96 whitespace-pre-wrap">
                {statisticalResults.results}
              </div>
              
              <h4 className="font-semibold text-gray-700 mt-4">Simulated Visualization (Example):</h4>
               <Card title="Example Chart: Group Values" className="bg-gray-50">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={MOCK_DATA_SAMPLE} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                        <XAxis dataKey="name" tick={{ fill: chartTextColor }} />
                        <YAxis tick={{ fill: chartTextColor }}/>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#FFFFFF', border: `1px solid #E5E7EB`}} 
                            labelStyle={{ color: chartTextColor }}
                            itemStyle={{ color: chartTextColor }}
                        />
                        <Legend wrapperStyle={{ color: chartTextColor }}/>
                        <Bar dataKey="value" fill="#3b82f6" />
                        <Bar dataKey="pv" fill="#0ea5e9" />
                    </BarChart>
                </ResponsiveContainer>
               </Card>

              {isStatistician && (
                <>
                  <TextAreaInput
                    label="Statistician's Interpretation & Validation Notes"
                    value={statisticalResults.statisticianInterpretation || ''}
                    onChange={e => setStatisticalResults(prev => ({ ...prev, statisticianInterpretation: e.target.value }))}
                    placeholder="Provide substantive interpretation of AI results. Note any corrections or validation points."
                    rows={3}
                    disabled={isLoading}
                  />
                  <Button onClick={validateAnalysis} isLoading={isLoading} disabled={statisticalResults.isValidated} leftIcon={<CheckCircleIcon />} variant="secondary">
                    {statisticalResults.isValidated ? "Analysis Validated" : "Validate Analysis"}
                  </Button>
                </>
              )}
               {!isStatistician && statisticalResults.isValidated && (
                   <p className="text-sm text-success flex items-center"><CheckCircleIcon className="h-5 w-5 mr-1"/> Analysis validated by Statistician.</p>
               )}
            </div>
          )}
        </div>
      </Card>

      {currentProject?.analysis?.isValidated && (
        <Button onClick={proceedToManuscript} isLoading={isLoading} className="mt-6" variant="primary">
          Proceed to Manuscript Writing
        </Button>
      )}
    </ModuleWrapper>
  );
};
