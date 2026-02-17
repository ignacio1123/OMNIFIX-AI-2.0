
import { GoogleGenAI, Type } from "@google/genai";
import { LOCAL_KNOWLEDGE_BASE, ThreatEntry } from "./knowledgeBase";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleApiError = (error: any) => {
  console.warn("IA Offline o Error de API. Usando motor de respaldo local.");
  return null;
};

// Motor de búsqueda heurístico local mejorado
const searchLocalKnowledge = (query: string): any => {
  const words = query.toLowerCase().split(/[ ,.;/]+/);
  
  // Puntuamos las entradas según coincidencia de palabras y etiquetas
  const scoredEntries = LOCAL_KNOWLEDGE_BASE.map(entry => {
    let score = 0;
    const entryText = `${entry.name} ${entry.description} ${entry.tags.join(' ')} ${entry.type}`.toLowerCase();
    
    words.forEach(word => {
      if (word.length < 3) return; // Ignorar palabras cortas
      if (entryText.includes(word)) score += 1;
      if (entry.tags.some(t => t.includes(word))) score += 2;
      if (entry.name.toLowerCase().includes(word)) score += 3;
    });
    
    return { entry, score };
  });

  // Ordenar por puntuación
  const bestMatch = scoredEntries.sort((a, b) => b.score - a.score)[0];

  if (bestMatch && bestMatch.score > 0) {
    const match = bestMatch.entry;
    return {
      summary: match.description,
      steps: match.manualSteps,
      recommendedTools: ["OmniFix Local Scanner", "CMD Admin", "Toolbox"],
      severity: match.dangerLevel,
      difficulty: match.type === 'Mobile' ? "Intermedio (Hardware)" : "Técnico Manual"
    };
  }

  return {
    summary: "No se encontró coincidencia exacta en la base local amplia. El problema puede ser nuevo o requiere análisis de logs crudos.",
    steps: ["Analizar visor de eventos (eventvwr.msc)", "Revisar procesos activos en Administrador de Tareas", "Escanear con herramientas de la Toolbox (Victoria/MemTest)"],
    recommendedTools: ["HWiNFO64", "Victoria HDD", "Process Explorer"],
    severity: "Desconocida",
    difficulty: "Alta / Investigación"
  };
};

export interface SystemProfile {
  cpuName: string;
  ramTotal: string;
  diskHealth: string;
  osVersion: string;
  activeProcesses: string[];
  recentErrors: string[];
}

export interface RepairTask {
  id: string;
  title: string;
  command: string;
  description: string;
}

export interface IsoData {
  id: string;
  name: string;
  version: string;
  size: string;
  type: string;
  status: string;
  description: string;
  downloadUrl?: string;
}

export const getDiagnosticReport = async (symptoms: string) => {
  try {
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') throw new Error("No Key");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Diagnóstico: ${symptoms}. Responde JSON: { summary, steps[], recommendedTools[], severity, difficulty }.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    handleApiError(error);
    return searchLocalKnowledge(symptoms);
  }
};

export const getRepairPlan = async (risks: string[]) => {
  try {
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') throw new Error("No Key");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Plan reparación CMD para: ${risks.join(', ')}. JSON array {id, title, command, description}.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '[]');
  } catch (error) {
    const plan: RepairTask[] = [];
    risks.forEach((risk, i) => {
      const words = risk.toLowerCase().split(' ');
      // Buscar todos los matches
      const matches = LOCAL_KNOWLEDGE_BASE.filter(e =>
        words.some(w => e.name.toLowerCase().includes(w) || e.tags.includes(w))
      );
      // Priorizar los más graves
      const sortedMatches = matches.sort((a, b) => {
        const levels = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
        return levels[b.dangerLevel] - levels[a.dangerLevel];
      });
      sortedMatches.forEach((match, j) => {
        plan.push({
          id: `local-${i}-${j}`,
          title: match.name,
          command: match.commands[0] || "sfc /scannow",
          description: match.manualSteps[0]
        });
      });
    });
    // Si no hay suficientes, agregar tareas genéricas
    if (plan.length === 0) {
      plan.push({
        id: `fix-generic-0`,
        title: 'Mantenimiento General',
        command: 'sfc /scannow & dism /online /cleanup-image /restorehealth',
        description: 'Reparación estándar de archivos de sistema.'
      });
    }
    return plan;
  }
};

export const getMobileDiagnosis = async (model: string, symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dispositivo: ${model}. Síntomas: ${symptoms}. JSON diagnosis.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    const localMatch = searchLocalKnowledge(symptoms);
    return {
      likelyIssue: localMatch.summary,
      schematicFocus: "Etapa de carga y Boot primario",
      difficulty: localMatch.difficulty,
      requiredTools: localMatch.recommendedTools,
      repairSteps: localMatch.steps,
      microSolderingRequired: symptoms.toLowerCase().includes('carga') || symptoms.toLowerCase().includes('placa')
    };
  }
};

export const getMobileFirmwareLibrary = async (): Promise<IsoData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Firmwares móviles JSON array.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '[]');
  } catch (error) {
    return [
      { id: 'f-1', name: 'LineageOS 21', version: 'Android 14', size: '1.2GB', type: 'ROM', status: 'Stable', description: 'ROM personalizada limpia basada en AOSP.' },
      { id: 'f-2', name: 'Samsung Stock Firmware', version: 'OneUI 6.1', size: '7GB', type: 'Stock', status: 'Official', description: 'Firmware original para recuperación completa.' },
      { id: 'f-3', name: 'Xiaomi Fastboot ROM', version: 'HyperOS 1.0', size: '5.5GB', type: 'Stock', status: 'Stable', description: 'ROM para recuperación vía MiFlash.' }
    ];
  }
};

export const analyzeSystemProfile = async (profile: SystemProfile) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analiza JSON: ${JSON.stringify(profile)}. JSON salud.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    let score = 90;
    const risks = [];
    if (profile.diskHealth.includes('Warning')) { score -= 20; risks.push("Falla de Disco Inminente"); }
    if (profile.recentErrors.length > 0) { score -= 15; risks.push("Corrupción de Registro Detectada"); }
    
    return { 
      healthScore: score, 
      risks: risks.length > 0 ? risks : ["Sin problemas evidentes en base local"], 
      summary: "El sistema está operando en modo de diagnóstico local limitado por falta de conexión IA." 
    };
  }
};

export const getLatestIsoVersions = async (): Promise<IsoData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ISOs técnicas JSON array.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '[]');
  } catch (error) {
    return [];
  }
};

export const getInstallationManual = async (isoName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Guía ${isoName} JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    return { title: "Guía de Instalación Genérica", steps: [{ step: "Preparar USB", details: "Usar Rufus con esquema GPT/UEFI." }, { step: "Configurar BIOS", details: "Desactivar Secure Boot y seleccionar el USB como prioridad." }], technicalTips: ["Usar puertos USB 3.0 para mayor velocidad"] };
  }
};

export const getRecoveryAdvice = async (fileType: string, scenario: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Recuperación ${fileType} JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    return { chance: "Media (40-60%)", tool: "PhotoRec / Recuva / R-Studio", steps: ["No guardar nuevos archivos en el disco afectado", "Escanear en modo profundo (Deep Scan)", "Recuperar archivos en una unidad distinta"] };
  }
};

export const generateSecurityScript = async (issue: string, module: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Script .bat para ${module}: ${issue}.`
    });
    return response.text || '';
  } catch (error) {
    return "@echo off\necho OmniFix Security Fix (Modo Offline)\necho Realizando mantenimiento de emergencia...\nsfc /scannow\ndism /online /cleanup-image /restorehealth\nipconfig /flushdns\npause";
  }
};

export const generateExecutableScript = async (risks: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Script .bat para solucionar: ${risks.join(', ')}`
    });
    return response.text || '';
  } catch (error) {
    return "@echo off\necho OmniFix Script de Reparación Local\nchkdsk C: /f\npause";
  }
};

export const getToolManual = async (toolName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Manual ${toolName} JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    return { simpleExplanation: "Herramienta técnica de diagnóstico profundo.", steps: ["Ejecutar como administrador", "Seguir las instrucciones en pantalla"] };
  }
};

export const simulateToolExecution = async (toolName: string, profile: SystemProfile) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Simula ${toolName} JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    return { logs: ["BOOT...", "CHECKING INTERFACES...", "DONE."], verdict: "Todo correcto según el análisis local.", clientSummary: "No se encontraron anomalías críticas." };
  }
};

export const generateTechnicalReport = async (toolName: string, verdict: string, logs: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Reporte ${toolName} texto.`
    });
    return response.text || '';
  } catch (error) {
    return `REPORTE TÉCNICO LOCAL\nHERRAMIENTA: ${toolName}\nRESULTADO: ${verdict}\n\nEste reporte fue generado automáticamente por el motor de respaldo de OmniFix.`;
  }
};

export const getDiagnosticReportIA = async (symptoms: string) => {
  return getDiagnosticReport(symptoms);
};
