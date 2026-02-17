
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Disc, HardDrive, ShieldCheck, Zap, AlertTriangle, ExternalLink, RefreshCw, Layers, Terminal, BookOpen, Code, Package, Trash2, CheckCircle2 } from 'lucide-react';

const PortableKit: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [stagedIds, setStagedIds] = useState<string[]>(JSON.parse(localStorage.getItem('staged_isos') || '[]'));

  useEffect(() => {
    const handleStorageChange = () => {
      setStagedIds(JSON.parse(localStorage.getItem('staged_isos') || '[]'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleExportStandalone = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert("Generando paquete Standalone... OmniFix_Portable_v3.zip listo para descargar.");
      setIsExporting(false);
    }, 2000);
  };

  const removeStaged = (id: string) => {
    const updated = stagedIds.filter(i => i !== id);
    setStagedIds(updated);
    localStorage.setItem('staged_isos', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Smartphone size={160} className="text-indigo-400" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-4">DESPLIEGUE TÉCNICO USB</h2>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8 italic">
            Desde aquí gestionas el contenido de tu pendrive. Las herramientas "preparadas" estarán disponibles directamente al arrancar el PC desde el USB, sin necesidad de sistema operativo activo.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleExportStandalone}
              disabled={isExporting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              {isExporting ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
              Generar Pack de Supervivencia (.zip)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: USB Payload Status */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <HardDrive className="text-indigo-500" />
                CONTENIDO DEL PENDRIVE
              </h3>
              <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-4 py-1 rounded-full border border-indigo-500/20">
                {stagedIds.length} TOOLS LISTAS
              </span>
            </div>

            {stagedIds.length > 0 ? (
              <div className="space-y-4">
                {stagedIds.map(id => (
                  <div key={id} className="p-6 bg-zinc-950 border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                        <Package size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-xs uppercase tracking-widest">{id.replace('iso-', 'IMAGE #')}</h4>
                        <p className="text-[10px] text-zinc-500 italic mt-1 font-bold">Inyectado en /BOOT/IMAGES/</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                        <CheckCircle2 size={14} /> BOOT READY
                      </div>
                      <button 
                        onClick={() => removeStaged(id)}
                        className="p-3 hover:bg-rose-500/20 rounded-xl text-zinc-600 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                 <AlertTriangle size={48} className="mx-auto text-zinc-800 mb-4" />
                 <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">No hay herramientas preparadas</p>
                 <p className="text-[10px] text-zinc-700 italic mt-1">Ve a la Librería ISO y pulsa "Preparar para Formateo"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Deployment Guide */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-10">
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Zap size={18} className="fill-current" />
              PROTOCOLO DE ARRANQUE
            </h3>
            <div className="space-y-8">
              <Step text="Inserta el USB en el PC que no responde." />
              <Step text="Enciende y pulsa repetidamente la tecla de Boot (F12, ESC, F11)." />
              <Step text="Selecciona tu USB 'OmniFix_Boot' en el menú UEFI." />
              <Step text="En el menú de Ventoy, selecciona la imagen preparada para formatear o reparar." />
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 shadow-xl">
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                <Disc size={16} className="text-indigo-400" />
                CONSEJO TÉCNICO
             </h4>
             <p className="text-xs text-zinc-400 leading-relaxed italic">
               Las imágenes marcadas como <strong>"Optimized"</strong> están configuradas para saltarse los requisitos de TPM 2.0 y CPU no soportadas de Windows 11, ideal para reparaciones en hardware antiguo.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex gap-4 items-center group">
    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(99,102,241,1)]"></div>
    <p className="text-xs text-zinc-300 italic font-medium">{text}</p>
  </div>
);

export default PortableKit;
