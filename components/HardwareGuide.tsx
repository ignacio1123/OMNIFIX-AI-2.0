
import React, { useState } from 'react';
import { 
  Cpu, HardDrive, Zap, Thermometer, AlertTriangle, Monitor, Layers, 
  Wind, Activity, Info, CheckCircle, Wrench, Box, ZapOff, Ghost, 
  Database, ShieldAlert, Search, MousePointer2, Fan, Settings, 
  BookOpen, Lightbulb, Microscope, Gauge, Fingerprint, ChevronRight,
  CircuitBoard, Tv, ShieldCheck
} from 'lucide-react';

interface ComponentDetail {
  id: string;
  name: string;
  category: 'Core' | 'Storage' | 'Power' | 'Cooling' | 'Peripherals' | 'Motherboard';
  icon: React.ReactNode;
  function: string;
  specs: { label: string; value: string }[];
  failures: { title: string; desc: string; solution: string }[];
  manual: string[];
  recommendations: string;
}

const HardwareGuide: React.FC = () => {
  const [activeComp, setActiveComp] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const systemSnapshot = [
    { label: "Procesador Detectado", value: "Intel Core i9-14900K", status: "Healthy", icon: <Cpu size={14} /> },
    { label: "Memoria Activa", value: "64GB DDR5 @ 6000MT/s", status: "Optimal", icon: <Zap size={14} /> },
    { label: "Almacenamiento Principal", value: "Samsung 990 Pro 2TB NVMe", status: "89% Life", icon: <Database size={14} /> },
    { label: "GPU de Sistema", value: "NVIDIA RTX 4090 (24GB VRAM)", status: "Active", icon: <Monitor size={14} /> }
  ];

  const components: ComponentDetail[] = [
    {
      id: "mobo",
      name: "Placa Base (Motherboard)",
      category: "Motherboard",
      icon: <CircuitBoard size={48} />,
      function: "El sistema nervioso central del PC. Gestiona la comunicación entre todos los componentes y regula el voltaje del CPU mediante los VRMs.",
      specs: [
        { label: "Chipset", value: "Z790 / X670E / B650" },
        { label: "Fases VRM", value: "8+2 a 24+2+1" },
        { label: "BIOS Type", value: "UEFI (AMI/Insyde)" }
      ],
      failures: [
        { title: "Capacitores Hinchados", desc: "Fugas de voltaje o reinicios aleatorios.", solution: "Recambio de capacitores o sustitución de placa si hay daño en pistas." },
        { title: "BIOS Corrupta", desc: "El PC enciende pero no da post.", solution: "Flashback mediante USB dedicado o reprogramación con programador EEPROM." }
      ],
      manual: [
        "Verificar que los separadores del gabinete coincidan con el factor de forma (ATX, mATX).",
        "Conectar primero el cable EPS (CPU) antes de montar disipadores grandes.",
        "Asegurar que la pila CMOS (CR2032) tenga al menos 3V."
      ],
      recommendations: "Mantenga los VRMs frescos. Un sobrecalentamiento en la zona del socket degrada el CPU permanentemente."
    },
    {
      id: "cpu",
      name: "Procesador (CPU)",
      category: "Core",
      icon: <Cpu size={48} />,
      function: "Unidad Central de Procesamiento encargada de ejecutar ciclos de instrucción y cálculos binarios.",
      specs: [
        { label: "Arquitectura", value: "x86-64 / ARM" },
        { label: "TDP Promedio", value: "65W - 250W" },
        { label: "Interfaz", value: "LGA / PGA" }
      ],
      failures: [
        { title: "Thermal Throttling", desc: "Reducción de frecuencia por calor.", solution: "Cambio de pasta térmica (MX-6) y limpieza de cooler." },
        { title: "WHEA Uncorrectable", desc: "Error de hardware fatal.", solution: "Revisar voltajes (Vcore) y estabilidad de la PSU." }
      ],
      manual: [
        "Verificar compatibilidad de socket (LGA1700, AM5, etc).",
        "Instalar sin aplicar presión excesiva (Gravedad es suficiente).",
        "Aplicar patrón de pasta térmica 'X' para cobertura total."
      ],
      recommendations: "No superar los 85°C bajo carga sostenida. Limpiar cada 6 meses."
    },
    {
      id: "gpu",
      name: "Gráfica (GPU)",
      category: "Core",
      icon: <Monitor size={48} />,
      function: "Procesamiento masivo paralelo para renderizado de buffers de imagen y cómputo de shaders.",
      specs: [
        { label: "VRAM", value: "GDDR6 / GDDR6X" },
        { label: "Interfaz", value: "PCIe 4.0 / 5.0 x16" },
        { label: "Bus de Datos", value: "128-bit - 384-bit" }
      ],
      failures: [
        { title: "Artifacts Visuales", desc: "Puntos o líneas aleatorias.", solution: "Falla de VRAM. Intentar undervolt o reballing." },
        { title: "Coil Whine", desc: "Ruido eléctrico agudo.", solution: "Limitar FPS para reducir carga inductiva." }
      ],
      manual: [
        "Asegurar soporte físico para evitar 'GPU Sag' (doblamiento).",
        "Usar cables PCIe independientes desde la fuente.",
        "Monitorear Hotspot y VRAM temps por separado."
      ],
      recommendations: "Las memorias GDDR6X son propensas a sobrecalentamiento (>100°C). Use pads térmicos de alta calidad."
    },
    {
      id: "ram",
      name: "Memoria RAM",
      category: "Core",
      icon: <Zap size={48} />,
      function: "Almacenamiento volátil de acceso aleatorio para datos de aplicaciones activas.",
      specs: [
        { label: "Estándar", value: "DDR4 / DDR5" },
        { label: "Voltaje", value: "1.1V - 1.45V" },
        { label: "Latencia", value: "CL14 - CL40" }
      ],
      failures: [
        { title: "Bit Flip", desc: "Corrupción de datos aleatoria.", solution: "Usar MemTest86+ para identificar módulo." },
        { title: "Falla de Boot (Pitidos)", desc: "El BIOS no reconoce la RAM.", solution: "Limpieza de contactos con alcohol isopropílico." }
      ],
      manual: [
        "Instalar en slots 2 y 4 para habilitar Dual Channel.",
        "Activar Perfil XMP/DOCP/EXPO para velocidad nominal.",
        "Verificar QVL de la placa base antes de comprar."
      ],
      recommendations: "DDR5 requiere mayor estabilidad de voltaje. Evite mezclar marcas o latencias distintas."
    },
    {
      id: "display",
      name: "Monitor / Pantalla",
      category: "Peripherals",
      icon: <Tv size={48} />,
      function: "Interfaz de salida visual. Transforma señales digitales en píxeles activos mediante tecnologías LED u OLED.",
      specs: [
        { label: "Panel", value: "IPS / VA / OLED" },
        { label: "Frecuencia", value: "60Hz - 540Hz" },
        { label: "Profundidad", value: "8-bit / 10-bit (HDR)" }
      ],
      failures: [
        { title: "Backlight Bleed", desc: "Fuga de luz en bordes oscuros.", solution: "Ajustar presión del marco o reducir brillo." },
        { title: "Ghosting / Inverse", desc: "Estelas en objetos en movimiento.", solution: "Ajustar configuración de Overdrive (Response Time)." }
      ],
      manual: [
        "Utilizar cables DisplayPort 1.4+ para altas frecuencias.",
        "Calibrar perfil ICC para fidelidad de color profesional.",
        "Evitar imágenes estáticas en paneles OLED (Burn-in)."
      ],
      recommendations: "Limpie siempre con paños de microfibra secos. Los líquidos pueden penetrar el polarizado."
    },
    {
      id: "storage",
      name: "SSD NVMe / SATA",
      category: "Storage",
      icon: <Database size={48} />,
      function: "Unidades de estado sólido basadas en memoria NAND Flash para persistencia de datos.",
      specs: [
        { label: "Protocolo", value: "NVMe (PCIe) / AHCI (SATA)" },
        { label: "Vida Útil", value: "TBW (Terabytes Written)" },
        { label: "Velocidad", value: "500MB/s - 14GB/s" }
      ],
      failures: [
        { title: "Read-Only Mode", desc: "El SSD se bloquea para proteger datos.", solution: "Reemplazo inmediato. La vida útil ha expirado." },
        { title: "Dispositivo no Detectado", desc: "Falla de controladora o puerto.", solution: "Probar en otro puerto M.2 o cambiar cable SATA." }
      ],
      manual: [
        "Instalar disipador si el NVMe supera los 70°C.",
        "No desfragmentar nunca (solo ejecutar TRIM).",
        "Mantener 10% de espacio libre para 'Over-provisioning'."
      ],
      recommendations: "Haga backup semanal. Los SSDs no avisan antes de morir como los HDDs."
    }
  ];

  const filtered = components.filter(c => 
    (activeCategory === 'All' || c.category === activeCategory) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.function.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      
      {/* SECCIÓN 1: SNAPSHOT DEL SISTEMA ACTUAL */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {systemSnapshot.map((item, idx) => (
          <div key={idx} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col gap-3 hover:border-indigo-500/30 transition-all cursor-default group shadow-lg">
            <div className="flex justify-between items-center">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950 border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full ${item.status.includes('Optimal') || item.status.includes('Healthy') ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></div>
                <span className={`text-[8px] font-black uppercase ${item.status.includes('Optimal') || item.status.includes('Healthy') ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {item.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{item.label}</p>
              <p className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN 2: LIBRERÍA ENCICLOPÉDICA */}
      <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
          <CircuitBoard size={240} className="text-indigo-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-1 h-1 bg-indigo-500 rounded-full"></div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">OmniFix Engineering Library</p>
          </div>
          <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white mb-8">LIBRERÍA DE HARDWARE <span className="text-zinc-700">V3.0</span></h2>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <input 
                type="text"
                placeholder="Buscar componente, síntoma o manual..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner text-zinc-200 placeholder:text-zinc-700"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {['All', 'Motherboard', 'Core', 'Storage', 'Peripherals'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap active:scale-95 ${
                    activeCategory === cat 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)]' 
                    : 'bg-zinc-800 border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {cat === 'All' ? 'Ver Todos' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Componentes Dinámico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(comp => (
          <div 
            key={comp.id}
            onClick={() => setActiveComp(activeComp === comp.id ? null : comp.id)}
            className={`group bg-zinc-900 border rounded-[3rem] transition-all cursor-pointer overflow-hidden shadow-2xl relative ${
              activeComp === comp.id 
              ? 'border-indigo-500/50 ring-4 ring-indigo-500/10 scale-[1.02] z-10' 
              : 'border-white/5 hover:border-indigo-500/20'
            }`}
          >
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-6 rounded-[1.5rem] bg-zinc-950 border border-white/10 text-indigo-400 group-hover:scale-110 transition-transform duration-500 ${activeComp === comp.id ? 'bg-indigo-600/10 shadow-inner' : ''}`}>
                  {comp.icon}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Microscope size={12} className="text-zinc-700" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">ID-7492</span>
                  </div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/10 block">{comp.category}</span>
                </div>
              </div>

              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4 group-hover:text-indigo-400 transition-colors">{comp.name}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed italic mb-8 h-10 overflow-hidden line-clamp-2">"{comp.function}"</p>

              <div className="space-y-3">
                {comp.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center bg-zinc-950/50 p-4 rounded-[1.2rem] border border-white/5 hover:bg-zinc-950 transition-colors">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-[11px] font-bold text-zinc-200">{spec.value}</span>
                  </div>
                ))}
              </div>

              {activeComp !== comp.id && (
                <div className="mt-8 flex justify-center items-center gap-3 py-2 border-t border-white/5">
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] group-hover:tracking-[0.5em] transition-all">Explorar Protocolos</span>
                  <ChevronRight size={16} className="text-indigo-500" />
                </div>
              )}
            </div>

            {/* Contenido Expandido: Manual y Fallas */}
            {activeComp === comp.id && (
              <div className="px-10 pb-10 space-y-10 animate-in slide-in-from-top-6 duration-700 bg-gradient-to-b from-transparent to-black/30">
                
                {/* Manual Forense */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <BookOpen size={16} />
                    </div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Protocolo de Taller (Instalación)</h4>
                  </div>
                  <div className="bg-zinc-950/80 rounded-[2rem] p-8 border border-white/5 space-y-5 shadow-inner">
                    {comp.manual.map((step, i) => (
                      <div key={i} className="flex gap-5 items-start group/step">
                        <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0 group-hover/step:border-indigo-500 group-hover/step:text-indigo-400 transition-all">{i+1}</div>
                        <p className="text-xs text-zinc-400 italic leading-relaxed group-hover/step:text-zinc-200 transition-colors">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historial de Fallas */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                      <ShieldAlert size={16} />
                    </div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Diagnóstico de Fallas (QC)</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {comp.failures.map((f, i) => (
                      <div key={i} className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-[1.8rem] space-y-4 hover:bg-rose-500/10 transition-all group/fail">
                        <div className="flex justify-between items-start">
                          <p className="text-[11px] font-black text-rose-400 uppercase tracking-tight">{f.title}</p>
                          <Activity size={14} className="text-rose-900 opacity-50" />
                        </div>
                        <p className="text-[11px] text-zinc-500 italic leading-relaxed">{f.desc}</p>
                        <div className="flex gap-4 items-center pt-4 border-t border-rose-500/10">
                          <Wrench size={14} className="text-emerald-500" />
                          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Fix: {f.solution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nota del Especialista */}
                <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                  <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
                    <Lightbulb size={120} className="text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck size={18} className="text-indigo-400" />
                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Veredicto de Mantenimiento</h5>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed italic relative z-10 font-medium">
                    {comp.recommendations}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer de la Enciclopedia */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-12 rounded-[4rem] flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-3xl -z-10"></div>
        <div className="w-28 h-28 bg-amber-500/20 rounded-[2.5rem] flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/30 group-hover:scale-110 transition-transform duration-700 shadow-xl">
          <Microscope size={56} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-2xl font-black text-amber-500 uppercase italic tracking-tighter mb-4 flex items-center gap-4 justify-center md:justify-start">
            CONTROL DE ESD Y ESTRÉS MECÁNICO
            <AlertTriangle size={24} className="animate-bounce" />
          </h4>
          <p className="text-xs text-zinc-500 leading-relaxed italic max-w-4xl font-medium">
            El diagnóstico de hardware requiere aislamiento ambiental. Un <strong>35% de las fallas post-servicio</strong> se deben a descargas electrostáticas (ESD) o tensiones mecánicas excesivas al apretar tornillos. 
            Utilice siempre destornilladores torque-limitados y superficies conductivas a tierra. Esta biblioteca se actualiza mediante el motor de IA para reflejar fallas emergentes en plataformas DDR5 y PCIe 5.0.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HardwareGuide;
