'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, Play, Loader2, ChevronRight, 
  BarChart3, User, Settings, LogOut, CheckCircle2, 
  AlertCircle, BrainCircuit, MessageSquare, Sparkles,
  Code, Briefcase, GraduationCap, Volume2, AlertTriangle
} from 'lucide-react';

// ==================================================================================
//  VS CODE INSTRUCTIONS:
//  1. Run: npm install @vapi-ai/web @google/generative-ai
//  2. UNCOMMENT the two lines below to enable Real AI:
// ==================================================================================

import Vapi from '@vapi-ai/web'; 
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- CONFIGURATION ---
// Set this to FALSE in VS Code after uncommenting the imports above to use Real Vapi.
const USE_MOCK_AI = false; 

// ==================================================================================
//  SMART MOCK SERVICES (FOR PREVIEW & TESTING WITHOUT KEYS)
// ==================================================================================

class MockVapi {
  active: boolean = false;
  listeners: { [key: string]: Function[] } = {};
  recognition: any = null;
  questionIndex: number = 0;
  
  // Mock questions to cycle through
  questions = [
    "Let's start with an introduction. Tell me about yourself and your experience.",
    "Can you explain a challenging technical problem you solved recently?",
    "What are your strengths and weaknesses in this tech stack?",
    "Do you have any questions for us?"
  ];

  constructor(token: string) {
    // Setup Browser Speech Recognition for Mock Mode
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        
        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          this.handleUserSpeech(transcript);
        };

        this.recognition.onerror = (e: any) => console.error("Mock mic error", e);
        this.recognition.onend = () => {
          // If active, restart listening (simulate always-on)
          if (this.active) {
             // Optional: Add delay or logic to not listen while speaking
          }
        };
      }
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  start(assistantId: string, overrides?: any) {
    console.log("Mock Vapi Session Started");
    this.active = true;
    this.questionIndex = 0;
    this.emit('call-start');
    
    // Initial Greeting
    this.speakAndLog(this.questions[0]);
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    if (this.recognition) this.recognition.stop();
    this.emit('call-end');
  }

  setMuted(muted: boolean) {
    console.log("Mock Microphone muted:", muted);
  }

  // Internal helper to simulate AI turn
  speakAndLog(text: string) {
    if (!this.active) return;

    // 1. Emit Transcript (Assistant)
    this.emit('message', { 
      type: 'transcript', 
      transcriptType: 'final', 
      role: 'assistant', 
      transcript: text 
    });

    // 2. Emit Speech Events & Audio
    this.emit('speech-start');
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel previous speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        if (!this.active) return;
        this.emit('speech-end');
        // Start listening after AI finishes speaking
        this.startListening();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback if no TTS
      setTimeout(() => {
        this.emit('speech-end');
        this.startListening();
      }, 2000);
    }
  }

  startListening() {
    if (this.active && this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        // Already started
      }
    }
  }

  handleUserSpeech(text: string) {
    if (!this.active) return;

    // 1. Emit Transcript (User)
    this.emit('message', {
      type: 'transcript',
      transcriptType: 'final',
      role: 'user',
      transcript: text
    });

    // 2. Simulate AI Thinking & Responding
    setTimeout(() => {
      this.questionIndex++;
      if (this.questionIndex < this.questions.length) {
        this.speakAndLog(this.questions[this.questionIndex]);
      } else {
        this.speakAndLog("Thank you for your time. We have finished the interview.");
        setTimeout(() => this.stop(), 3000);
      }
    }, 1000);
  }
}

class MockGenerativeAI {
  apiKey: string;
  constructor(apiKey: string) { this.apiKey = apiKey; }

  getGenerativeModel(config: any) {
    return {
      generateContent: async (prompt: string) => {
        await new Promise(r => setTimeout(r, 2500));
        return {
          response: {
            text: () => JSON.stringify({
              overallScore: 7.8,
              summary: "The candidate showed promise but lacked depth in specific areas. Communication was clear, but technical examples could be more concrete.",
              strengths: ["Clear Voice/Audio", "Professional Demeanor", "Basic Concept Awareness"],
              improvements: ["Provide deeper technical examples", "Use the STAR method for behavioral questions", "Reduce hesitation"],
              techScores: [
                { skill: "Technical Depth", score: 7 },
                { skill: "Communication", score: 8 },
                { skill: "Problem Solving", score: 7 }
              ]
            })
          }
        };
      }
    };
  }
}

// --- COMPONENTS ---

// 1. LOGIN
const AuthScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, uid: "user_123" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/20">
            <BrainCircuit className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">PrepAI</h1>
          <p className="text-slate-400 mt-2">Your AI-Powered Interview Coach</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="developer@example.com" />
          </div>
          <div className="pb-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input type="password" required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

// 2. DASHBOARD
const Dashboard = ({ user, onStartInterview }: any) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-40">Ready to ace your next interview?</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full mb-4">NEW SESSION</span>
            <h2 className="text-3xl font-bold text-white mb-4">Start a Mock Interview</h2>
            <p className="text-slate-300 mb-8 max-w-md">Configure your target role, tech stack, and experience level.</p>
            <button onClick={onStartInterview} className="bg-white text-indigo-900 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg">
              <Play className="w-5 h-5 fill-current" /> Start Configuration
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-400" /> History</h3>
            <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="text-sm text-slate-400">Last Session</div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-white font-medium">React Dev</span>
                        <span className="text-green-400 font-bold">7.8/10</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// 3. CONFIG
const ConfigScreen = ({ onStart, onBack }: any) => {
  const [role, setRole] = useState("");
  const [techStack, setTechStack] = useState("");
  const [experience, setExperience] = useState("junior");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={onBack} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2">&larr; Back</button>
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6">Configure Interview</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Target Role</label>
            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Backend Developer" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Tech Stack</label>
            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Python, Django, AWS" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {['junior', 'mid', 'senior'].map((level) => (
              <button key={level} onClick={() => setExperience(level)} className={`py-3 rounded-xl border capitalize font-medium transition-all ${experience === level ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-400'}`}>{level}</button>
            ))}
          </div>
          <button onClick={() => onStart({ role, techStack, experience })} disabled={!role || !techStack} className="w-full mt-8 bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-blue-50 disabled:opacity-50 flex justify-center items-center gap-2">
            Start Interview <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. INTERVIEW SESSION
const InterviewSession = ({ config, onFinish }: any) => {
  const [status, setStatus] = useState('initializing'); 
  const [messages, setMessages] = useState<any[]>([]);
  const messagesRef = useRef<any[]>([]); 
  const vapiRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (role: string, text: string) => {
    const newMessage = { role, text, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    messagesRef.current = [...messagesRef.current, newMessage];
  };

  useEffect(() => {
    // 1. Check for Keys if using Real AI
    if (!USE_MOCK_AI && !process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
      setError("Vapi API Key is missing. Please add it to your environment variables.");
      return;
    }

    // 2. Select SDK
    let VapiClass: any = MockVapi;
    if (!USE_MOCK_AI) {
      try {
         VapiClass = Vapi;
      } catch (e) {
         console.warn("Vapi SDK not loaded, falling back to Mock");
      }
    }

    // 3. Initialize
    const vapi = new VapiClass(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "mock-key");
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setStatus('speaking');
      setError(null);
      addMessage('system', 'Interview Started.');
    });

    vapi.on('speech-start', () => setStatus('listening'));
    vapi.on('speech-end', () => setStatus('processing'));

    vapi.on('message', (msg: any) => {
      if (msg.type === 'transcript' && msg.transcriptType === 'final') {
        addMessage(msg.role, msg.transcript);
      }
    });

    vapi.on('error', (e: any) => {
        console.error(e);
        setError("Connection Error. Please check your API Keys or Internet.");
        setStatus('error');
    });

    vapi.on('call-end', () => {
      // GUARD: Don't show scorecard if call failed instantly (empty transcript)
      // We assume a valid interview has at least 2 exchanges or lasts > 5 seconds
      if (messagesRef.current.length < 2 && !USE_MOCK_AI && status !== 'completed') {
        setError("Call ended too quickly. Did you provide a valid Assistant ID?");
        setStatus('error');
      } else if (status !== 'completed') {
        setStatus('completed');
        onFinish(messagesRef.current);
      }
    });

    // 4. Start Call
    try {
      const assistantOverrides = {
        firstMessage: `Hello! I see you're applying for a ${config.role} position. Let's begin.`,
        variableValues: { name: "Candidate", role: config.role }
      };
      
      // Use Assistant ID from environment variable or default
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "YOUR_ASSISTANT_ID";
      vapi.start(assistantId, assistantOverrides);

    } catch (err) {
      console.error("Failed to start Vapi", err);
      setError("Failed to initialize voice agent.");
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [config]);

  const handleStopSession = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      setStatus('completed');
    }
  };

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Session Error</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">Return Home</button>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${status === 'listening' ? 'bg-red-500 animate-pulse' : status === 'speaking' ? 'bg-blue-500' : 'bg-slate-500'}`}></div>
          <span className="text-slate-300 font-medium uppercase tracking-wider text-sm">
            {status === 'listening' ? 'Listening...' : status === 'speaking' ? 'Agent Speaking...' : status}
          </span>
        </div>
        <button onClick={handleStopSession} className="text-red-400 hover:text-red-300 text-sm font-bold">End Session</button>
      </div>

      <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-8 mb-6 shadow-inner shadow-black/50">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-xl transition-all duration-500 ${status === 'speaking' ? 'scale-150 opacity-100' : 'scale-100 opacity-50'}`}></div>
          <div className={`w-32 h-32 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center relative z-10 transition-transform duration-300 ${status === 'listening' ? 'scale-110 border-blue-500 shadow-blue-500/50 shadow-lg' : ''}`}>
             {status === 'speaking' ? <Volume2 className="w-12 h-12 text-blue-400 animate-pulse" /> : <Mic className={`w-12 h-12 ${status === 'listening' ? 'text-red-400' : 'text-slate-500'}`} />}
          </div>
        </div>
        
        <div className="mt-12 text-center max-w-2xl">
          <p className="text-slate-500 text-sm mb-2 uppercase tracking-widest">Live Transcript</p>
          <div className="text-xl font-light text-slate-200 min-h-[4rem] max-h-40 overflow-y-auto px-4">
            {messages.length > 0 ? messages[messages.length - 1].text : "Initializing AI..."}
          </div>
          {USE_MOCK_AI && status === 'listening' && (
              <p className="text-xs text-blue-400 mt-2 animate-pulse">Simulated Mode: Speak into your mic...</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-center gap-6">
          <button className="bg-slate-800 text-white p-4 rounded-full hover:bg-slate-700"><Mic className="w-6 h-6" /></button>
          <button onClick={handleStopSession} className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2">
            <Square className="fill-current w-4 h-4" /> Stop
          </button>
      </div>
    </div>
  );
};

// 5. SCORECARD
const Scorecard = ({ results, onHome }: any) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateFeedback = async () => {
      const GenAIConstructor = USE_MOCK_AI ? MockGenerativeAI : (GoogleGenerativeAI || MockGenerativeAI);

      try {
        const genAI = new GenAIConstructor(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "mock-key");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const transcriptText = results.map((m: any) => `${m.role}: ${m.text}`).join("\n");
        const prompt = `Analyze interview:\n${transcriptText}\nOutput JSON: {overallScore, summary, strengths[], improvements[], techScores[{skill, score}]}`;
        
        const result = await model.generateContent(prompt);
        let jsonStr = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        setAnalysis(JSON.parse(jsonStr));
      } catch (error) {
        console.error(error);
        // Fallback
        setAnalysis({ overallScore: 0, summary: "Error generating feedback.", strengths: [], improvements: [], techScores: [] });
      } finally {
        setLoading(false);
      }
    };
    generateFeedback();
  }, [results]);

  if (loading) return <div className="flex flex-col items-center justify-center h-full"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /><p className="text-white mt-4">Analyzing...</p></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Interview Analysis</h2>
        <p className="text-slate-400">AI-Generated Performance Report</p>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full border-8 border-blue-600/20 flex items-center justify-center relative">
            <span className="text-4xl font-bold text-white">{analysis.overallScore}</span>
            <span className="absolute text-xs text-slate-500 bottom-6">OUT OF 10</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Overall Summary</h3>
            <p className="text-slate-400 max-w-xs">{analysis.summary}</p>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
           {analysis.techScores?.map((tech: any, i: number) => (
             <div key={i} className="text-center bg-slate-950 p-4 rounded-2xl border border-slate-800 min-w-[100px]">
               <div className="text-sm text-slate-400 mb-1">{tech.skill}</div>
               <div className="text-xl font-bold text-white">{tech.score}/10</div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Key Strengths</h3>
          <ul className="space-y-3">{analysis.strengths?.map((item: string, i: number) => <li key={i} className="text-slate-300 flex gap-2"><span className="text-green-500">•</span>{item}</li>)}</ul>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Areas for Improvement</h3>
          <ul className="space-y-3">{analysis.improvements?.map((item: string, i: number) => <li key={i} className="text-slate-300 flex gap-2"><span className="text-amber-500">•</span>{item}</li>)}</ul>
        </div>
      </div>
      <button onClick={onHome} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl">Back to Dashboard</button>
    </div>
  );
};

// MAIN APP CONTAINER
export default function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState<any>(null);
  const [interviewConfig, setInterviewConfig] = useState<any>(null);
  const [interviewResults, setInterviewResults] = useState<any>(null);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">

      {view === 'login' && <AuthScreen onLogin={(u) => { setUser(u); setView('dashboard'); }} />}
      {view === 'dashboard' && <Dashboard user={user} onStartInterview={() => setView('setup')} />}
      {view === 'setup' && <ConfigScreen onStart={(c: any) => { setInterviewConfig(c); setView('interview'); }} onBack={() => setView('dashboard')} />}
      {view === 'interview' && <InterviewSession config={interviewConfig} onFinish={(r: any) => { setInterviewResults(r); setView('scorecard'); }} />}
      {view === 'scorecard' && <Scorecard results={interviewResults} onHome={() => setView('dashboard')} />}
    </div>
  );
}