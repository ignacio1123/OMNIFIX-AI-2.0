
import React, { useState } from 'react';
import { Book, ShieldAlert, Zap, Search, Terminal, AlertTriangle, CheckCircle2, Copy, Layers, Ghost } from 'lucide-react';
import { LOCAL_KNOWLEDGE_BASE, ThreatEntry } from '../knowledgeBase';

const SecurityEncyclopedia: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<ThreatEntry | null>(null);

  const filtered = LOCAL_KNOWLEDGE_BASE.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    alert("Comando copiado al portapapeles.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">BIBLIOTECA DE AMENAZAS</h2>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Base de Datos de Reparación Offline v1.0</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="Buscar virus, falla o ataque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Side */}
          <div className="lg:col-span-1 space-y-4 max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
            {filtered.map(entry => (
              <button 
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className={`w-full text-left p-6 rounded-3xl border transition-all group ${
                  selectedEntry?.id === entry.id 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/30' 
                  : 'bg-zinc-950 border-white/5 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{entry.type}</span>
                   {entry.dangerLevel === 'Critical' && <AlertTriangle size={14} className="text-rose-400" />}
                </div>
                <h4 className="font-black text-sm uppercase italic tracking-tight">{entry.name}</h4>
              </button>
            ))}
          </div>

          {/* Details Side */}
          <div className="lg:col-span-2">
            {selectedEntry ? (
              <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 animate-in zoom-in-95 duration-500 h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                   <div>
                     <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">{selectedEntry.name}</h3>
                     <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                       selectedEntry.dangerLevel === 'Critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                       selectedEntry.dangerLevel === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                       'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                     }`}>
                       Riesgo: {selectedEntry.dangerLevel}
                     </span>
                   </div>
                   <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
                      <Ghost size={32} className="text-zinc-700" />
                   </div>
                </div>

                <div className="space-y-8 flex-1">
                  <div>
                    <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Descripción Técnica</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">"{selectedEntry.description}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Procedimiento de Remediación
                      </h5>
                      <div className="space-y-3">
                        {selectedEntry.manualSteps.map((step, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black text-indigo-400">{i+1}</span>
                            <p className="text-[10px] text-zinc-300 italic">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Terminal size={14} className="text-indigo-400" /> Comandos de Terminal
                      </h5>
                      <div className="space-y-3">
                        {selectedEntry.commands.map((cmd, i) => (
                          <div key={i} className="group relative">
                            <code className="block w-full bg-black p-4 rounded-xl text-[10px] text-emerald-500 font-mono border border-white/5 overflow-x-auto">
                              {cmd}
                            </code>
                            <button 
                              onClick={() => copyCommand(cmd)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-zinc-800 rounded-lg text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Copy size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-20 bg-zinc-950/20 group">
                 <Book size={64} className="text-zinc-800 mb-6 group-hover:scale-110 transition-transform duration-700" />
                 <h4 className="text-zinc-600 font-black uppercase tracking-widest mb-2 italic">Seleccione una Entrada</h4>
                 <p className="text-xs text-zinc-700 italic max-w-xs">Explore la base de datos local para obtener manuales y comandos de reparación instantáneos.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Amenazas en Base" value={LOCAL_KNOWLEDGE_BASE.length.toString()} icon={<Layers size={18} />} />
        <StatCard label="Motor de Respaldo" value="ACTIVO" icon={<Zap size={18} />} />
        <StatCard label="Modo Offline" value="SOPORTADO" icon={<ShieldAlert size={18} />} />
        <StatCard label="Protocolo QC" value="ISO-9001" icon={<CheckCircle2 size={18} />} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-zinc-900 border border-white/5 p-6 rounded-[2rem] flex flex-col gap-4">
    <div className="p-3 bg-zinc-950 border border-white/10 rounded-xl text-indigo-400 w-fit">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-white italic tracking-tight">{value}</p>
    </div>
  </div>
);

export default SecurityEncyclopedia;
