import React, { useState } from 'react';
import {
  Upload,
  Brain,
  Sparkles,
  FileSpreadsheet,
  TrendingUp,
  AlertCircle,
  Check,
  Zap,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Por favor sube un archivo Excel válido (.xlsx o .xls)');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const analyzeFile = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('data', file);

      const response = await fetch('https://n8n-latest-a738.onrender.com/webhook/Data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al analizar el archivo');

      const result = await response.json();
      const analysisText = result.content?.parts?.[0]?.text || result.text || result.analysis || 'No se pudo obtener el análisis';
      setAnalysis({ analysis: analysisText });
    } catch (err) {
      setError(err.message || 'Error al procesar el archivo');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAnalysis = (text) => {
    if (!text) return [];
    const sections = text.split(/\n(?=\d+\.\s|\*\*)/);
    return sections.filter(s => s.trim());
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden flex flex-col">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Patrón de fondo */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                DataInsight AI
              </h1>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-6xl mx-auto">
            {/* Pantalla inicial */}
            {!analysis && !isAnalyzing && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-5xl font-bold mb-4">
                    Analiza tus datos de{' '}
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Excel
                    </span>
                  </h2>
                  <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Sube tu archivo y obtén insights instantáneos con inteligencia artificial
                  </p>
                </div>

                {/* Área de carga */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative group transition-all duration-300 ${isDragging ? 'scale-102' : ''}`}
                >
                  <div
                    className={`relative bg-slate-900/50 backdrop-blur-xl border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                      isDragging
                        ? 'border-purple-400 bg-purple-500/10 shadow-2xl shadow-purple-500/20'
                        : 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="relative text-center space-y-6">
                      {!file ? (
                        <>
                          <div className="flex justify-center">
                            <div
                              className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center transition-transform duration-300 ${
                                isDragging ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                              }`}
                            >
                              <Upload
                                className={`w-12 h-12 transition-colors duration-300 ${
                                  isDragging ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-2xl font-semibold text-white">Arrastra tu archivo aquí</p>
                            <p className="text-slate-400">o haz clic para seleccionar</p>
                          </div>

                          <label className="inline-block">
                            <input
                              type="file"
                              accept=".xlsx,.xls"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
                              <FileSpreadsheet className="w-5 h-5" />
                              Seleccionar archivo Excel
                            </span>
                          </label>

                          <p className="text-sm text-slate-500">Soporta archivos .xlsx y .xls</p>
                        </>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-center gap-3 text-green-400 text-lg font-semibold">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="w-6 h-6" />
                            </div>
                            <span className="truncate max-w-xs">{file.name}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                              onClick={analyzeFile}
                              disabled={isAnalyzing}
                              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              <Zap className="w-5 h-5" />
                              Analizar con IA
                            </button>

                            <button
                              onClick={() => setFile(null)}
                              className="px-6 py-4 border border-slate-700 hover:border-slate-600 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-800/50"
                            >
                              Cambiar archivo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-xl backdrop-blur-xl animate-shake">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-300 mb-1">Error</p>
                      <p className="text-sm text-red-300/80">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cargando */}
            {isAnalyzing && (
              <div className="text-center space-y-8 animate-fade-in">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-purple-300">Analizando tus datos</h3>
                  <p className="text-slate-400">La IA está procesando tu archivo...</p>
                </div>
              </div>
            )}

            {/* Resultados */}
            {analysis && !isAnalyzing && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">Análisis completado</span>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Resultados del Análisis
                  </h2>
                </div>

                <div className="space-y-4">
                  {formatAnalysis(analysis.analysis).map((section, idx) => {
                    const titleMatch = section.match(/\*\*(.+?)\*\*/);
                    const title = titleMatch ? titleMatch[1] : null;
                    const content = title ? section.replace(/\*\*.+?\*\*/, '').trim() : section.trim();

                    return (
                      <div
                        key={idx}
                        className="group p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 animate-slide-up"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            {section.includes('RESUMEN') && <FileSpreadsheet className="w-5 h-5" />}
                            {section.includes('ESTADÍSTICA') && <BarChart3 className="w-5 h-5" />}
                            {section.includes('PATRÓN') && <TrendingUp className="w-5 h-5" />}
                            {section.includes('INSIGHT') && <Lightbulb className="w-5 h-5" />}
                            {section.includes('PROBLEMA') && <AlertCircle className="w-5 h-5" />}
                            {section.includes('RECOMENDACIÓN') && <Sparkles className="w-5 h-5" />}
                            {!section.match(/RESUMEN|ESTADÍSTICA|PATRÓN|INSIGHT|PROBLEMA|RECOMENDACIÓN/) && <Brain className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            {title && <h3 className="text-lg font-bold text-purple-300 mb-3">{title}</h3>}
                            <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed">
                              <ReactMarkdown>{content}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      setAnalysis(null);
                      setFile(null);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
                  >
                    <Upload className="w-5 h-5" />
                    Analizar otro archivo
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Animaciones */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out backwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
