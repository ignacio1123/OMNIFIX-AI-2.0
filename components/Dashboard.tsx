
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HARDWARE_ICONS } from '../constants';
import { HardwareMetrics } from '../types';
import { Activity, AlertTriangle, Info, Terminal as TerminalIcon, ShieldCheck, Zap, ArrowUpRight, Usb } from 'lucide-react';

const generateMockData = (): HardwareMetrics[] => {
  const data: HardwareMetrics[] = [];
  const now = new Date();
  for (let i = 15; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000);
    data.push({
      timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu: Math.floor(Math.random() * 20) + 15,
      gpu: Math.floor(Math.random() * 10) + 5,
      ram: Math.floor(Math.random() * 5) + 40,
      disk: Math.floor(Math.random() * 3) + 1,
      temp: Math.floor(Math.random() * 5) + 45
    });
  }
  return data;
};

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<HardwareMetrics[]>(generateMockData());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const now = new Date();
        next.push({
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: Math.max(0, Math.min(100, last.cpu + (Math.random() * 6 - 3))),
          gpu: Math.max(0, Math.min(100, last.gpu + (Math.random() * 4 - 2))),
          ram: Math.max(0, Math.min(100, last.ram + (Math.random() * 1.5 - 0.75))),
          disk: Math.max(0, Math.min(100, last.disk + (Math.random() * 0.8 - 0.4))),
          temp: Math.max(30, Math.min(90, last.temp + (Math.random() * 1 - 0.5)))
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = metrics[metrics.length - 1];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Notification Banner */}
      <div className="relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-start gap-6 shadow-2xl">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20 shadow-inner">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Protocolo de Operación Omniflex</h4>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-black rounded uppercase border border-indigo-500/30">Admin Required</span>
            </div>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed max-w-2xl">
              La suite está sincronizada con el motor de IA para proporcionar <strong className="text-zinc-200">auditorías de hardware forenses</strong>. 
              Ahora con soporte para <strong className="text-indigo-400">Reparación de Drivers y USB/SD</strong> sin conexión.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10 transition-all active:scale-95 flex items-center gap-2">
            Ver Documentación <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={HARDWARE_ICONS.cpu} label="Core Load" value={`${current.cpu.toFixed(1)}%`} color="text-indigo-400" bg="bg-indigo-500/10" trend="+2.4%" />
        <StatCard icon={HARDWARE_ICONS.ram} label="Memory Bus" value={`${current.ram.toFixed(1)}%`} color="text-purple-400" bg="bg-purple-500/10" trend="-0.1%" />
        <StatCard icon={HARDWARE_ICONS.usb} label="Removable I/O" value="Stable" color="text-amber-400" bg="bg-amber-500/10" trend="Active" />
        <StatCard icon={HARDWARE_ICONS.disk} label="Disk IOPS" value={`${current.disk.toFixed(1)}%`} color="text-emerald-400" bg="bg-emerald-500/10" trend="Low" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Telemetry Chart */}
        <div className="lg:col-span-8 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8">
             <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-white/5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Live Probe</span>
             </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-black text-white italic flex items-center gap-3 tracking-tighter">
              <Activity className="w-6 h-6 text-indigo-500" />
              ANÁLISIS DE FLUJO DINÁMICO
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Sincronización de Sensores del Kernel</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#3f3f46" fontSize={9} hide />
                <YAxis stroke="#3f3f46" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" name="CPU LOAD" animationDuration={1000} />
                <Area type="monotone" dataKey="ram" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" name="RAM LOAD" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Tech Guide Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 transition-transform group-hover:rotate-0 duration-700">
             <TerminalIcon size={180} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200 mb-8 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Protocolo Técnico
            </h3>
            <ul className="space-y-6">
              <StepItem num="01" text="Gestione drivers conflictivos desde la Biblioteca Offline." />
              <StepItem num="02" text="Repare memorias USB RAW usando comandos Diskpart integrados." />
              <StepItem num="03" text="Utilice SDI para instalar controladores sin internet." />
            </ul>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest block">OmniShield Core</span>
                <span className="text-[9px] text-indigo-100/60 font-medium">Protección de Hardware Activa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string, bg: string, trend: string }> = ({ icon, label, value, color, bg, trend }) => (
  <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group cursor-default shadow-xl">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${bg} ${color} border border-white/5`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter ${trend.includes('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black tracking-tighter text-white italic">{value}</p>
    </div>
  </div>
);

const StepItem: React.FC<{ num: string, text: string }> = ({ num, text }) => (
  <li className="flex gap-4 items-start group">
    <span className="text-[10px] font-black text-white/40 group-hover:text-white transition-colors pt-0.5">{num}</span>
    <p className="text-xs font-bold text-white/80 leading-relaxed group-hover:text-white transition-colors">{text}</p>
  </li>
);

export default Dashboard;
