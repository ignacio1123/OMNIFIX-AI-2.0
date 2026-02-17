
import React, { useState, useEffect } from 'react';
import { Download, Monitor, Laptop, Server, Terminal, Shield, RefreshCw, BookOpen, Loader2, CheckCircle2, AlertTriangle, Info, X, Zap, Activity, ExternalLink, Filter, Package, HardDrive, Share2, Globe, FileCode, Gamepad2, Code2 } from 'lucide-react';
import { getLatestIsoVersions, getInstallationManual, IsoData } from '../geminiService';

const IsoLibrary: React.FC = () => {
  const [isos, setIsos] = useState<IsoData[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedIsoManual, setSelectedIsoManual] = useState<any>(null);
  const [isLoadingManual, setIsLoadingManual] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Windows' | 'Rescue' | 'Utility' | 'Linux' | 'Software'>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [stagingId, setStagingId] = useState<string | null>(null);
  const [stagedIsos, setStagedIsos] = useState<string[]>(JSON.parse(localStorage.getItem('staged_isos') || '[]'));

  useEffect(() => {
    syncLibrary();
  }, []);

  useEffect(() => {
    localStorage.setItem('staged_isos', JSON.stringify(stagedIsos));
  }, [stagedIsos]);

  const syncLibrary = async () => {
    setIsSyncing(true);
    try {
      const aiData = await getLatestIsoVersions();
      const defaultIsos: IsoData[] = [
        // SISTEMAS
        { id: 'iso-win-tiny', name: 'Windows 11 Tiny11', version: '23H2 Core', size: '3.5 GB', type: 'Windows', status: 'Optimized', description: 'Windows 11 despojado de telemetría. Ideal para equipos modestos.', downloadUrl: 'https://archive.org/download/tiny-11-23-h-2/tiny11%2023H2%20x64.iso' },
        { id: 'iso-hiren', name: 'Hiren\'s BootCD PE', version: 'x64 v1.0.2', size: '2.8 GB', type: 'Rescue', status: 'Stable', description: 'La herramienta definitiva de rescate forense.', downloadUrl: 'https://www.hirensbootcd.org/files/HBCD_PE_x64.iso' },
        { id: 'iso-medicat', name: 'Medicat USB Full', version: 'v23 Stable', size: '25 GB', type: 'Rescue', status: 'Stable', description: 'El sucesor de Hiren\'s. Una suite masiva técnico-profesional.', downloadUrl: 'https://medicatusb.com/' },
        
        // GAMING & LAUNCHERS
        { id: 'game-roblox', name: 'Roblox Player', version: 'Bootstrapper', size: '160 MB', type: 'Software', status: 'Official', description: 'Instalador oficial de Roblox para Windows.', downloadUrl: 'https://www.roblox.com/download/client' },
        { id: 'game-steam', name: 'Steam Client', version: 'Latest', size: '2.1 MB', type: 'Software', status: 'Official', description: 'Plataforma de Valve. El instalador descargará los archivos finales.', downloadUrl: 'https://cdn.akamai.steamstatic.com/client/installer/SteamSetup.exe' },
        { id: 'game-epic', name: 'Epic Games Launcher', version: 'Latest', size: '48 MB', type: 'Software', status: 'Official', description: 'Lanzador oficial para Unreal Engine y juegos de Epic.', downloadUrl: 'https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/installer/download/EpicGamesLauncherInstaller.msi' },
        { id: 'game-bnet', name: 'Battle.net Launcher', version: 'Latest', size: '4.8 MB', type: 'Software', status: 'Official', description: 'Cliente oficial para Overwatch, Diablo y Call of Duty.', downloadUrl: 'https://www.battle.net/download/getInstallerForGame?os=win&game=bnet&static=true' },
        
        // DEVELOPMENT & TECH
        { id: 'dev-vscode', name: 'Visual Studio Code', version: 'v1.92 x64', size: '92 MB', type: 'Software', status: 'Official', description: 'Editor de código líder. Instalador de usuario de 64 bits.', downloadUrl: 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user' },
        { id: 'dev-node', name: 'Node.js LTS', version: 'v20.x', size: '30 MB', type: 'Software', status: 'LTS', description: 'Entorno de ejecución para JavaScript en el servidor.', downloadUrl: 'https://nodejs.org/dist/v20.17.0/node-v20.17.0-x64.msi' },
        { id: 'sw-chrome', name: 'Google Chrome', version: 'Stable x64', size: '95 MB', type: 'Software', status: 'Stable', description: 'Navegador Google (Standalone/Offline Installer).', downloadUrl: 'https://www.google.com/chrome/?standalone=1' },
        { id: 'sw-office', name: 'Office Deployment Tool', version: 'Latest', size: '3.6 MB', type: 'Software', status: 'Official', description: 'Herramienta oficial para instalar Microsoft 365.', downloadUrl: 'https://www.microsoft.com/en-us/download/details.aspx?id=49117' },
        { id: 'sw-7zip', name: '7-Zip', version: '24.08 x64', size: '1.6 MB', type: 'Software', status: 'Stable', description: 'Compresor universal open source.', downloadUrl: 'https://www.7-zip.org/a/7z2408-x64.exe' },
        { id: 'sw-vlc', name: 'VLC Media Player', version: '3.0.21', size: '42 MB', type: 'Software', status: 'Stable', description: 'Reproductor universal de medios.', downloadUrl: 'https://get.videolan.org/vlc/3.0.21/win64/vlc-3.0.21-win64.exe' },
        { id: 'sw-anydesk', name: 'AnyDesk', version: 'v8.0', size: '5.2 MB', type: 'Software', status: 'Official', description: 'Soporte remoto instantáneo.', downloadUrl: 'https://anydesk.com/es/downloads/windows' },
        { id: 'sw-discord', name: 'Discord Desktop', version: 'Latest', size: '85 MB', type: 'Software', status: 'Official', description: 'Comunicación para gaming y comunidades.', downloadUrl: 'https://discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=win&arch=x86' }
      ];

      // Merge and avoid duplicates by ID or Name
      const merged = [...defaultIsos];
      aiData.forEach(aiItem => {
        const isDuplicate = merged.some(m => 
          m.id === aiItem.id || 
          m.name.toLowerCase() === aiItem.name.toLowerCase()
        );
        if (!isDuplicate) {
          merged.push(aiItem);
        }
      });

      setIsos(merged);
    } catch (e) {
      console.error("Sync Error:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const loadManual = async (isoName: string) => {
    setIsLoadingManual(true);
    try {
      const manual = await getInstallationManual(isoName);
      setSelectedIsoManual(manual);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingManual(false);
    }
  };

  const handleStaging = (iso: IsoData) => {
    setStagingId(iso.id);
    setTimeout(() => {
      setStagedIsos(prev => [...prev, iso.id]);
      setStagingId(null);
    }, 2500);
  };

  const handleDownload = (iso: IsoData) => {
    setDownloadingId(iso.id);
    setTimeout(() => {
      if (iso.downloadUrl) {
        // Redirección directa para iniciar descarga
        window.location.assign(iso.downloadUrl);
      } else {
        const query = encodeURIComponent(iso.name + " " + iso.version + " official setup direct download");
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
      }
      setDownloadingId(null);
    }, 800);
  };

  const filteredIsos = isos.filter(iso => activeFilter === 'All' || iso.type === activeFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Manual Modal Overlay */}
      {selectedIsoManual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in zoom-in-95">
          <div className="bg-zinc-900 border border-white/5 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-zinc-800 p-8 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-white uppercase italic">{selectedIsoManual.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Manual de Despliegue Técnico</p>
                </div>
              </div>
              <button onClick={() => setSelectedIsoManual(null)} className="p-2 hover:bg-zinc-700 rounded-2xl transition-colors">
                <X size={28} className="text-zinc-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Activity size={16} className="text-indigo-500" />
                    Pasos de Instalación
                  </h4>
                  {selectedIsoManual.steps?.map((s: any, i: number) => (
                    <div key={i} className="bg-zinc-950 border border-white/5 p-6 rounded-3xl relative group hover:border-indigo-500/30 transition-all">
                      <div className="flex gap-6">
                        <span className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-black text-indigo-400 shrink-0 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all">{i+1}</span>
                        <div>
                          <p className="text-sm font-black text-zinc-100 mb-2 uppercase tracking-wide">{s.step}</p>
                          <p className="text-xs text-zinc-500 leading-relaxed italic">{s.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-8">
                   <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2rem] p-8">
                     <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                       <Zap size={16} className="fill-current" />
                       Tips de Configuración Pro
                     </h4>
                     <ul className="space-y-4">
                        {selectedIsoManual.technicalTips?.map((tip: string, i: number) => (
                          <li key={i} className="text-xs text-zinc-300 flex gap-4 leading-relaxed italic">
                            <span className="text-indigo-500 font-black">»</span>
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

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">CATÁLOGO DE SOFTWARE</h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Sistemas, Juegos y Desarrollo (Direct Download)</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={syncLibrary}
            disabled={isSyncing}
            className="bg-zinc-900 border border-white/5 hover:border-indigo-500/30 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-4 transition-all active:scale-95 shadow-2xl"
          >
            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" /> : <RefreshCw className="w-4 h-4" />}
            Sincronizar Repositorio
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {[
          { id: 'All', label: 'Todas', icon: <Package size={14} /> },
          { id: 'Windows', label: 'Sistemas', icon: <Monitor size={14} /> },
          { id: 'Software', label: 'Programas & Juegos', icon: <Gamepad2 size={14} /> },
          { id: 'Rescue', label: 'Mantenimiento', icon: <Shield size={14} /> },
          { id: 'Linux', label: 'Linux', icon: <Terminal size={14} /> }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id as any)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-3 whitespace-nowrap ${
              activeFilter === filter.id 
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)]' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIsos.map(iso => (
          <div key={iso.id} className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col shadow-xl h-full hover:shadow-indigo-500/5">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl border transition-colors ${
                iso.type === 'Software' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                iso.status === 'Optimized' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                {iso.name.toLowerCase().includes('steam') || iso.name.toLowerCase().includes('roblox') || iso.name.toLowerCase().includes('epic') || iso.name.toLowerCase().includes('battle.net') || iso.name.toLowerCase().includes('discord') ? <Gamepad2 size={20} /> :
                 iso.name.toLowerCase().includes('code') || iso.name.toLowerCase().includes('node') || iso.name.toLowerCase().includes('git') ? <Code2 size={20} /> :
                 iso.type === 'Windows' ? <Monitor size={20} /> : 
                 iso.type === 'Rescue' ? <Shield size={20} /> : 
                 iso.type === 'Software' ? <Package size={20} /> : <FileCode size={20} />}
              </div>
              <div className="text-right">
                {stagedIsos.includes(iso.id) ? (
                  <span className="text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest bg-indigo-600 text-white border border-indigo-500 flex items-center gap-1 animate-in zoom-in duration-300">
                    <CheckCircle2 size={10} /> LISTO
                  </span>
                ) : (
                  <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border block ${
                    iso.type === 'Software' ? 'border-blue-500/50 text-blue-400' :
                    iso.status === 'Optimized' ? 'border-indigo-500/50 text-indigo-400' : 
                    'border-emerald-500/50 text-emerald-400'
                  }`}>
                    {iso.status}
                  </span>
                )}
                <span className="text-[10px] font-mono text-zinc-600 font-bold block mt-2">{iso.size}</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-black text-lg mb-1 text-white group-hover:text-indigo-400 transition-colors tracking-tighter italic uppercase">{iso.name}</h3>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Ver: {iso.version}</p>
              <p className="text-xs text-zinc-500 leading-relaxed italic mb-8">"{iso.description}"</p>
            </div>

            <div className="space-y-3 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => loadManual(iso.name)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-black py-3 rounded-xl text-[9px] uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
                >
                  <BookOpen size={14} /> Guía
                </button>
                <button 
                  onClick={() => handleDownload(iso)}
                  disabled={downloadingId === iso.id}
                  className={`flex items-center justify-center gap-2 font-black py-3 rounded-xl text-[9px] uppercase tracking-widest transition-all border active:scale-95 ${
                    iso.downloadUrl 
                    ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white' 
                    : 'bg-zinc-800 border-white/5 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {downloadingId === iso.id ? <Loader2 size={14} className="animate-spin" /> : 
                   iso.downloadUrl ? <Download size={14} /> : <Globe size={14} />} 
                  {iso.downloadUrl ? 'Download' : 'Search'}
                </button>
              </div>
              
              <button 
                onClick={() => handleStaging(iso)}
                disabled={stagingId === iso.id || stagedIsos.includes(iso.id)}
                className={`w-full flex items-center justify-center gap-3 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                  stagedIsos.includes(iso.id) 
                  ? 'bg-zinc-950 text-zinc-600 border border-white/5 cursor-default' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {stagingId === iso.id ? <Loader2 className="w-4 h-4 animate-spin" /> : stagedIsos.includes(iso.id) ? <HardDrive className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                {stagingId === iso.id ? 'Preparando...' : stagedIsos.includes(iso.id) ? 'Boot-Ready in USB' : 'Inyectar en Menú USB'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IsoLibrary;
