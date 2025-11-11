import React, { useState, useCallback, useEffect } from 'react';
import type { PatientCase, ChatMessage, Investigation } from '../types';
import { getPatientResponse, getInvestigationResult, getAIGuiderAdvice } from '../services/geminiService';
import PatientInfoPanel from './panels/PatientInfoPanel';
import ChatPanel from './panels/ChatPanel';
import InvestigationsPanel from './panels/InvestigationsPanel';
import DifferentialDiagnosisPanel from './panels/DifferentialDiagnosisPanel';
import AIGuiderPanel from './panels/AIGuiderPanel';
import DiagnosisSubmissionModal from './modals/DiagnosisSubmissionModal';

interface ConsultationViewProps {
  patientCase: PatientCase;
  onDiagnose: (
    finalDiagnosis: string,
    confidence: number,
    chatHistory: ChatMessage[],
    investigations: Investigation[],
    differentialDiagnosis: string[]
  ) => void;
}

const ConsultationView: React.FC<ConsultationViewProps> = ({ patientCase, onDiagnose }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (patientCase) {
        setChatHistory([
            {
                sender: 'patient',
                text: `Hello Doctor, I'm ${patientCase.demographics.name}. Thank you for seeing me.`
            }
        ]);
    }
  }, [patientCase]);

  const handleSendMessage = useCallback(async (message: string) => {
    const newUserMessage: ChatMessage = { sender: 'user', text: message };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    try {
      const patientReply = await getPatientResponse(updatedHistory, patientCase);
      const newPatientMessage: ChatMessage = { sender: 'patient', text: patientReply };
      setChatHistory(prev => [...prev, newPatientMessage]);
    } catch (error) {
      console.error("Error getting patient response:", error);
      const errorMessage: ChatMessage = { sender: 'patient', text: "I'm sorry, I'm not feeling well enough to talk right now. Please try again." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatHistory, patientCase]);
  
  const handleOrderInvestigation = useCallback(async (name: string, type: 'Lab' | 'Imaging' | 'Exam' | 'Custom') => {
    const newInvestigation: Investigation = { id: Date.now().toString(), name, type, status: 'Pending', results: null };
    setInvestigations(prev => [...prev, newInvestigation]);

    try {
      const results = await getInvestigationResult(name, patientCase);
      setInvestigations(prev => prev.map(inv => inv.id === newInvestigation.id ? { ...inv, status: 'Complete', results } : inv));
    } catch (error) {
      console.error("Error getting investigation results:", error);
       setInvestigations(prev => prev.map(inv => inv.id === newInvestigation.id ? { ...inv, status: 'Complete', results: { reportTitle: name, findings: 'Error fetching results.' } } : inv));
    }
  }, [patientCase]);

  const handleSubmitDiagnosis = (finalDiagnosis: string, confidence: number) => {
    onDiagnose(finalDiagnosis, confidence, chatHistory, investigations, differentialDiagnosis);
  };
  
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
            <PatientInfoPanel patientCase={patientCase} />
            <DifferentialDiagnosisPanel
                diagnoses={differentialDiagnosis}
                setDiagnoses={setDifferentialDiagnosis}
            />
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-6 flex flex-col">
            <ChatPanel 
                chatHistory={chatHistory} 
                onSendMessage={handleSendMessage}
                patientName={patientCase.demographics.name}
                isLoading={isChatLoading}
            />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-6">
            <InvestigationsPanel investigations={investigations} onOrderInvestigation={handleOrderInvestigation} />
            <AIGuiderPanel 
                onGetAdvice={async () => getAIGuiderAdvice(chatHistory, investigations, differentialDiagnosis, patientCase)}
            />
            <div className="bg-[#161B22] border border-slate-700 rounded-lg p-4">
                <button
                    onClick={() => setIsSubmitting(true)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 transform hover:scale-105"
                >
                    Submit Final Diagnosis
                </button>
            </div>
        </div>
        {isSubmitting && (
            <DiagnosisSubmissionModal
                onClose={() => setIsSubmitting(false)}
                onSubmit={handleSubmitDiagnosis}
            />
        )}
    </div>
  );
};

export default ConsultationView;