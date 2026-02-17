
export enum ToolCategory {
  DIAGNOSTICS = 'Diagnóstico',
  MALWARE = 'Eliminación Malware',
  BACKUP = 'Respaldo y Recuperación',
  PARTITION = 'Particionamiento',
  PASSWORD = 'Reset de Contraseña',
  OPTIMIZATION = 'Optimización',
  BOOT_REPAIR = 'Reparación de Arranque',
  LIVE_OS = 'Sistemas Live'
}

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  isPopular?: boolean;
  link?: string;
}

export interface IsoImage {
  id: string;
  name: string;
  version: string;
  size: string;
  type: 'Windows' | 'Linux' | 'Utility' | 'Rescue';
}

export interface HardwareMetrics {
  cpu: number;
  gpu: number;
  ram: number;
  disk: number;
  temp: number;
  timestamp: string;
}
