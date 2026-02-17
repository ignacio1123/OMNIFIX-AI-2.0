
import React, { useState } from 'react';
import { Send, Bot, Loader2, Wrench, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getDiagnosticReport } from '../geminiService';

interface DiagnosticResult {
  summary: string;
  steps: string[];
  recommendedTools: string[];
  severity: string;
  difficulty: string;
}

const AITroubleshooter: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const data = await getDiagnosticReport(symptoms);
      setReport(data);
    } catch (err) {
      setError("Fallo la conexión con el motor OmniFix IA. Por favor, verifica tu conexión o API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityStyles = (severity: string) => {
    const s = severity.toLowerCase();
    if (s.includes('crítica') || s.includes('alta') || s.includes('critical') || s.includes('high')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (s.includes('media') || s.includes('medium')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-6 h-6 text-indigo-400" />
            <h2 className="text-lg font-bold">Diagnóstico Asistido IA</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-4">
            Describe los síntomas detalladamente (ej. "Pantallazo azul VIDEO_TDR_FAILURE", "El PC se apaga después de 5 minutos", "Lentitud al abrir archivos").
          </p>
          <form onSubmit={handleDiagnose} className="space-y-4">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Ingresa síntomas o códigos de error..."
              className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
            />
            <button
              type="submit"
              disabled={isLoading || !symptoms.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
              Analizar Problema
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="lg:col-span-7 h-full">
        {report ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-zinc-800/50 px-6 py-4 flex justify-between items-center border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold">Reporte de Solución</h3>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${getSeverityStyles(report.severity)}`}>
                {report.severity}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Resumen</h4>
                <p className="text-zinc-100 leading-relaxed">{report.summary}</p>
              </div>

              <div>
                <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">Guía de Reparación</h4>
                <div className="space-y-3">
                  {report.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-sm group">
                      <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <p className="pt-1 text-zinc-300 group-hover:text-zinc-100 transition-colors">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">Software Sugerido</h4>
                <div className="flex flex-wrap gap-2">
                  {report.recommendedTools.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-zinc-500 pt-2 italic">
                <span>Dificultad: {report.difficulty}</span>
                <span>Motor OmniFix AI</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600">
            <Bot className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-center px-12 italic">Esperando descripción de síntomas para generar reporte de solución...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITroubleshooter;
