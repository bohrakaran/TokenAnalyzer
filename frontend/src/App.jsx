import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';

const API_URL = 'http://localhost:8000';

const models = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'llama3', name: 'Llama 3', provider: 'Ollama' },
  { id: 'mistral', name: 'Mistral', provider: 'Ollama' },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const analyzePrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        text: prompt,
        model: selectedModel
      });
      setResult(response.data);
      // Save to local history
      const newHistoryItem = {
        ...response.data,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now()
      };
      setHistory([newHistoryItem, ...history].slice(0, 5));
    } catch (error) {
      console.error("Error analyzing prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Zap className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold gradient-text">TokenAnalyzer</h1>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <Activity size={20} className="hover:text-indigo-400 cursor-pointer" />
          <BarChart3 size={20} className="hover:text-indigo-400 cursor-pointer" />
          <Settings size={20} className="hover:text-indigo-400 cursor-pointer" />
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Input Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Search size={16} /> Enter your prompt
              </label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                ))}
              </select>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your prompt here to analyze tokens and cost..."
              className="w-full h-64 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-slate-300 focus:border-indigo-500 outline-none transition-all resize-none"
            />
            <button 
              onClick={analyzePrompt}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? "Analyzing..." : (
                <>
                  <Send size={18} /> Analyze Token Usage
                </>
              )}
            </button>
          </div>

          {/* Real-time Results */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-2">
                  <Hash className="text-indigo-400" size={20} />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Tokens</span>
                </div>
                <div className="text-3xl font-bold">{result.tokens}</div>
                <div className="text-[10px] text-slate-400 mt-1">Total model tokens</div>
              </div>

              <div className="glass rounded-2xl p-5 border-l-4 border-emerald-500">
                <div className="flex justify-between items-start mb-2">
                  <DollarSign className="text-emerald-400" size={20} />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Est. Cost</span>
                </div>
                <div className="text-3xl font-bold">${result.estimated_cost}</div>
                <div className="text-[10px] text-slate-400 mt-1">Based on OpenAI rates</div>
              </div>

              <div className="glass rounded-2xl p-5 border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-2">
                  <Cpu className="text-purple-400" size={20} />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Characters</span>
                </div>
                <div className="text-3xl font-bold">{result.character_count}</div>
                <div className="text-[10px] text-slate-400 mt-1">Raw string length</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Side Panels */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* History Panel */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-indigo-400" /> Recent Activity
            </h3>
            <div className="flex flex-col gap-3">
              {history.length === 0 ? (
                <div className="text-slate-500 text-sm text-center py-8">
                  No activity yet. Analyze a prompt to see results here.
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-medium text-slate-300">{item.model}</div>
                      <div className="text-[10px] text-slate-500">{item.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-indigo-400">{item.tokens} tokens</div>
                      <div className="text-[10px] text-emerald-500">${item.estimated_cost}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-indigo-400" size={18} />
              <h3 className="text-sm font-semibold text-indigo-300">How it works</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tokens are the basic units of text processed by LLMs. In English, 1,000 tokens is roughly 750 words. This tool uses <span className="text-indigo-300">tiktoken</span> (OpenAI's official library) to ensure 100% accuracy in count estimation.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-auto pt-12 pb-6 text-slate-500 text-xs">
        &copy; 2026 TokenAnalyzer Dashboard &bull; Built with FastAPI & React
      </footer>
    </div>
  );
}

export default App;
