
import type { Specialty, Rarity } from './types';

export const SPECIALTIES: Specialty[] = [
  'Cardiology', 'Neurology', 'Gastroenterology', 'Pulmonology', 'Infectious Disease'
];

export const RARITIES: Rarity[] = [
  'Common', 'Uncommon', 'Rare', 'Very Rare'
];

export const INVESTIGATIONS_LIST = {
  labs: [
    'Complete Blood Count (CBC)', 'Basic Metabolic Panel (BMP)', 'Comprehensive Metabolic Panel (CMP)', 
    'Liver Function Tests (LFTs)', 'Electrolytes', 'Inflammatory Markers (ESR, CRP)', 
    'Urinalysis', 'Blood Culture'
  ],
  imaging: [
    'Chest X-Ray', 'Abdominal CT Scan', 'Head CT Scan', 'Ultrasound Abdomen', 
    'ECG', 'MRI Brain', 'Echocardiogram'
  ],
  exams: [
    'Cardiac Examination', 'Respiratory Examination', 'Neurological Examination', 
    'Abdominal Examination', 'Skin Examination', 'Mental Status Examination'
  ]
};

export const LOADING_TIPS = [
    "Tip: A thorough patient history is often more revealing than a battery of tests.",
    "Tip: Always consider the patient's emotional state as a potential clinical clue.",
    "Tip: Differential diagnosis is a process of elimination. Start broad.",
    "Tip: Correlate imaging findings with clinical presentation; don't treat the scan.",
    "Tip: Occam's Razor suggests the simplest explanation is often the best, but not always."
];