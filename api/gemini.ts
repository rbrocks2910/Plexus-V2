// Vercel Serverless Function (Edge)
// This function acts as a secure backend proxy.
// It is the ONLY place where the API key and @google/genai SDK are used.

import { GoogleGenAI, Type } from "@google/genai";
import type { PatientCase, ChatMessage, Investigation, Feedback } from '../types';

// This is required for Vercel Edge functions
export const config = {
  runtime: 'edge',
};

const parseJsonFromMarkdown = <T,>(markdownString: string): T => {
    const jsonString = markdownString.replace(/^```json\s*|```\s*$/g, '');
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON from AI response:", jsonString);
        throw new Error("Invalid JSON response from AI");
    }
};

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    if (!process.env.API_KEY) {
        return new Response(JSON.stringify({ error: 'API_KEY not configured on server' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = ai.models;

    try {
        const { action, payload } = await request.json();

        switch (action) {
            case 'getPatientResponse': {
                const { chatHistory, patientCase } = payload as { chatHistory: ChatMessage[], patientCase: PatientCase };
                const systemInstruction = `You are roleplaying as a patient.
                    **Patient Profile:**
                    - Name: ${patientCase.demographics.name}
                    - Age: ${patientCase.demographics.age}
                    - Emotional State: ${patientCase.emotionalState}

                    **Your personal history and symptoms (THIS IS YOUR ONLY SOURCE OF TRUTH):**
                    ${patientCase.patientHistoryPrompt}

                    **RULES FOR ROLEPLAYING:**
                    1.  **BE THE PATIENT:** Respond to the doctor's questions from the perspective of ${patientCase.demographics.name}. Do not act like a doctor or an AI.
                    2.  **REVEAL INFORMATION GRADUALLY:** Only answer what the doctor asks. Do not volunteer extra information from your history unless it's a natural part of the conversation. If the doctor asks "how are you?", talk about your chief complaint.
                    3.  **BE HUMAN:** You do not know your own diagnosis. You cannot interpret lab results. If asked a complex medical question you don't understand, respond naturally (e.g., "I'm not sure what that means, doctor.", "Can you explain that in simple terms?").
                    4.  **MAINTAIN YOUR PERSONA:** Remember your emotional state is ${patientCase.emotionalState}. Let this color your responses. For example, if you are anxious, your answers might be shorter or you might ask worried questions back.
                    5.  **KEEP IT CONCISE AND CONVERSATIONAL:** Use simple, everyday language. Avoid long paragraphs.
                    6.  **DO NOT MENTION THE DIAGNOSIS:** You have no knowledge of your final diagnosis. Your knowledge is limited to the symptoms and history provided above. Do not give away the diagnosis.`;

                const lastUserMessage = chatHistory[chatHistory.length - 1].text;
                const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                    history: chatHistory.slice(0, -1).map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.text }],
                    }))
                });
                const response = await chat.sendMessage({ message: lastUserMessage });
                return new Response(JSON.stringify({ text: response.text.trim() }), { headers: { 'Content-Type': 'application/json' } });
            }

            case 'getInvestigationResult': {
                const { testName, patientCase } = payload as { testName: string, patientCase: PatientCase };
                const prompt = `You are a medical lab/radiology reporting system. Based on the patient case with the diagnosis of "${patientCase.internalDiagnosis}", generate a realistic result for the following investigation: "${testName}". The result should be clinically relevant and consistent with the diagnosis but should NOT explicitly state the diagnosis. For example, if the diagnosis is myocardial infarction, an ECG might show ST-segment elevation. Present the result in a professional report format. Output as a JSON object.`;

                const response = await model.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                reportTitle: { type: Type.STRING },
                                findings: { type: Type.STRING }
                            }
                        }
                    }
                });
                const result = parseJsonFromMarkdown<{reportTitle: string; findings: string}>(response.text);
                return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
            }

            case 'getAIGuiderAdvice': {
                const { chatHistory, investigations, differentialDiagnosis, patientCase } = payload as { chatHistory: ChatMessage[], investigations: Investigation[], differentialDiagnosis: string[], patientCase: PatientCase };
                const systemInstruction = "You are a senior attending physician supervising a medical student during a patient consultation. Your role is to provide Socratic guidance. Do not reveal the diagnosis. Instead, critique the student's process, evaluate their thinking, and guide them on the next logical steps. Adopt a professional, educational, and slightly formal tone, as if you are speaking to them in a real clinical setting.";
    
                const prompt = `Senior Physician, please review this student's progress with the patient.

                    **Patient Presentation:**
                    - Chief Complaint: ${patientCase.chiefComplaint}
                    - Demographics: ${patientCase.demographics.age}-year-old ${patientCase.demographics.gender}.

                    **Student's Actions So Far:**
                    - **Recent Conversation History:**
                    ${chatHistory.slice(-10).map(m => `${m.sender === 'user' ? 'Student' : 'Patient'}: ${m.text}`).join('\n')}
                    - **Investigations Ordered:**
                    ${investigations.map(i => `${i.name} (${i.status})`).join(', ') || 'None yet.'}

                    **Student's Current Thinking:**
                    - **Differential Diagnosis List:**
                    ${differentialDiagnosis.join(', ') || 'Not specified yet.'}

                    **Your Task:**
                    Provide your guidance to the student. Structure your response into three clear sections if possible, using markdown for formatting (e.g., bold headings):
                    1.  **Critique of Approach:** Briefly evaluate their history-taking and investigation choices so far. What have they done well? What could they be doing more effectively or what lines of questioning are they missing?
                    2.  **Critique of Differential Diagnosis:** Analyze their current list of differential diagnoses. Is it reasonable? Are there any obvious diagnoses they are missing based on the presentation? Are they thinking too broadly or too narrowly? Provide your reasoning.
                    3.  **Guidance for Next Steps:** Based on your critique, what specific questions should they ask or what examinations/investigations should they prioritize next? Provide the clinical reasoning for your suggestions to help them connect the dots.

                    Remember, the goal is to guide their thinking process, not to give them the diagnosis.`;

                const response = await model.generateContent({ model: 'gemini-2.5-pro', contents: prompt, config: { systemInstruction } });
                return new Response(JSON.stringify({ advice: response.text }), { headers: { 'Content-Type': 'application/json' } });
            }

            case 'getCaseFeedback': {
                const { userDiagnosis, confidence, chatHistory, investigations, differentialDiagnosis, patientCase } = payload as { userDiagnosis: string, confidence: number, chatHistory: ChatMessage[], investigations: Investigation[], differentialDiagnosis: string[], patientCase: PatientCase };
                const prompt = `You are a medical education assessment AI. The correct diagnosis for this case was "${patientCase.internalDiagnosis}". The student submitted a diagnosis of "${userDiagnosis}" with ${confidence}% confidence. 
                    Analyze the student's performance based on the conversation history, ordered investigations, and their differential diagnosis list.
                    A key part of your analysis must be a critique of the student's diagnostic methodology. Compare their sequence of actions (history taking, physical exams, investigations) against the standard, logical clinical workflow for a patient presenting with "${patientCase.chiefComplaint}". Comment on whether their approach was efficient and followed a logical sequence (e.g., history -> exam -> basic tests -> advanced tests) or if they jumped to conclusions.
                    Provide a comprehensive feedback report. Format the output as a single JSON object.`;

                const response = await model.generateContent({
                    model: 'gemini-2.5-pro',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                diagnosticAccuracyScore: { type: Type.NUMBER, description: "A number (0 for incorrect, 50 for partially correct/related, 100 for correct)." },
                                whatWentWell: { type: Type.STRING, description: "A paragraph explaining the student's strengths." },
                                areasForImprovement: { type: Type.STRING, description: "A paragraph with constructive criticism." },
                                missedClues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of short, exact quotes from the patient's conversation that were key clues." },
                                differentialDiagnosisReview: { type: Type.STRING, description: "A paragraph analyzing the student's differential diagnosis list." },
                                diagnosticMethodCritique: { type: Type.STRING, description: "A critique of the student's diagnostic methodology, comparing their approach to standard clinical practice. Analyze the sequence of history taking, examination, and investigations." },
                                clinicalExplanation: { type: Type.STRING, description: `A detailed explanation of the correct diagnosis, "${patientCase.internalDiagnosis}", including its pathophysiology, clinical presentation, and management.` },
                            }
                        }
                    }
                });
                const result = parseJsonFromMarkdown<Feedback>(response.text);
                return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
            }

            default:
                return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error: any) {
        console.error('API Route Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
