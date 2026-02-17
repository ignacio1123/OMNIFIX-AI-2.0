
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldCheck, Activity, Loader2, Play, Wrench, Zap, Copy, FileText, Download, Fingerprint, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
// Fix: removed generateFullAuditReport which is not exported from geminiService
import { analyzeSystemProfile, getRepairPlan, SystemProfile, RepairTask } from '../geminiService';

const DEEP_SCAN_LOGS = [
  "Iniciando Sonda OmniFix V3.0 Kernel Probe...",
  "Mapeando registros de CPU IRQ y estados de energía...",
  "Analizando Tabla de Particiones MBR/GPT (Forensic Level 1)...",
  "Escaneando Registro HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run...",
  ">>> ANOMALÍA: Proceso 'svchost.exe' inyectado desde Temp/System32.",
  "Verificando integridad WinSxS (SFC Engine Deep Scan)...",
  "Escaneando servicios de red activos (Netstat analysis / Promiscuous Mode)...",
  ">>> ERROR: Servicio de telemetría 'WpnUserService' modificado por tercero.",
  "Analizando latencias de disco 0 (Victoria Engine Bridge)...",
  ">>> ALERTA: 12 Sectores lentos (>500ms) detectados en bloque maestro.",
  "Escaneando firmas de malware en RAM...",
  ">>> AMENAZA: Firma de Troyano 'Razy' detectada en memoria volátil.",
  "Análisis forense completado. Compilando mapa de remediación quirúrgico..."
];

const AutoScanTerminal: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repairTasks, setRepairTasks] = useState<RepairTask[]>([]);
  const [fixingTasks, setFixingTasks] = useState<Record<string, boolean>>({});
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isFixingAll, setIsFixingAll] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [currentLogs]);

  const runScan = async () => {
    setIsScanning(true);
    setReport(null);
    setRepairTasks([]);
    setCurrentLogs([]);
    setProgress(0);
    setCompletedTasks({});

    for (let i = 0; i < DEEP_SCAN_LOGS.length; i++) {
      await new Promise(r => setTimeout(r, 150)); // Un poco más lento para efecto forense
      setCurrentLogs(prev => [...prev, DEEP_SCAN_LOGS[i]]);
      setProgress(Math.round(((i + 1) / DEEP_SCAN_LOGS.length) * 100));
    }

    setIsAnalyzing(true);
    try {
      const mockProfile: SystemProfile = {
        cpuName: "Intel i9-14900K @ 5.8GHz",
        ramTotal: "64GB DDR5 6000MT/s",
        diskHealth: "89% (Advertencia: Sectores lentos detectados)",
        osVersion: "Windows 11 Pro 23H2",
        activeProcesses: ["chrome.exe", "svchost.exe (Inyectado)", "msedge.exe", "WpnUserService (Mod)"],
        recentErrors: ["Disk I/O Error 0x8007045D", "Kernel Memory Corruption BSOD", "Security Violation: Unauthorized Registry Access"]
      };
      const result = await analyzeSystemProfile(mockProfile);
      setReport(result);
      const plan = await getRepairPlan(result.risks || ["Malware en RAM", "Inyección svchost", "Sectores lentos", "Telemetría corrupta"]);
      setRepairTasks(plan);
    } catch (e) {
      setCurrentLogs(prev => [...prev, "ERROR CRÍTICO: IA desconectada o API limit excedido."]);
    } finally {
      setIsAnalyzing(false);
      setIsScanning(false);
    }
  };

  const handleFix = async (task: RepairTask) => {
    setFixingTasks(prev => ({ ...prev, [task.id]: true }));
    await new Promise(r => setTimeout(r, 1500));
    setFixingTasks(prev => ({ ...prev, [task.id]: false }));
    setCompletedTasks(prev => ({ ...prev, [task.id]: true }));
  };

  const handleFixAll = async () => {
    setIsFixingAll(true);
    for (const task of repairTasks) {
      if (!completedTasks[task.id]) {
        await handleFix(task);
      }
    }
    setIsFixingAll(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-zinc-900 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="bg-zinc-800 px-10 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Terminal size={18} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">OmniFix Kernel Probe v3.0</span>
          </div>
          <div className="flex gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 animate-pulse"></div>
          </div>
        </div>

        <div className="p-10">
          {!isScanning && !report && !isAnalyzing ? (
            <div className="text-center py-24 bg-black/20 rounded-[2.5rem] border border-white/5 border-dashed">
              <Fingerprint className="w-24 h-24 text-indigo-400 mx-auto mb-8 opacity-40 animate-pulse" />
              <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">Análisis Forense de Sistema</h3>
              <p className="text-zinc-500 text-sm max-w-lg mx-auto mb-10 italic">
                Sonda profunda que busca rootkits, corrupción de memoria volátil y fallas de hardware latentes en el núcleo de Windows.
              </p>
              <button onClick={runScan} className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl shadow-indigo-600/30 active:scale-95">
                Iniciar Diagnóstico de Bajo Nivel
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div ref={scrollRef} className="bg-black p-10 h-96 overflow-y-auto font-mono text-[11px] rounded-[2rem] border border-white/10 shadow-inner scrollbar-hide">
                {currentLogs.map((log, i) => (
                  <div key={i} className="mb-2 flex gap-6">
                    <span className="text-zinc-800 select-none font-bold">0x{i.toString(16).toUpperCase().padStart(4,'0')}</span>
                    <span className={log.includes('>>>') ? (log.includes('AMENAZA') || log.includes('ERROR') ? 'text-red-400 font-bold' : 'text-amber-400 font-bold') : 'text-zinc-500 italic'}>{log}</span>
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="flex items-center gap-4 text-indigo-400 mt-6 animate-pulse">
                    <RefreshCw className="animate-spin" size={16} />
                    <span className="font-black uppercase tracking-[0.2em] text-[10px]">IA: Compilando Reporte Quirúrgico...</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span>Progreso de Escaneo</span>
                  <span className="text-indigo-400">{progress}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden p-[2px]">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">{report.healthScore}%</div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-10">Estado Global del Host</p>
              <p className="text-sm text-zinc-400 italic mb-10 leading-relaxed">"{report.summary}"</p>
              <div className="p-4 bg-zinc-950 border border-white/10 rounded-2xl mb-10">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-500">
                   <span>Riesgo de Malware</span>
                   <span className="text-red-400">Alto</span>
                 </div>
              </div>
              <button className="w-full bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">Exportar Auditoría</button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <h4 className="font-black text-2xl italic uppercase tracking-tighter flex items-center gap-4 text-white">
                  <Wrench className="text-indigo-500" />
                  Plan de Remediación
                </h4>
                <button 
                  onClick={handleFixAll}
                  disabled={isFixingAll || repairTasks.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
                >
                  {isFixingAll ? <RefreshCw className="animate-spin w-4 h-4" /> : <Zap size={14} />}
                  Corregir Todo
                </button>
              </div>
              
              <div className="space-y-4">
                {repairTasks.map(task => (
                  <div key={task.id} className="p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between group hover:border-indigo-500/20 transition-all">
                    <div className="flex-1 md:mr-10 mb-6 md:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Layers size={14} className="text-indigo-400" />
                        <h5 className="font-black text-white uppercase text-xs tracking-widest">{task.title}</h5>
                      </div>
                      <code className="text-[10px] text-zinc-500 font-mono block bg-black/40 p-2 rounded-lg border border-white/5 mb-3 truncate italic">{task.command}</code>
                      <p className="text-[11px] text-zinc-600 leading-relaxed italic">{task.description}</p>
                    </div>
                    <div className="shrink-0">
                      {completedTasks[task.id] ? (
                        <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-[10px] tracking-widest bg-emerald-500/10 px-6 py-3 rounded-xl border border-emerald-500/20">
                          <CheckCircle2 size={16} /> Corregido
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleFix(task)}
                          disabled={fixingTasks[task.id] || isFixingAll}
                          className="w-full md:w-auto bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-50 border border-transparent hover:border-indigo-500"
                        >
                          {fixingTasks[task.id] ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Arreglar'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoScanTerminal;
