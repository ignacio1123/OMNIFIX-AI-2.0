
import React from 'react';
import { 
  ShieldAlert, 
  Database, 
  HardDrive, 
  Key, 
  Zap, 
  Cpu,
  Thermometer,
  Gauge,
  Monitor,
  RefreshCw,
  Microscope,
  Box,
  Wind,
  Activity,
  Layers,
  Wrench,
  Disc,
  Usb,
  Download
} from 'lucide-react';
import { Tool, ToolCategory } from './types';

export const TOOLS_LIST: Tool[] = [
  // Drivers & Controladores
  { id: 'dr-1', name: 'Snappy Driver Installer (SDI)', category: ToolCategory.OPTIMIZATION, description: 'La mejor herramienta offline para instalar drivers faltantes sin necesidad de internet.', isPopular: true, link: 'https://sdi-tool.org/' },
  { id: 'dr-2', name: 'DDU (Display Driver Uninstaller)', category: ToolCategory.OPTIMIZATION, description: 'Eliminación total y limpia de drivers de video y audio para corregir BSODs.', isPopular: true, link: 'https://www.wagnardsoft.com/' },
  { id: 'dr-3', name: 'Intel Driver Support Assistant', category: ToolCategory.OPTIMIZATION, description: 'Utilidad oficial para mantener al día el chipset, wifi y gráficos integrados de Intel.', isPopular: false },

  // Reparación de Unidades (USB/SD/HDD)
  { id: 'st-1', name: 'HDD Low Level Format Tool', category: ToolCategory.DIAGNOSTICS, description: 'Realiza un formateo de bajo nivel borrando tablas de particiones y rellenando con ceros.', isPopular: true, link: 'https://hddguru.com/' },
  { id: 'st-2', name: 'TestDisk & PhotoRec', category: ToolCategory.BACKUP, description: 'Recuperación de particiones eliminadas y archivos de memorias USB corruptas.', isPopular: true },
  { id: 'st-3', name: 'Rufus', category: ToolCategory.BOOT_REPAIR, description: 'No solo crea USBs booteables, también sirve para detectar bloques dañados en memorias flash.', isPopular: true },
  { id: 'st-4', name: 'HP USB Disk Storage Format Tool', category: ToolCategory.PARTITION, description: 'Herramienta clásica para forzar el formateo en memorias que Windows no puede procesar.', isPopular: false },

  // Diagnóstico CPU & Motherboard
  { id: 'cpu-1', name: 'Prime95', category: ToolCategory.DIAGNOSTICS, description: 'Prueba de estrés definitiva para estabilidad de CPU y detección de errores de cálculo.', isPopular: true, link: 'https://www.mersenne.org/download/' },
  { id: 'cpu-2', name: 'HWiNFO64', category: ToolCategory.DIAGNOSTICS, description: 'Monitoreo exhaustivo de voltajes, VRMs y sensores térmicos detallados.', isPopular: true, link: 'https://www.hwinfo.com/' },
  
  // Diagnóstico RAM
  { id: 'ram-1', name: 'MemTest86+', category: ToolCategory.DIAGNOSTICS, description: 'Escaneo a bajo nivel de celdas de memoria RAM para detectar corrupción física.', isPopular: true },

  // Diagnóstico Discos
  { id: 'disk-1', name: 'Victoria HDD/SSD', category: ToolCategory.DIAGNOSTICS, description: 'Herramienta forense para remapear sectores dañados y analizar tiempos de respuesta.', isPopular: true },
  { id: 'disk-2', name: 'CrystalDiskInfo', category: ToolCategory.DIAGNOSTICS, description: 'Estado S.M.A.R.T. predictivo y contador de horas de vida.', isPopular: true },

  // Malware & Seguridad
  { id: 'sec-1', name: 'Kaspersky Rescue Disk', category: ToolCategory.MALWARE, description: 'Sistema live para desinfectar equipos que no inician por rootkits.', isPopular: true },
  { id: 'sec-2', name: 'Malwarebytes Portable', category: ToolCategory.MALWARE, description: 'Escaneo rápido de malware sin rastro de instalación.', isPopular: true },

  // Respaldo
  { id: 'back-2', name: 'Macrium Reflect', category: ToolCategory.BACKUP, description: 'Herramienta confiable de respaldo basada en imágenes y clonación.', isPopular: true },

  // Otros
  { id: 'util-1', name: 'NTPWEdit', category: ToolCategory.PASSWORD, description: 'Reset de contraseñas locales editando el archivo SAM de Windows.', isPopular: true },
];

export const CATEGORY_ICONS: Record<ToolCategory, React.ReactNode> = {
  [ToolCategory.DIAGNOSTICS]: <Microscope className="w-5 h-5 text-blue-400" />,
  [ToolCategory.MALWARE]: <ShieldAlert className="w-5 h-5 text-red-400" />,
  [ToolCategory.BACKUP]: <Database className="w-5 h-5 text-emerald-400" />,
  [ToolCategory.PARTITION]: <HardDrive className="w-5 h-5 text-purple-400" />,
  [ToolCategory.PASSWORD]: <Key className="w-5 h-5 text-yellow-400" />,
  [ToolCategory.OPTIMIZATION]: <Zap className="w-5 h-5 text-orange-400" />,
  [ToolCategory.BOOT_REPAIR]: <RefreshCw className="w-5 h-5 text-cyan-400" />,
  [ToolCategory.LIVE_OS]: <Box className="w-5 h-5 text-indigo-400" />
};

export const HARDWARE_ICONS = {
  cpu: <Cpu className="w-4 h-4" />,
  temp: <Thermometer className="w-4 h-4" />,
  ram: <Gauge className="w-4 h-4" />,
  disk: <HardDrive className="w-4 h-4" />,
  gpu: <Monitor className="w-4 h-4" />,
  fan: <Wind className="w-4 h-4" />,
  usb: <Usb className="w-4 h-4" />
};
