
export interface ThreatEntry {
  id: string;
  name: string;
  type: 'Malware' | 'Hardware' | 'System' | 'Network' | 'Mobile' | 'Storage' | 'Drivers';
  symptoms: string[];
  description: string;
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  manualSteps: string[];
  commands: string[];
  tags: string[];
}

export const LOCAL_KNOWLEDGE_BASE: ThreatEntry[] = [
  // --- STORAGE & GHOST DISKS ---
  {
    id: 'st-03',
    name: 'Disco Invisible (Pérdida de Letra/Ruta)',
    type: 'Storage',
    symptoms: ['El disco aparece en Administrador de Discos pero no en Mi Equipo', 'Antes era C: o D: y ahora no tiene letra', 'Error: No se encuentra la ruta'],
    description: 'El sistema operativo ha perdido el punto de montaje o el ID de volumen ha cambiado tras una actualización o fallo de energía.',
    dangerLevel: 'Medium',
    manualSteps: [
      'Abrir Administrador de Discos (diskmgmt.msc).',
      'Localizar la partición sin letra (barra azul).',
      'Click derecho -> Cambiar la letra y rutas de acceso -> Asignar nueva letra.',
      'Si no aparece, usar el comando automount de Diskpart.'
    ],
    commands: [
      'diskpart',
      'automount enable',
      'rescan',
      'list volume',
      'select volume X',
      'assign letter=Z'
    ],
    tags: ['invisible', 'letra', 'unidad', 'disco', 'desaparecido', 'C:', 'D:']
  },
  {
    id: 'st-04',
    name: 'Disco No Inicializado / I/O Error',
    type: 'Storage',
    symptoms: ['El disco pide inicializar (MBR/GPT)', 'Error de dispositivo de E/S', 'Capacidad incorrecta'],
    description: 'Fallo en el sector 0 (MBR) o en la controladora del disco. Puede ser daño físico o corrupción lógica severa.',
    dangerLevel: 'Critical',
    manualSteps: [
      'Verificar conexión del cable SATA/USB.',
      'Intentar inicializar como GPT si el disco es > 2TB.',
      'Si el error de E/S persiste, el firmware del disco puede estar bloqueado.'
    ],
    commands: [
      'diskpart',
      'list disk',
      'select disk X',
      'attributes disk clear readonly',
      'clean'
    ],
    tags: ['inicializar', 'mbr', 'gpt', 'error io', 'disco nuevo', 'reparar']
  },
  {
    id: 'st-05',
    name: 'Reparación de Sistema de Archivos RAW',
    type: 'Storage',
    symptoms: ['Pide formatear al abrir', 'CHKDSK no disponible para RAW', 'MicroSD ilegible'],
    description: 'El encabezado del sistema de archivos (FAT32/NTFS) está corrupto. Los datos siguen ahí pero Windows no sabe leerlos.',
    dangerLevel: 'High',
    manualSteps: [
      'Usar TestDisk para reconstruir el Boot Sector.',
      'Si es NTFS, intentar reparar con el comando especializado de recuperación de imagen.',
      'No formatear bajo ninguna circunstancia si se desean los datos.'
    ],
    commands: [
      'chkdsk X: /f /r /x',
      'format X: /q /fs:ntfs'
    ],
    tags: ['raw', 'formato', 'microsd', 'usb', 'ilegal', 'reparar']
  },
  // --- MANTENER ENTRADAS ANTERIORES ---
  {
    id: 'dr-01',
    name: 'Conflicto de Driver (BSOD)',
    type: 'Drivers',
    symptoms: ['Pantallazo azul'],
    description: 'Conflicto de memoria.',
    dangerLevel: 'High',
    manualSteps: ['Modo Seguro'],
    commands: ['pnputil /enum-drivers'],
    tags: ['driver', 'bsod']
  }
];
