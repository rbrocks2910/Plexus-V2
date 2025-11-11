import type { PatientCase, Specialty, Rarity, ChatMessage, Investigation, Feedback } from '../types';
import { CASE_DATABASE } from '../caseDatabase';

export const generatePatientCase = async (specialty: Specialty, rarity: Rarity): Promise<PatientCase> => {
    // This function remains on the client-side as it uses a local database and does not require an API key.
    const matchingCases = CASE_DATABASE.filter(
        c => c.specialty === specialty && c.rarity === rarity
    );

    if (matchingCases.length === 0) {
        throw new Error(`No cases found for ${specialty} with ${rarity} rarity.`);
    }

    const randomIndex = Math.floor(Math.random() * matchingCases.length);
    const selectedCase = matchingCases[randomIndex];
    
    return Promise.resolve(selectedCase);
};

// --- API Wrapper ---
// A generic helper function to call our new backend endpoint.
async function callApi<T>(action: string, payload: unknown): Promise<T> {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred' }));
        console.error(`API Error for action "${action}":`, errorData);
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
}

// --- Refactored Service Functions ---
// These functions now securely call the backend proxy instead of the Gemini API directly.

export const getPatientResponse = async (chatHistory: ChatMessage[], patientCase: PatientCase): Promise<string> => {
    const { text } = await callApi<{ text: string }>('getPatientResponse', { chatHistory, patientCase });
    return text;
};

export const getInvestigationResult = async (testName: string, patientCase: PatientCase): Promise<{reportTitle: string; findings: string}> => {
    return callApi<{reportTitle: string; findings: string}>('getInvestigationResult', { testName, patientCase });
};

export const getAIGuiderAdvice = async (chatHistory: ChatMessage[], investigations: Investigation[], differentialDiagnosis: string[], patientCase: PatientCase): Promise<string> => {
    const { advice } = await callApi<{ advice: string }>('getAIGuiderAdvice', { chatHistory, investigations, differentialDiagnosis, patientCase });
    return advice;
};

export const getCaseFeedback = async (
    userDiagnosis: string,
    confidence: number,
    chatHistory: ChatMessage[],
    investigations: Investigation[],
    differentialDiagnosis: string[],
    patientCase: PatientCase
): Promise<Feedback> => {
    return callApi<Feedback>('getCaseFeedback', { userDiagnosis, confidence, chatHistory, investigations, differentialDiagnosis, patientCase });
};
