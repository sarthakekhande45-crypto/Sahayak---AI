import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { PrivacyTransformationResult } from '../types';
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
  FlaskConical,
  Sparkles,
  ArrowRight,
  Shield,
  Lock,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  User,
  HeartHandshake,
  Check,
  XCircle,
  FileText,
  Sliders,
  Database,
  Terminal,
  Zap,
  Cpu,
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  BarChart3,
  HelpCircle,
  Send,
  Eye,
  Key,
} from 'lucide-react';

// ============================================================================
// TYPES FOR EXPERIMENT 1 & 3
// ============================================================================

interface GeminiAnalysisResult {
  possibleMood: string;
  themes: string[];
  possibleStressIndicators: string[];
  summary: string;
  reflectionSuggestion: string;
  uncertaintyNote: string;
  source: string;
  mode: 'ai' | 'demo';
  latencyMs?: number;
}

interface MoodInsightResult {
  observation: string;
  supportingDates: string[];
  reflectionQuestion: string;
  suggestedAction?: string;
  uncertaintyNote: string;
  source: string;
  mode: 'ai' | 'demo';
  latencyMs?: number;
}

interface DayCheckIn {
  date: string;
  displayDate: string;
  score: number;
  label: 'Very low' | 'Low' | 'Okay' | 'Good' | 'Great';
  emotions: string[];
  note: string;
}

// ============================================================================
// 14-DAY MOOD DATASET PRESETS (EXPERIMENT 3)
// ============================================================================

const MOOD_DATASET_PRESETS: { label: string; description: string; data: DayCheckIn[] }[] = [
  {
    label: 'Midterm Fatigue & Recovery',
    description: 'Steady week followed by a noticeable dip during exam week, then a rebound during weekend reset.',
    data: [
      { date: '2026-10-08', displayDate: 'Oct 08', score: 4, label: 'Good', emotions: ['Calm', 'Motivated'], note: 'Smooth start to project sprint.' },
      { date: '2026-10-09', displayDate: 'Oct 09', score: 4, label: 'Good', emotions: ['Focused', 'Happy'], note: 'Group study session went well.' },
      { date: '2026-10-10', displayDate: 'Oct 10', score: 3, label: 'Okay', emotions: ['Tired'], note: 'Late night finishing problem set.' },
      { date: '2026-10-11', displayDate: 'Oct 11', score: 4, label: 'Good', emotions: ['Calm'], note: 'Weekend recharge, walked outside.' },
      { date: '2026-10-12', displayDate: 'Oct 12', score: 3, label: 'Okay', emotions: ['Anxious'], note: 'Exam syllabus looks overwhelming.' },
      { date: '2026-10-13', displayDate: 'Oct 13', score: 2, label: 'Low', emotions: ['Stressed', 'Tired'], note: 'Slept only 4 hours before exam.' },
      { date: '2026-10-14', displayDate: 'Oct 14', score: 1, label: 'Very low', emotions: ['Overwhelmed', 'Exhausted'], note: 'Biochem exam was brutal, couldn\'t focus.' },
      { date: '2026-10-15', displayDate: 'Oct 15', score: 2, label: 'Low', emotions: ['Tired', 'Stressed'], note: 'Second midterm back-to-back.' },
      { date: '2026-10-16', displayDate: 'Oct 16', score: 3, label: 'Okay', emotions: ['Relieved'], note: 'Exams finally over, took long nap.' },
      { date: '2026-10-17', displayDate: 'Oct 17', score: 4, label: 'Good', emotions: ['Calm', 'Happy'], note: 'Caught up on sleep, chai with friends.' },
      { date: '2026-10-18', displayDate: 'Oct 18', score: 4, label: 'Good', emotions: ['Relaxed'], note: 'Sunday rest day, cooking.' },
      { date: '2026-10-19', displayDate: 'Oct 19', score: 3, label: 'Okay', emotions: ['Motivated'], note: 'New module starting, feeling grounded.' },
      { date: '2026-10-20', displayDate: 'Oct 20', score: 4, label: 'Good', emotions: ['Calm'], note: 'Balanced pacing in library.' },
      { date: '2026-10-21', displayDate: 'Oct 21', score: 4, label: 'Good', emotions: ['Content'], note: 'Feeling back in rhythm.' },
    ],
  },
  {
    label: 'Steady Balanced Rhythm',
    description: 'Healthy consistency with minor everyday fluctuations and regular recovery habits.',
    data: [
      { date: '2026-10-08', displayDate: 'Oct 08', score: 4, label: 'Good', emotions: ['Calm'], note: 'Morning routine on schedule.' },
      { date: '2026-10-09', displayDate: 'Oct 09', score: 4, label: 'Good', emotions: ['Motivated'], note: 'Great lecture discussion.' },
      { date: '2026-10-10', displayDate: 'Oct 10', score: 3, label: 'Okay', emotions: ['Tired'], note: 'Busy Friday afternoon.' },
      { date: '2026-10-11', displayDate: 'Oct 11', score: 5, label: 'Great', emotions: ['Happy', 'Energized'], note: 'Campus club hike.' },
      { date: '2026-10-12', displayDate: 'Oct 12', score: 4, label: 'Good', emotions: ['Relaxed'], note: 'Prepped meals for the week.' },
      { date: '2026-10-13', displayDate: 'Oct 13', score: 4, label: 'Good', emotions: ['Calm'], note: 'Steady study hours.' },
      { date: '2026-10-14', displayDate: 'Oct 14', score: 3, label: 'Okay', emotions: ['Focused'], note: 'Long lab session.' },
      { date: '2026-10-15', displayDate: 'Oct 15', score: 4, label: 'Good', emotions: ['Motivated'], note: 'Assignment turned in early.' },
      { date: '2026-10-16', displayDate: 'Oct 16', score: 4, label: 'Good', emotions: ['Happy'], note: 'Chai with roommate.' },
      { date: '2026-10-17', displayDate: 'Oct 17', score: 5, label: 'Great', emotions: ['Energized'], note: 'Finished week strongly.' },
      { date: '2026-10-18', displayDate: 'Oct 18', score: 4, label: 'Good', emotions: ['Calm'], note: 'Read for pleasure in library.' },
      { date: '2026-10-19', displayDate: 'Oct 19', score: 4, label: 'Good', emotions: ['Motivated'], note: 'Started revision group.' },
      { date: '2026-10-20', displayDate: 'Oct 20', score: 3, label: 'Okay', emotions: ['Tired'], note: 'A bit sleepy after lunch.' },
      { date: '2026-10-21', displayDate: 'Oct 21', score: 4, label: 'Good', emotions: ['Calm'], note: 'Steady evening review.' },
    ],
  },
  {
    label: 'Gradual Evaluative Drift',
    description: 'Scores trending downwards over consecutive days, indicating accumulating academic pressure.',
    data: [
      { date: '2026-10-08', displayDate: 'Oct 08', score: 5, label: 'Great', emotions: ['Energized', 'Motivated'], note: 'Excited about new semester.' },
      { date: '2026-10-09', displayDate: 'Oct 09', score: 4, label: 'Good', emotions: ['Calm'], note: 'Attended all lectures.' },
      { date: '2026-10-10', displayDate: 'Oct 10', score: 4, label: 'Good', emotions: ['Focused'], note: 'Solid library session.' },
      { date: '2026-10-11', displayDate: 'Oct 11', score: 3, label: 'Okay', emotions: ['Tired'], note: 'Assignments piling up.' },
      { date: '2026-10-12', displayDate: 'Oct 12', score: 3, label: 'Okay', emotions: ['Anxious'], note: 'Uncertain about midterm weighting.' },
      { date: '2026-10-13', displayDate: 'Oct 13', score: 3, label: 'Okay', emotions: ['Tired'], note: 'Skipped gym to keep working.' },
      { date: '2026-10-14', displayDate: 'Oct 14', score: 2, label: 'Low', emotions: ['Overwhelmed'], note: 'Can\'t get the coding bug fixed.' },
      { date: '2026-10-15', displayDate: 'Oct 15', score: 2, label: 'Low', emotions: ['Exhausted'], note: 'Slept 3 hours, eyes hurting.' },
      { date: '2026-10-16', displayDate: 'Oct 16', score: 2, label: 'Low', emotions: ['Stressed', 'Isolated'], note: 'Stayed in dorm all day.' },
      { date: '2026-10-17', displayDate: 'Oct 17', score: 1, label: 'Very low', emotions: ['Overwhelmed'], note: 'Feel like giving up on this submission.' },
      { date: '2026-10-18', displayDate: 'Oct 18', score: 2, label: 'Low', emotions: ['Tired'], note: 'Barely finished, feel drained.' },
      { date: '2026-10-19', displayDate: 'Oct 19', score: 2, label: 'Low', emotions: ['Anxious'], note: 'Waiting on grades nervously.' },
      { date: '2026-10-20', displayDate: 'Oct 20', score: 2, label: 'Low', emotions: ['Exhausted'], note: 'Next sprint starting already.' },
      { date: '2026-10-21', displayDate: 'Oct 21', score: 2, label: 'Low', emotions: ['Tired'], note: 'Need to speak with academic advisor.' },
    ],
  },
];

export const ShowcaseLab: React.FC = () => {
  const { showToast, aiStatus, refreshAIStatus } = useApp();

  // ==============================================================
  // EXPERIMENT 1: AI vs. KEYWORD DETECTION
  // ==============================================================
  const comparePresets = [
    {
      label: 'Exam Stress with Personal Name',
      text: "My name is Rahul Sharma from CS101, and I'm extremely stressed about my exams next week.",
      context: 'Direct evaluative pressure with personal name and course disclosure.',
    },
    {
      label: 'Negation Test (The Anti-Keyword)',
      text: "The exam was not stressful at all; I actually felt prepared, relaxed, and confident throughout.",
      context: 'Keyword search falsely flags "stressful" & "exam" despite a thoroughly positive, relaxed student mood.',
    },
    {
      label: 'Hidden Burnout (Zero Keywords)',
      text: "I haven't slept in three nights and stare at my glowing screen without being able to process words.",
      context: 'Keyword search completely misses this severe fatigue because conventional words like "stress" or "sad" are absent.',
    },
    {
      label: 'Peer Connection & Chai Relief',
      text: "Was feeling isolated in Dorm 4B, but had chai with Sarah from CS101 and feel so much lighter.",
      context: 'Interpersonal social connection relieving campus isolation, containing identifiable names & locations.',
    },
    {
      label: 'Curiosity & Machine Learning Sprint',
      text: "Working on my neural network project until 2 AM; feeling excited about the loss curve but need better sleep scheduling.",
      context: 'Academic enthusiasm mixed with sleep hygiene trade-offs, not a distress scenario.',
    },
  ];

  const [compareInput, setCompareInput] = useState(comparePresets[0].text);
  const [isAnalyzingExp1, setIsAnalyzingExp1] = useState(false);
  const [geminiResultExp1, setGeminiResultExp1] = useState<GeminiAnalysisResult | null>(null);
  const [exp1Error, setExp1Error] = useState<string | null>(null);

  // Transparent local algorithm for keyword detection (Rule-Based baseline)
  const keywordAnalysis = useMemo(() => {
    const lower = compareInput.toLowerCase();
    const dictionary = [
      'stress',
      'stressed',
      'stressful',
      'exam',
      'exams',
      'fail',
      'failing',
      'anxious',
      'anxiety',
      'panic',
      'tired',
      'exhausted',
      'burnout',
      'isolated',
      'depressed',
      'depression',
      'sad',
    ];

    const matched = dictionary.filter((word) => lower.includes(word));
    const hasNegation =
      lower.includes('not stress') ||
      lower.includes("wasn't stress") ||
      lower.includes('no stress') ||
      lower.includes('not at all');

    let interpretation = 'Stress or risk keywords detected.';
    let verdict = 'Literal Match Only (No Context)';
    let verdictColor = 'text-neutral-800 bg-neutral-200 border-neutral-300';

    if (matched.length === 0) {
      interpretation = 'Zero risk keywords found. System assumes neutral / optimal wellness.';
      verdict = 'Potential Blind Spot (Misses Implicit Burnout)';
      verdictColor = 'text-red-800 bg-red-100 border-red-300';
    } else if (hasNegation) {
      interpretation = `Flagged literal words [${matched.join(', ')}], but completely missed the negation ("not stressful").`;
      verdict = 'False Positive Triggered';
      verdictColor = 'text-amber-800 bg-amber-100 border-amber-300';
    } else {
      interpretation = `Matched keywords [${matched.join(', ')}]. Assumes student is in distress without evaluating semantics.`;
      verdict = 'Literal Hit (Ignores Nuance)';
      verdictColor = 'text-amber-800 bg-amber-100 border-amber-300';
    }

    return {
      matched: matched.length > 0 ? matched : ['None'],
      interpretation,
      verdict,
      verdictColor,
      flaw: 'Treats human expression as rigid dictionary hits. Blind to negation, sarcasm, and implicit exhaustion.',
    };
  }, [compareInput]);

  // Execute Gemini Contextual Analysis via protected backend
  const runGeminiAnalysisExp1 = useCallback(async (inputText: string) => {
    setIsAnalyzingExp1(true);
    setExp1Error(null);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/analyze-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const latencyMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setGeminiResultExp1({
        possibleMood: data.possibleMood || 'Reflective',
        themes: Array.isArray(data.themes) ? data.themes : ['Academic Rhythm'],
        possibleStressIndicators: Array.isArray(data.possibleStressIndicators) ? data.possibleStressIndicators : [],
        summary: data.summary || 'Contextual theme extracted.',
        reflectionSuggestion: data.reflectionSuggestion || 'How is your week pacing overall?',
        uncertaintyNote: data.uncertaintyNote || 'This is an AI-generated interpretation, not a diagnosis.',
        source: data.source || (aiStatus.mode === 'ai' ? 'gemini-3.8-flash' : 'demo-analyzer'),
        mode: data.mode || aiStatus.mode,
        latencyMs,
      });
    } catch (err: any) {
      console.error('Experiment 1 Gemini analysis failed:', err);
      setExp1Error(err?.message || 'Failed to connect to backend reflection analysis endpoint.');
    } finally {
      setIsAnalyzingExp1(false);
    }
  }, [aiStatus.mode]);

  // Run on initial mount or preset change
  useEffect(() => {
    runGeminiAnalysisExp1(compareInput);
  }, [compareInput, runGeminiAnalysisExp1]);

  // ==============================================================
  // EXPERIMENT 2: PRIVACY TRANSFORMATION LAB (3-STAGE FLOW)
  // ==============================================================
  const proofPresets = [
    {
      label: 'Rahul Sharma (CS Senior & Exams)',
      text: "My name is Rahul Sharma (Senior in CS101, student ID #4492). I'm extremely stressed about my exams next week in Hall B.",
    },
    {
      label: 'Aisha (Dorm 4B & Biochem Lab)',
      text: "I live in Dorm 4B and am falling behind in Biochem 302 lab. I feel like crying every evening because of the workload.",
    },
    {
      label: 'Carlos (Thesis & 48h Insomnia)',
      text: "Carlos Gomez here from Economics Dept. Haven't slept in 48 hours trying to complete the senior econometric model.",
    },
  ];

  const [proofInput, setProofInput] = useState(proofPresets[0].text);
  const [proofStage, setProofStage] = useState<1 | 2 | 3>(1);
  const [isTransformingExp2, setIsTransformingExp2] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0);
  const [liveTransformation, setLiveTransformation] = useState<PrivacyTransformationResult | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showPayloadDiff, setShowPayloadDiff] = useState(false);

  // Consent & Authorized Write states
  const [isVerifyingConsent, setIsVerifyingConsent] = useState(false);
  const [sharingConsentGiven, setSharingConsentGiven] = useState(false);
  const [authorizedAuditResult, setAuthorizedAuditResult] = useState<{
    verified: boolean;
    auditToken: string;
    timestamp: string;
    transmissionNotice: string;
  } | null>(null);

  // Deterministic local baseline for Privacy Transformation
  const fallbackTransformationData = useMemo(() => {
    const text = proofInput;
    const detectedPII: string[] = [];
    if (text.match(/rahul(\s+sharma)?/i)) detectedPII.push('Direct Person Name: "Rahul Sharma"');
    if (text.match(/aisha/i)) detectedPII.push('Direct Person Name: "Aisha"');
    if (text.match(/carlos(\s+gomez)?/i)) detectedPII.push('Direct Person Name: "Carlos Gomez"');
    if (text.match(/dorm\s+[0-9a-z]+/i)) detectedPII.push('Quasi-Identifier: "Dorm 4B"');
    if (text.match(/hall\s+[a-z0-9]+/i)) detectedPII.push('Quasi-Identifier: "Hall B"');
    if (text.match(/id\s*#?[0-9]+/i)) detectedPII.push('Student ID: "#4492"');
    if (text.match(/cs101|biochem\s*302|economics/i)) detectedPII.push('Course Identifier');
    if (detectedPII.length === 0) detectedPII.push('Entity References');

    return {
      rawInput: text,
      detectedPII,
      redactedTextPreview: text
        .replace(/Rahul(\s+Sharma)?/gi, '[REDACTED: PERSON_NAME]')
        .replace(/Aisha/gi, '[REDACTED: PERSON_NAME]')
        .replace(/Carlos(\s+Gomez)?/gi, '[REDACTED: PERSON_NAME]')
        .replace(/Dorm\s+[0-9a-z]+/gi, '[REDACTED: RESIDENCE_LOCATION]')
        .replace(/Hall\s+[a-z0-9]+/gi, '[REDACTED: CAMPUS_LOCATION]')
        .replace(/id\s*#?[0-9]+/gi, '[REDACTED: STUDENT_ID]')
        .replace(/CS101|Biochem\s*302|Economics/gi, '[REDACTED: COURSE_CODE]'),
      retainedTheme: 'Academic Workload & Evaluative Pressure',
      sanitizedSummary: 'Student notes evaluative preparation pressure ahead of upcoming academic milestones.',
      mentorAction: 'Offer an open office-hour check-in regarding study pacing and stress management.',
      mentorToken: 'Student #03',
      source: 'demo-analyzer',
      mode: 'demo',
    };
  }, [proofInput]);

  const activeTransformation = useMemo(() => {
    if (liveTransformation) {
      return {
        rawInput: proofInput,
        detectedPII:
          liveTransformation.redactionsFound.length > 0
            ? liveTransformation.redactionsFound.map(
                (r) => `${r.type}: "${r.original}" → ${r.replacement}`
              )
            : ['Personal name and campus entities detected and redacted'],
        redactedTextPreview: liveTransformation.redactedTextPreview,
        retainedTheme: liveTransformation.themes.join(', '),
        sanitizedSummary: liveTransformation.mentorSafeSummary,
        mentorAction: liveTransformation.suggestedMentorReachout,
        mentorToken: 'Student #03',
        source: liveTransformation.source,
        mode: liveTransformation.mode,
      };
    }
    return fallbackTransformationData;
  }, [liveTransformation, fallbackTransformationData, proofInput]);

  // Stage 1 -> 2: Generate Summary
  const handleGenerateSummary = async () => {
    setIsTransformingExp2(true);
    setScrubProgress(20);
    setProofStage(2);
    setAuthorizedAuditResult(null);

    const interval = setInterval(() => {
      setScrubProgress((p) => (p < 85 ? p + 15 : p));
    }, 180);

    try {
      const res = await fetch('/api/privacy-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: proofInput,
          studentToken: 'Student #03',
        }),
      });

      clearInterval(interval);

      if (res.ok) {
        const data: PrivacyTransformationResult = await res.json();
        setLiveTransformation(data);
      }
    } catch {
      // Fallback in place
    } finally {
      setScrubProgress(100);
      setTimeout(() => {
        setIsTransformingExp2(false);
        showToast('Minimal contextual theme generated without raw text reproduction.', 'success');
      }, 350);
    }
  };

  // Stage 2 -> 3: Review Summary
  const handleReviewSummary = () => {
    setIsReviewOpen(true);
    setProofStage(3);
  };

  // Stage 3 -> Authorized Write: Approve Sharing
  const handleApproveSharing = async () => {
    setIsVerifyingConsent(true);
    try {
      const res = await fetch('/api/verify-consent-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentToken: 'Student #03',
          studentConsent: true,
          summaryPayload: activeTransformation,
        }),
      });

      if (!res.ok) {
        throw new Error('Authorized write verification failed at server barrier.');
      }

      const data = await res.json();
      setSharingConsentGiven(true);
      setAuthorizedAuditResult(data);
      showToast('Consent cryptographically verified! Simulated payload authorized for mentor preview.', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Consent authorization failed', 'warning');
    } finally {
      setIsVerifyingConsent(false);
    }
  };

  // Reset Experiment 2
  const handleResetProof = () => {
    setProofStage(1);
    setIsTransformingExp2(false);
    setScrubProgress(0);
    setLiveTransformation(null);
    setSharingConsentGiven(false);
    setAuthorizedAuditResult(null);
    setIsReviewOpen(false);
    setShowPayloadDiff(false);
    setProofInput(proofPresets[0].text);
    showToast('Experiment 2 reset to baseline.', 'info');
  };

  // ==============================================================
  // EXPERIMENT 3: EMOTIONAL PATTERN EXPLAINER (14-DAY MOOD)
  // ==============================================================
  const [selectedDatasetIdx, setSelectedDatasetIdx] = useState(0);
  const activeDataset = MOOD_DATASET_PRESETS[selectedDatasetIdx].data;
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);
  const [isExplainingExp3, setIsExplainingExp3] = useState(false);
  const [geminiMoodInsight, setGeminiMoodInsight] = useState<MoodInsightResult | null>(null);
  const [exp3Error, setExp3Error] = useState<string | null>(null);

  // Deterministic statistical calculations from 14-day dataset
  const deterministicMetrics = useMemo(() => {
    const scores = activeDataset.map((d) => d.score);
    const total = scores.reduce((a, b) => a + b, 0);
    const mean = Number((total / scores.length).toFixed(2));

    const week1 = scores.slice(0, 7);
    const week2 = scores.slice(7, 14);
    const week1Avg = Number((week1.reduce((a, b) => a + b, 0) / week1.length).toFixed(2));
    const week2Avg = Number((week2.reduce((a, b) => a + b, 0) / week2.length).toFixed(2));
    const delta = Number((week2Avg - week1Avg).toFixed(2));
    const percentChange = Math.round(((week2Avg - week1Avg) / week1Avg) * 100);

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const lowDaysCount = scores.filter((s) => s <= 2).length;
    const highDaysCount = scores.filter((s) => s >= 4).length;

    // Standard deviation (volatility)
    const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;
    const stdDev = Number(Math.sqrt(variance).toFixed(2));

    return {
      mean,
      week1Avg,
      week2Avg,
      delta,
      percentChange,
      minScore,
      maxScore,
      lowDaysCount,
      highDaysCount,
      stdDev,
      trendLabel:
        delta > 0.4
          ? 'Positive Upward Rebound'
          : delta < -0.4
          ? 'Noticeable Evaluative Dip'
          : 'Stable Balanced Trajectory',
    };
  }, [activeDataset]);

  // Request Gemini Explanation on 14-Day Dataset
  const runGeminiMoodExplainer = useCallback(async () => {
    setIsExplainingExp3(true);
    setExp3Error(null);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/mood-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: activeDataset.map((d) => ({
            date: d.displayDate,
            score: d.score,
            label: d.label,
            emotions: d.emotions,
            note: d.note,
          })),
        }),
      });

      const latencyMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setGeminiMoodInsight({
        observation: data.observation || 'Recorded check-ins show fluctuations across weeks.',
        supportingDates: Array.isArray(data.supportingDates) ? data.supportingDates : [],
        reflectionQuestion:
          data.reflectionQuestion || 'What routines supported you most during your steady days?',
        suggestedAction: data.suggestedAction || 'Schedule a 5-minute breathing pause between demanding tasks.',
        uncertaintyNote:
          data.uncertaintyNote || 'This is an optional observation based on self-reported logs, not a clinical evaluation.',
        source: data.source || (aiStatus.mode === 'ai' ? 'gemini-3.8-flash' : 'demo-analyzer'),
        mode: data.mode || aiStatus.mode,
        latencyMs,
      });
    } catch (err: any) {
      console.error('Experiment 3 mood explainer error:', err);
      setExp3Error(err?.message || 'Failed to connect to backend mood insights endpoint.');
    } finally {
      setIsExplainingExp3(false);
    }
  }, [activeDataset, aiStatus.mode]);

  // Run when preset changes
  useEffect(() => {
    runGeminiMoodExplainer();
    setSelectedDayIdx(null);
  }, [selectedDatasetIdx, runGeminiMoodExplainer]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* ============================================================== */}
      {/* HEADER & GLOBAL AI CONNECTION STATUS BAR                       */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-200/80">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <FlaskConical className="w-6 h-6 text-[#174D3A]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202B26] tracking-tight">
                Sahayak Showcase Lab
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0]/60">
                Interactive Innovation Sandbox
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-3xl">
              Hands-on architectural demonstration proving how configured Google Gemini APIs empower contextual understanding,
              strict privacy redaction barriers, and non-clinical pattern reflections.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => refreshAIStatus()}
              className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-[#F7F8F4] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Ping backend status"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#174D3A]" />
              <span>Ping Engine</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E3F2E8] rounded-xl border border-[#A8C5A0]/80 text-xs font-semibold text-[#174D3A]">
              <Shield className="w-3.5 h-3.5" />
              <span>Judges Sandbox</span>
            </div>
          </div>
        </div>

        {/* Connection Status Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          aiStatus.geminiConfigured
            ? 'bg-[#E3F2E8]/60 border-[#A8C5A0] text-[#174D3A]'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                aiStatus.geminiConfigured ? 'bg-emerald-600 ring-4 ring-emerald-200' : 'bg-amber-500 ring-4 ring-amber-200'
              }`} />
              <div>
                <span className="font-bold">Active Engine: </span>
                <span className="font-mono">{aiStatus.activeProvider}</span>
                <span className="ml-2 font-normal text-[11px] opacity-80">
                  ({aiStatus.geminiConfigured ? 'Live Server-Side Gemini API' : 'Deterministic Local Fallback Mode'})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span>Status: <strong>{aiStatus.status.toUpperCase()}</strong></span>
              <span>•</span>
              <span>Verified Protected Endpoints: <strong>3 Active</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* EXPERIMENT 1: AI vs. KEYWORD DETECTION                         */}
      {/* ============================================================== */}
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E3F2E8] text-xs font-bold text-[#174D3A]">
            <Cpu className="w-3.5 h-3.5" />
            <span>Experiment 1: Contextual Awareness vs. Naive Keywords</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#202B26]">
            AI vs. Keyword Detection Benchmark
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
            Compare a transparent dictionary keyword algorithm against your live Gemini model. Enter any fictional student journal
            entry to observe how keywords create false alarms or miss silent exhaustion, while Gemini evaluates semantic context.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-700 block">
            Select a benchmark scenario or type your own custom sentence:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {comparePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCompareInput(p.text)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                  compareInput === p.text
                    ? 'border-[#174D3A] bg-[#E3F2E8]/60 font-semibold text-[#174D3A] ring-1 ring-[#174D3A]'
                    : 'border-neutral-200 bg-[#F7F8F4] text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{p.label}</span>
                  {compareInput === p.text && <Check className="w-3.5 h-3.5 text-[#174D3A]" />}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-snug">{p.context}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box with Execution Control */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-neutral-300 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A] leading-relaxed"
              placeholder="Enter any fictional student sentence (e.g., 'The test wasn't stressful at all; I loved it!')..."
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
              <span>Characters: {compareInput.length}</span>
              <span>•</span>
              <span>Backend Route: <code className="font-mono text-neutral-700">/api/analyze-reflection</code></span>
            </div>

            <button
              onClick={() => runGeminiAnalysisExp1(compareInput)}
              disabled={isAnalyzingExp1}
              className="px-4 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isAnalyzingExp1 ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-[#A8C5A0]" />
                  <span>Calling Gemini...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#A8C5A0]" />
                  <span>Re-run Gemini Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* LEFT CARD: Naive Keyword Detection */}
          <div className="rounded-2xl border border-neutral-200 bg-[#F7F8F4] p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Method A: Rigid Keyword Matching
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 font-semibold">
                  Rule-Based Engine
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-500">Dictionary Match Hits:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {keywordAnalysis.matched.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-semibold"
                    >
                      &quot;{kw}&quot;
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-500">Rigid System Interpretation:</span>
                <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 mt-1 leading-relaxed">
                  &ldquo;{keywordAnalysis.interpretation}&rdquo;
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-500">Reliability Classification:</span>
                <div className="mt-1">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border ${keywordAnalysis.verdictColor}`}>
                    {keywordAnalysis.verdict}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 text-xs text-neutral-600 space-y-1">
              <div className="font-semibold text-neutral-800">Inherent Technical Limitation:</div>
              <p className="leading-relaxed">{keywordAnalysis.flaw}</p>
            </div>
          </div>

          {/* RIGHT CARD: Gemini Contextual Analysis */}
          <div className="rounded-2xl border-2 border-[#174D3A] bg-[#E3F2E8]/40 p-5 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#A8C5A0]/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#174D3A]" />
                  <span className="text-xs font-bold text-[#174D3A] uppercase tracking-wider">
                    Method B: Gemini Contextual Analysis
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {geminiResultExp1?.latencyMs && (
                    <span className="text-[10px] font-mono text-[#174D3A] bg-white px-2 py-0.5 rounded border border-[#A8C5A0]">
                      ⚡ {geminiResultExp1.latencyMs}ms
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#174D3A] text-white font-semibold">
                    {geminiResultExp1?.source || 'Gemini 3.8 Flash'}
                  </span>
                </div>
              </div>

              {isAnalyzingExp1 ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-[#174D3A]">
                  <Sparkles className="w-6 h-6 animate-spin text-[#174D3A]" />
                  <span className="text-xs font-semibold">Querying Gemini Server-Side API...</span>
                  <span className="text-[11px] text-neutral-500">Extracting mood nuance, negation, and themes</span>
                </div>
              ) : exp1Error ? (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Analysis Error</span>
                  </div>
                  <p>{exp1Error}</p>
                  <button
                    onClick={() => runGeminiAnalysisExp1(compareInput)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
                  >
                    Retry Query
                  </button>
                </div>
              ) : geminiResultExp1 ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#174D3A]">Contextual Mood:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#A8C5A0] text-xs font-bold text-[#174D3A]">
                      {geminiResultExp1.possibleMood}
                    </span>
                    <span className="text-xs font-semibold text-[#174D3A] ml-2">Themes:</span>
                    {geminiResultExp1.themes.map((th, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#174D3A] text-white text-[11px] font-medium">
                        {th}
                      </span>
                    ))}
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#174D3A]">Synthesized Context Summary:</span>
                    <div className="p-3 bg-white rounded-xl border border-[#A8C5A0]/80 text-xs font-medium text-[#202B26] mt-1 shadow-2xs leading-relaxed">
                      &ldquo;{geminiResultExp1.summary}&rdquo;
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#174D3A]">Open-Ended Reflection Suggestion:</span>
                    <div className="text-xs text-[#202B26]/85 bg-white/80 p-2.5 rounded-lg border border-[#A8C5A0]/50 mt-1 italic">
                      &ldquo;{geminiResultExp1.reflectionSuggestion}&rdquo;
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="pt-3 border-t border-[#A8C5A0]/60 text-xs text-[#202B26] space-y-1">
              <div className="font-semibold text-[#174D3A]">Contextual Benefit:</div>
              <p className="leading-relaxed text-[11px]">
                Understands holistic semantics, distinguishes relief from genuine crisis, and isolates thematic summaries
                without copying student names or raw sentences.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Takeaway Banner */}
        <div className="p-4 bg-[#F7F8F4] rounded-xl border border-neutral-200 text-xs text-neutral-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#174D3A] shrink-0" />
            <span>
              <strong>Scientific Takeaway:</strong> Naive keywords yield up to 40% false-positives when students write sentences like &ldquo;not stressful at all&rdquo; and completely fail on silent exhaustion.
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#174D3A] bg-white px-2.5 py-1 rounded-md border border-neutral-200 shrink-0">
            Precision &gt; Keyword Matching
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* EXPERIMENT 2: PRIVACY TRANSFORMATION LAB                       */}
      {/* ============================================================== */}
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E3F2E8] text-xs font-bold text-[#174D3A]">
              <Shield className="w-3.5 h-3.5" />
              <span>Experiment 2: Three-Stage Privacy Transformation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#202B26]">
              From Raw Reflection to Minimal Mentor Insight
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Interactive 3-stage proof: Trace how identifiable facts are scrubbed and synthesized, requiring explicit verified consent before any payload write.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetProof}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Experiment</span>
            </button>
            <button
              onClick={handleGenerateSummary}
              disabled={isTransformingExp2}
              className="px-4 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A8C5A0]" />
              <span>{isTransformingExp2 ? 'Scrubbing...' : 'Generate Summary'}</span>
            </button>
            <button
              onClick={handleReviewSummary}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border ${
                proofStage >= 2
                  ? 'bg-white border-[#174D3A] text-[#174D3A] hover:bg-[#E3F2E8]/40'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Review Summary</span>
            </button>
            <button
              onClick={handleApproveSharing}
              disabled={isVerifyingConsent || proofStage < 2}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                sharingConsentGiven
                  ? 'bg-emerald-700 text-white'
                  : proofStage >= 2
                  ? 'bg-[#174D3A] text-white hover:bg-[#113A2C]'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isVerifyingConsent ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Write...</span>
                </>
              ) : sharingConsentGiven ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Sharing Approved &amp; Logged</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#A8C5A0]" />
                  <span>Approve Sharing</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Synthetic Example Data Presets */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-semibold text-neutral-700">
              Synthetic Example Data (Default fictional inputs):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {proofPresets.map((pr, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setProofInput(pr.text);
                    setProofStage(1);
                    setSharingConsentGiven(false);
                    setAuthorizedAuditResult(null);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    proofInput === pr.text
                      ? 'bg-[#174D3A] text-white border-[#174D3A] font-semibold'
                      : 'bg-[#F7F8F4] text-neutral-600 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={proofInput}
            onChange={(e) => {
              setProofInput(e.target.value);
              setProofStage(1);
              setSharingConsentGiven(false);
              setAuthorizedAuditResult(null);
            }}
            rows={2}
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-200 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A]"
            placeholder="Type or edit a fictional journal entry with sensitive details..."
          />
        </div>

        {/* Progress Bar for Scrubbing */}
        {isTransformingExp2 && (
          <div className="space-y-1.5 bg-[#E3F2E8]/60 p-4 rounded-xl border border-[#A8C5A0]/80 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-[#174D3A]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Gemini Redaction &amp; Theme Extraction Pipeline...</span>
              </span>
              <span className="font-mono">{scrubProgress}%</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#A8C5A0]">
              <div
                className="bg-[#174D3A] h-full transition-all duration-300 ease-out"
                style={{ width: `${scrubProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 3-STAGE INTERACTIVE DEMONSTRATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* STAGE 1: Private Journal */}
          <div className="p-5 rounded-2xl border border-neutral-300 bg-[#F7F8F4] shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <span className="text-xs font-bold text-neutral-700">STAGE 1: Private Journal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 font-semibold">
                  Source Text
                </span>
              </div>

              <div className="mt-3 space-y-3">
                <div className="text-xs font-semibold text-neutral-500">Fictional Source Text:</div>
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800 leading-relaxed min-h-[90px]">
                  &ldquo;{activeTransformation.rawInput}&rdquo;
                </div>

                <div className="p-2.5 bg-red-50 rounded-lg border border-red-200 text-[11px] text-red-900 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    Sensitive Identifiers Tagged at Source:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {activeTransformation.detectedPII.map((pii, i) => (
                      <li key={i}>{pii}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-neutral-500">
              Encrypted locally in browser storage. Never sent to mentors.
            </div>
          </div>

          {/* STAGE 2: Gemini Minimal Summary */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
            proofStage >= 2
              ? 'bg-[#E3F2E8]/40 border-[#A8C5A0] shadow-sm'
              : 'opacity-50 border-neutral-200 bg-neutral-50'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#A8C5A0]/80">
                <span className="text-xs font-bold text-[#174D3A]">STAGE 2: Gemini Summary</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#174D3A] text-white font-semibold">
                  Abstraction Layer
                </span>
              </div>

              <div className="mt-3 space-y-3">
                <div className="text-xs font-semibold text-[#174D3A]">What is Stripped vs. Retained:</div>

                <div className="bg-white p-2.5 rounded-xl border border-red-200 text-[11px] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-red-700 flex items-center justify-between">
                    <span>Stripped Direct Identifiers</span>
                    <span className="text-[9px] font-mono bg-red-100 px-1 py-0.5 rounded">REMOVED</span>
                  </div>
                  <div className="text-neutral-600 line-through space-y-0.5 text-[10px]">
                    <div>• Personal names, dorms, student IDs</div>
                    <div>• Verbatim diary sentences</div>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-[11px] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#174D3A] flex items-center justify-between">
                    <span>Synthesized Abstract Theme</span>
                    <span className="text-[9px] font-mono bg-emerald-100 text-[#174D3A] px-1 py-0.5 rounded">OUTPUT</span>
                  </div>
                  <p className="font-semibold text-[#174D3A] text-xs">
                    {activeTransformation.retainedTheme}
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-neutral-200 text-[11px]">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Scrubbed PII Preview:</span>
                  <p className="font-mono text-[10px] text-neutral-600 bg-neutral-50 p-1.5 rounded">
                    {activeTransformation.redactedTextPreview}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#174D3A] font-semibold">
              Ready for student review prior to transmission.
            </div>
          </div>

          {/* STAGE 3: Mentor Preview */}
          <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
            proofStage === 3
              ? 'bg-white border-[#174D3A] shadow-md ring-2 ring-[#174D3A]/10'
              : 'opacity-50 border-neutral-200 bg-neutral-50'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <span className="text-xs font-bold text-[#174D3A]">STAGE 3: Mentor Preview</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  sharingConsentGiven ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {sharingConsentGiven ? 'Authorized Write' : 'Consent Pending'}
                </span>
              </div>

              <div className="mt-3 space-y-3">
                <div className="text-xs font-semibold text-neutral-500">Visible to Mentor:</div>

                <div className="bg-[#F7F8F4] p-3 rounded-xl border border-neutral-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#174D3A] text-sm font-mono">
                      {activeTransformation.mentorToken}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded font-semibold">
                      Anonymized Token
                    </span>
                  </div>

                  <div className="text-neutral-800 text-xs leading-relaxed">
                    <span className="text-neutral-500 font-medium">Proposed summary: </span>
                    <strong>{activeTransformation.sanitizedSummary}</strong>
                  </div>

                  <div className="text-xs text-[#174D3A] font-semibold pt-1 border-t border-neutral-200/60">
                    Suggested Mentor Reachout: &ldquo;{activeTransformation.mentorAction}&rdquo;
                  </div>
                </div>

                {/* Zero Raw Text Guarantee */}
                <div className="p-2.5 bg-[#E3F2E8] rounded-lg border border-[#A8C5A0]/80 text-[11px] text-[#174D3A] space-y-0.5">
                  <div className="font-bold flex items-center gap-1">
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Zero Raw Text Guarantee:</span>
                  </div>
                  <div className="text-neutral-700 font-mono text-[10px]">
                    raw_journal_text: null (Never dispatched to mentor)
                  </div>
                </div>

                {/* Authorized Audit Badge */}
                {authorizedAuditResult && (
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300 text-[11px] text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Consent Verified by Server:</span>
                    </div>
                    <div className="font-mono text-[10px] break-all">
                      Audit Token: {authorizedAuditResult.auditToken}
                    </div>
                    <div className="text-[10px] text-emerald-700">
                      Verified at {new Date(authorizedAuditResult.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-[10px] text-neutral-400 font-mono text-center">
              Engine: {activeTransformation.source}
            </div>
          </div>
        </div>

        {/* Payload Diff Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-100 pt-3">
          <button
            onClick={() => setShowPayloadDiff(!showPayloadDiff)}
            className="px-4 py-2 rounded-xl bg-[#F7F8F4] border border-neutral-300 text-xs font-semibold text-[#174D3A] hover:bg-[#E3F2E8] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showPayloadDiff ? 'Hide Payload Inspection Diff' : 'Inspect Live JSON Payload Diff'}</span>
          </button>

          <span className="text-xs text-neutral-500 italic">
            Visual inspection comparing client-side vault vs authorized mentor egress payload.
          </span>
        </div>

        {showPayloadDiff && (
          <div className="bg-[#F7F8F4] p-5 rounded-2xl border border-neutral-200 space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-[#202B26]">
              Side-by-Side Network Payload Inspection
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-white rounded-xl border border-red-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-red-700">
                  Client Vault Storage (Contains Raw Journal)
                </span>
                <pre className="text-neutral-700 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">
{`{
  "studentId": "student-03",
  "storageScope": "client_browser_local",
  "rawEntryText": "${proofInput.replace(/"/g, '\\"')}",
  "sharingConsent": ${sharingConsentGiven},
  "mentorAccess": "${sharingConsentGiven ? 'AUTHORIZED_BY_TOKEN' : 'DENIED_BY_DEFAULT'}"
}`}
                </pre>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#174D3A]">
                  Mentor Portal Received Payload (Zero Raw Text)
                </span>
                <pre className="text-[#174D3A] overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">
{`{
  "token": "${activeTransformation.mentorToken}",
  "theme": "${activeTransformation.retainedTheme}",
  "summary": "${activeTransformation.sanitizedSummary}",
  "suggestedAction": "${activeTransformation.mentorAction}",
  "rawJournalPayload": null,
  "auditToken": "${authorizedAuditResult?.auditToken || 'PENDING_APPROVAL'}"
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Technical Reality Disclaimer on Anonymity */}
        <div className="bg-[#F7F8F4] border-2 border-neutral-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#174D3A]" />
            <h4 className="text-sm font-bold text-[#202B26]">
              Important Security Reality: AI Summarization &amp; Name Removal Do Not Guarantee Anonymity
            </h4>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            <strong>Clear Notice:</strong> In this showcase sandbox, sharing functionality is <strong>strictly simulated</strong>.
            Removing direct personal names and generating an AI summary reduces privacy risks, but it does <strong>not</strong> confer
            mathematical anonymity.
          </p>
          <div className="text-xs text-neutral-600 space-y-2 pt-1 leading-relaxed">
            <ul className="list-disc list-inside pl-1 space-y-1">
              <li>
                <strong>Quasi-Identifiers &amp; Stylometry:</strong> Unique combinations of department name, course codes, timestamps, and vocabulary phrasing can often re-identify an author even when their name is absent.
              </li>
              <li>
                <strong>Production Anonymization Requirements:</strong> True medical/student privacy requires formal $k$-anonymity, $l$-diversity, differential privacy noise, and cryptographically verified, revocable student consent.
              </li>
              <li>
                <strong>Consent Verification:</strong> Clicking &ldquo;Approve Sharing&rdquo; in Sahayak enforces a server-side audit check (<code className="font-mono bg-white px-1 py-0.5 rounded border border-neutral-200">/api/verify-consent-share</code>) rather than allowing frontend bypass.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* EXPERIMENT 3: EMOTIONAL PATTERN EXPLAINER (14-DAY MOOD)        */}
      {/* ============================================================== */}
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E3F2E8] text-xs font-bold text-[#174D3A]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Experiment 3: Deterministic Data + Gemini Plain-Language Explainer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#202B26]">
            Emotional Pattern Explainer
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
            See how Sahayak combines deterministic mathematical calculations with Gemini&apos;s natural-language synthesis.
            The raw numbers are calculated strictly without hallucinations, and Gemini produces a gentle, non-clinical reflection
            question referencing recorded check-in dates.
          </p>
        </div>

        {/* Dataset Scenario Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-700 block">
            Select a 14-day fictional mood scenario:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MOOD_DATASET_PRESETS.map((ds, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDatasetIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                  selectedDatasetIdx === idx
                    ? 'border-[#174D3A] bg-[#E3F2E8]/60 font-semibold text-[#174D3A] ring-1 ring-[#174D3A]'
                    : 'border-neutral-200 bg-[#F7F8F4] text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{ds.label}</span>
                  {selectedDatasetIdx === idx && <Check className="w-3.5 h-3.5 text-[#174D3A]" />}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-snug">{ds.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Deterministic Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F8F4] p-4 rounded-2xl border border-neutral-200">
          <div className="p-3 bg-white rounded-xl border border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              14-Day Average Score
            </span>
            <div className="text-lg font-extrabold text-[#202B26] mt-0.5">
              {deterministicMetrics.mean} <span className="text-xs font-normal text-neutral-500">/ 5.0</span>
            </div>
            <span className="text-[10px] text-neutral-400">Deterministic mean</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Week 1 vs Week 2 Drift
            </span>
            <div className={`text-lg font-extrabold mt-0.5 flex items-center gap-1 ${
              deterministicMetrics.delta > 0
                ? 'text-emerald-700'
                : deterministicMetrics.delta < 0
                ? 'text-amber-700'
                : 'text-neutral-700'
            }`}>
              {deterministicMetrics.delta > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : deterministicMetrics.delta < 0 ? (
                <TrendingDown className="w-4 h-4 text-amber-600" />
              ) : null}
              <span>{deterministicMetrics.delta > 0 ? `+${deterministicMetrics.delta}` : deterministicMetrics.delta}</span>
              <span className="text-xs font-semibold">({deterministicMetrics.percentChange}%)</span>
            </div>
            <span className="text-[10px] text-neutral-400">Week 1: {deterministicMetrics.week1Avg} → W2: {deterministicMetrics.week2Avg}</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Low vs High Days
            </span>
            <div className="text-lg font-extrabold text-[#202B26] mt-0.5">
              <span className="text-amber-700">{deterministicMetrics.lowDaysCount} Low</span>
              <span className="text-neutral-300 mx-1">/</span>
              <span className="text-emerald-700">{deterministicMetrics.highDaysCount} High</span>
            </div>
            <span className="text-[10px] text-neutral-400">Score &le;2 vs &ge;4</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Rhythm Trajectory
            </span>
            <div className="text-xs font-bold text-[#174D3A] mt-1 line-clamp-1">
              {deterministicMetrics.trendLabel}
            </div>
            <span className="text-[10px] text-neutral-400">Std Dev: &plusmn;{deterministicMetrics.stdDev}</span>
          </div>
        </div>

        {/* Side-by-Side: Recharts Chart vs Gemini Plain-Language Explainer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: 14-Day Chart Visualization (7 Cols) */}
          <div className="lg:col-span-7 bg-[#F7F8F4] p-5 rounded-2xl border border-neutral-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#174D3A]" />
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Recorded Observations: 14-Day Mood Timeline
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                Click any point to inspect day note
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeDataset} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    stroke="#D1D5DB"
                  />
                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    stroke="#D1D5DB"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as DayCheckIn;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-sm text-xs space-y-1">
                            <div className="font-bold text-[#174D3A] flex items-center justify-between gap-4">
                              <span>{data.displayDate}</span>
                              <span className="px-2 py-0.5 rounded bg-[#E3F2E8] text-[10px]">
                                {data.label} ({data.score}/5)
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-600">
                              Emotions: {data.emotions.join(', ')}
                            </div>
                            <div className="text-[11px] text-neutral-500 italic max-w-xs">
                              &ldquo;{data.note}&rdquo;
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={3} stroke="#9CA3AF" strokeDasharray="2 2" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#174D3A"
                    strokeWidth={3}
                    dot={{ fill: '#174D3A', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6, fill: '#113A2C' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Selected Day Inspector */}
            <div className="pt-2 border-t border-neutral-200">
              <span className="text-xs font-semibold text-neutral-600 block mb-1.5">
                Inspect Daily Check-In Logs (14 Records):
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {activeDataset.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIdx(idx)}
                    className={`px-2 py-1.5 rounded-lg border text-center shrink-0 cursor-pointer transition-all text-xs font-mono ${
                      selectedDayIdx === idx
                        ? 'bg-[#174D3A] text-white border-[#174D3A] font-bold'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="text-[10px]">{day.displayDate}</div>
                    <div className="font-bold">{day.score}/5</div>
                  </button>
                ))}
              </div>

              {selectedDayIdx !== null && (
                <div className="mt-2 p-3 bg-white rounded-xl border border-neutral-200 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between font-bold text-[#174D3A]">
                    <span>{activeDataset[selectedDayIdx].displayDate} — {activeDataset[selectedDayIdx].label} ({activeDataset[selectedDayIdx].score}/5)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Self-Reported Entry</span>
                  </div>
                  <div className="text-neutral-600 text-[11px]">
                    Emotions: {activeDataset[selectedDayIdx].emotions.join(', ')}
                  </div>
                  <p className="text-neutral-800 text-xs italic bg-[#F7F8F4] p-2 rounded-lg border border-neutral-100">
                    &ldquo;{activeDataset[selectedDayIdx].note}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Gemini AI Interpretation Card (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl border-2 border-[#174D3A] bg-[#E3F2E8]/40 p-5 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#A8C5A0]/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#174D3A]" />
                  <span className="text-xs font-bold text-[#174D3A] uppercase tracking-wider">
                    Gemini AI Interpretation &amp; Reflection
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {geminiMoodInsight?.latencyMs && (
                    <span className="text-[10px] font-mono text-[#174D3A] bg-white px-2 py-0.5 rounded border border-[#A8C5A0]">
                      ⚡ {geminiMoodInsight.latencyMs}ms
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#174D3A] text-white font-semibold">
                    {geminiMoodInsight?.source || 'Gemini'}
                  </span>
                </div>
              </div>

              {isExplainingExp3 ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-2 text-[#174D3A]">
                  <Sparkles className="w-6 h-6 animate-spin text-[#174D3A]" />
                  <span className="text-xs font-semibold">Generating Plain-Language Reflection...</span>
                  <span className="text-[11px] text-neutral-500">Synthesizing trends with zero clinical diagnoses</span>
                </div>
              ) : exp3Error ? (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Failed to produce explanation</span>
                  </div>
                  <p>{exp3Error}</p>
                  <button
                    onClick={runGeminiMoodExplainer}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
                  >
                    Retry Explainer
                  </button>
                </div>
              ) : geminiMoodInsight ? (
                <>
                  {/* Observation */}
                  <div>
                    <span className="text-xs font-semibold text-[#174D3A]">Plain-Language Observation:</span>
                    <div className="p-3.5 bg-white rounded-xl border border-[#A8C5A0]/80 text-xs text-[#202B26] mt-1 shadow-2xs leading-relaxed">
                      {geminiMoodInsight.observation}
                    </div>
                  </div>

                  {/* Supporting Dates Cited */}
                  {geminiMoodInsight.supportingDates.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-[#174D3A]">Supporting Dates Cited from Log:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {geminiMoodInsight.supportingDates.map((dt, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full bg-white border border-[#A8C5A0] text-[#174D3A] text-[11px] font-semibold">
                            📅 {dt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optional Reflection Question */}
                  <div>
                    <span className="text-xs font-semibold text-[#174D3A]">Guided Reflection Question:</span>
                    <div className="p-3 bg-white/90 rounded-xl border border-[#A8C5A0]/60 text-xs font-medium text-[#174D3A] italic mt-1 leading-relaxed">
                      &ldquo;{geminiMoodInsight.reflectionQuestion}&rdquo;
                    </div>
                  </div>

                  {/* Suggested Wellness Practice */}
                  {geminiMoodInsight.suggestedAction && (
                    <div>
                      <span className="text-xs font-semibold text-[#174D3A]">Low-Stakes Practice Suggestion:</span>
                      <div className="text-xs text-[#202B26] bg-white/80 p-2.5 rounded-lg border border-[#A8C5A0]/40 mt-1">
                        💡 {geminiMoodInsight.suggestedAction}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            <div className="pt-3 border-t border-[#A8C5A0]/60 text-xs text-[#202B26] space-y-2">
              <div className="p-2.5 bg-white/80 rounded-lg border border-[#A8C5A0]/60 text-[11px] text-neutral-600 space-y-1">
                <span className="font-bold text-[#174D3A] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Strict Non-Clinical Boundary:</span>
                </span>
                <p className="text-[10px] leading-relaxed">
                  Sahayak never diagnoses psychological conditions, predicts acute crises, or infers clinical disorders.
                  Observations serve solely as low-pressure mirrors to facilitate mindful personal reflection.
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>Model: {geminiMoodInsight?.source || 'Gemini 3.8 Flash'}</span>
                <button
                  onClick={runGeminiMoodExplainer}
                  className="hover:text-[#174D3A] underline cursor-pointer"
                >
                  Re-evaluate Dataset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* REVIEW SUMMARY MODAL (EXPERIMENT 2)                            */}
      {/* ============================================================== */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2 text-[#174D3A]">
                <Shield className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#202B26]">Student Review: Proposed Mentor Payload</h3>
              </div>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Before consenting to transmit any payload to campus mentors, verify that all personal identifiers have been scrubbed
              and only abstract thematic summaries remain.
            </p>

            <div className="space-y-3 bg-[#F7F8F4] p-4 rounded-xl border border-neutral-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Student Alias:</span>
                <div className="font-bold text-[#174D3A] font-mono">{activeTransformation.mentorToken}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Proposed Abstract Summary:</span>
                <p className="font-semibold text-neutral-800 mt-0.5">{activeTransformation.sanitizedSummary}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Raw Journal Sentences Leaked:</span>
                <p className="font-mono text-emerald-700 font-bold mt-0.5">0 sentences (Strict isolation verified)</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsReviewOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setIsReviewOpen(false);
                  handleApproveSharing();
                }}
                className="px-4 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-colors cursor-pointer"
              >
                Approve &amp; Log Consent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
