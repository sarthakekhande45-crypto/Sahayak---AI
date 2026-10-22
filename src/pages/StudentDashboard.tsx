import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MoodLevel, MoodCheckIn } from '../types';
import { GrowthTree } from '../components/GrowthTree';
import { BreathingPause } from '../components/BreathingPause';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Smile,
  Meh,
  Frown,
  Heart,
  TrendingDown,
  TrendingUp,
  Calendar,
  BookOpen,
  Sparkles,
  Send,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  HelpCircle,
  Trash2,
} from 'lucide-react';

const MOOD_OPTIONS: { label: MoodLevel; score: number; emoji: string; desc: string }[] = [
  { label: 'Very low', score: 1, emoji: '😞', desc: 'Heavy / draining' },
  { label: 'Low', score: 2, emoji: '🙁', desc: 'Down / tired' },
  { label: 'Okay', score: 3, emoji: '😐', desc: 'Steady / neutral' },
  { label: 'Good', score: 4, emoji: '🙂', desc: 'Content / well' },
  { label: 'Great', score: 5, emoji: '😄', desc: 'Energized / joyful' },
];

const EMOTION_TAGS = [
  'Stressed',
  'Calm',
  'Anxious',
  'Motivated',
  'Tired',
  'Hopeful',
  'Overwhelmed',
  'Happy',
];

export const StudentDashboard: React.FC = () => {
  const {
    moodHistory,
    addMoodCheckIn,
    journalEntries,
    deleteJournalEntry,
    mentorMessages,
    replyToMentorMessage,
    markMessageAsRead,
    setCurrentPage,
    activeStudent,
    toggleIdentitySharing,
    aiStatus,
  } = useApp();

  // Mood check-in form state
  const [selectedMood, setSelectedMood] = useState<MoodLevel>('Okay');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['Tired']);
  const [checkInNote, setCheckInNote] = useState('');
  const [chartRange, setChartRange] = useState<7 | 14>(14);

  // Pattern Insights state
  const [patternInsight, setPatternInsight] = useState<{
    observation: string;
    supportingDates: string[];
    reflectionQuestion: string;
    suggestedAction: string;
    uncertaintyNote: string;
    source: string;
    mode: string;
  } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const fetchMoodInsight = async () => {
    setLoadingInsight(true);
    setInsightError(null);
    try {
      const res = await fetch('/api/mood-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: moodHistory }),
      });
      if (!res.ok) throw new Error('Failed to analyze mood patterns');
      const data = await res.json();
      setPatternInsight(data);
    } catch {
      setInsightError('Could not generate reflection at this moment.');
    } finally {
      setLoadingInsight(false);
    }
  };

  // Mentor message reply state
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Toggle emotion pill
  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodCheckIn(selectedMood, selectedEmotions, checkInNote.trim() || undefined);
    setCheckInNote('');
  };

  // Filter chart data for 7d vs 14d
  const chartData = useMemo(() => {
    const sorted = [...moodHistory].sort(
      (a, b) => new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime()
    );
    const slice = sorted.slice(-chartRange);
    return slice.map((item, index) => {
      const dateLabel =
        item.displayDate === 'Today' && index < slice.length - 1
          ? new Date(item.createdAt || item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : item.displayDate;
      return {
        date: dateLabel,
        score: item.moodScore,
        label: item.moodLabel,
        emotions: item.emotions.join(', ') || 'None recorded',
        note: item.note || '',
      };
    });
  }, [moodHistory, chartRange]);

  // 7-day average vs previous 7-day average for Drift Detection
  const { driftDetected, recentAvg, earlierAvg } = useMemo(() => {
    const sorted = [...moodHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (sorted.length < 8) {
      return { driftDetected: false, recentAvg: 3, earlierAvg: 3 };
    }
    const recent = sorted.slice(-4);
    const earlier = sorted.slice(-10, -4);
    const recentSum = recent.reduce((acc, curr) => acc + curr.moodScore, 0);
    const earlierSum = earlier.reduce((acc, curr) => acc + curr.moodScore, 0);
    const rAvg = Number((recentSum / recent.length).toFixed(1));
    const eAvg = Number((earlierSum / earlier.length).toFixed(1));

    // Noticeable downward drop >= 0.8 difference
    const isDrifting = eAvg - rAvg >= 0.8;
    return { driftDetected: isDrifting, recentAvg: rAvg, earlierAvg: eAvg };
  }, [moodHistory]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#202B26] tracking-tight">
              Hello, Alex 👋
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0]/60">
              Sample Student (Demo)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Take a moment for yourself. How are you feeling today?
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage('ai-companion')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#174D3A] text-white rounded-xl text-xs font-semibold hover:bg-[#123E2F] transition-all shadow-xs cursor-pointer min-h-[40px]"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>AI Companion</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-600">
            <Lock className="w-3.5 h-3.5 text-[#174D3A] shrink-0" />
            <span className="truncate">Private Mode active · Never shared</span>
          </div>
        </div>
      </div>

      {/* Gentle Drift / Pattern Change Indicator if detected */}
      {driftDetected && (
        <div className="bg-[#FFFBEB] border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
              <TrendingDown className="w-5 h-5 text-[#D97706]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-amber-900">Pattern change noticed</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-200/70 text-amber-900 rounded">
                  Self-Reported Trend
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed max-w-2xl">
                Your recent check-in average (<strong>{recentAvg}/5.0</strong>) differs from your earlier
                entries (<strong>{earlierAvg}/5.0</strong>). Would you like to reflect on what has changed or unpack this with the AI Companion?
              </p>
              <div className="text-[11px] text-amber-700/80 pt-1">
                Note: This observation is based solely on your own voluntary check-in scale. It is not a clinical assessment or disorder classification.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage('ai-companion')}
              className="px-4 py-2.5 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#123E2F] transition-colors whitespace-nowrap shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Talk with Companion</span>
            </button>
            <button
              onClick={() => setCurrentPage('journalling')}
              className="px-4 py-2.5 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-100/70 transition-colors whitespace-nowrap shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#174D3A]" />
              <span>Reflect in Journal</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid: Mood Check-In & Growth Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Section A: Today's Mood Check-in Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-6 shadow-xs space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#174D3A] uppercase">
                Daily Check-In
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#202B26] mt-0.5">
                How is your energy right now?
              </h2>
            </div>
            <span className="text-xs text-neutral-400">Voluntary &amp; Private</span>
          </div>

          <form onSubmit={handleSaveMood} className="space-y-5 sm:space-y-6">
            {/* 5 Mood Buttons - Responsive Grid */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                1. Select baseline mood:
              </label>
              <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
                {MOOD_OPTIONS.map((opt) => {
                  const isSelected = selectedMood === opt.label;
                  return (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() => setSelectedMood(opt.label)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[70px] ${
                        isSelected
                          ? 'border-[#174D3A] bg-[#E3F2E8] shadow-xs ring-2 ring-[#174D3A]/20'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="text-2xl" role="img" aria-label={opt.label}>
                        {opt.emoji}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-[#174D3A]' : 'text-[#202B26]'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-neutral-500 leading-tight">
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emotion Multi-Select Tags */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                2. What emotions are present? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {EMOTION_TAGS.map((emotion) => {
                  const isSelected = selectedEmotions.includes(emotion);
                  return (
                    <button
                      type="button"
                      key={emotion}
                      onClick={() => toggleEmotion(emotion)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer min-h-[36px] flex items-center ${
                        isSelected
                          ? 'bg-[#174D3A] text-white shadow-2xs'
                          : 'bg-[#F7F8F4] text-[#202B26] border border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {emotion}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Short Note */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                3. Add a short note for your own reference (Optional)
              </label>
              <input
                type="text"
                value={checkInNote}
                onChange={(e) => setCheckInNote(e.target.value)}
                placeholder="e.g., Finished morning lab, feeling a bit stretched for time..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A] transition-colors"
                maxLength={140}
              />
              <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-1">
                <span>Self-reported reflection · Not a clinical score</span>
                <span>{checkInNote.length}/140</span>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-neutral-500">
                Updates your 14-day graph and growth tree
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-97 cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A8C5A0]" />
                <span>Save Mood Check-In</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section D: Growth Tree Component & Mindful Breathing */}
        <div className="lg:col-span-5 space-y-6">
          <GrowthTree checkInCount={moodHistory.length} />
          <BreathingPause />
        </div>
      </div>


      {/* Section C: Emotional Wellness Graph (14-day interactive LineChart with Recharts) */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold tracking-wider text-[#174D3A] uppercase">
                Wellness Trajectory
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F8F4] text-neutral-500 border border-neutral-200">
                Self-Reported Records
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#202B26] mt-0.5">
              14-Day Emotional Rhythm
            </h2>
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#F7F8F4] rounded-lg border border-neutral-200 self-start sm:self-auto">
            <button
              onClick={() => setChartRange(7)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[36px] flex items-center ${
                chartRange === 7
                  ? 'bg-white text-[#174D3A] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setChartRange(14)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[36px] flex items-center ${
                chartRange === 14
                  ? 'bg-white text-[#174D3A] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Past 14 Days
            </button>
          </div>
        </div>

        {/* Recharts Chart Container - Scaled for Viewport */}
        <div className="h-60 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                width={42}
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => {
                  const map: Record<number, string> = {
                    1: '1-Low',
                    2: '2',
                    3: '3-Mid',
                    4: '4',
                    5: '5-High',
                  };
                  return map[value] || `${value}`;
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-lg text-xs space-y-1 max-w-[240px] sm:max-w-xs break-words">
                        <div className="font-bold text-[#174D3A]">{data.date}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-neutral-800">Mood:</span>
                          <span className="font-bold text-[#174D3A]">
                            {data.label} ({data.score}/5)
                          </span>
                        </div>
                        {data.emotions && (
                          <div className="text-neutral-600">
                            <span className="font-semibold">Emotions: </span>
                            {data.emotions}
                          </div>
                        )}
                        {data.note && (
                          <div className="text-neutral-500 italic mt-1 border-t pt-1">
                            &ldquo;{data.note}&rdquo;
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Neutral baseline reference line */}
              <ReferenceLine y={3} stroke="#A8C5A0" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#174D3A"
                strokeWidth={3}
                dot={{ fill: '#174D3A', r: 4 }}
                activeDot={{ r: 6, fill: '#D97706', stroke: '#174D3A', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Transparent Explanation */}
        <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 gap-2">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#174D3A] inline-block" /> Self-Reported Mood Line
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-[#A8C5A0] inline-block" /> Baseline Neutral (Okay - 3)
            </span>
          </div>
          <span className="italic">
            Note: Records show personal self-reports, not a clinical prediction or medical conclusion.
          </span>
        </div>

        {/* Optional Pattern Insights Section */}
        <div className="pt-4 border-t border-neutral-200/80">
          {!patternInsight ? (
            <div className="p-4 rounded-xl bg-[#F7F8F4] border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#174D3A]" />
                  <span className="text-xs font-bold text-[#174D3A]">
                    Optional Mood Pattern Reflection
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600">
                    {aiStatus.mode === 'ai' ? 'Gemini AI Mode' : 'Local Demo Mode'}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Generate an understandable reflection about changes across your self-reported check-ins. Cites specific dates without diagnosing or predicting crises.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchMoodInsight}
                disabled={loadingInsight}
                className="shrink-0 px-4 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A8C5A0]" />
                <span>{loadingInsight ? 'Analyzing Records...' : 'Reflect on Pattern'}</span>
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[#F7F8F4] border border-[#174D3A]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#174D3A]" />
                  <span className="text-xs font-bold text-[#174D3A]">
                    Pattern Observation & Gentle Reflection
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      patternInsight.mode === 'ai'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {patternInsight.mode === 'ai' ? 'Gemini 3.8 Flash' : 'Deterministic Pattern Analyzer'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchMoodInsight}
                    disabled={loadingInsight}
                    className="text-xs text-[#174D3A] hover:underline font-semibold cursor-pointer"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setPatternInsight(null)}
                    className="text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer ml-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                  {patternInsight.observation}
                </p>

                {patternInsight.supportingDates.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-neutral-500 font-semibold">Supporting check-ins:</span>
                    {patternInsight.supportingDates.map((date, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <blockquote className="p-3 bg-white rounded-xl border border-neutral-200 text-xs text-[#174D3A] font-semibold italic">
                &ldquo;{patternInsight.reflectionQuestion}&rdquo;
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200/60 gap-2">
                <span className="text-[11px]">
                  <strong>Gentle suggestion:</strong> {patternInsight.suggestedAction}
                </span>
                <span className="text-[10px] italic text-neutral-400 sm:text-right">
                  {patternInsight.uncertaintyNote}
                </span>
              </div>
            </div>
          )}
          {insightError && (
            <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{insightError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Grid: Recent Private Reflections & Mentor Support */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Section E: Recent Private Reflections */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#174D3A]" />
              <h3 className="text-base font-bold text-[#202B26]">
                Recent Private Reflections
              </h3>
            </div>
            <button
              onClick={() => setCurrentPage('journalling')}
              className="text-xs font-semibold text-[#174D3A] hover:underline flex items-center gap-1"
            >
              <span>Write Entry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-neutral-500">
            These entries reside only on your device. Mentors can never view raw reflection prose.
          </p>

          <div className="space-y-3">
            {journalEntries.length === 0 ? (
              <div className="text-center py-8 text-neutral-400 text-xs">
                No reflections saved yet. Start with a short sentence today!
              </div>
            ) : (
              journalEntries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-[#F7F8F4] border border-neutral-200/80 space-y-2 hover:border-[#174D3A]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage('journalling')}
                      className="text-sm font-bold text-[#202B26] hover:text-[#174D3A] text-left hover:underline cursor-pointer"
                    >
                      {entry.title}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-neutral-400">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        title="Delete this reflection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#202B26]/80 line-clamp-2 leading-relaxed">
                    {entry.content}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500">
                    <span className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700">
                      Mood Tag: {entry.moodLabel}
                    </span>
                    <span className="text-[#174D3A] font-medium">Private to you</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section F: Mentor Support Notes */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#174D3A]" />
              <h3 className="text-base font-bold text-[#202B26]">
                Mentor Support Notes
              </h3>
            </div>
            <span className="text-xs text-neutral-400">
              {mentorMessages.filter((m) => m.studentId === 'student-03' || m.studentId === activeStudent.id).length} message(s)
            </span>
          </div>

          <p className="text-xs text-neutral-500">
            Compassionate messages sent by campus wellness mentors.
          </p>

          <div className="space-y-4">
            {mentorMessages.filter((m) => m.studentId === 'student-03' || m.studentId === activeStudent.id).length === 0 ? (
              <div className="text-center py-8 text-neutral-400 text-xs space-y-2 bg-[#F7F8F4] rounded-xl border border-neutral-200">
                <Heart className="w-6 h-6 text-[#A8C5A0] mx-auto opacity-70" />
                <p className="font-semibold text-neutral-700">No mentor messages yet.</p>
                <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                  When your mentor observes cohort patterns and sends a supportive note, it will appear here.
                </p>
              </div>
            ) : (
              mentorMessages
                .filter((m) => m.studentId === 'student-03' || m.studentId === activeStudent.id)
                .map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-[#E3F2E8]/40 border border-[#A8C5A0]/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#174D3A]">{msg.mentorName}</div>
                    <div className="text-[11px] text-neutral-500">{msg.mentorRole}</div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-xs text-[#202B26] leading-relaxed italic bg-white/80 p-3 rounded-lg border border-[#A8C5A0]/40">
                  &ldquo;{msg.message}&rdquo;
                </p>

                {msg.studentReply ? (
                  <div className="bg-[#F7F8F4] p-2.5 rounded-lg border border-neutral-200 text-xs">
                    <span className="font-semibold text-[#174D3A]">Your reply: </span>
                    <span className="text-neutral-700">{msg.studentReply}</span>
                  </div>
                ) : (
                  <div>
                    {activeReplyId === msg.id ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a brief reply back to Dr. Rao..."
                          className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#174D3A]"
                          rows={2}
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyText('');
                            }}
                            className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (replyText.trim()) {
                                replyToMentorMessage(msg.id, replyText.trim());
                                setReplyText('');
                                setActiveReplyId(null);
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C]"
                          >
                            Send Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => markMessageAsRead(msg.id)}
                          className="text-[11px] text-neutral-500 hover:text-neutral-800"
                        >
                          {msg.readAt ? 'Marked as read' : 'Mark as read'}
                        </button>
                        <button
                          onClick={() => setActiveReplyId(msg.id)}
                          className="px-3 py-1 rounded-lg bg-white border border-[#A8C5A0] text-xs font-semibold text-[#174D3A] hover:bg-[#E3F2E8] transition-colors"
                        >
                          Respond (Demo)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

          {/* Identity Sharing Toggle for Demo */}
          <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2.5">
            <div>
              <div className="font-semibold text-[#202B26]">Identity Sharing Consent</div>
              <div className="text-[11px] text-neutral-500">
                Current status: {activeStudent.identitySharingConsent ? 'Revealed as Alex' : 'Anonymous Token (Student #03)'}
              </div>
            </div>
            <button
              onClick={() =>
                toggleIdentitySharing('student-03', !activeStudent.identitySharingConsent)
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto min-h-[36px] ${
                activeStudent.identitySharingConsent
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#F7F8F4] text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              {activeStudent.identitySharingConsent ? 'Revoke Consent' : 'Simulate Grant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
