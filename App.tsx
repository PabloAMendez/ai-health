import React, { useState } from 'react';
import { Activity, AlertTriangle, Loader2 } from 'lucide-react';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';
import { predictHomaWithGemini } from './services/geminiService';
import { PredictionResult, PredictionInput, AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [inputData, setInputData] = useState<PredictionInput | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePredictionSubmit = async (data: PredictionInput) => {
    setInputData(data);
    setAppState(AppState.ANALYZING);
    
    try {
      const prediction = await predictHomaWithGemini(data);
      setResult(prediction);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("Error en la inferencia del modelo. Por favor verifica los datos e intenta nuevamente.");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setInputData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Widget */}
        <div className="bg-indigo-600 p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-3 py-1 rounded-full mb-3 backdrop-blur-sm border border-indigo-400/30">
              <Activity size={16} className="text-indigo-100" />
              <span className="text-xs font-semibold text-indigo-50 tracking-wide uppercase">AI HOMA Predictor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Calculadora de Resistencia a la Insulina
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
              Estimación basada en IA (Modelo .h5) utilizando Glucosa, IMC y Sexo.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {appState === AppState.IDLE && (
            <InputForm onSubmit={handlePredictionSubmit} isLoading={false} />
          )}

          {appState === AppState.ANALYZING && (
            <div className="flex flex-col items-center justify-center py-16 animate-pulse text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full scale-150 opacity-50"></div>
                <Loader2 size={48} className="text-indigo-600 animate-spin relative z-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Procesando Datos Clínicos...</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                La red neuronal está analizando los biomarcadores para estimar el índice HOMA-IR.
              </p>
            </div>
          )}

          {appState === AppState.ERROR && (
             <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center max-w-md mx-auto my-8">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-900 mb-1">Error de Cálculo</h3>
                <p className="text-red-600 text-sm mb-4">{errorMsg}</p>
                <button 
                  onClick={handleReset}
                  className="px-5 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm shadow-sm"
                >
                  Intentar de nuevo
                </button>
             </div>
          )}

          {appState === AppState.SUCCESS && result && inputData && (
            <ResultsView 
              result={result} 
              input={inputData}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer Widget */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
           <p className="text-xs text-slate-400">
             Herramienta de soporte clínico basada en Inteligencia Artificial. No sustituye el criterio médico.
           </p>
        </div>
      </div>
    </div>
  );
};

export default App;