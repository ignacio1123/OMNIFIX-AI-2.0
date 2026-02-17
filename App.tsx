
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Wrench, Shield, Settings as SettingsIcon, Terminal, HardDrive, Cpu, Download, Database, Code, ShieldAlert, Zap, Layers, Bell, Command, Book, X, AlertTriangle, RefreshCw, Smartphone, Monitor, Disc, Tablet, Usb, Search } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AITroubleshooter from './components/AITroubleshooter';
import Toolbox from './components/Toolbox';
import AutoScanTerminal from './components/AutoScanTerminal';
import IsoLibrary from './components/IsoLibrary';
import DataRecovery from './components/DataRecovery';
import ScriptCenter from './components/ScriptCenter';
import SecurityLab from './components/SecurityLab';
import Settings from './components/Settings';
import HardwareGuide from './components/HardwareGuide';
import PortableKit from './components/PortableKit';
import MobileLab from './components/MobileLab';
import SecurityEncyclopedia from './components/SecurityEncyclopedia';
import StorageAnalyzer from './components/StorageAnalyzer';

type ActiveTab = 'dashboard' | 'autoscan' | 'hardware' | 'security' | 'scripts' | 'isos' | 'recovery' | 'troubleshoot' | 'toolbox' | 'settings' | 'portable' | 'mobile' | 'encyclopedia' | 'storage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [apiError, setApiError] = useState<string | null>(null);
  const [hotPlugEvent, setHotPlugEvent] = useState<{name: string, type: string} | null>(null);

  // Monitor de hardware (Simulación de detección automática)
  useEffect(() => {
    const handleDeviceChange = () => {
       // En un entorno real, usaríamos navigator.usb.addEventListener
       setHotPlugEvent({ name: "Unidad USB Genérica", type: "Almacenamiento" });
    };

    // Simulamos una inserción aleatoria para demostración después de 15 segundos
    const timer = setTimeout(() => {
      handleDeviceChange();
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b]">
      {/* Notificación Hot-Plug */}
      {hotPlugEvent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
           <div className="bg-zinc-900 border-2 border-indigo-500/50 p-12 rounded-[3.5rem] max-w-lg w-full text-center shadow-[0_0_100px_rgba(79,70,229,0.2)]">
              <div className="w-24 h-24 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center text-indigo-400 mx-auto mb-8 animate-bounce">
                 <Usb size={48} />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">¡NUEVO DISPOSITIVO!</h3>
              <p className="text-zinc-400 text-sm mb-10 italic">Se ha detectado la conexión de: <b className="text-indigo-400">{hotPlugEvent.name}</b>. ¿Deseas iniciar un análisis forense inmediato?</p>
              <div className="flex gap-4">
                 <button onClick={() => setHotPlugEvent(null)} className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all">Ignorar</button>
                 <button 
                  onClick={() => { setActiveTab('storage'); setHotPlugEvent(null); }}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-indigo-600/20"
                 >Analizar Ahora</button>
              </div>
           </div>
        </div>
      )}

      <aside className="w-20 lg:w-72 glass border-r border-white/5 flex flex-col z-20 transition-all duration-500">
        <div className="p-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
              <Command className="text-white w-6 h-6" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-extrabold tracking-tight leading-none text-white">OMNIFIX <span className="text-indigo-500">CORE</span></h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Engine v3.0.0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
          <p className="hidden lg:block px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">SISTEMA PC</p>
          <SidebarItem icon={<LayoutDashboard size={19} />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Cpu size={19} />} label="Deep Scan" isActive={activeTab === 'autoscan'} onClick={() => setActiveTab('autoscan')} />
          <SidebarItem icon={<HardDrive size={19} />} label="Storage Forensic" isActive={activeTab === 'storage'} onClick={() => setActiveTab('storage')} />
          
          <p className="hidden lg:block px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-8 mb-4">SEGURIDAD & AMENAZAS</p>
          <SidebarItem icon={<Book size={19} />} label="Biblioteca Offline" isActive={activeTab === 'encyclopedia'} onClick={() => setActiveTab('encyclopedia')} />
          <SidebarItem icon={<ShieldAlert size={19} />} label="Security Lab" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />

          <p className="hidden lg:block px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-8 mb-4">MOBILE LAB</p>
          <SidebarItem icon={<Smartphone size={19} />} label="Phone Repair" isActive={activeTab === 'mobile'} onClick={() => setActiveTab('mobile')} />
          
          <p className="hidden lg:block px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-8 mb-4">DESPLIEGUE</p>
          <SidebarItem icon={<Disc size={19} />} label="Portable Kit (USB)" isActive={activeTab === 'portable'} onClick={() => setActiveTab('portable')} />
          <SidebarItem icon={<Download size={19} />} label="Librería ISO" isActive={activeTab === 'isos'} onClick={() => setActiveTab('isos')} />
          
          <p className="hidden lg:block px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-8 mb-4">HERRAMIENTAS</p>
          <SidebarItem icon={<Code size={19} />} label="Scripts" isActive={activeTab === 'scripts'} onClick={() => setActiveTab('scripts')} />
          <SidebarItem icon={<Terminal size={19} />} label="Toolbox" isActive={activeTab === 'toolbox'} onClick={() => setActiveTab('toolbox')} />
          <SidebarItem icon={<Database size={19} />} label="Datos" isActive={activeTab === 'recovery'} onClick={() => setActiveTab('recovery')} />
        </div>

        <div className="p-4 border-t border-white/5 space-y-1">
          <SidebarItem icon={<SettingsIcon size={19} />} label="Configuración" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 z-10">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3">
              {activeTab === 'storage' && 'Storage Forensic Lab'}
              {activeTab === 'dashboard' && 'Monitor de Telemetría'}
              {activeTab === 'autoscan' && 'Analizador Forense'}
              {activeTab === 'toolbox' && 'Librería de Herramientas'}
            </h2>
          </div>
          <div className="h-10 px-4 rounded-full border border-white/10 flex items-center gap-3 bg-zinc-900">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Master Technican</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'autoscan' && <AutoScanTerminal />}
            {activeTab === 'storage' && <StorageAnalyzer />}
            {activeTab === 'hardware' && <HardwareGuide />}
            {activeTab === 'portable' && <PortableKit />}
            {activeTab === 'security' && <SecurityLab />}
            {activeTab === 'scripts' && <ScriptCenter />}
            {activeTab === 'isos' && <IsoLibrary />}
            {activeTab === 'recovery' && <DataRecovery />}
            {activeTab === 'troubleshoot' && <AITroubleshooter />}
            {activeTab === 'toolbox' && <Toolbox />}
            {activeTab === 'mobile' && <MobileLab />}
            {activeTab === 'encyclopedia' && <SecurityEncyclopedia />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </div>
      </main>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
      isActive 
      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20' 
      : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border border-transparent'
    }`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:text-indigo-400 group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className={`hidden lg:inline font-bold text-[13px] tracking-tight ${isActive ? 'text-white' : ''}`}>{label}</span>
  </button>
);

export default App;
