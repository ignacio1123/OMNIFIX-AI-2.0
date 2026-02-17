
import React, { useState } from 'react';
import { Code, Download, FileText, Loader2, Play, Terminal, ShieldAlert, CheckCircle2, Copy } from 'lucide-react';
import { generateExecutableScript } from '../geminiService';

const ScriptCenter: React.FC = () => {
  const [problemDescription, setProblemDescription] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    if (!problemDescription.trim()) return;
    setIsGenerating(true);
    setGeneratedScript('');
    try {
      const risks = [problemDescription];
      const scriptCode = await generateExecutableScript(risks);
      setGeneratedScript(scriptCode);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedScript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "OmniFix_Repair_Script.bat";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyScript = () => {
    navigator.clipboard.writeText(generatedScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Input Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Code size={120} />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Terminal size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Generador de Scripts</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Compilador OmniFix V2</p>
            </div>
          </div>

          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Escribe los problemas exactos que quieres arreglar. La IA generará un archivo <strong>.bat</strong> que ejecutará los comandos necesarios en tu PC.
          </p>

          <div className="space-y-4">
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Ej: Limpiar archivos basura, resetear red, cerrar winupdate_sys.exe y reparar imagen de windows..."
              className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all shadow-inner"
            />
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !problemDescription.trim()}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95"
            >
              {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              {isGenerating ? 'Compilando Script...' : 'Generar Script Ejecutable'}
            </button>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-4">
          <ShieldAlert className="text-amber-500 shrink-0" />
          <div className="text-xs text-zinc-400 leading-relaxed">
            <span className="font-bold text-amber-500 block mb-1">PROTOCOLO TÉCNICO:</span>
            Los scripts generados deben ejecutarse como <strong>Administrador</strong>. Revisa siempre el código antes de ejecutarlo para asegurar que cumple con tus necesidades.
          </div>
        </div>
      </div>

      {/* Output Side */}
      <div className="lg:col-span-7">
        {generatedScript ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-full shadow-2xl animate-in slide-in-from-right-8 duration-500">
            <div className="bg-zinc-800 px-6 py-4 border-b border-zinc-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="text-indigo-400 w-5 h-5" />
                <h3 className="font-bold text-sm tracking-tight">OmniFix_Repair_Script.bat</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={copyScript}
                  className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-zinc-300 transition-all border border-zinc-600"
                >
                  {isCopied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
                <button 
                  onClick={downloadScript}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg"
                >
                  <Download size={14} />
                  Descargar .bat
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 bg-black overflow-auto font-mono text-[11px] leading-relaxed text-zinc-400 custom-scrollbar shadow-inner">
              <pre className="whitespace-pre-wrap select-all">
                {generatedScript}
              </pre>
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-700 p-12 text-center bg-zinc-900/20">
            {isGenerating ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-indigo-500" />
                <p className="italic font-bold animate-pulse">La IA está ensamblando los bloques de comando...</p>
              </div>
            ) : (
              <>
                <Terminal className="w-16 h-16 mb-6 opacity-10" />
                <p className="italic text-sm max-w-sm">
                  Aquí aparecerá el código de tu herramienta de reparación. Podrás descargarlo y ejecutarlo en cualquier PC Windows.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptCenter;
