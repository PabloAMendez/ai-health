import React from 'react';
import { PredictionResult, PredictionInput } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, ClipboardList, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResultsViewProps {
  result: PredictionResult;
  input: PredictionInput;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, input, onReset }) => {
  // Gauge Data
  const gaugeValue = Math.min(Math.max(result.homaIndex, 0), 10); // Cap at 10
  const data = [
    { name: 'Value', value: gaugeValue },
    { name: 'Remaining', value: 10 - gaugeValue },
  ];
  
  // Colors adapted for light mode
  const getRiskColor = (level: string) => {
    if (level.includes("Normal")) return "#10b981"; // Emerald 500
    if (level.includes("Leve")) return "#f59e0b"; // Amber 500
    return "#ef4444"; // Red 500
  };

  const activeColor = getRiskColor(result.riskLevel);

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* Top Section: Score and Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Score Card */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
           
           <div className="relative z-10 w-full text-center">
             <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
               Índice Estimado
             </h3>
             <h4 className="text-2xl font-bold text-slate-800 mb-4">HOMA-IR</h4>
             
             {/* Gauge Chart */}
             <div className="h-40 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="70%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={activeColor} />
                      <Cell fill="#e2e8f0" /> 
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Value */}
                <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-4xl font-extrabold text-slate-800 block leading-none">{result.homaIndex.toFixed(1)}</span>
                </div>
             </div>

             <div className={`mt-0 py-1.5 px-4 rounded-full inline-block text-sm font-bold border`}
                  style={{ backgroundColor: `${activeColor}15`, color: activeColor, borderColor: `${activeColor}40` }}>
               {result.riskLevel}
             </div>
           </div>
        </div>

        {/* Input Summary & Quick Explanation */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <h4 className="text-xs text-slate-400 uppercase mb-3 font-bold tracking-wide">Parámetros Analizados</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
               <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                 <div className="text-[10px] text-slate-400 uppercase font-semibold">Sexo</div>
                 <div className="text-sm font-bold text-slate-700">{input.sex === 'Male' ? 'M' : 'F'}</div>
               </div>
               <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                 <div className="text-[10px] text-slate-400 uppercase font-semibold">Glucosa</div>
                 <div className="text-sm font-bold text-slate-700">{input.glucose}</div>
               </div>
               <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                 <div className="text-[10px] text-slate-400 uppercase font-semibold">IMC</div>
                 <div className="text-sm font-bold text-slate-700">{input.bmi}</div>
               </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex gap-2 items-start">
               <Info className="text-indigo-600 mt-0.5 shrink-0" size={16} />
               <p className="text-sm text-indigo-900 leading-snug">
                 {result.explanation}
               </p>
            </div>
          </div>
        </div>

      </div>

      {/* Recommendations */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-slate-800 text-lg font-bold flex items-center gap-2 mb-4">
          <ClipboardList className="text-indigo-600" size={20} />
          Recomendaciones Clínicas
        </h3>
        <div className="grid gap-3">
          {result.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              {result.riskLevel.includes('Normal') 
                ? <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                : <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={18} />
              }
              <span className="text-slate-600 text-sm font-medium">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onReset}
        className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center justify-center gap-2 mt-4"
      >
        <RefreshCw size={18} />
        Nueva Consulta
      </button>

    </div>
  );
};

export default ResultsView;