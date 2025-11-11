
export type AppState = 'selection' | 'consultation' | 'feedback';

export type Specialty = 'Cardiology' | 'Neurology' | 'Gastroenterology' | 'Pulmonology' | 'Infectious Disease';
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';

export interface PatientCase {
  specialty: Specialty;
  rarity: Rarity;
  demographics: {
    name: string;
    age: number;
    gender: string;
    occupation: string;
  };
  clinicalBackground: string; // Retained for feedback generation
  patientHistoryPrompt: string; // Narrative for AI roleplaying
  chiefComplaint: string;
  emotionalState: string;
  internalDiagnosis: string;
}

export interface ChatMessage {
  sender: 'user' | 'patient';
  text: string;
}

export interface Investigation {
  id: string;
  name: string;
  type: 'Lab' | 'Imaging' | 'Exam' | 'Custom';
  status: 'Ordered' | 'Pending' | 'Complete';
  results: InvestigationResult | null;
}

export interface InvestigationResult {
  reportTitle: string;
  findings: string;
}

export interface Feedback {
  diagnosticAccuracyScore: number;
  whatWentWell: string;
  areasForImprovement: string;
  missedClues: string[];
  differentialDiagnosisReview: string;
  diagnosticMethodCritique: string;
  clinicalExplanation: string;
}
