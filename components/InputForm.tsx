import React, { useState } from 'react';
import { Scale, Droplet, ArrowRight, User } from 'lucide-react';
import { PredictionInput } from '../types';

interface InputFormProps {
  onSubmit: (data: PredictionInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [sex, setSex] = useState<'Male' | 'Female'>('Female');
  const [glucose, setGlucose] = useState<string>('');
  const [bmi, setBmi] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (glucose && bmi) {
      onSubmit({
        sex,
        glucose: parseFloat(glucose),
        bmi: parseFloat(bmi)
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Sex Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <User size={18} className="text-indigo-500" />
            Sexo Biológico
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSex('Female')}
              className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base ${
                sex === 'Female' 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              Femenino
            </button>
            <button
              type="button"
              onClick={() => setSex('Male')}
              className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base ${
                sex === 'Male' 
                   ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                   : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              Masculino
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Glucose Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Droplet size={18} className="text-pink-500" />
              Glucosa (mg/dL)
            </label>
            <div className="relative">
              <input
                type="number"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                placeholder="95"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-lg"
                required
                min="20"
                max="600"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">mg/dL</span>
            </div>
            <p className="text-xs text-slate-400 ml-1">Valor en ayunas</p>
          </div>

          {/* BMI Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Scale size={18} className="text-emerald-500" />
              IMC (kg/m²)
            </label>
            <div className="relative">
              <input
                type="number"
                value={bmi}
                onChange={(e) => setBmi(e.target.value)}
                placeholder="24.5"
                step="0.1"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-lg"
                required
                min="10"
                max="100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">kg/m²</span>
            </div>
             <p className="text-xs text-slate-400 ml-1">Índice de Masa Corporal</p>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
          >
            {isLoading ? (
              'Procesando...'
            ) : (
              <>
                Calcular Riesgo HOMA-IR
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;