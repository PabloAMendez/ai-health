export interface PredictionInput {
  sex: 'Male' | 'Female';
  glucose: number; // mg/dL
  bmi: number; // kg/m²
}

export interface PredictionResult {
  homaIndex: number;
  riskLevel: 'Normal' | 'Resistencia Leve' | 'Resistencia Severa';
  riskColor: string;
  explanation: string;
  recommendations: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}