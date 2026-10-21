import React, { useState, useRef, useEffect, useId } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Sparkles,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  User,
  RefreshCw,
  PhoneCall,
  Wind,
  CheckCircle,
  ChevronRight,
  Lock,
  Copy,
  Check,
  Square,
  Plus,
  BookOpen,
  Code2,
  GraduationCap,
  BookmarkCheck,
  BookmarkPlus,
  HelpCircle,
  Terminal,
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
  isError?: boolean;
}

const STARTER_PROMPTS = [
  {
    label: 'Photosynthesis',
    category: 'Science',
    prompt: 'What is photosynthesis and how does it work?',
  },
  {
    label: 'Exam Stress',
    category: 'Wellness',
    prompt: 'How can I manage exam stress when I feel completely overwhelmed?',
  },
  {
    label: 'Reverse String JS',
    category: 'Code',
    prompt: 'Write a JavaScript function that reverses a string and explain how it works.',
  },
  {
    label: '7-Day Study Plan',
    category: 'Study',
    prompt: 'Give me a detailed 7-day study plan to prepare for finals.',
  },
  {
    label: 'Feynman Technique',
    category: 'Productivity',
    prompt: 'Can you explain the Feynman Technique and how I can apply it to difficult college topics?',
  },
  {
    label: 'Tell Me a Joke',
    category: 'Fun',
    prompt: 'Tell me a clever, light-hearted joke to take a study break.',
  },
];

const CRISIS_RESOURCES = [
  {
    region: 'India (National)',
    name: 'Tele-MANAS Mental Health Helpline',
    phone: '14416 / 1800-891-4416',
    hours: '24/7 · Toll-Free · Multi-lingual Support',
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
    hours: '24/7 · Free & Confidential Support',
  },
  {
    region: 'Immediate Danger',
    name: 'Emergency Dispatch & Campus Security',
    phone: 'Dial 112 (India) or 911 (US)',
    hours: 'Immediate Local Emergency Dispatch',
  },
];

// Helper to render inline markdown: bold, italic, inline code, and links
const InlineMarkdown: React.FC<{ text: string }> = ({ text }) => {
  // Regex tokenizes `code`, **bold**, *italic*, [text](url)
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 font-mono text-[12px] border border-neutral-200/80 mx-0.5"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return (
            <strong key={i} className="font-bold text-neutral-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
          return (
            <em key={i} className="italic text-neutral-800">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
          const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (match) {
            return (
              <a
                key={i}
                href={match[2]}
                target="_blank"
                rel="noreferrer"
                className="text-[#174D3A] underline underline-offset-2 hover:text-[#113A2C]"
              >
                {match[1]}
              </a>
            );
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

// Component to render code blocks with language badge and copy-to-clipboard functionality
const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl bg-[#1E2320] text-neutral-100 overflow-hidden text-xs font-mono shadow-sm border border-neutral-800">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#151916] text-[11px] text-neutral-400 border-b border-neutral-800 select-none">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#A8C5A0]" />
          <span className="uppercase tracking-wider font-semibold text-neutral-300">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#A8C5A0]" />
              <span className="text-[#A8C5A0]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto whitespace-pre leading-relaxed text-[12.5px]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Component to render markdown tables properly
const TableBlock: React.FC<{ lines: string[] }> = ({ lines }) => {
  if (lines.length < 2) return null;

  const headerCells = lines[0]
    .split('|')
    .map((c) => c.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

  const dataRows = lines.slice(2).map((row) =>
    row
      .split('|')
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
  );

  return (
    <div className="my-3 overflow-x-auto rounded-xl border border-neutral-200/90 shadow-2xs">
      <table className="min-w-full text-xs text-left">
        <thead className="bg-[#F0F7F2] text-[#174D3A] font-bold border-b border-neutral-200/90">
          <tr>
            {headerCells.map((header, idx) => (
              <th key={idx} className="px-3.5 py-2 font-semibold">
                <InlineMarkdown text={header} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white">
          {dataRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-neutral-50/70 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3.5 py-2 text-neutral-700">
                  <InlineMarkdown text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Rich Markdown Parser & Renderer for Sahayak AI Responses
const FormattedMarkdownResponse: React.FC<{ content: string }> = ({ content }) => {
  // 1. Separate code fences from text blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-sm leading-relaxed text-[#202B26] break-words">
      {parts.map((part, pIdx) => {
        if (!part) return null;

        // Code block
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstNewline = part.indexOf('\n');
          const language = firstNewline !== -1 ? part.slice(3, firstNewline).trim() : '';
          const code = firstNewline !== -1 ? part.slice(firstNewline + 1, -3) : part.slice(3, -3);
          return <CodeBlock key={pIdx} code={code} language={language} />;
        }

        // Normal text blocks: process tables, headings, lists, blockquotes, paragraphs
        const lines = part.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
          const line = lines[i];
          const trimmed = line.trim();

          // Empty line
          if (!trimmed) {
            i++;
            continue;
          }

          // Markdown Table: starts with `|` and second line contains `|---`
          if (
            trimmed.startsWith('|') &&
            i + 1 < lines.length &&
            lines[i + 1].trim().startsWith('|') &&
            lines[i + 1].includes('---')
          ) {
            const tableLines: string[] = [trimmed, lines[i + 1].trim()];
            i += 2;
            while (i < lines.length && lines[i].trim().startsWith('|')) {
              tableLines.push(lines[i].trim());
              i++;
            }
            elements.push(<TableBlock key={`table-${pIdx}-${i}`} lines={tableLines} />);
            continue;
          }

          // Headings
          if (trimmed.startsWith('#### ')) {
            elements.push(
              <h4 key={`h4-${pIdx}-${i}`} className="text-xs font-bold text-neutral-800 uppercase tracking-wider mt-3 mb-1">
                <InlineMarkdown text={trimmed.slice(5)} />
              </h4>
            );
            i++;
            continue;
          }
          if (trimmed.startsWith('### ')) {
            elements.push(
              <h3 key={`h3-${pIdx}-${i}`} className="text-sm font-bold text-[#174D3A] mt-3.5 mb-1 flex items-center gap-1.5">
                <InlineMarkdown text={trimmed.slice(4)} />
              </h3>
            );
            i++;
            continue;
          }
          if (trimmed.startsWith('## ')) {
            elements.push(
              <h2 key={`h2-${pIdx}-${i}`} className="text-base font-extrabold text-[#202B26] mt-4 mb-1.5 pb-1 border-b border-neutral-100">
                <InlineMarkdown text={trimmed.slice(3)} />
              </h2>
            );
            i++;
            continue;
          }
          if (trimmed.startsWith('# ')) {
            elements.push(
              <h1 key={`h1-${pIdx}-${i}`} className="text-lg font-extrabold text-[#202B26] mt-4 mb-2">
                <InlineMarkdown text={trimmed.slice(2)} />
              </h1>
            );
            i++;
            continue;
          }

          // Horizontal rule
          if (trimmed === '---' || trimmed === '***') {
            elements.push(<hr key={`hr-${pIdx}-${i}`} className="my-3 border-neutral-200" />);
            i++;
            continue;
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            const quoteLines = [trimmed.slice(2)];
            i++;
            while (i < lines.length && lines[i].trim().startsWith('> ')) {
              quoteLines.push(lines[i].trim().slice(2));
              i++;
            }
            elements.push(
              <blockquote
                key={`bq-${pIdx}-${i}`}
                className="my-2 pl-3.5 py-1.5 border-l-3 border-[#174D3A] bg-[#F0F7F2] rounded-r-xl text-xs text-neutral-700 italic"
              >
                {quoteLines.map((ql, qIdx) => (
                  <p key={qIdx}>
                    <InlineMarkdown text={ql} />
                  </p>
                ))}
              </blockquote>
            );
            continue;
          }

          // Unordered list
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const listItems: string[] = [trimmed.slice(2)];
            i++;
            while (
              i < lines.length &&
              (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- '))
            ) {
              listItems.push(lines[i].trim().slice(2));
              i++;
            }
            elements.push(
              <ul key={`ul-${pIdx}-${i}`} className="list-disc list-outside pl-4 space-y-1 my-2">
                {listItems.map((item, idx) => (
                  <li key={idx} className="text-neutral-700">
                    <InlineMarkdown text={item} />
                  </li>
                ))}
              </ul>
            );
            continue;
          }

          // Ordered list
          if (/^\d+\.\s/.test(trimmed)) {
            const listItems: string[] = [trimmed.replace(/^\d+\.\s*/, '')];
            i++;
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
              listItems.push(lines[i].trim().replace(/^\d+\.\s*/, ''));
              i++;
            }
            elements.push(
              <ol key={`ol-${pIdx}-${i}`} className="list-decimal list-outside pl-4 space-y-1 my-2">
                {listItems.map((item, idx) => (
                  <li key={idx} className="text-neutral-700">
                    <InlineMarkdown text={item} />
                  </li>
                ))}
              </ol>
            );
            continue;
          }

          // Regular paragraph
          const paraLines = [line];
          i++;
          while (
            i < lines.length &&
            lines[i].trim() &&
            !lines[i].trim().startsWith('#') &&
            !lines[i].trim().startsWith('|') &&
            !lines[i].trim().startsWith('* ') &&
            !lines[i].trim().startsWith('- ') &&
            !/^\d+\.\s/.test(lines[i].trim()) &&
            !lines[i].trim().startsWith('> ')
          ) {
            paraLines.push(lines[i]);
            i++;
          }

          elements.push(
            <p key={`p-${pIdx}-${i}`} className="text-neutral-700 leading-relaxed my-1.5">
              {paraLines.map((pl, lIdx) => (
                <React.Fragment key={lIdx}>
                  <InlineMarkdown text={pl} />
                  {lIdx < paraLines.length - 1 && ' '}
                </React.Fragment>
              ))}
            </p>
          );
        }

        return <React.Fragment key={pIdx}>{elements}</React.Fragment>;
      })}
    </div>
  );
};

export const AICompanion: React.FC = () => {
  const { aiStatus, showToast, refreshAIStatus, setCurrentPage, saveJournalEntry } = useApp();

  // Consent & Privacy Gate
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('sahayak_companion_consent') === 'true';
  });

  const INITIAL_MESSAGE: ChatMessage = {
    id: 'welcome-init',
    sender: 'companion',
    text: "Namaste! I am Sahayak AI Companion. I am here to help you navigate college life.\n\nYou can ask me about anything:\n* **Academics & Study Strategies:** Explaining complex concepts, Feynman method, memory techniques, study scheduling\n* **Technology & Coding:** Writing code, debugging, architecture, data structures\n* **College Life & Everyday Challenges:** Time management, building confidence, making friends\n* **Mental Wellness & Emotional Balance:** Exam stress, burnout prevention, mindful reflection\n* **General Knowledge & Curiosity:** Science, history, trivia, writing assistance\n\nWhat would you like to explore or discuss right now?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: aiStatus.geminiConfigured ? 'Google Gemini' : 'Sahayak Engine',
    mode: aiStatus.mode,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [savedJournalMessageId, setSavedJournalMessageId] = useState<string | null>(null);

  const activeRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll inside chat viewport on update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
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
    showToast('AI processing disclosure accepted. You can now chat freely with Companion.', 'success');
  };

  // Stop Generation Handler
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    showToast('Generation stopped.', 'info');
  };

  // Start a fresh conversation
  const handleNewChat = () => {
    if (isLoading) {
      handleStopGeneration();
    }
    activeRequestIdRef.current += 1;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'companion',
        text: "New conversation started. I'm ready for your questions—whether you need academic explanations, coding guidance, everyday problem solving, or a supportive pause.\n\nWhat would you like to talk about?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: aiStatus.geminiConfigured ? 'Google Gemini' : 'Sahayak Engine',
        mode: aiStatus.mode,
      },
    ]);
    setInputMessage('');
    setErrorMessage(null);
    setLastFailedMessage(null);
    showToast('Started a fresh conversation session.', 'info');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Send message to Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text || isLoading) return;

    if (!hasConsented) {
      showToast('Please review and accept the AI data disclosure first.', 'warning');
      return;
    }

    activeRequestIdRef.current += 1;
    const currentRequestId = activeRequestIdRef.current;

    // Initialize AbortController for stop-generation control
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setErrorMessage(null);
    setLastFailedMessage(null);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Prepare bounded conversation history (exclude welcome and failed messages)
    const historyPayload = messages
      .filter((m) => !m.id.startsWith('welcome-') && !m.isError)
      .slice(-14)
      .map((m) => ({
        role: m.sender === 'student' ? 'user' : 'model',
        sender: m.sender,
        text: m.text,
      }));

    try {
      const response = await fetch('/api/chat-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      let data: any = {};
      const rawText = await response.text().catch(() => '');
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = { error: rawText };
      }

      // Guard: Check if request has been superseded or cancelled
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }

      if (!response.ok) {
        let errorDesc = data.details || data.error;
        if (!errorDesc || typeof errorDesc !== 'string' || errorDesc.trim().length === 0) {
          if (response.status === 404) {
            errorDesc =
              'Server returned status 404. On Vercel, ensure vercel.json and api/index.ts are deployed and GEMINI_API_KEY is set in your Vercel Project Settings.';
          } else if (response.status === 503) {
            errorDesc =
              'GEMINI_API_KEY is not configured on the server. Please add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.';
          } else if (response.status === 500) {
            errorDesc =
              'Server error (500). If deployed on Vercel, please check your Vercel Function Logs for error details or verify your GEMINI_API_KEY.';
          } else {
            errorDesc = `Server returned status ${response.status}. Please check your connection and retry.`;
          }
        }
        throw new Error(errorDesc);
      }

      let botText = data.reply;
      if (!botText || typeof botText !== 'string' || !botText.trim()) {
        botText = data.error
          ? `I am currently operating in local offline mode. Feel free to ask about study strategies, exam prep, coding, or managing college stress!`
          : `Hello! I am your Sahayak AI Companion. How can I help you today? Feel free to ask any question or share what you're working on.`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: 'companion',
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'Deterministic Local Engine',
        mode: data.mode || 'demo',
        isCrisis: data.isCrisis,
        exercise: data.exerciseSuggestion,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (data.isCrisis) {
        setShowCrisisModal(true);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was deliberately stopped by user
        return;
      }
      if (activeRequestIdRef.current !== currentRequestId) {
        return;
      }
      console.warn('Companion chat request note:', err?.message || err);
      setLastFailedMessage(text);
      setErrorMessage(
        err?.message ||
          'Unable to reach the service. Please check your network and click Retry.'
      );
    } finally {
      if (activeRequestIdRef.current === currentRequestId) {
        setIsLoading(false);
        abortControllerRef.current = null;
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

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Explicit user action: save companion insight to private journal
  const handleSaveToJournal = (msg: ChatMessage) => {
    saveJournalEntry(
      `Insight from AI Companion:\n\n${msg.text}`,
      'AI Companion Reflection Note',
      'Reflective'
    );
    setSavedJournalMessageId(msg.id);
    showToast('Saved to your private wellness journal.', 'success');
    setTimeout(() => setSavedJournalMessageId(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-200/80">
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
                    ? 'Powered by Google Gemini (Server-Side Live AI)'
                    : 'Offline Demo Mode'}
                </span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
              General-purpose assistant for academics, coding, college life, study pacing, and supportive mental wellness.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="px-3.5 py-1.5 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#123E2F] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Start a new conversation session"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>

          {/* Crisis Help */}
          <button
            onClick={() => setShowCrisisModal(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Helplines & Emergency Assistance"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Crisis Help</span>
          </button>

          {/* Clear Current Chat */}
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={messages.length <= 1}
            className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-600 hover:text-rose-700 hover:border-rose-200 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Refresh AI status */}
          <button
            onClick={() => refreshAIStatus()}
            className="p-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-[#174D3A] transition-colors cursor-pointer"
            title="Check AI Connection Status"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safety & General-Purpose Scope Notice */}
      <div className="bg-[#F0F7F2] border border-[#A8C5A0]/60 rounded-2xl p-3.5 text-xs text-[#202B26]/85 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#174D3A] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#174D3A]">Private &amp; Multi-Domain: </span>
            Ask any question in your own words—academics, STEM, code, campus life, or emotional stress. This AI assistant provides supportive conversational guidance but
            <strong className="text-neutral-900"> does not provide medical diagnoses</strong>.
            Chat logs are private and <strong className="text-neutral-900">never shared with mentors</strong>.
          </div>
        </div>
        <button
          onClick={() => setCurrentPage('privacy-safety')}
          className="text-xs font-semibold text-[#174D3A] hover:underline whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <span>Privacy Policy</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Consent Disclosure Banner */}
      {!hasConsented && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Lock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">
                AI Processing Notice &amp; Student Consent
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Messages submitted here are securely transmitted to Google Gemini via a protected server-side proxy to generate live, contextual answers.
                No identifying student records or grades are attached, and chat logs are never automatically shared with mentors or faculty.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
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

      {/* Somatic Pacing Exercise (Box Breathing) */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#202B26]">4-4-4-4 Box Breathing Reset</h4>
              <p className="text-[11px] text-neutral-500">Optional 4-second somatic pacing to steady racing thoughts</p>
            </div>
          </div>
          <button
            onClick={() => setBreathingActive(!breathingActive)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              breathingActive
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-neutral-100 text-[#174D3A] hover:bg-[#E3F2E8] border border-neutral-200'
            }`}
          >
            {breathingActive ? 'Stop Pacing' : 'Start Pacing'}
          </button>
        </div>

        {breathingActive && (
          <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-3 border-[#174D3A] bg-[#E3F2E8] flex flex-col items-center justify-center transition-all animate-pulse">
                <span className="text-lg font-extrabold text-[#174D3A]">{breathCountdown}</span>
                <span className="text-[9px] uppercase font-bold text-[#174D3A]/80 tracking-wider">
                  {breathPhase}
                </span>
              </div>
            </div>
            <div className="text-left text-xs text-neutral-600 max-w-md space-y-0.5">
              <p className="font-semibold text-[#174D3A]">Guided rhythm:</p>
              <p>Inhale (4s) → Hold (4s) → Exhale (4s) → Pause (4s). Release tension in your jaw and shoulders.</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Stream Container */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm flex flex-col overflow-hidden min-h-[550px] max-h-[750px]">
        {/* Messages Scroll Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FBFBFA]/60"
        >
          {messages.map((msg) => {
            const isStudent = msg.sender === 'student';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isStudent ? 'justify-end' : 'justify-start'}`}
              >
                {/* Companion Avatar */}
                {!isStudent && (
                  <div className="w-8 h-8 rounded-full bg-white border border-[#A8C5A0] overflow-hidden p-0.5 shrink-0 shadow-2xs mt-1">
                    <img
                      src={LOGO_PATH}
                      alt="Sahayak Companion"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 shadow-2xs space-y-2 ${
                    isStudent
                      ? 'bg-[#174D3A] text-white rounded-br-xs'
                      : 'bg-white text-[#202B26] border border-neutral-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                    <span className="font-semibold">
                      {isStudent ? 'You (Student)' : 'Sahayak AI Companion'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Content */}
                  {isStudent ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <FormattedMarkdownResponse content={msg.text} />
                  )}

                  {/* Crisis Resource Alert if flagged */}
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

                  {/* Actions & Metadata Bar on Companion Messages */}
                  {!isStudent && (
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#174D3A]" />
                        <span>{msg.mode === 'ai' ? `Google Gemini (${msg.source || '3.8 Flash'})` : 'Demo Engine'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Copy message to clipboard"
                        >
                          {copiedMessageId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#174D3A]" />
                              <span className="text-[#174D3A] font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {/* Explicit Save to Private Journal */}
                        <button
                          onClick={() => handleSaveToJournal(msg)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-[#174D3A] hover:bg-[#E3F2E8] transition-colors cursor-pointer"
                          title="Save this reflection to your private journal"
                        >
                          {savedJournalMessageId === msg.id ? (
                            <>
                              <BookmarkCheck className="w-3 h-3 text-[#174D3A]" />
                              <span className="font-semibold">Saved to Journal</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3 h-3" />
                              <span>Save to Journal</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isStudent && (
                  <div className="w-8 h-8 rounded-full bg-[#174D3A] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing / Reasoning Indicator with Stop Control */}
          {isLoading && (
            <div className="flex gap-3 items-start justify-start animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-full bg-white border border-[#A8C5A0] overflow-hidden p-0.5 shrink-0 shadow-2xs mt-1">
                <img
                  src={LOGO_PATH}
                  alt="Sahayak Companion"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="bg-white border border-neutral-200/90 rounded-2xl rounded-bl-xs px-4 py-3 shadow-2xs flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-600 font-medium">Sahayak is reasoning</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#174D3A] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#174D3A] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#174D3A] rounded-full animate-bounce"></span>
                  </div>
                </div>
                <button
                  onClick={handleStopGeneration}
                  className="px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Stop generating response"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Stop</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Informative Error Banner with Retry */}
        {errorMessage && (
          <div className="px-4 py-3 bg-rose-50 border-t border-rose-200 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-rose-950">Generation Error: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
            {lastFailedMessage && (
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Retry Question</span>
              </button>
            )}
          </div>
        )}

        {/* Topic Starters Carousel */}
        <div className="p-3 border-t border-neutral-200/70 bg-white/95">
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5 px-0.5">
            <span className="flex items-center gap-1 font-semibold text-neutral-700">
              <Sparkles className="w-3 h-3 text-[#174D3A]" />
              <span>Explore Prompts (Academics, Code, Life, Wellness):</span>
            </span>
            <span className="text-[10px] text-neutral-400 hidden sm:inline">
              Ask anything in your own words
            </span>
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
                <span className="text-[9px] uppercase font-bold text-neutral-500 bg-neutral-200/80 px-1 py-0.2 rounded">
                  {starter.category}
                </span>
                <span>{starter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-white border-t border-neutral-200/80">
          <div className="relative flex items-end gap-2 bg-[#F7F8F4] border border-neutral-300 rounded-2xl p-2 focus-within:border-[#174D3A] focus-within:ring-2 focus-within:ring-[#174D3A]/20 transition-all">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasConsented
                  ? 'Ask any question (e.g., science, exam stress, coding, study plan, friendships)...'
                  : 'Please accept the AI disclosure above to start chatting...'
              }
              disabled={!hasConsented || isLoading}
              rows={2}
              maxLength={3000}
              className="w-full bg-transparent text-sm text-[#202B26] placeholder:text-neutral-400 resize-none focus:outline-none p-1.5 disabled:opacity-50"
            />

            <div className="flex flex-col items-end gap-1 shrink-0 pb-1">
              <span className="text-[10px] text-neutral-400 font-mono pr-1">
                {inputMessage.length}/3000
              </span>
              {isLoading ? (
                <button
                  onClick={handleStopGeneration}
                  className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading || !hasConsented}
                  className="p-2 rounded-xl bg-[#174D3A] text-white hover:bg-[#123E2F] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95 cursor-pointer"
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 px-1">
            <span>Dynamic responses by Google Gemini · Non-clinical guidance</span>
            <span>Enter to send · Shift+Enter for new line</span>
          </div>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
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
                  This will reset messages in this session. Messages are private and never shared with mentors.
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
                onClick={() => {
                  handleNewChat();
                  setShowClearConfirm(false);
                }}
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
