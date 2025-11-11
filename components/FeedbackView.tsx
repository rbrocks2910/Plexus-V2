
import React from 'react';
import type { Feedback, PatientCase, ChatMessage } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ClipboardCheckIcon } from './icons/FeedbackIcons';

interface FeedbackViewProps {
  feedback: Feedback;
  patientCase: PatientCase;
  chatHistory: ChatMessage[];
  onNewCase: () => void;
}

const HighlightedChat: React.FC<{ chatHistory: ChatMessage[], missedClues: string[], patientName: string }> = ({ chatHistory, missedClues, patientName }) => {
    const isMissedClue = (text: string) => {
        return missedClues.some(clue => text.includes(clue));
    };

    return (
        <div className="max-h-60 overflow-y-auto bg-[#0D1117] p-3 rounded-md border border-slate-700">
            {chatHistory.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === 'patient' && isMissedClue(msg.text) ? 'bg-yellow-900/50 border border-yellow-500/50' : ''}`}>
                    <span className={`font-bold ${msg.sender === 'user' ? 'text-cyan-400' : 'text-slate-300'}`}>
                        {msg.sender === 'user' ? 'You' : patientName}:
                    </span>
                    <span className="ml-2 text-slate-300">{msg.text}</span>
                </div>
            ))}
        </div>
    );
};

const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback, patientCase, chatHistory, onNewCase }) => {
  const scoreColor = feedback.diagnosticAccuracyScore === 100 ? 'text-green-400' : feedback.diagnosticAccuracyScore > 0 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="bg-[#161B22] border border-slate-700 rounded-lg shadow-2xl shadow-cyan-500/10 p-8 text-center">
        <h2 className="text-3xl font-bold text-cyan-300 mb-2">Case Debriefing</h2>
        <p className="text-slate-400">Correct Diagnosis: <span className="font-bold text-white">{patientCase.internalDiagnosis}</span></p>
      </div>

      <div className="bg-[#161B22] p-6 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-200">Diagnostic Accuracy</h3>
            <span className={`text-2xl font-bold ${scoreColor}`}>{feedback.diagnosticAccuracyScore}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4">
            <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-4 rounded-full"
                style={{ width: `${feedback.diagnosticAccuracyScore}%` }}
            ></div>
        </div>
         <p className="text-sm text-slate-400 mt-2 text-right">
            {feedback.diagnosticAccuracyScore === 100 && 'Excellent! Correct diagnosis.'}
            {feedback.diagnosticAccuracyScore > 0 && feedback.diagnosticAccuracyScore < 100 && 'Close. Partially correct diagnosis.'}
            {feedback.diagnosticAccuracyScore === 0 && 'Incorrect diagnosis. Keep practicing!'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161B22] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center"><CheckCircleIcon className="w-6 h-6 mr-2 text-green-500" />What Went Well</h3>
            <p className="text-slate-300">{feedback.whatWentWell}</p>
        </div>
        <div className="bg-[#161B22] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center"><XCircleIcon className="w-6 h-6 mr-2 text-red-500" />Areas for Improvement</h3>
            <p className="text-slate-300">{feedback.areasForImprovement}</p>
        </div>
      </div>
      
      {feedback.missedClues && feedback.missedClues.length > 0 && (
          <div className="bg-[#161B22] p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Missed Clues Review</h3>
            <p className="text-slate-400 mb-4">Key statements from the patient are highlighted below. Reflect on how these might have guided your diagnosis.</p>
            <HighlightedChat chatHistory={chatHistory} missedClues={feedback.missedClues} patientName={patientCase.demographics.name} />
          </div>
      )}

      <div className="bg-[#161B22] p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Differential Diagnosis Review</h3>
        <p className="text-slate-300">{feedback.differentialDiagnosisReview}</p>
      </div>

      <div className="bg-[#161B22] p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center"><ClipboardCheckIcon className="w-6 h-6 mr-2 text-purple-400" />Diagnostic Method Critique</h3>
        <p className="text-slate-300">{feedback.diagnosticMethodCritique}</p>
      </div>

      <div className="bg-[#161B22] p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center"><InformationCircleIcon className="w-6 h-6 mr-2 text-cyan-400" />Clinical Explanation</h3>
        <p className="text-slate-300 whitespace-pre-wrap">{feedback.clinicalExplanation}</p>
      </div>
      
      <div className="text-center pt-4">
        <button 
            onClick={onNewCase} 
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
            Start New Case
        </button>
      </div>
    </div>
  );
};

export default FeedbackView;
