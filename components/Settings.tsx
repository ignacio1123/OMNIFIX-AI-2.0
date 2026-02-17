
import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Eye, Database, Monitor, Bell, Cpu, Globe, Zap, Save, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const [heuristicLevel, setHeuristicLevel] = useState('surgical');
  const [telemetry, setTelemetry] = useState(true);
  const [autoExport, setAutoExport] = useState(false);
  const [theme, setTheme] = useState('pro-dark');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
          <SettingsIcon size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter italic uppercase">Configuración de Suite</h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">OmniFix Core Control v2.5.0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* IA & Diagnostics */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Cpu size={18} className="text-indigo-400" />
              Motor de Inteligencia Artificial
            </h3>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div>
                  <h4 className="font-bold text-zinc-100">Nivel de Heurística</h4>
                  <p className="text-xs text-zinc-500 italic">Define la agresividad del escaneo profundo.</p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  {['Standard', 'Advanced', 'Surgical'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setHeuristicLevel(level.toLowerCase())}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        heuristicLevel === level.toLowerCase() 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Database size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100">Caché de Firmas Offline</h4>
                    <p className="text-xs text-zinc-500">Mantener base de datos de malware en local para escaneos sin red.</p>
                  </div>
                </div>
                <Toggle checked={true} />
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex gap-4">
                  <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100">Smart-Fix Automático</h4>
                    <p className="text-xs text-zinc-500">Aplicar parches menores sin requerir autorización manual.</p>
                  </div>
                </div>
                <Toggle checked={false} />
              </div>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Monitor size={18} className="text-indigo-400" />
              Interfaz y Visualización
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Tema Visual</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                    <span className="text-sm font-bold text-zinc-200">Professional Dark</span>
                  </div>
               </div>
               <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Densidad de Datos</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-zinc-200">Alta (Modo Técnico)</span>
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* Security & System Info */}
        <div className="space-y-6">
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <Shield size={18} className="text-emerald-400" />
              Privacidad
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Telemetría IA</span>
                <Toggle checked={telemetry} onChange={() => setTelemetry(!telemetry)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Auto-Guardar Logs</span>
                <Toggle checked={autoExport} onChange={() => setAutoExport(!autoExport)} />
              </div>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <Globe size={18} className="text-blue-400" />
              Estado de Red
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-bold">GEMINI API</span>
                  <span className="text-[10px] text-emerald-400 font-black">ONLINE</span>
               </div>
               <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-bold">LATENCIA</span>
                  <span className="text-[10px] text-indigo-400 font-black">42ms</span>
               </div>
               <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-bold">VERSION</span>
                  <span>v2.5.0-STABLE</span>
               </div>
            </div>
            <button className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all">
              <RefreshCw size={12} />
              Buscar Actualizaciones
            </button>
          </section>

          <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3">
            <Save size={20} />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ checked: boolean, onChange?: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`w-12 h-6 rounded-full p-1 transition-all ${checked ? 'bg-indigo-600' : 'bg-zinc-800'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

export default Settings;
