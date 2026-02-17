
import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Zap, Ghost, Loader2, Download, Copy, AlertCircle, Terminal, HardDrive, Trash2 } from 'lucide-react';
import { generateSecurityScript } from '../geminiService';

const SecurityLab: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'malware' | 'performance' | 'integrity'>('malware');
  const [issue, setIssue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!issue) return;
    setIsGenerating(true);
    setScript('');
    try {
      const code = await generateSecurityScript(issue, activeModule);
      setScript(code);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([script], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `OmniFix_${activeModule}_Fix.bat`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModuleCard 
          icon={<Ghost className="w-6 h-6" />} 
          label="Anti-Malware" 
          desc="Eliminar troyanos y procesos espía."
          isActive={activeModule === 'malware'}
          onClick={() => setActiveModule('malware')}
          color="text-red-400"
          bg="bg-red-500/10"
        />
        <ModuleCard 
          icon={<Zap className="w-6 h-6" />} 
          label="Optimización" 
          desc="Corregir lentitud y servicios pesados."
          isActive={activeModule === 'performance'}
          onClick={() => setActiveModule('performance')}
          color="text-yellow-400"
          bg="bg-yellow-500/10"
        />
        <ModuleCard 
          icon={<ShieldCheck className="w-6 h-6" />} 
          label="Integridad" 
          desc="Reparar registro y archivos corruptos."
          isActive={activeModule === 'integrity'}
          onClick={() => setActiveModule('integrity')}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Consola de Desinfección</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Nivel de Seguridad: Militar</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Describe el daño o virus:</label>
              <textarea 
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder={
                  activeModule === 'malware' ? "Ej: El proceso 'win_update.exe' no se deja cerrar y consume 90% CPU..." :
                  activeModule === 'performance' ? "Ej: Windows tarda 3 minutos en iniciar y el disco está siempre al 100%..." :
                  "Ej: No puedo abrir el Administrador de Tareas ni el Regedit..."
                }
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner"
              />

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !issue}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5 fill-current" />}
                Generar Script de Arreglo
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} className="text-yellow-500" />
              Checklist de Seguridad Real
            </h4>
            <div className="space-y-3">
              <CheckItem label="Desconecta la red antes de ejecutar el script." />
              <CheckItem label="Cierra todas las aplicaciones abiertas." />
              <CheckItem label="Asegúrate de tener respaldo de tus datos." />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {script ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col h-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="bg-zinc-800/80 px-6 py-4 flex justify-between items-center border-b border-zinc-700 backdrop-blur">
                  <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm">
                    <Terminal size={18} />
                    OmniFix_Security_Core.bat
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { navigator.clipboard.writeText(script); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className={`p-2 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-zinc-700 text-zinc-400 hover:text-white'}`}
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={downloadScript}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg"
                    >
                      <Download size={14} />
                      Descargar Fix
                    </button>
                  </div>
               </div>
               <div className="flex-1 p-6 bg-black/90 font-mono text-[11px] leading-relaxed text-zinc-400 overflow-auto scrollbar-hide">
                  <pre className="whitespace-pre-wrap">{script}</pre>
               </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600 p-12 text-center bg-zinc-900/20">
              {isGenerating ? (
                <div className="space-y-4">
                  <Loader2 className="w-16 h-16 mx-auto animate-spin text-indigo-500" />
                  <p className="italic font-bold animate-pulse">Compilando lógica de desinfección...</p>
                </div>
              ) : (
                <>
                  <ShieldAlert className="w-20 h-20 mb-6 opacity-10" />
                  <h4 className="text-zinc-500 font-bold mb-2">Esperando Entrada</h4>
                  <p className="text-sm italic max-w-sm">
                    Escribe los síntomas arriba para que la IA genere un script de limpieza profunda contra malware o lentitud.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ModuleCard: React.FC<{ icon: React.ReactNode, label: string, desc: string, isActive: boolean, onClick: () => void, color: string, bg: string }> = ({ icon, label, desc, isActive, onClick, color, bg }) => (
  <button 
    onClick={onClick}
    className={`p-5 rounded-3xl border transition-all text-left group relative overflow-hidden ${
      isActive ? 'bg-zinc-900 border-indigo-500 ring-1 ring-indigo-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
    }`}
  >
    <div className={`p-3 rounded-2xl w-fit mb-4 ${bg} ${color}`}>
      {icon}
    </div>
    <h4 className={`font-black text-sm mb-1 ${isActive ? 'text-white' : 'text-zinc-400'}`}>{label}</h4>
    <p className="text-[10px] text-zinc-500 leading-relaxed">{desc}</p>
    {isActive && (
      <div className="absolute bottom-0 right-0 p-2">
        <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')} animate-pulse`}></div>
      </div>
    )}
  </button>
);

const CheckItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 text-xs text-zinc-400">
    <div className="w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
      <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
    </div>
    {label}
  </div>
);

export default SecurityLab;
