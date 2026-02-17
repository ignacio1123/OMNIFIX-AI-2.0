
import React, { useState, useEffect } from 'react';
import { HardDrive, Search, Zap, AlertTriangle, CheckCircle2, Loader2, Database, ShieldCheck, RefreshCw, Terminal, ArrowRight, Disc, Usb } from 'lucide-react';
import { getDiagnosticReport } from '../geminiService';

const StorageAnalyzer: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [foundDisks, setFoundDisks] = useState<any[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);

  const startDeepScan = async () => {
    setIsScanning(true);
    setLogs(["Iniciando escaneo de bajo nivel...", "Consultando BUS SATA/NVMe...", "Buscando particiones huérfanas..."]);
    
    // Simulación de escaneo de discos
    setTimeout(() => setLogs(prev => [...prev, "Detectado: Disco Físico 1 (Samsung SSD) - OK"] ), 500);
    setTimeout(() => {
      setLogs(prev => [...prev, "ALERTA: Detectado Volumen sin letra (Volume 3 - 465GB)"] );
      setFoundDisks([
        { id: 'd1', name: 'Samsung 990 Pro', status: 'Healthy', letter: 'C:', health: 98 },
        { id: 'd2', name: 'Generic USB Flash', status: 'RAW / Error', letter: 'None', health: 45, isGhost: true },
        { id: 'd3', name: 'MicroSD Kingston', status: 'Write Protected', letter: 'E:', health: 70 }
      ]);
    }, 1500);
    
    setTimeout(() => {
      setLogs(prev => [...prev, "Escaneo finalizado. Se encontraron 2 anomalías de montaje."] );
      setIsScanning(false);
    }, 2500);
  };

  const repairGhostDisk = async (disk: any) => {
    setActiveAnalysis(disk);
    setLogs(prev => [...prev, `Intentando reasignar letra a ${disk.name}...`, "Ejecutando diskpart automount..."]);
    
    await new Promise(r => setTimeout(r, 2000));
    
    setFoundDisks(prev => prev.map(d => d.id === disk.id ? { ...d, status: 'Repaired', letter: 'Z:', isGhost: false } : d));
    setLogs(prev => [...prev, `ÉXITO: Unidad montada en Z:\\`] );
    setActiveAnalysis(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <HardDrive size={180} className="text-emerald-500" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-4">Storage Forensic Lab</h2>
          <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed italic mb-8">
            Especializado en recuperar discos que "desaparecieron" de Windows, unidades USB con formato RAW y MicroSD bloqueadas. 
            El motor analiza el MBR y la tabla de particiones buscando letras de unidad perdidas.
          </p>
          <button 
            onClick={startDeepScan}
            disabled={isScanning}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-3 active:scale-95"
          >
            {isScanning ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            Escanear Unidades de Almacenamiento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Terminal de Logs */}
        <div className="lg:col-span-4 bg-black border border-white/10 rounded-[2.5rem] p-8 h-[400px] flex flex-col font-mono text-[10px] shadow-inner">
           <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
             <Terminal size={14} className="text-emerald-500" />
             <span className="text-zinc-600 font-bold uppercase tracking-widest">Storage Console</span>
           </div>
           <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
             {logs.map((log, i) => (
               <div key={i} className={`flex gap-4 ${log.includes('ALERTA') ? 'text-amber-400' : log.includes('ÉXITO') ? 'text-emerald-400' : 'text-zinc-500'}`}>
                 <span className="opacity-30">[{i}]</span>
                 <p>{log}</p>
               </div>
             ))}
           </div>
        </div>

        {/* Lista de Discos Detectados */}
        <div className="lg:col-span-8 space-y-4">
          {foundDisks.length > 0 ? (
            foundDisks.map(disk => (
              <div key={disk.id} className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/20 transition-all shadow-xl">
                <div className="flex items-center gap-8">
                  <div className={`p-5 rounded-2xl border ${disk.isGhost ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-zinc-950 border-white/5 text-zinc-500'}`}>
                    {disk.name.includes('USB') ? <Usb size={24} /> : disk.name.includes('MicroSD') ? <Disc size={24} /> : <HardDrive size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg uppercase tracking-tighter italic">{disk.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black text-zinc-500 uppercase">Letra: <b className="text-white">{disk.letter}</b></span>
                      <span className={`text-[10px] font-black uppercase ${disk.status.includes('Error') ? 'text-rose-400' : 'text-emerald-400'}`}>• {disk.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   {disk.isGhost && (
                     <button 
                      onClick={() => repairGhostDisk(disk)}
                      disabled={activeAnalysis === disk}
                      className="bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/10 flex items-center gap-2"
                     >
                       {activeAnalysis === disk ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                       Forzar Montaje C:/D:
                     </button>
                   )}
                   <div className="text-right">
                      <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Health</p>
                      <p className={`text-lg font-black italic ${disk.health > 80 ? 'text-emerald-500' : disk.health > 50 ? 'text-amber-500' : 'text-rose-500'}`}>{disk.health}%</p>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center p-20 opacity-40">
               <Database size={64} className="mb-6" />
               <p className="text-xs font-bold uppercase tracking-widest">Inicie el escaneo para mapear unidades</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageAnalyzer;
