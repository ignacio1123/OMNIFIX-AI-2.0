
import React, { useState, useEffect, useRef } from 'react';
import ImgIcon from '../Img/Brandmark - Creador de marcas y logotipos con IA_files/24px.svg';
import { Search, ExternalLink, Star, BookOpen, X, Loader2, AlertTriangle, CheckCircle2, Info, Lightbulb, ShieldCheck, Play, Terminal as TerminalIcon, Download, Copy, Check, FileText } from 'lucide-react';
import { TOOLS_LIST, CATEGORY_ICONS } from '../constants';
import { ToolCategory, Tool } from '../types';
import { getToolManual, simulateToolExecution, generateTechnicalReport } from '../geminiService';

const Toolbox: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'Todas'>('Todas');
  
  // States
  const [selectedToolManual, setSelectedToolManual] = useState<any>(null);
  const [isLoadingManual, setIsLoadingManual] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<{ toolName: string, logs: string[], verdict: string, clientSummary: string } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const filteredTools = TOOLS_LIST.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenManual = async (tool: Tool) => {
    setIsLoadingManual(true);
    try {
      const manual = await getToolManual(tool.name, tool.category);
      setSelectedToolManual({ ...manual, toolName: tool.name });
    } catch (e) { console.error(e); }
    finally { setIsLoadingManual(false); }
  };

  const handleRunSimulation = async (tool: Tool) => {
    setIsSimulating(true);
    setActiveSimulation({ toolName: tool.name, logs: [`BOOTING VIRTUAL KERNEL FOR ${tool.name.toUpperCase()}...`, "IRQ CHECK: OK", "MEMORY MAP: LOADED"], verdict: "", clientSummary: "" });
    
    try {
      const mockProfile = {
        cpuName: "Intel Core i7-13700K",
        ramTotal: "16GB DDR5",
        diskHealth: "85% (Warning: Smart Event 05)",
        osVersion: "Windows 11 Home",
        activeProcesses: [],
        recentErrors: ["Disk I/O Error", "Memory Access Violation"]
      };
      const result = await simulateToolExecution(tool.name, mockProfile);
      
      for (const log of result.logs) {
        await new Promise(r => setTimeout(r, 100));
        setActiveSimulation(prev => prev ? { ...prev, logs: [...prev.logs, log] } : null);
      }
      setActiveSimulation(prev => prev ? { ...prev, verdict: result.verdict, clientSummary: result.clientSummary } : null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExportReport = async () => {
    if (!activeSimulation) return;
    setIsExporting(true);
    try {
      const reportText = await generateTechnicalReport(activeSimulation.toolName, activeSimulation.verdict, activeSimulation.logs);
      const element = document.createElement("a");
      const file = new Blob([reportText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Reporte_${activeSimulation.toolName.replace(' ', '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) { console.error(e); }
    finally { setIsExporting(false); }
  };

  const openWebsite = (link?: string) => {
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Simulation Modal */}
      {activeSimulation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in zoom-in-95">
          <div className="bg-[#0a0a0a] border border-zinc-800 w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-[0_0_120px_rgba(79,70,229,0.3)]">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <TerminalIcon className="text-emerald-500" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">OmniFix Engine - Entorno de Diagnóstico</span>
              </div>
              <button onClick={() => setActiveSimulation(null)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                <X size={20} className="text-zinc-500" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Terminal Area */}
              <div className="flex-[2] p-6 font-mono text-[10px] leading-relaxed overflow-y-auto scrollbar-hide bg-black/50 border-r border-zinc-800/50">
                {activeSimulation.logs.map((log, idx) => (
                  <div key={idx} className="flex gap-4 mb-0.5 opacity-80">
                    <span className="text-zinc-800 select-none w-10">{idx.toString(16).toUpperCase().padStart(4, '0')}</span>
                    <span className={log.includes('ERROR') || log.includes('WARNING') ? 'text-red-500' : 'text-emerald-400/90'}>
                      {log}
                    </span>
                  </div>
                ))}
                {isSimulating && <div className="text-indigo-500 animate-pulse mt-4">{">>> ANALYZING HARDWARE REGISTERS..."}</div>}
                <div ref={terminalEndRef} />
              </div>

              {/* Verdict Area */}
              <div className="flex-1 p-8 bg-zinc-900/20 space-y-8 overflow-y-auto">
                <div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Veredicto Técnico</h4>
                  {activeSimulation.verdict ? (
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl animate-in fade-in">
                      <p className="text-xs text-zinc-300 italic leading-relaxed">{activeSimulation.verdict}</p>
                    </div>
                  ) : <div className="h-20 bg-zinc-800/20 rounded-2xl animate-pulse"></div>}
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Resumen para el Cliente</h4>
                  {activeSimulation.clientSummary ? (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in">
                      <p className="text-xs text-zinc-300 leading-relaxed font-bold">{activeSimulation.clientSummary}</p>
                    </div>
                  ) : <div className="h-20 bg-zinc-800/20 rounded-2xl animate-pulse"></div>}
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-3">
                 <ShieldCheck className="text-emerald-500" size={20} />
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Simulación Finalizada con Éxito</p>
               </div>
               <div className="flex gap-3 w-full md:w-auto">
                 <button 
                  onClick={handleExportReport}
                  disabled={isExporting || !activeSimulation.verdict}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-700 active:scale-95"
                 >
                    {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                    Exportar Reporte Cliente
                 </button>
                 <button 
                  onClick={() => openWebsite(TOOLS_LIST.find(t => t.name === activeSimulation.toolName)?.link)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                 >
                    <Download size={14} />
                    Usar Herramienta Real
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Modal (Keeping it for Documentation) */}
      {selectedToolManual && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in zoom-in-95">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{selectedToolManual.toolName}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Protocolo Médico</p>
                </div>
              </div>
              <button onClick={() => setSelectedToolManual(null)} className="p-2 hover:bg-zinc-700 rounded-xl transition-colors">
                <X size={24} className="text-zinc-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                <p className="text-zinc-300 text-sm leading-relaxed italic">"{selectedToolManual.simpleExplanation}"</p>
                {/* Manual Content ... */}
            </div>
            <div className="p-6 bg-zinc-800/50 border-t border-zinc-700">
              <button onClick={() => setSelectedToolManual(null)} className="w-full bg-indigo-600 py-3 rounded-xl font-black text-xs uppercase text-white">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar herramienta profesional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-xl"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          <CategoryBtn label="Todas" isActive={activeCategory === 'Todas'} onClick={() => setActiveCategory('Todas')} />
          {Object.values(ToolCategory).map(cat => (
            <CategoryBtn key={cat} label={cat} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} icon={CATEGORY_ICONS[cat]} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filteredTools.map(tool => (
          <div key={tool.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-indigo-500/40 transition-all group relative overflow-hidden flex flex-col shadow-2xl h-full">
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                {CATEGORY_ICONS[tool.category]}
              </div>
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                {tool.category}
              </span>
            </div>

            <div className="flex-1">
              <h4 className="font-black text-xl mb-2 text-zinc-100 group-hover:text-indigo-400 transition-colors tracking-tight">
                {tool.name}
              </h4>
              <p className="text-zinc-500 text-xs leading-relaxed mb-8 italic">
                {tool.description}
              </p>
            </div>

            <div className="space-y-3 mt-auto pt-4 border-t border-zinc-800/50">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleOpenManual(tool)} disabled={isLoadingManual} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all border border-zinc-700">
                   {isLoadingManual ? <Loader2 size={12} className="animate-spin" /> : <BookOpen size={12} />}
                   Manual
                </button>
                <button onClick={() => openWebsite(tool.link)} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all border border-zinc-700">
                   <ExternalLink size={12} />
                   Web
                </button>
              </div>
              <button onClick={() => handleRunSimulation(tool)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                <img src={ImgIcon} alt="icono" style={{ width: 20, height: 20 }} />
                Ejecutar Diagnóstico Virtual
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryBtn: React.FC<{ label: string, isActive: boolean, onClick: () => void, icon?: React.ReactNode }> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all border ${
      isActive ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
    }`}
  >
    {icon && <span className="opacity-70">{icon}</span>}
    {label}
  </button>
);

export default Toolbox;
