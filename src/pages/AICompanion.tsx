import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  Bot,
  User,
  Info,
  RefreshCw,
  PhoneCall,
  Wind,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Lock,
  BookOpen,
  Code,
  GraduationCap,
} from 'lucide-react';
import { LOGO_PATH } from '../components/Navbar';

interface ChatMessage {
  id: string;
  sender: 'student' | 'companion';
  text: string;
  timestamp: string;
  source?: string;
  mode?: 'ai' | 'demo';
  isCrisis?: boolean;
  exercise?: string;
}

const STARTER_PROMPTS = [
  {
    label: 'Feynman Technique',
    category: 'Study',
    icon: 'book',
    prompt: 'Can you explain the Feynman Technique for studying and how I can use it for my revisions?',
  },
  {
    label: 'Python List Comprehension',
    category: 'Tech',
    icon: 'code',
    prompt: 'What is Python list comprehension and how does it work with a practical example?',
  },
  {
    label: 'Exam Overwhelm',
    category: 'Wellness',
    icon: 'heart',
    prompt: 'I have two exams tomorrow and I feel completely overwhelmed and unable to focus.',
  },
  {
    label: 'Making Campus Friends',
    category: 'Life',
    icon: 'user',
    prompt: 'How do I start conversations and make friends during my first college semester?',
  },
  {
    label: 'Time Management',
    category: 'Productivity',
    icon: 'clock',
    prompt: 'What are 3 proven time management strategies to balance heavy coursework and rest?',
  },
  {
    label: '2-Minute Grounding',
    category: 'Calm',
    icon: 'wind',
    prompt: 'Can you guide me through a 2-minute calming breathing or grounding exercise right now?',
  },
];

const CRISIS_RESOURCES = [
  {
    region: 'India (National)',
    name: 'Tele-MANAS Mental Health Helpline',
    phone: '14416 / 1800-891-4416',
    hours: '24/7 · Toll-Free · Multi-lingual',
  },
  {
    region: 'India',
    name: 'KIRAN Mental Health Helpline',
    phone: '1800-599-0019',
    hours: '24/7 · Ministry of Social Justice',
  },
  {
    region: 'United States & Canada',
    name: '988 Suicide & Crisis Lifeline',
    phone: 'Call or Text 988',
    hours: '24/7 · Free & Confidential',
  },
  {
    region: 'Immediate Danger',
    name: 'Campus Security or Emergency Services',
    phone: 'Dial 112 (India) or 911 (US)',
    hours: 'Immediate Local Dispatch',
  },
];

// Helper component to render markdown inline tokens (`code` and **bold**)
const FormattedInline: React.FC<{ text: string }> = ({ text }) => {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 font-mono text-[12px] border border-neutral-200"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
          return (
            <strong key={i} className="font-semibold text-neutral-900">
              {token.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{token}</span>;
      })}
    </>
  );
};

// Formats companion responses with code blocks, bold text, bullet points, and clean spacing
const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const lang = firstLineEnd !== -1 ? part.slice(3, firstLineEnd).trim() : '';
          const code = firstLineEnd !== -1 ? part.slice(firstLineEnd + 1, -3) : part.slice(3, -3);

          return (
            <div
              key={index}
              className="my-2.5 rounded-xl bg-neutral-900 text-neutral-100 overflow-hidden text-xs font-mono shadow-xs border border-neutral-800"
            >
              {lang && (
                <div className="px-3 py-1 bg-neutral-800 text-[10px] text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-700">
                  {lang}
                </div>
              )}
              <pre className="p-3 overflow-x-auto whitespace-pre leading-normal">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const paragraphs = part.split(/\n\n+/);
        return paragraphs.map((para, pIdx) => {
          if (!para.trim()) return null;
          const lines = para.split('\n');
          const isBulletList = lines.every(
            (line) => line.trim().startsWith('* ') || line.trim().startsWith('- ') || /^\d+\.\s/.test(line.trim())
          );

          if (isBulletList) {
            return (
              <ul key={`${index}-${pIdx}`} className="list-disc list-inside space-y-1 my-1.5 pl-1">
                {lines.map((line, lIdx) => (
                  <li key={lIdx}>
                    <FormattedInline text={line.replace(/^(\* |- |\d+\.\s*)/, '')} />
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={`${index}-${pIdx}`}>
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  <FormattedInline text={line} />
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        });
      })}
    </div>
  );
};

export const AICompanion: React.FC = () => {
  const { aiStatus, showToast, refreshAIStatus, setCurrentPage } = useApp();

  // Consent & Privacy Gate
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('sahayak_companion_consent') === 'true';
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'companion',
      text: "Namaste! I am Sahayak AI Companion. I am here to help you navigate college life—whether you need clear explanations on study techniques, coding or coursework help, advice on campus challenges, or a supportive, non-judgmental space to unpack stress.\n\nWhat would you like to explore or talk about today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: aiStatus.geminiConfigured ? 'Google Gemini' : 'Sahayak Engine',
      mode: aiStatus.mode,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);

  const activeRequestIdRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Breathing exercise cycle
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathCountdown((prev) => {
        if (prev > 1) return prev - 1;

        setBreathPhase((currentPhase) => {
          if (currentPhase === 'Inhale') return 'Hold';
          if (currentPhase === 'Hold') return 'Exhale';
          if (currentPhase === 'Exhale') return 'Rest';
          return 'Inhale';
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive]);

  const handleConsentAccept = () => {
    setHasConsented(true);
    localStorage.setItem('sahayak_companion_consent', 'true');
    showToast('AI processing consent recorded. You can now chat with Companion.', 'success');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text || isLoading) return;

    if (!hasConsented) {
      showToast('Please review and accept the AI data processing disclosure first.', 'warning');
      return;
    }

    activeRequestIdRef.current += 1;
    const currentRequestId = activeRequestIdRef.current;

    setErrorMessage(null);
    setLastFailedMessage(null);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Prepare recent multi-turn conversation history for context (exclude welcome banner)
    const historyPayload = messages
      .filter((m) => m.id !== 'welcome-1')
      .slice(-8)
      .map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

    try {
      const response = await fetch('/api/chat-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      const data = await response.json().catch(() => ({}));

      // Guard: Ensure response belongs to the latest request
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }

      if (!response.ok) {
        const errorDesc =
          data.details ||
          data.error ||
          `Server returned status ${response.status}. Please try again.`;
        throw new Error(errorDesc);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        sender: 'companion',
        text: data.reply || 'Thank you for sharing your thoughts.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || (data.mode === 'ai' ? 'Google Gemini' : 'Demo Engine'),
        mode: data.mode || 'ai',
        isCrisis: data.isCrisis,
        exercise: data.exerciseSuggestion,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (data.isCrisis) {
        setShowCrisisModal(true);
      }
    } catch (err: any) {
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }
      console.error('Failed to send companion message:', err);
      setLastFailedMessage(text);
      setErrorMessage(
        err?.message ||
          'Unable to reach the Gemini service at this moment. Please check your connection and click Retry.'
      );
    } finally {
      if (activeRequestIdRef.current === currentRequestId) {
        setIsLoading(false);
      }
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage && !isLoading) {
      handleSendMessage(lastFailedMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    activeRequestIdRef.current += 1;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'companion',
        text: 'The conversation has been cleared. Whenever you are ready, feel free to ask a question or explore a prompt below.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: aiStatus.geminiConfigured ? 'Google Gemini' : 'Sahayak Engine',
        mode: aiStatus.mode,
      },
    ]);
    setShowClearConfirm(false);
    setErrorMessage(null);
    setLastFailedMessage(null);
    setIsLoading(false);
    showToast('Conversation history reset.', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#A8C5A0]/80 p-1 shadow-xs shrink-0 flex items-center justify-center">
            <img
              src={LOGO_PATH}
              alt="Sahayak Companion"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-[#202B26] tracking-tight">
                AI Companion
              </h1>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${
                  aiStatus.geminiConfigured
                    ? 'bg-[#E3F2E8] text-[#174D3A] border-[#A8C5A0]/60'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>
                  {aiStatus.geminiConfigured
                    ? 'Powered by Google Gemini (Live Server-Side AI)'
                    : 'Deterministic Engine (Demo Mode)'}
                </span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Your conversational partner for academics, study strategies, technology, everyday life, and mental wellness.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setShowCrisisModal(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Helplines & Emergency Assistance"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Crisis Help</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={messages.length <= 1}
            className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-600 hover:text-rose-700 hover:border-rose-200 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          <button
            onClick={() => refreshAIStatus()}
            className="p-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-[#174D3A] transition-colors cursor-pointer"
            title="Refresh AI Connection"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safety & General-Purpose Scope Banner */}
      <div className="bg-[#F0F7F2] border border-[#A8C5A0]/60 rounded-2xl p-4 text-xs text-[#202B26]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#174D3A] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#174D3A]">Privacy & Guidance Notice: </span>
            Feel free to ask about study techniques, academics, coding, campus life, or emotional stress. This AI Companion
            provides helpful conversational guidance, but does
            <strong className="text-neutral-900"> not provide medical diagnoses or clinical therapy</strong>.
            Conversations are private and <strong className="text-neutral-900">never transmitted to mentors</strong>.
          </div>
        </div>
        <button
          onClick={() => setCurrentPage('privacy-safety')}
          className="text-xs font-semibold text-[#174D3A] hover:underline whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <span>Privacy Details</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Consent Gate Modal / Banner if not yet consented */}
      {!hasConsented && (
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Lock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">
                AI Processing Disclosure & User Consent
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Before chatting, please note that message text is securely transmitted to Google&apos;s Gemini API via a protected server-side proxy to generate personalized, dynamic responses.
                No identifying academic records are attached, conversations are not used for advertising, and messages are never shared with mentors.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleConsentAccept}
              className="px-4 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#123E2F] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>I Understand &amp; Agree to AI Processing</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Box Breathing Widget (Optional Low-Risk Exercise) */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#202B26]">Quick Pacing: 4-4-4-4 Box Breathing</h4>
              <p className="text-[11px] text-neutral-500">Optional somatic pacing exercise to steady racing thoughts before exams or study</p>
            </div>
          </div>
          <button
            onClick={() => setBreathingActive(!breathingActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              breathingActive
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-[#174D3A] text-white hover:bg-[#123E2F]'
            }`}
          >
            {breathingActive ? 'Stop Pacing' : 'Start 4s Pacing'}
          </button>
        </div>

        {breathingActive && (
          <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-[#174D3A] bg-[#E3F2E8] flex flex-col items-center justify-center transition-all animate-pulse">
                <span className="text-xl font-extrabold text-[#174D3A]">{breathCountdown}</span>
                <span className="text-[10px] uppercase font-bold text-[#174D3A]/80 tracking-wider">
                  {breathPhase}
                </span>
              </div>
            </div>
            <div className="text-left text-xs text-neutral-600 max-w-md space-y-1">
              <p className="font-semibold text-[#174D3A]">How it works:</p>
              <p>Inhale slowly through your nose (4s) → Hold gently (4s) → Exhale smoothly through mouth (4s) → Rest (4s).</p>
              <p className="text-[11px] text-neutral-400">Notice where your shoulders are and allow them to drop away from your ears.</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Interface Window */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col overflow-hidden min-h-[520px] max-h-[700px]">
        {/* Chat History Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FBFBFA]/50">
          {messages.map((msg) => {
            const isStudent = msg.sender === 'student';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-end ${isStudent ? 'justify-end' : 'justify-start'}`}
              >
                {/* Companion Avatar */}
                {!isStudent && (
                  <div className="w-8 h-8 rounded-full bg-white border border-[#A8C5A0] overflow-hidden p-0.5 shrink-0 shadow-2xs mb-1">
                    <img
                      src={LOGO_PATH}
                      alt="Sahayak Companion"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-2xs space-y-1.5 ${
                    isStudent
                      ? 'bg-[#174D3A] text-white rounded-br-xs'
                      : 'bg-white text-[#202B26] border border-neutral-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-75">
                    <span className="font-semibold">
                      {isStudent ? 'You (Student)' : 'Sahayak AI Companion'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Render content: user messages as text, companion formatted with code/markdown */}
                  {isStudent ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <FormattedMessage text={msg.text} />
                  )}

                  {/* Optional Reflection Exercise Card inside companion bubble if provided */}
                  {msg.exercise && (
                    <div className="mt-2.5 pt-2.5 border-t border-neutral-100/80 bg-[#F0F7F2] -mx-1 px-3 py-2 rounded-xl text-xs text-[#174D3A] flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#174D3A]" />
                      <div className="space-y-0.5">
                        <span className="font-bold">Gentle Practice Suggestion:</span>
                        <p className="text-[11px] text-neutral-700">{msg.exercise}</p>
                      </div>
                    </div>
                  )}

                  {/* Crisis Resources Alert inside bubble */}
                  {msg.isCrisis && (
                    <div className="mt-2.5 pt-2 border-t border-rose-100 bg-rose-50 -mx-1 px-3 py-2 rounded-xl text-xs text-rose-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Immediate Crisis Support Available</span>
                      </div>
                      <p className="text-[11px]">
                        Tele-MANAS: <strong>14416</strong> | KIRAN: <strong>1800-599-0019</strong> | US/Canada: <strong>988</strong> | Emergency: <strong>112 / 911</strong>
                      </p>
                    </div>
                  )}

                  {/* Source Metadata Pill */}
                  {!isStudent && (
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-100">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#174D3A]" />
                        {msg.mode === 'ai' ? 'Dynamic Gemini AI' : 'Demo Result'}
                      </span>
                      <span>Non-diagnostic</span>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isStudent && (
                  <div className="w-8 h-8 rounded-full bg-[#174D3A] text-white flex items-center justify-center text-xs font-bold shrink-0 mb-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator while waiting for Gemini */}
          {isLoading && (
            <div className="flex gap-3 items-end justify-start animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-full bg-white border border-[#A8C5A0] overflow-hidden p-0.5 shrink-0 shadow-2xs mb-1">
                <img
                  src={LOGO_PATH}
                  alt="Sahayak Companion"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="bg-white border border-neutral-200/90 rounded-2xl rounded-bl-xs px-4 py-3 shadow-2xs flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium">Sahayak is reasoning</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#174D3A] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#174D3A] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#174D3A] rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Informative Error Banner with Retry Button */}
        {errorMessage && (
          <div className="px-4 py-3 bg-rose-50 border-t border-rose-200 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-rose-950">AI Generation Notice: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
            {lastFailedMessage && (
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Retry Message</span>
              </button>
            )}
          </div>
        )}

        {/* Multi-Domain Conversation Starters */}
        <div className="p-3 border-t border-neutral-200/70 bg-white/95">
          <div className="flex items-center justify-between gap-1.5 text-[11px] text-neutral-500 mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-neutral-700">
              <Sparkles className="w-3 h-3 text-[#174D3A]" />
              <span>Explore Topics (Study, Coding, Life, Wellness):</span>
            </span>
            <span className="text-[10px] text-neutral-400 hidden sm:inline">Click any prompt to ask Gemini</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STARTER_PROMPTS.map((starter) => (
              <button
                key={starter.label}
                onClick={() => {
                  setInputMessage(starter.prompt);
                  textareaRef.current?.focus();
                }}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-[#E3F2E8] hover:text-[#174D3A] text-[11px] font-medium text-neutral-700 transition-colors whitespace-nowrap shrink-0 border border-neutral-200/70 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="text-[9px] uppercase font-bold text-neutral-400 bg-neutral-200/80 px-1 py-0.2 rounded">
                  {starter.category}
                </span>
                <span>{starter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box Area */}
        <div className="p-4 bg-white border-t border-neutral-200/80">
          <div className="relative flex items-end gap-2 bg-[#F7F8F4] border border-neutral-300 rounded-2xl p-2 focus-within:border-[#174D3A] focus-within:ring-2 focus-within:ring-[#174D3A]/20 transition-all">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasConsented
                  ? 'Ask anything (study methods, coding, time management, stress, college life)...'
                  : 'Please accept the AI consent above to enable chat...'
              }
              disabled={!hasConsented || isLoading}
              rows={2}
              maxLength={1000}
              className="w-full bg-transparent text-sm text-[#202B26] placeholder:text-neutral-400 resize-none focus:outline-none p-1.5 disabled:opacity-50"
            />

            <div className="flex flex-col items-end gap-1 shrink-0 pb-1">
              <span className="text-[10px] text-neutral-400 font-mono pr-1">
                {inputMessage.length}/1000
              </span>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading || !hasConsented}
                className="p-2 rounded-xl bg-[#174D3A] text-white hover:bg-[#123E2F] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95 cursor-pointer"
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 px-1">
            <span>Dynamic responses generated by Google Gemini · Non-clinical</span>
            <span>Enter to send · Shift+Enter for new line</span>
          </div>
        </div>
      </div>

      {/* Clear Conversation Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Clear Conversation?</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  This will reset your messages in this session. Messages are not shared with mentors.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearConversation}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-xs cursor-pointer"
              >
                Yes, Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Resources Modal */}
      {showCrisisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#202B26]">
                    Immediate Crisis &amp; Support Resources
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Free, confidential 24/7 human support services
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCrisisModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 leading-relaxed">
              If you or someone you know is in immediate danger, please reach out to emergency
              services or a trusted individual right away. <strong>Sahayak is an AI companion, not an emergency response system.</strong>
            </div>

            <div className="space-y-2.5">
              {CRISIS_RESOURCES.map((res) => (
                <div
                  key={res.name}
                  className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      {res.region}
                    </span>
                    <h5 className="text-xs font-bold text-neutral-900">{res.name}</h5>
                    <p className="text-[11px] text-neutral-500">{res.hours}</p>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#174D3A] bg-white px-2.5 py-1 rounded-lg border border-neutral-200 self-start sm:self-auto">
                    {res.phone}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCrisisModal(false)}
                className="px-5 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#123E2F] cursor-pointer"
              >
                Close Resources
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
