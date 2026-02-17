
import React, { useState } from 'react';
import { Database, Search, FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { getRecoveryAdvice } from '../geminiService';

const DataRecovery: React.FC = () => {
  const [fileType, setFileType] = useState('');
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  const handleStartScan = async () => {
    setLoading(true);
    try {
      const res = await getRecoveryAdvice(fileType, scenario);
      setAdvice(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-emerald-400 w-6 h-6" />
            <h2 className="text-xl font-bold">Rescate de Datos</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Tipo de Archivo</label>
              <select 
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Seleccionar...</option>
                <option value="Fotos/Videos">Fotos y Videos</option>
                <option value="Documentos">Documentos (PDF, Office)</option>
                <option value="Bases de Datos">Bases de Datos</option>
                <option value="Todo">Escaneo Completo</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Escenario de Pérdida</label>
              <textarea 
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Ej: Borré la carpeta por error, el disco pide formato..."
                className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <button 
              onClick={handleStartScan}
              disabled={loading || !fileType || !scenario}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
              Analizar Posibilidades de Recuperación
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        {advice ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-1">Plan de Rescate</h3>
                <p className="text-zinc-500 text-sm">Basado en algoritmos de recuperación profunda.</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-400">{advice.chance}</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Probabilidad</div>
              </div>
            </div>

            <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-4">
              <CheckCircle className="text-emerald-400 w-8 h-8" />
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase">Herramienta Recomendada</p>
                <p className="text-lg font-bold">{advice.tool}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Procedimiento Técnico</h4>
              {advice.steps.map((step: string, i: number) => (
                <div key={i} className="flex gap-4 items-start p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">{i+1}</span>
                  <p className="text-sm text-zinc-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600 p-12 text-center">
            <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
            <p className="italic">Proporcione detalles sobre la pérdida de datos para que la IA elabore un plan de rescate especializado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataRecovery;
