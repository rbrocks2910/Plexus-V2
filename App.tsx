
import React, { useState, useCallback } from 'react';
import type { AppState, PatientCase, Feedback, Specialty, Rarity, ChatMessage, Investigation } from './types';
import { generatePatientCase, getCaseFeedback } from './services/geminiService';
import CaseSelection from './components/CaseSelection';
import ConsultationView from './components/ConsultationView';
import FeedbackView from './components/FeedbackView';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('selection');
  const [patientCase, setPatientCase] = useState<PatientCase | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [chatHistoryForFeedback, setChatHistoryForFeedback] = useState<ChatMessage[]>([]);

  const handleCaseStart = useCallback(async (specialty: Specialty, rarity: Rarity) => {
    try {
      // Case generation from local DB is synchronous but we keep async for API consistency
      const newCase = await generatePatientCase(specialty, rarity);
      setPatientCase(newCase);
      setAppState('consultation');
    } catch (error) {
      console.error("Error loading patient case:", error);
      alert("Failed to load a patient case. Please try again.");
    }
  }, []);

  const handleDiagnose = useCallback(async (
    finalDiagnosis: string,
    confidence: number,
    chatHistory: ChatMessage[],
    investigations: Investigation[],
    differentialDiagnosis: string[]
  ) => {
    if (!patientCase) return;

    setIsLoading(true);
    setLoadingMessage('Analyzing your diagnostic performance...');
    setChatHistoryForFeedback(chatHistory);

    try {
      const caseFeedback = await getCaseFeedback(
        finalDiagnosis,
        confidence,
        chatHistory,
        investigations,
        differentialDiagnosis,
        patientCase
      );
      setFeedback(caseFeedback);
      setAppState('feedback');
    } catch (error) {
      console.error("Error getting case feedback:", error);
      alert("Failed to get case feedback. Please check your connection or API key and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [patientCase]);

  const handleNewCase = useCallback(() => {
    setAppState('selection');
    setPatientCase(null);
    setFeedback(null);
    setChatHistoryForFeedback([]);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'selection':
        return <CaseSelection onCaseStart={handleCaseStart} />;
      case 'consultation':
        if (patientCase) {
          return <ConsultationView patientCase={patientCase} onDiagnose={handleDiagnose} />;
        }
        return null; // Should not happen
      case 'feedback':
        if (feedback && patientCase) {
          return <FeedbackView feedback={feedback} patientCase={patientCase} chatHistory={chatHistoryForFeedback} onNewCase={handleNewCase} />;
        }
        return null; // Should not happen
      default:
        return <CaseSelection onCaseStart={handleCaseStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] font-sans relative">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        {isLoading && <LoadingOverlay message={loadingMessage} />}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;