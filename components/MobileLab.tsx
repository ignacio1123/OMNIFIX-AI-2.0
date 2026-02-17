
import React, { useState, useEffect } from 'react';
import { Smartphone, Zap, ShieldAlert, Cpu, Wrench, Search, Loader2, Tablet, CheckCircle2, AlertTriangle, BookOpen, HardDrive, Terminal, Layers, Info, Download, Globe, RefreshCw, X, FileCode, Disc } from 'lucide-react';
import { getMobileDiagnosis, getMobileFirmwareLibrary, getInstallationManual, IsoData } from '../geminiService';

const MobileLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hardware' | 'firmware' | 'guides'>('hardware');
  const [model, setModel] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  
  // Firmware Library States
  const [firmwares, setFirmwares] = useState<IsoData[]>([]);
  const [isSyncingFirmware, setIsSyncingFirmware] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);

  useEffect(() => {
    if (activeTab === 'firmware') {
      syncFirmwares();
    }
  }, [activeTab]);

  const syncFirmwares = async () => {
    setIsSyncingFirmware(true);
    try {
      const data = await getMobileFirmwareLibrary();
      setFirmwares(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncingFirmware(false);
    }
  };

  const handleDiagnose = async () => {
    if (!model || !symptoms) return;
    setIsDiagnosing(true);
    setDiagnosis(null);
    try {
      const data = await getMobileDiagnosis(model, symptoms);
      setDiagnosis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const loadManual = async (name: string) => {
    setIsLoadingGuide(true);
    try {
      const manual = await getInstallationManual(name);
      setSelectedGuide(manual);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingGuide(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Modal Manual Móvil */}
      {selectedGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in zoom-in-95">
          <div className="bg-zinc-900 border border-white/5 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-zinc-800 p-8 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-white uppercase italic">{selectedGuide.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Guía de Despliegue de Sistema</p>
                </div>
              </div>
              <button onClick={() => setSelectedGuide(null)} className="p-2 hover:bg-zinc-700 rounded-2xl transition-colors">
                <X size={28} className="text-zinc-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Terminal size={16} className="text-emerald-500" />
                    Procedimiento Passo a Passo
                  </h4>
                  {selectedGuide.steps?.map((s: any, i: number) => (
                    <div key={i} className="bg-zinc-950 border border-white/5 p-6 rounded-3xl relative group">
                      <div className="flex gap-6">
                        <span className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-black text-emerald-400 shrink-0 border border-white/10">{i+1}</span>
                        <div>
                          <p className="text-sm font-black text-zinc-100 mb-2 uppercase tracking-wide">{s.step}</p>
                          <p className="text-xs text-zinc-500 leading-relaxed italic">{s.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-8">
                   <div className="bg-emerald-600/5 border border-emerald-500/20 rounded-[2rem] p-8">
                     <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                       <Zap size={16} className="fill-current" />
                       Tips de Flasheo Seguro
                     </h4>
                     <ul className="space-y-4">
                        {selectedGuide.technicalTips?.map((tip: string, i: number) => (
                          <li key={i} className="text-xs text-zinc-300 flex gap-4 leading-relaxed italic">
                            <span className="text-emerald-500 font-black">»</span>
                            {tip}
                          </li>
                        ))}
                     </ul>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selector de Pestañas Pro */}
      <div className="flex gap-4 p-2 bg-zinc-900 border border-white/5 rounded-[2.5rem] w-fit mx-auto shadow-2xl">
        <ModuleBtn 
          icon={<Smartphone size={18} />} 
          label="Hardware & Board" 
          active={activeTab === 'hardware'} 
          onClick={() => setActiveTab('hardware')} 
        />
        <ModuleBtn 
          icon={<Disc size={18} />} 
          label="Firmware & ROMs" 
          active={activeTab === 'firmware'} 
          onClick={() => setActiveTab('firmware')} 
        />
        <ModuleBtn 
          icon={<BookOpen size={18} />} 
          label="Learning Center" 
          active={activeTab === 'guides'} 
          onClick={() => setActiveTab('guides')} 
        />
      </div>

      {activeTab === 'hardware' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Panel Izquierdo: Input de Diagnóstico */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900 border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                 <Cpu size={140} className="text-indigo-400" />
              </div>
              
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8 flex items-center gap-4">
                <Smartphone className="text-indigo-500" />
                Sonda de Reparación
              </h3>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Dispositivo (Ej: iPhone 12, S20+)</label>
                  <input 
                    type="text" 
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Marca y Modelo..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white shadow-inner"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Síntomas / Historia de Falla</label>
                  <textarea 
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Ej: No carga, consumo oscila en fuente de poder..."
                    className="w-full h-32 bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white resize-none"
                  />
                </div>

                <button 
                  onClick={handleDiagnose}
                  disabled={isDiagnosing || !model || !symptoms}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-6 rounded-2xl text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-4"
                >
                  {isDiagnosing ? <Loader2 className="animate-spin w-6 h-6" /> : <Search size={20} />}
                  Analizar Falla Multinivel
                </button>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] p-8 flex gap-6 shadow-xl">
               <AlertTriangle className="text-amber-500 shrink-0" size={24} />
               <div>
                 <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Aviso Técnico</h4>
                 <p className="text-xs text-zinc-500 italic leading-relaxed">
                   El diagnóstico IA se basa en bases de datos de esquemáticos (ZXW, Borneo). Use voltajes de referencia antes de levantar componentes.
                 </p>
               </div>
            </div>
          </div>

          {/* Panel Derecho: Resultados Dinámicos */}
          <div className="lg:col-span-7 h-full">
            {diagnosis ? (
              <div className="bg-zinc-900 border border-white/5 rounded-[3.5rem] p-12 h-full shadow-2xl animate-in zoom-in-95 duration-700 flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-1">PLAN QUIRÚRGICO</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{model}</p>
                  </div>
                  <div className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                    diagnosis.difficulty === 'Expert' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                    diagnosis.difficulty === 'Hard' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                    Dificultad: {diagnosis.difficulty}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <ResultCard icon={<Layers size={18} />} label="Diagnóstico" value={diagnosis.likelyIssue} color="text-indigo-400" bg="bg-indigo-500/5" />
                  <ResultCard icon={<Terminal size={18} />} label="Foco Esquemático" value={diagnosis.schematicFocus} color="text-amber-400" bg="bg-amber-500/5" />
                </div>

                <div className="flex-1 space-y-10">
                  <div>
                    <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                      <BookOpen size={16} className="text-indigo-500" />
                      Pasos de Reparación (Sencillo a Complejo)
                    </h5>
                    <div className="space-y-4">
                      {diagnosis.repairSteps.map((step: string, i: number) => (
                        <div key={i} className="flex gap-6 p-6 bg-zinc-950 border border-white/5 rounded-3xl group hover:border-indigo-500/30 transition-all shadow-inner">
                          <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-black text-indigo-400 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {i+1}
                          </span>
                          <p className="text-[12px] text-zinc-400 leading-relaxed font-medium italic group-hover:text-zinc-200">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {diagnosis.microSolderingRequired && (
                    <div className="p-8 bg-rose-600/10 border border-rose-500/30 rounded-[2.5rem] flex items-center gap-8 shadow-lg">
                      <Zap className="text-rose-500 animate-pulse" size={32} />
                      <div>
                        <h6 className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-1">REQUIERE MICRO-SOLDADURA</h6>
                        <p className="text-[10px] text-rose-200/60 italic leading-relaxed">Intervención en placa base. Use cautín con punta tipo K o J y microscopio.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center text-center p-20 bg-zinc-900/10 group">
                 <Smartphone size={80} className="text-zinc-800 mb-8 group-hover:scale-110 transition-all duration-1000 group-hover:text-indigo-500/40" />
                 <h4 className="text-zinc-600 font-black uppercase tracking-[0.3em] mb-3 italic">Awaiting Device Telemetry</h4>
                 <p className="text-xs text-zinc-700 italic max-w-sm leading-relaxed">Ingrese los datos para generar el protocolo de intervención técnica profesional.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'firmware' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">LIBRERÍA DE SISTEMAS MÓVILES</h2>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">ROMs Personalizadas, GSIs y Firmwares Originales</p>
            </div>
            <button 
              onClick={syncFirmwares}
              disabled={isSyncingFirmware}
              className="bg-zinc-900 border border-white/5 hover:border-emerald-500/30 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-4 transition-all active:scale-95 shadow-2xl"
            >
              {isSyncingFirmware ? <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> : <RefreshCw className="w-4 h-4" />}
              Actualizar Catálogo ROM
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {firmwares.map(fw => (
              <div key={fw.id} className="bg-zinc-900 border border-white/5 rounded-[3rem] p-8 hover:border-emerald-500/30 transition-all group flex flex-col shadow-xl">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Disc size={24} />
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-600 text-white border border-emerald-500">
                      {fw.type}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 font-bold block mt-2">{fw.size}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-black text-lg mb-1 text-white group-hover:text-emerald-400 transition-colors tracking-tighter italic uppercase">{fw.name}</h3>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">{fw.version}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed italic mb-8">"{fw.description}"</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                   <button 
                    onClick={() => loadManual(fw.name)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 rounded-xl text-[9px] uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
                   >
                     <BookOpen size={14} /> Guía
                   </button>
                   <button 
                    onClick={() => fw.downloadUrl && window.open(fw.downloadUrl, '_blank')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl text-[9px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                   >
                     <Download size={14} /> Descargar
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <GuideCard 
            title="Cambio de Pantalla Genérico" 
            difficulty="Simple" 
            desc="Procedimiento seguro de apertura y transferencia de sensores (FaceID/TouchID)." 
            steps={["Calentar bordes", "Succión con ventosa", "Desconectar Flex Batería"]}
          />
          <GuideCard 
            title="Reballing de IC Audio" 
            difficulty="Hard" 
            desc="Técnica de re-estañado para integrados de audio en iPhone 7/7P y similares." 
            steps={["Limpieza de pads", "Stencil especializado", "Curva de calor 320°C"]}
          />
          <GuideCard 
            title="Desbloqueo de Bootloader" 
            difficulty="Medium" 
            desc="Protocolos para Xiaomi, Pixel y Samsung. Riesgos y preparaciones." 
            steps={["Opciones de desarrollador", "Comandos ADB", "Wipe data total"]}
          />
          <GuideCard 
            title="Limpieza de Sulfatación" 
            difficulty="Medium" 
            desc="Tratamiento por ultrasonido y químicos para equipos mojados." 
            steps={["Desarme total", "Batea ultrasonido 5min", "Secado estufa 60°C"]}
          />
        </div>
      )}

      {/* Footer Mobile Pro Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard title="3uTools Expert" desc="Gestión avanzada para iOS. Flash, Jailbreak y Diagnóstico de piezas." link="https://www.3u.com/" />
        <ResourceCard title="SamFirm Reborn" desc="Descarga de firmwares oficiales de Samsung a máxima velocidad." link="https://samfirmtool.com/" />
        <ResourceCard title="MTK Auth Bypass" desc="Saltar autenticación en dispositivos MediaTek para flasheo profundo." link="#" />
        <ResourceCard title="Qualcomm QPST" desc="Herramienta de bajo nivel para dispositivos Snapdragon." link="#" />
      </div>
    </div>
  );
};

const GuideCard: React.FC<{ title: string, difficulty: string, desc: string, steps: string[] }> = ({ title, difficulty, desc, steps }) => (
  <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10 hover:border-indigo-500/20 transition-all group flex flex-col shadow-2xl">
    <div className="flex justify-between items-center mb-8">
       <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
         <BookOpen size={24} />
       </div>
       <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
         difficulty === 'Hard' ? 'border-rose-500/40 text-rose-400 bg-rose-500/5' :
         difficulty === 'Medium' ? 'border-amber-500/40 text-amber-400 bg-amber-500/5' :
         'border-emerald-500/40 text-emerald-400 bg-emerald-500/5'
       }`}>
         {difficulty}
       </span>
    </div>
    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4 group-hover:text-indigo-400 transition-colors">{title}</h3>
    <p className="text-[11px] text-zinc-500 leading-relaxed italic mb-8">{desc}</p>
    <div className="space-y-3 mt-auto pt-6 border-t border-white/5">
       {steps.map((s, i) => (
         <div key={i} className="flex gap-4 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">{s}</p>
         </div>
       ))}
    </div>
  </div>
);

const ModuleBtn: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-10 py-4 rounded-[1.8rem] flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
      active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-zinc-500 hover:text-zinc-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

const ResultCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string, bg: string }> = ({ icon, label, value, color, bg }) => (
  <div className={`p-8 rounded-[2.5rem] border border-white/5 ${bg} space-y-4 shadow-inner`}>
    <div className={`flex items-center gap-4 ${color}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
    </div>
    <p className="text-sm font-bold text-zinc-100 italic">{value}</p>
  </div>
);

const ResourceCard: React.FC<{ title: string, desc: string, link: string }> = ({ title, desc, link }) => (
  <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group flex flex-col h-full shadow-lg">
    <div className="flex justify-between items-start mb-6">
       <div className="p-3 bg-zinc-950 border border-white/10 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Zap size={18} />
       </div>
       <CheckCircle2 size={16} className="text-zinc-800" />
    </div>
    <h5 className="font-black text-white uppercase text-xs tracking-tight mb-2 italic">{title}</h5>
    <p className="text-[10px] text-zinc-500 leading-relaxed mb-6 flex-1 italic">{desc}</p>
    <button 
      onClick={() => link !== '#' && window.open(link, '_blank')}
      className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-3"
    >
      Acceder a Herramienta <Download size={14} />
    </button>
  </div>
);

export default MobileLab;
