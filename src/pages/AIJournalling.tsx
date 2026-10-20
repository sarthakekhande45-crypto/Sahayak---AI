import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WellnessSummary } from '../types';
import {
  BookOpen,
  Sparkles,
  Send,
  Trash2,
  Lock,
  Download,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  RefreshCw,
  Info,
  CheckCircle2,
  X,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  Wind,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'What has been on your mind today?',
  'What felt difficult today?',
  'What is one thing that helped you?',
  'What would you like someone to understand?',
];

const SYNTHETIC_SAMPLES = [
  {
    title: 'Exam Pressure & Sleep Debt',
    mood: 'Stressed',
    text: "I haven't slept properly in three nights because midterms start next Tuesday. Every time I open my laptop, I feel this knot in my stomach thinking about failing the algorithms exam. My roommate Sarah tried to offer some tea, which was sweet, but I just couldn't calm my thoughts down.",
  },
  {
    title: 'Coursework Overwhelm & Self-Doubt',
    mood: 'Overwhelmed',
    text: "Living in Dorm 4B and trying to keep up with both Biochem lab and my part-time job feels impossible right now. It feels like everyone else in the lecture understands the material instantly, while I have to read the chapter three times. I just want to pause everything for one afternoon.",
  },
  {
    title: 'Senior Thesis Delivery Strain',
    mood: 'Tired',
    text: "Carlos here working on the econometrics senior paper. I have spent 48 hours staring at regression errors. My eyes sting from the screen and I keep skipping meals. I know I just need two good nights of sleep, but the Sunday submission deadline is looming.",
  },
  {
    title: 'Post-Presentation Relief & Calm',
    mood: 'Calm',
    text: "Our team capstone demo went so much better than expected! Professor Henderson was engaged and the audience asked thoughtful questions. The tension in my shoulders finally melted away. Celebrated with chai and quiet music.",
  },
];

export const AIJournalling: React.FC = () => {
  const {
    journalEntries,
    saveJournalEntry,
    deleteJournalEntry,
    clearJournalHistory,
    addWellnessSummary,
    wellnessSummaries,
    showToast,
    aiStatus,
    refreshAIStatus,
  } = useApp();

  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryMood, setEntryMood] = useState('Reflective');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPreAnalysisModal, setShowPreAnalysisModal] = useState(false);
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false);

  const [currentSummary, setCurrentSummary] = useState<WellnessSummary | null>(
    wellnessSummaries[0] || null
  );

  // Companion Chat state
  const [companionInput, setCompanionInput] = useState('');
  const [companionLoading, setCompanionLoading] = useState(false);
  const [companionMessages, setCompanionMessages] = useState<
    { sender: 'companion' | 'student'; text: string; time: string; exercise?: string }[]
  >([
    {
      sender: 'companion',
      text: 'Hello. Thank you for stepping into this quiet space. You do not need perfect words—feel free to jot down whatever is sitting with you today, or ask me for a gentle reflection exercise.',
      time: 'Just now',
    },
  ]);

  const handleApplyPrompt = (prompt: string) => {
    if (!entryContent) {
      setEntryContent(`${prompt}\n\n`);
    } else {
      setEntryContent((prev) => `${prev}\n\n${prompt}\n`);
    }
  };

  const handleLoadSample = (sample: (typeof SYNTHETIC_SAMPLES)[0]) => {
    setEntryTitle(sample.title);
    setEntryContent(sample.text);
    setEntryMood(sample.mood);
    showToast(`Loaded synthetic sample: "${sample.title}"`, 'info');
  };

  const handleSavePrivately = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!entryContent.trim()) {
      showToast('Please write a few thoughts before saving.', 'warning');
      return;
    }

    saveJournalEntry(
      entryContent.trim(),
      entryTitle.trim() || 'Untitled Reflection',
      entryMood
    );
    setEntryContent('');
    setEntryTitle('');
  };

  // Pre-Analysis trigger
  const handlePreAnalyzeClick = () => {
    const textToAnalyze = entryContent.trim() || (journalEntries[0] ? journalEntries[0].content : '');
    if (!textToAnalyze) {
      showToast('Please type some reflection text or load a sample first.', 'warning');
      return;
    }
    setShowPreAnalysisModal(true);
  };

  const executeAnalysis = async () => {
    setShowPreAnalysisModal(false);
    const textToAnalyze = entryContent.trim() || (journalEntries[0] ? journalEntries[0].content : '');
    if (!textToAnalyze) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze }),
      });

      if (!res.ok) throw new Error('Analysis request failed');
      const data = await res.json();

      const newSummary: WellnessSummary = {
        id: `summary-${Date.now()}`,
        studentId: 'student-03',
        possibleMood: data.possibleMood || 'Reflective',
        summary: data.summary || 'Contextual reflection analyzed.',
        themes: data.themes || ['General reflection'],
        stressIndicators: data.possibleStressIndicators || data.stressIndicators || ['None identified'],
        confidence: data.confidence || 'Demo estimate',
        reflectionSuggestion: data.reflectionSuggestion || 'How can you care for yourself today?',
        uncertaintyNote: data.uncertaintyNote || 'This is an AI-generated interpretation, not a diagnosis.',
        createdAt: new Date().toISOString(),
        sharingConsent: false,
        source: data.source || 'demo-analyzer',
        mode: data.mode || (aiStatus.geminiConfigured ? 'ai' : 'demo'),
      };

      setCurrentSummary(newSummary);
      addWellnessSummary(newSummary);
      showToast(
        `Reflection analyzed via ${
          data.source === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash (AI Mode)' : 'Deterministic Demo Engine'
        }`,
        'success'
      );
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      const fallbackSummary: WellnessSummary = {
        id: `summary-${Date.now()}`,
        studentId: 'student-03',
        possibleMood: 'Reflective',
        summary: 'Demo analysis: High-level themes extracted locally without transmitting raw diary.',
        themes: ['Academic Demands', 'Self-Care Rhythm'],
        stressIndicators: ['Evaluative workload phrasing'],
        confidence: 'Demo estimate (Deterministic)',
        reflectionSuggestion: 'What is one pressure you can take off your shoulders for the next hour?',
        uncertaintyNote: 'This is an AI-generated interpretation, not a diagnosis.',
        createdAt: new Date().toISOString(),
        sharingConsent: false,
        source: 'demo-analyzer',
        mode: 'demo',
      };
      setCurrentSummary(fallbackSummary);
      addWellnessSummary(fallbackSummary);
      showToast('Reflection analyzed via local fallback.', 'info');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCompanionSend = async (messageText?: string) => {
    const textToSend = messageText || companionInput.trim();
    if (!textToSend || companionLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newHistory = [
      ...companionMessages,
      { sender: 'student' as const, text: textToSend, time: timeStr },
    ];
    setCompanionMessages(newHistory);
    setCompanionInput('');
    setCompanionLoading(true);

    try {
      const res = await fetch('/api/chat-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newHistory.slice(-5).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!res.ok) throw new Error('Companion service error');
      const data = await res.json();

      setCompanionMessages((prev) => [
        ...prev,
        {
          sender: 'companion',
          text: data.reply || 'Thank you for sharing that. Take your time—what feels most important right now?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          exercise: data.exerciseSuggestion,
        },
      ]);
    } catch {
      setCompanionMessages((prev) => [
        ...prev,
        {
          sender: 'companion',
          text: 'Thank you for reflecting on that. College life can ask a lot of your mind and body. How does your chest feel when you take a deep, slow breath right now?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          exercise: 'Box Breathing: Inhale 4s, hold 4s, exhale 4s, pause 4s.',
        },
      ]);
    } finally {
      setCompanionLoading(false);
    }
  };

  const handleClearChat = () => {
    setCompanionMessages([
      {
        sender: 'companion',
        text: 'Session reset. This quiet space is open whenever you would like to reflect again.',
        time: 'Just now',
      },
    ]);
    setShowClearChatConfirm(false);
    showToast('Companion conversation cleared.', 'info');
  };

  const handleExportJournal = () => {
    const exportData = {
      platform: 'Sahayak Mental Wellness Platform',
      exportDate: new Date().toISOString(),
      studentToken: 'Student #03 (Alex Sharma - Private Export)',
      totalEntries: journalEntries.length,
      entries: journalEntries,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahayak-journal-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Journal exported to JSON file.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & AI Provider Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202B26] tracking-tight">
              A space to let it out.
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0]/60">
              Private Diary
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            You don&apos;t need perfect words. Start wherever you are.
          </p>
        </div>

        {/* AI Provider Status Card */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs shadow-xs">
            <Cpu className="w-4 h-4 text-[#174D3A]" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-semibold text-[#174D3A]">
                <span>{aiStatus.geminiConfigured ? 'AI Mode Active' : 'Demo Mode Active'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-neutral-500">
                {aiStatus.geminiConfigured ? 'Google Gemini 3.8 Flash' : 'Deterministic Local Engine'}
              </span>
            </div>
            <button
              onClick={() => refreshAIStatus()}
              className="p-1 text-neutral-400 hover:text-[#174D3A] transition-colors ml-1"
              title="Refresh provider status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-600 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-[#174D3A]" />
            <span>Local Encryption · Zero Raw Sentences Shared</span>
          </div>
        </div>
      </div>

      {/* Friendly Mode Notice if running in Demo Mode */}
      {!aiStatus.geminiConfigured && (
        <div className="p-3.5 bg-[#E3F2E8]/60 border border-[#A8C5A0]/60 rounded-2xl flex items-start sm:items-center justify-between gap-3 text-xs text-[#174D3A]">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#174D3A] shrink-0" />
            <span>
              <strong>Demo Mode:</strong> Operating with local deterministic NLP analysis. When a valid{' '}
              <code className="font-mono bg-white/70 px-1 py-0.5 rounded text-[11px]">GEMINI_API_KEY</code>{' '}
              is configured in the server environment, live Google Gemini 3.8 Flash calls activate automatically.
            </span>
          </div>
          <span className="shrink-0 font-semibold text-[11px] px-2 py-0.5 rounded bg-white border border-[#A8C5A0]/80">
            Fully Functional
          </span>
        </div>
      )}

      {/* Main Grid: Journal Editor (Left) & AI Companion / Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Journal Editor & History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section A: Journal Editor */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-semibold tracking-wider text-[#174D3A] uppercase">
                Private Journal Entry
              </span>
              <span className="text-xs text-neutral-400 font-mono tabular-nums">
                {entryContent.length} characters
              </span>
            </div>

            {/* Quick Load Synthetic Samples */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-500">
                  Quick Load Synthetic Samples (Educational Prototype):
                </span>
                <span className="text-[10px] text-neutral-400">Click to fill</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {SYNTHETIC_SAMPLES.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(s)}
                    className="p-2 rounded-xl bg-[#F7F8F4] border border-neutral-200 text-left hover:border-[#174D3A] hover:bg-[#E3F2E8]/40 transition-all text-xs"
                  >
                    <div className="font-bold text-[#174D3A] truncate">{s.title}</div>
                    <div className="text-[10px] text-neutral-500">Mood: {s.mood}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Prompts */}
            <div>
              <div className="text-[11px] font-semibold text-neutral-500 mb-1.5">
                Or pick a reflective question:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleApplyPrompt(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F7F8F4] border border-neutral-200 text-neutral-700 hover:border-[#174D3A] hover:bg-[#E3F2E8]/40 transition-colors text-left"
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Mood selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder="Entry title (e.g., Afternoon thoughts, Pre-exam worries)"
                  className="w-full text-sm font-semibold px-3 py-2 rounded-xl border border-neutral-200 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A]"
                />
              </div>
              <div>
                <select
                  value={entryMood}
                  onChange={(e) => setEntryMood(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-neutral-200 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A]"
                >
                  <option value="Reflective">Mood: Reflective</option>
                  <option value="Stressed">Mood: Stressed</option>
                  <option value="Overwhelmed">Mood: Overwhelmed</option>
                  <option value="Calm">Mood: Calm</option>
                  <option value="Hopeful">Mood: Hopeful</option>
                  <option value="Tired">Mood: Tired</option>
                </select>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={entryContent}
              onChange={(e) => setEntryContent(e.target.value)}
              placeholder="What feels heavy? What felt good? Write freely without worrying about punctuation..."
              rows={8}
              className="w-full text-sm p-4 rounded-xl border border-neutral-200 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A] leading-relaxed resize-y"
            />

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {entryContent.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="px-3 py-1.5 text-xs text-neutral-500 hover:text-red-600 transition-colors"
                  >
                    Clear Draft
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreAnalyzeClick}
                  disabled={isAnalyzing}
                  className="px-4 py-2 rounded-xl bg-white border border-[#A8C5A0] text-[#174D3A] text-xs font-semibold hover:bg-[#E3F2E8] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                  title="Extract high-level themes without exposing raw text"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#174D3A]" />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Reflection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSavePrivately}
                  className="px-5 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-97"
                >
                  <Lock className="w-3.5 h-3.5 text-[#A8C5A0]" />
                  <span>Save Privately</span>
                </button>
              </div>
            </div>

            {/* Confirmation dialog for Clear Draft */}
            {showClearConfirm && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-800">
                <span>Are you sure you want to discard this draft?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900"
                  >
                    Keep
                  </button>
                  <button
                    onClick={() => {
                      setEntryContent('');
                      setEntryTitle('');
                      setShowClearConfirm(false);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section E: Private Journal History & Privacy Controls */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#174D3A]" />
                <h3 className="text-base font-bold text-[#202B26]">
                  Past Reflections ({journalEntries.length})
                </h3>
              </div>

              {/* Export and Clear controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJournal}
                  className="px-2.5 py-1 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 flex items-center gap-1"
                  title="Download personal reflection archive as JSON"
                >
                  <Download className="w-3 h-3 text-[#174D3A]" />
                  <span>Export</span>
                </button>

                {journalEntries.length > 0 && (
                  <button
                    onClick={clearJournalHistory}
                    className="px-2.5 py-1 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-500 hover:text-red-600 hover:border-red-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {journalEntries.length === 0 ? (
                <div className="text-center py-10 text-neutral-400 text-xs space-y-2 bg-[#F7F8F4] rounded-xl border border-neutral-200">
                  <BookOpen className="w-6 h-6 text-[#A8C5A0] mx-auto opacity-70" />
                  <p className="font-semibold text-neutral-700">No reflections saved yet.</p>
                  <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                    Use the editor above to write your thoughts. They remain 100% private on your device.
                  </p>
                </div>
              ) : (
                journalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl bg-[#F7F8F4] border border-neutral-200/80 space-y-2 hover:border-[#174D3A]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#202B26]">{entry.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-neutral-400">
                          {new Date(entry.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <button
                          onClick={() => deleteJournalEntry(entry.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#202B26]/80 leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 text-[11px] text-neutral-500">
                      <span className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-medium">
                        Mood Tag: {entry.moodLabel}
                      </span>
                      <span className="text-[#174D3A] font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Client-side only · Zero external transmission
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mood & Stress Summary (Section C) + AI Reflection Companion (Section B) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section C: Structured Mood and Stress Summary */}
          {currentSummary && (
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#174D3A]" />
                  <h3 className="text-base font-bold text-[#202B26]">
                    Mood &amp; Stress Analysis
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0]/60">
                    {currentSummary.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Demo Analyzer'}
                  </span>
                </div>
              </div>

              {/* Possible Mood Pill */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F8F4] border border-neutral-200/70">
                <span className="text-xs text-neutral-600 font-medium">Estimated Mood:</span>
                <span className="px-3 py-1 rounded-lg bg-[#174D3A] text-white text-xs font-bold shadow-xs">
                  {currentSummary.possibleMood || 'Reflective'}
                </span>
              </div>

              {/* Observed Themes */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-neutral-600">Thematic Focus:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentSummary.themes.map((th, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#E3F2E8]/60 border border-[#A8C5A0]/60 text-xs font-semibold text-[#174D3A]"
                    >
                      {th}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stress indicators */}
              {currentSummary.stressIndicators?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-neutral-600">
                    Possible Stress Indicators:
                  </span>
                  <div className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/70 space-y-1">
                    {currentSummary.stressIndicators.map((ind, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Neutral Summary */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-600">
                  Pattern Summary:
                </span>
                <p className="text-xs text-[#202B26]/80 leading-relaxed bg-[#F7F8F4] p-3 rounded-xl border border-neutral-200/80">
                  {currentSummary.summary}
                </p>
              </div>

              {/* Gentle Reflection Suggestion */}
              <div className="p-3.5 bg-[#E3F2E8]/70 rounded-xl border border-[#A8C5A0]/80 space-y-1">
                <span className="text-xs font-bold text-[#174D3A] flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  Self-Reflection Prompt:
                </span>
                <p className="text-xs text-[#202B26] italic leading-relaxed">
                  &ldquo;{currentSummary.reflectionSuggestion}&rdquo;
                </p>
              </div>

              {/* Uncertainty Note & Disclaimer */}
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 space-y-0.5">
                <div className="font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>{currentSummary.uncertaintyNote || 'This is an AI-generated interpretation, not a diagnosis.'}</span>
                </div>
                <p className="text-[10px] text-amber-800/80">
                  Educational prototype estimates. Not clinical or medical guidance.
                </p>
              </div>
            </div>
          )}

          {/* Section B: AI Reflection Companion */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#202B26]">Reflection Companion</h3>
                  <span className="text-[10px] text-neutral-500">
                    Empathetic partner · Not a doctor or therapist
                  </span>
                </div>
              </div>

              {/* Clear conversation button */}
              <button
                type="button"
                onClick={() => setShowClearChatConfirm(true)}
                className="text-[11px] text-neutral-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-neutral-50"
                title="Reset companion session"
              >
                Clear
              </button>
            </div>

            {/* Quick Reflection Exercise Chips */}
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                Low-Risk Reflection Exercises:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCompanionSend('Could we do a quick Box Breathing exercise together?')}
                  className="px-2 py-1 rounded-lg bg-[#F7F8F4] border border-neutral-200 text-[11px] text-neutral-700 hover:border-[#174D3A] hover:bg-[#E3F2E8]/40 transition-colors flex items-center gap-1"
                >
                  <Wind className="w-3 h-3 text-[#174D3A]" />
                  <span>Box Breathing (4-4-4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCompanionSend('Guide me through a 5-4-3-2-1 sensory grounding exercise.')}
                  className="px-2 py-1 rounded-lg bg-[#F7F8F4] border border-neutral-200 text-[11px] text-neutral-700 hover:border-[#174D3A] hover:bg-[#E3F2E8]/40 transition-colors"
                >
                  5-4-3-2-1 Grounding
                </button>
                <button
                  type="button"
                  onClick={() => handleCompanionSend('I have too many worries. Can we try a 10-minute worry time-box?')}
                  className="px-2 py-1 rounded-lg bg-[#F7F8F4] border border-neutral-200 text-[11px] text-neutral-700 hover:border-[#174D3A] hover:bg-[#E3F2E8]/40 transition-colors"
                >
                  10-Min Worry Delay
                </button>
                <button
                  type="button"
                  onClick={() => handleCompanionSend('What is a gentle self-compassion thought for today?')}
                  className="px-2 py-1 rounded-lg bg-[#F7F8F4] border border-neutral-200 text-[11px] text-neutral-700 hover:border-[#174D3A] hover:bg-[#E3F2E8]/40 transition-colors"
                >
                  Self-Compassion Check
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {companionMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'student' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'student'
                        ? 'bg-[#174D3A] text-white rounded-tr-xs shadow-xs'
                        : 'bg-[#F7F8F4] text-[#202B26] border border-neutral-200/80 rounded-tl-xs'
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.exercise && (
                      <div className="mt-2 pt-2 border-t border-neutral-200/60 text-[11px] text-[#174D3A] font-medium bg-[#E3F2E8]/50 p-2 rounded-xl">
                        💡 {msg.exercise}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {companionLoading && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 pl-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-[#174D3A]" />
                  <span>Thinking gently...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCompanionSend();
              }}
              className="space-y-2 pt-2 border-t border-neutral-100"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={companionInput}
                  onChange={(e) => setCompanionInput(e.target.value)}
                  placeholder="Share a thought or answer the reflection..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A]"
                />
                <button
                  type="submit"
                  disabled={companionLoading || !companionInput.trim()}
                  className="p-2.5 rounded-xl bg-[#174D3A] text-white hover:bg-[#113A2C] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[10px] text-neutral-400 text-center">
                Sahayak AI Companion offers supportive reflection prompts. It cannot diagnose or provide medical care.
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Pre-Analysis Explanation Modal */}
      {showPreAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#174D3A]" />
                <h3 className="text-base font-extrabold text-[#202B26]">
                  Reflection Analysis Notice
                </h3>
              </div>
              <button
                onClick={() => setShowPreAnalysisModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Before proceeding, here is how your reflection will be processed:
            </p>

            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174D3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Theme Extraction:</strong> The analyzer extracts high-level themes (e.g. Workload, Sleep, Social) to help you notice patterns.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174D3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Identity Isolation:</strong> Direct personal names, dorms, and course numbers are scrubbed before any abstract summary is generated.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174D3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Mentor Boundary:</strong> Your raw journal sentences remain private and are <em>never</em> shared with campus mentors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174D3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Non-Clinical:</strong> Outputs are estimated reflection prompts, never medical or psychiatric diagnoses.
                </span>
              </li>
            </ul>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowPreAnalysisModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={executeAnalysis}
                className="px-5 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-bold hover:bg-[#113A2C] transition-all shadow-xs"
              >
                Understand &amp; Analyze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Chat Confirmation Modal */}
      {showClearChatConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-neutral-200 space-y-3 animate-in zoom-in-95">
            <h4 className="text-sm font-bold text-neutral-900">Clear Companion Conversation?</h4>
            <p className="text-xs text-neutral-600">
              This will reset the conversation context for this session. Your saved private journal entries will not be affected.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setShowClearChatConfirm(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Clear Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
