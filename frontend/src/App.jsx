import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  Search, 
  Cpu, 
  DollarSign, 
  Hash,
  Send,
  Zap,
  Info,
  TrendingUp,
  X,
  Database,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const models = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'llama3-cloud', name: 'Llama 3 (Cloud Demo)', provider: 'Cloud' },
  { id: 'mixtral-cloud', name: 'Mixtral (Cloud Demo)', provider: 'Cloud' },
  { id: 'llama3.2', name: 'Llama 3.2', provider: 'Ollama' },
  { id: 'gemma2', name: 'Gemma 2', provider: 'Ollama' },
  { id: 'mistral', name: 'Mistral', provider: 'Ollama' },
  { id: 'phi3', name: 'Phi 3', provider: 'Ollama' },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:8000');

  // Refs for scrolling
  const historyRef = useRef(null);
  const chartRef = useRef(null);
  const topRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const loadFromHistory = (item) => {
    setPrompt(item.text || ""); // If we save text in history
    setResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const analyzePrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/analyze`, {
        text: prompt,
        model: selectedModel
      });
      setResult(response.data);
      const newHistoryItem = {
        ...response.data,
        text: prompt, // Saving text to restore it later
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now()
      };
      setHistory([newHistoryItem, ...history].slice(0, 5));
    } catch (error) {
      console.error("Error analyzing prompt:", error);
      alert("Error: Make sure backend is running. If using Ollama, ensure Ollama app is open.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center" ref={topRef}>
      <div className="mesh-bg" />
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsSettingsOpen(false)} />
          <div className="glass w-full max-w-md rounded-[2.5rem] p-8 relative z-10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Settings className="text-indigo-400" /> Settings
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Endpoint</label>
                <div className="flex items-center gap-3 bg-slate-950/50 border border-white/5 p-3 rounded-2xl">
                  <Database size={16} className="text-slate-500" />
                  <input 
                    type="text" 
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-slate-200 w-full"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing Model</label>
                <select className="bg-slate-950/50 border border-white/5 p-3 rounded-2xl text-sm text-slate-400 outline-none">
                  <option>Official Marketplace Rates</option>
                  <option>Enterprise Discount (10%)</option>
                  <option>Custom Override</option>
                </select>
              </div>

              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="premium-button py-4 rounded-2xl font-bold mt-4"
              >
                SAVE CONFIGURATION
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-16 px-4">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.5)] group-hover:rotate-12 transition-transform duration-500">
            <Zap className="text-white" size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-black gradient-text tracking-tight">TokenAnalyzer</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Intelligence Metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-8 text-slate-400">
          <div 
            onClick={() => scrollTo(historyRef)}
            className="p-2 hover:bg-white/5 rounded-full transition-all cursor-pointer group relative"
          >
            <Activity size={22} className="group-hover:text-indigo-400" />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Activity</span>
          </div>
          <div 
            onClick={() => scrollTo(chartRef)}
            className="p-2 hover:bg-white/5 rounded-full transition-all cursor-pointer group relative"
          >
            <BarChart3 size={22} className="group-hover:text-indigo-400" />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Charts</span>
          </div>
          <div 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/5 rounded-full transition-all cursor-pointer group relative"
          >
            <Settings size={22} className="group-hover:text-indigo-400" />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Settings</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="glass rounded-[2rem] p-8 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] rounded-full -mr-16 -mt-16" />
            
            <div className="flex justify-between items-center relative z-10">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Prompt Analysis
              </label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-950/80 border border-white/10 text-[11px] font-bold rounded-xl px-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer hover:border-white/20 transition-all"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} • {m.provider}</option>
                ))}
              </select>
            </div>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your prompt text here to calculate tokens and estimated cost across different LLM providers..."
              className="w-full h-72 bg-slate-950/30 border border-white/5 rounded-2xl p-6 text-slate-200 focus:border-indigo-500/30 outline-none transition-all resize-none placeholder:text-slate-700 leading-relaxed text-sm font-medium"
            />
            
            <button 
              onClick={analyzePrompt}
              disabled={loading}
              className="premium-button w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="tracking-wide uppercase">Algorithm Running...</span>
                </div>
              ) : (
                <>
                  <Send size={20} /> <span className="tracking-wide uppercase">Analyze Tokens</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Results */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="glass rounded-[2rem] p-7 border-l-4 border-indigo-500 group hover:translate-y-[-4px] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-500/20 p-2 rounded-xl">
                    <Hash className="text-indigo-400" size={20} />
                  </div>
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Token Count</span>
                </div>
                <div className="text-4xl font-black text-white">{result.tokens.toLocaleString()}</div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Model-specific units</p>
              </div>

              <div className="glass rounded-[2rem] p-7 border-l-4 border-emerald-500 group hover:translate-y-[-4px] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-500/20 p-2 rounded-xl">
                    <DollarSign className="text-emerald-400" size={20} />
                  </div>
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Estimate</span>
                </div>
                <div className="text-4xl font-black text-white">
                  {result.estimated_cost === 0 ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">FREE</span>
                  ) : (
                    `$${result.estimated_cost}`
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  {result.estimated_cost === 0 ? "Local infrastructure" : "Market average rates"}
                </p>
              </div>

              <div className="glass rounded-[2rem] p-7 border-l-4 border-purple-500 group hover:translate-y-[-4px] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-purple-500/20 p-2 rounded-xl">
                    <Cpu className="text-purple-400" size={20} />
                  </div>
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Length</span>
                </div>
                <div className="text-4xl font-black text-white">{result.character_count.toLocaleString()}</div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Raw UTF-8 characters</p>
              </div>
            </div>
          )}

          {/* Analytics Chart */}
          <div ref={chartRef} className="glass rounded-[2rem] p-8 h-[400px] flex flex-col relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full -ml-32 -mb-32" />
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <TrendingUp size={20} className="text-indigo-400" /> Usage Intelligence
              </h3>
              <div className="text-[9px] text-indigo-400 font-black tracking-[0.2em] bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                ACTIVE SESSION
              </div>
            </div>
            
            <div className="flex-1 w-full relative z-10">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...history].reverse().map((h, i) => ({ ...h, index: i }))}>
                    <XAxis 
                      dataKey="timestamp" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.03)', radius: 10 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="glass p-4 rounded-2xl shadow-2xl border-white/10 min-w-[140px]">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{payload[0].payload.model}</p>
                              <div className="flex flex-col gap-1">
                                <p className="text-lg font-black text-indigo-400">{payload[0].value.toLocaleString()} <span className="text-[10px] text-slate-500">tkn</span></p>
                                <p className="text-xs font-bold text-emerald-400">${payload[0].payload.estimated_cost}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="tokens" radius={[10, 10, 10, 10]} barSize={40}>
                      {[...history].reverse().map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === history.length - 1 ? 'url(#activeGradient)' : '#1e1b4b'} 
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4 border-2 border-dashed border-white/5 rounded-3xl">
                  <div className="p-4 bg-white/5 rounded-full">
                    <BarChart3 size={40} className="opacity-20" />
                  </div>
                  <p className="text-xs font-bold tracking-widest uppercase">Waiting for intelligence data...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div ref={historyRef} className="glass rounded-[2rem] p-8 border border-white/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <Activity size={20} className="text-indigo-400" /> Recent Stream
            </h3>
            <div className="flex flex-col gap-4">
              {history.length === 0 ? (
                <div className="text-slate-600 text-[11px] font-bold text-center py-12 uppercase tracking-widest">
                  History Empty
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => loadFromHistory(item)}
                    className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 flex justify-between items-center hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group cursor-pointer active:scale-95"
                  >
                    <div>
                      <div className="text-[11px] font-black text-slate-200 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{item.model}</div>
                      <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{item.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-indigo-400">{item.tokens.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-emerald-500">${item.estimated_cost}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full -mr-12 -mt-12" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <Info className="text-indigo-400" size={20} />
              <h3 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em]">Data Logic</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10">
              This intelligence engine leverages <span className="text-indigo-300 font-bold underline decoration-indigo-500/30 underline-offset-4">tiktoken</span> for precise model-specific tokenization. 
              <br/><br/>
              Ollama models are processed via local inference streams to ensure zero-cost and privacy-first analysis.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-24 pb-12 text-slate-600 text-[10px] font-black tracking-[0.3em] uppercase">
        &copy; 2026 TokenAnalyzer Global &bull; Next-Gen Intelligence
      </footer>
    </div>
  );
}

export default App;
