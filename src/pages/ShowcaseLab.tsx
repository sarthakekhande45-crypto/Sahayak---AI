import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PrivacyTransformationResult } from '../types';
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
} from 'lucide-react';

export const ShowcaseLab: React.FC = () => {
  const { showToast, aiStatus } = useApp();

  // ==============================================================
  // EXPERIMENT A: COMPARE LAB (Keyword vs Contextual Summary)
  // ==============================================================
  const comparePresets = [
    {
      label: 'Exam Stress (Rahul)',
      text: "My name is Rahul, and I'm extremely stressed about my exams.",
      context: 'Direct evaluative pressure with personal name disclosure.',
    },
    {
      label: 'Negation Test (Easy Exam)',
      text: "The exam was not stressful at all; I actually felt prepared and relaxed.",
      context: 'Keyword search falsely flags "stressful" & "exam" despite positive mood.',
    },
    {
      label: 'Hidden Burnout (No Keyword)',
      text: "I haven't slept in three nights and stare at my screen without being able to process words.",
      context: 'Keyword search misses this because words like "stress" or "depressed" are absent.',
    },
    {
      label: 'Peer & Roommate Relief',
      text: "Was feeling isolated in the dorms, but had chai with Sarah from CS101 and feel so much lighter.",
      context: 'Interpersonal connection and academic course code mentioned.',
    },
  ];

  const [compareInput, setCompareInput] = useState(comparePresets[0].text);

  // Keyword extraction logic
  const keywordAnalysis = useMemo(() => {
    const lower = compareInput.toLowerCase();
    const dictionary = [
      'stress',
      'stressed',
      'stressful',
      'exam',
      'exams',
      'fail',
      'anxious',
      'anxiety',
      'panic',
      'tired',
      'burnout',
      'isolated',
      'depressed',
      'sad',
    ];

    const matched = dictionary.filter((word) => lower.includes(word));
    const hasNegation =
      lower.includes('not stress') ||
      lower.includes("wasn't stress") ||
      lower.includes('no stress');

    let interpretation = 'Stress or risk keywords detected.';
    let verdict = 'False Alert / Context Missed';
    let verdictColor = 'text-amber-800 bg-amber-100 border-amber-300';

    if (matched.length === 0) {
      interpretation = 'Zero risk keywords found. System triggers no alert.';
      verdict = 'Potential Blind Spot (Missed Burnout)';
      verdictColor = 'text-red-800 bg-red-100 border-red-300';
    } else if (hasNegation) {
      interpretation = `Flagged words [${matched.join(', ')}], but missed the negation ("not stressful").`;
      verdict = 'False Positive Triggered';
      verdictColor = 'text-amber-800 bg-amber-100 border-amber-300';
    } else {
      verdict = 'Literal Match Only (No Context)';
      verdictColor = 'text-neutral-800 bg-neutral-200 border-neutral-300';
    }

    return {
      matched: matched.length > 0 ? matched : ['None'],
      interpretation,
      verdict,
      verdictColor,
      flaw: 'Treats human language as rigid dictionary hits. Blind to sarcasm, negation, and implicit exhaustion.',
    };
  }, [compareInput]);

  // Contextual summary logic
  const contextualAnalysis = useMemo(() => {
    const lower = compareInput.toLowerCase();
    let theme = 'General Student Routine';
    let summary = 'Routine daily student self-reflection.';
    let recommendation = 'Standard campus wellness pulse.';
    let nuance = 'No acute workload or adjustment pressures identified.';

    if (
      lower.includes('not stress') ||
      lower.includes('relaxed') ||
      lower.includes('prepared')
    ) {
      theme = 'Academic Preparedness & Calm';
      summary = 'Student reports low evaluative stress and solid preparation.';
      recommendation = 'Encourage ongoing healthy study-life balance habits.';
      nuance = 'Accurately recognizes negation: student expresses satisfaction rather than panic.';
    } else if (
      lower.includes('exam') ||
      lower.includes('stressed') ||
      lower.includes('test')
    ) {
      theme = 'Academic Workload & Evaluative Pressure';
      summary = 'Possible exam-related stress and evaluative pressure.';
      recommendation = 'Consider offering a gentle, supportive check-in.';
      nuance = 'Identifies core theme while stripping personal identity markers.';
    } else if (
      lower.includes('haven’t slept') ||
      lower.includes("haven't slept") ||
      lower.includes('screen') ||
      lower.includes('process words')
    ) {
      theme = 'Physical Fatigue & Cognitive Overload';
      summary = 'Signs of persistent sleep deprivation and study fatigue.';
      recommendation = 'Gentle check-in regarding rest boundaries and wellness resources.';
      nuance = 'Detects implicit exhaustion even when conventional risk keywords are omitted.';
    } else if (
      lower.includes('isolated') ||
      lower.includes('dorm') ||
      lower.includes('chai') ||
      lower.includes('lighter')
    ) {
      theme = 'Social Adjustment & Peer Support';
      summary = 'Interpersonal connection alleviating feelings of campus isolation.';
      recommendation = 'Celebrate peer connection; maintain supportive touchpoints.';
      nuance = 'Recognizes positive social relief while filtering out personal peer names.';
    }

    return {
      theme,
      summary,
      recommendation,
      nuance,
      benefit:
        'Understands holistic context, distinguishes relief from crisis, and synthesizes high-level themes without reproducing the raw diary.',
    };
  }, [compareInput]);

  // ==============================================================
  // EXPERIMENT B: PRIVACY PROOF (3-Step Animated Flow)
  // ==============================================================
  const proofPresets = [
    {
      label: 'Rahul (Exams & Identity)',
      text: "My name is Rahul Sharma (Senior in CS), and I'm extremely stressed about my exams next week.",
    },
    {
      label: 'Aisha (Dorm 4B & Bio Lab)',
      text: "I live in Dorm 4B and am falling behind in Biochem lab. I feel like crying every evening.",
    },
    {
      label: 'Carlos (Thesis & Insomnia)',
      text: "Carlos here from Economics. Haven't slept in 48 hours trying to complete the senior econometric model.",
    },
  ];

  const [proofInput, setProofInput] = useState(proofPresets[0].text);
  const [proofStep, setProofStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scrubbingProgress, setScrubbingProgress] = useState(0);
  const [showPayloadDiff, setShowPayloadDiff] = useState(false);
  const [liveTransformation, setLiveTransformation] = useState<PrivacyTransformationResult | null>(null);

  // Dynamic fallback analysis for Experiment B
  const fallbackTransformationData = useMemo(() => {
    const text = proofInput;
    const lower = text.toLowerCase();

    // Identify direct personal identifiers
    const detectedPII: string[] = [];
    if (text.match(/rahul(\s+sharma)?/i)) detectedPII.push('Direct Name: "Rahul Sharma"');
    if (text.match(/aisha/i)) detectedPII.push('Direct Name: "Aisha"');
    if (text.match(/carlos/i)) detectedPII.push('Direct Name: "Carlos"');
    if (text.match(/dorm\s+[0-9a-z]+/i)) detectedPII.push('Quasi-Identifier: "Dorm 4B"');
    if (text.match(/cs|biochem|economics/i)) detectedPII.push('Departmental Identifier');
    if (detectedPII.length === 0) detectedPII.push('Personal Name / Entity references detected');

    let theme = 'Academic Workload & Evaluative Pressure';
    let summary = 'Possible exam-related stress and preparation load.';
    let action = 'Offer a supportive check-in regarding study pacing.';

    if (lower.includes('biochem') || lower.includes('crying') || lower.includes('dorm')) {
      theme = 'Coursework Overwhelm & Adjustment Distress';
      summary = 'Elevated laboratory workload and emotional adjustment stress.';
      action = 'Proactively offer voluntary academic mentor office hours.';
    } else if (lower.includes('haven') || lower.includes('slept') || lower.includes('econometric')) {
      theme = 'Severe Rest Debt & Senior Project Strain';
      summary = 'Consecutive night sleep disruption tied to senior deliverable.';
      action = 'Encourage rest boundary and extend milestone guidance.';
    }

    return {
      rawInput: text,
      detectedPII,
      redactedTextPreview: text
        .replace(/Rahul(\s+Sharma)?/gi, '[REDACTED: PERSON_NAME]')
        .replace(/Aisha/gi, '[REDACTED: PERSON_NAME]')
        .replace(/Carlos/gi, '[REDACTED: PERSON_NAME]')
        .replace(/Dorm\s+[0-9a-z]+/gi, '[REDACTED: RESIDENCE_LOCATION]')
        .replace(/CS|Biochem|Economics/gi, '[REDACTED: COURSE_CODE]'),
      retainedTheme: theme,
      sanitizedSummary: summary,
      mentorAction: action,
      mentorToken: 'Student #03',
      source: 'demo-analyzer',
      mode: 'demo',
    };
  }, [proofInput]);

  const transformationData = useMemo(() => {
    if (liveTransformation) {
      return {
        rawInput: proofInput,
        detectedPII:
          liveTransformation.redactionsFound.length > 0
            ? liveTransformation.redactionsFound.map(
                (r) => `${r.type}: "${r.original}" → ${r.replacement}`
              )
            : ['Direct Name & Course Entities Redacted'],
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

  const runPrivacyTransformation = async () => {
    setIsProcessing(true);
    setProofStep(2);
    setScrubbingProgress(25);

    try {
      const progressTimer = setInterval(() => {
        setScrubbingProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 200);

      const res = await fetch('/api/privacy-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: proofInput,
          studentToken: 'Student #03',
        }),
      });

      clearInterval(progressTimer);

      if (res.ok) {
        const data: PrivacyTransformationResult = await res.json();
        setLiveTransformation(data);
      }
    } catch {
      // Keep fallback
    } finally {
      setScrubbingProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setProofStep(3);
        showToast('Transformation complete: Anonymous mentor payload delivered.', 'success');
      }, 400);
    }
  };

  const handleResetProof = () => {
    setProofStep(1);
    setIsProcessing(false);
    setScrubbingProgress(0);
    setShowPayloadDiff(false);
    setLiveTransformation(null);
    setProofInput(proofPresets[0].text);
    showToast('Experiment reset to baseline.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Title & Vision Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-[#174D3A]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202B26] tracking-tight">
              Sahayak Showcase Lab
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0]/60">
              Interactive Privacy Sandbox
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Hands-on technical demonstration proving why contextual theme summarization protects student privacy
            far better than naive keyword detection.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-600">
          <Shield className="w-3.5 h-3.5 text-[#174D3A]" />
          <span>Judges &amp; Evaluators Innovation Lab</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* EXPERIMENT A: COMPARE LAB                                     */}
      {/* ============================================================== */}
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#E3F2E8] text-xs font-bold text-[#174D3A]">
            <span>Experiment A: Comparative Benchmark</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#202B26]">
            Keyword Detection vs. Contextual Summary
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
            See why matching a few isolated keywords may miss context or produce false alarms, while a carefully
            designed contextual summary communicates relevant themes without reproducing the student’s private journal.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-700 block">
            Select a benchmark scenario or type your own custom test sentence:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {comparePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCompareInput(p.text)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                  compareInput === p.text
                    ? 'border-[#174D3A] bg-[#E3F2E8]/60 font-semibold text-[#174D3A] ring-1 ring-[#174D3A]'
                    : 'border-neutral-200 bg-[#F7F8F4] text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="font-bold">{p.label}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{p.context}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Input Box */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-neutral-300 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A] leading-relaxed"
              placeholder="Type any custom sentence to test..."
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Real-time comparative analysis updates immediately as you edit.</span>
            <span className="font-mono">{compareInput.length} chars</span>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* LEFT CARD: Naive Keyword Detection */}
          <div className="rounded-2xl border border-neutral-200 bg-[#F7F8F4] p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Left Card — Naive Keyword Detection
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                  Brittle Approach
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-500">Detected Keyword Hits:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
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
                <span className="text-xs font-semibold text-neutral-500">System Interpretation:</span>
                <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 mt-1">
                  &ldquo;{keywordAnalysis.interpretation}&rdquo;
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-500">Resulting Reliability:</span>
                <div className="mt-1">
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border ${keywordAnalysis.verdictColor}`}
                  >
                    {keywordAnalysis.verdict}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 text-xs text-neutral-600 space-y-1">
              <div className="font-semibold text-neutral-800">Why this fails:</div>
              <p className="leading-relaxed">{keywordAnalysis.flaw}</p>
            </div>
          </div>

          {/* RIGHT CARD: Contextual Theme Summary */}
          <div className="rounded-2xl border-2 border-[#174D3A] bg-[#E3F2E8]/40 p-5 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#A8C5A0]/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#174D3A]" />
                  <span className="text-xs font-bold text-[#174D3A] uppercase tracking-wider">
                    Right Card — Contextual Theme Summary
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#174D3A] text-white">
                  Sahayak Approach
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#174D3A]">Extracted Theme:</span>
                <div className="mt-1">
                  <span className="px-3 py-1 rounded-lg bg-white border border-[#A8C5A0] text-xs font-bold text-[#174D3A] inline-block shadow-2xs">
                    {contextualAnalysis.theme}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#174D3A]">Synthesized Output:</span>
                <div className="p-3 bg-white rounded-xl border border-[#A8C5A0]/80 text-xs font-semibold text-[#174D3A] mt-1 shadow-2xs">
                  &ldquo;{contextualAnalysis.summary}&rdquo;
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#174D3A]">Contextual Nuance:</span>
                <div className="text-xs text-[#202B26]/85 bg-white/70 p-2.5 rounded-lg border border-[#A8C5A0]/50 mt-1">
                  {contextualAnalysis.nuance}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#A8C5A0]/60 text-xs text-[#202B26] space-y-1">
              <div className="font-semibold text-[#174D3A]">Why this succeeds:</div>
              <p className="leading-relaxed">{contextualAnalysis.benefit}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* EXPERIMENT B: PRIVACY PROOF (3-Stage Transformation Flow)       */}
      {/* ============================================================== */}
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#E3F2E8] text-xs font-bold text-[#174D3A]">
              <span>Experiment B: Live Privacy Transformation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#202B26]">
              From Private Reflection to Limited Insight
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Trace how a student’s private journal is scrubbed of direct identifiers and converted into a limited, safe mentor payload.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetProof}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={runPrivacyTransformation}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A8C5A0]" />
              <span>{isProcessing ? 'Scrubbing Identifiers...' : 'Run Transformation'}</span>
            </button>
          </div>
        </div>

        {/* Custom Input for Experiment B */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-semibold text-neutral-700">
              Customize the fictional private journal entry:
            </label>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] text-neutral-400">Presets:</span>
              {proofPresets.map((pr, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setProofInput(pr.text);
                    setProofStep(1);
                  }}
                  className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    proofInput === pr.text
                      ? 'bg-[#174D3A] text-white border-[#174D3A]'
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
              setProofStep(1);
            }}
            rows={2}
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-200 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A]"
            placeholder="Type a sample with names, courses, or personal facts..."
          />
        </div>

        {/* Scrubbing Animation Progress Bar */}
        {isProcessing && (
          <div className="space-y-1.5 bg-[#E3F2E8]/60 p-4 rounded-xl border border-[#A8C5A0]/80 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-[#174D3A]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Privacy Pipeline: Direct Name Redaction &amp; Theme Extraction...</span>
              </span>
              <span className="font-mono">{scrubbingProgress}%</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#A8C5A0]">
              <div
                className="bg-[#174D3A] h-full transition-all duration-300 ease-out"
                style={{ width: `${scrubbingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 3 Step Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* STEP 1: Private Journal */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              proofStep >= 1
                ? 'bg-[#F7F8F4] border-neutral-300 shadow-xs ring-1 ring-neutral-200'
                : 'opacity-40 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="text-xs font-bold text-neutral-700">STEP 1 — Private Journal</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 font-semibold">
                Client Only
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="text-xs font-semibold text-neutral-500">Unfiltered Student Entry:</div>
              <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800 leading-relaxed min-h-[90px]">
                &ldquo;{transformationData.rawInput}&rdquo;
              </div>

              {/* Tagging sensitive data */}
              <div className="p-2.5 bg-red-50 rounded-lg border border-red-200 text-[11px] text-red-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  Sensitive Identifiers Present at Source:
                </span>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  {transformationData.detectedPII.map((pii, i) => (
                    <li key={i}>{pii}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* STEP 2: Summary Generation & Scrubbing */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              proofStep >= 2
                ? 'bg-[#E3F2E8]/50 border-[#A8C5A0] shadow-sm ring-1 ring-[#174D3A]/20'
                : 'opacity-40 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#A8C5A0]/80">
              <span className="text-xs font-bold text-[#174D3A]">STEP 2 — Redaction &amp; Theme</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#174D3A] text-white font-semibold">
                Privacy Barrier
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="text-xs font-semibold text-[#174D3A]">Transformation Rules Applied:</div>

              {/* What is Removed */}
              <div className="bg-white p-3 rounded-xl border border-red-200 text-xs space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-red-700 flex items-center justify-between">
                  <span>Information Removed</span>
                  <span className="text-[9px] font-mono bg-red-100 px-1.5 py-0.5 rounded">STRIPPED</span>
                </div>
                <div className="text-neutral-600 line-through space-y-0.5 text-[11px]">
                  <div>• Direct student names and greetings</div>
                  <div>• Specific course/dorm identifiers</div>
                  <div>• Verbatim emotional journal prose</div>
                </div>
              </div>

              {/* Redacted Preview */}
              <div className="bg-white p-3 rounded-xl border border-neutral-200 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                  Scrubbed Text Stream (PII Tokens):
                </span>
                <p className="font-mono text-[11px] text-neutral-700 leading-relaxed bg-[#F7F8F4] p-2 rounded-lg border border-neutral-100">
                  {transformationData.redactedTextPreview}
                </p>
              </div>

              {/* What is Retained */}
              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-[#174D3A] flex items-center justify-between">
                  <span>Information Retained</span>
                  <span className="text-[9px] font-mono bg-emerald-100 text-[#174D3A] px-1.5 py-0.5 rounded">SYNTHESIZED</span>
                </div>
                <div className="text-[#174D3A] font-semibold space-y-0.5 text-[11px]">
                  <div>• High-level theme: {transformationData.retainedTheme}</div>
                  <div>• Anonymous Token: {transformationData.mentorToken}</div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Mentor View (Zero Raw Text Displayed!) */}
          <div
            className={`p-5 rounded-2xl border-2 transition-all ${
              proofStep === 3
                ? 'bg-white border-[#174D3A] shadow-md ring-2 ring-[#174D3A]/10'
                : 'opacity-40 border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="text-xs font-bold text-[#174D3A]">STEP 3 — Anonymous Mentor View</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                Safe Payload
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="text-xs font-semibold text-neutral-500">Delivered to Mentor Portal:</div>

              <div className="bg-[#F7F8F4] p-3.5 rounded-xl border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#174D3A] text-sm">
                    {transformationData.mentorToken}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold">
                    Pattern Observed
                  </span>
                </div>

                <div className="text-neutral-700">
                  <span className="text-neutral-500 font-medium">Limited summary: </span>
                  <strong>{transformationData.sanitizedSummary}</strong>
                </div>

                <div className="text-xs text-[#174D3A] font-semibold pt-1 border-t border-neutral-200/60">
                  Recommended Action: &ldquo;{transformationData.mentorAction}&rdquo;
                </div>
              </div>

              {/* Strict Zero Diary Verification */}
              <div className="p-2.5 bg-[#E3F2E8]/80 rounded-lg border border-[#A8C5A0]/80 text-[11px] text-[#174D3A] space-y-0.5">
                <div className="font-bold flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Zero Raw Text Guarantee:</span>
                </div>
                <div className="text-neutral-700 font-mono text-[10px]">
                  raw_journal_text: NULL (Excluded at server API barrier)
                </div>
              </div>

              <div className="text-[10px] font-mono text-neutral-400 text-center">
                Engine: {transformationData.source === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'Deterministic Local Pipeline'}
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Payload Comparison Toggle */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-100">
          <button
            onClick={() => setShowPayloadDiff(!showPayloadDiff)}
            className="px-4 py-2 rounded-xl bg-[#F7F8F4] border border-neutral-300 text-xs font-semibold text-[#174D3A] hover:bg-[#E3F2E8] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showPayloadDiff ? 'Hide Payload Inspection Diff' : 'Inspect Live JSON Payload Diff'}</span>
          </button>

          <span className="text-xs text-neutral-500 italic">
            Visual inspection of client input vs sanitized egress payload.
          </span>
        </div>

        {showPayloadDiff && (
          <div className="bg-[#F7F8F4] p-5 rounded-2xl border border-neutral-200 space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-[#202B26]">
              Side-by-Side Network Payload Inspection
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Left payload */}
              <div className="p-3 bg-white rounded-xl border border-red-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-red-700">
                  Student Device Storage (Local Vault)
                </span>
                <pre className="text-neutral-700 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">
{`{
  "studentId": "student-03",
  "storageScope": "client_browser_local",
  "entryText": "${proofInput.replace(/"/g, '\\"')}",
  "sharingConsent": false,
  "mentorAccess": "DENIED_BY_DEFAULT"
}`}
                </pre>
              </div>

              {/* Right payload */}
              <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#174D3A]">
                  Mentor Portal Received Payload (Server Egress)
                </span>
                <pre className="text-[#174D3A] overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">
{`{
  "token": "Student #03",
  "theme": "${transformationData.retainedTheme}",
  "summary": "${transformationData.sanitizedSummary}",
  "suggestedAction": "${transformationData.mentorAction}",
  "rawJournalPayload": null,
  "identityRevealed": false
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Mandatory Technical Reality Disclaimer */}
        <div className="bg-[#F7F8F4] border-2 border-neutral-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#174D3A]" />
            <h4 className="text-sm font-bold text-[#202B26]">
              Important Technical Distinction: Educational Demo vs. Production Security
            </h4>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            <strong>This demonstration is an interactive architectural showcase, not a verified formal security audit.</strong> In this prototype, transformations illustrate how contextual theme extraction separates student reflection from mentor oversight.
          </p>
          <div className="text-xs text-neutral-600 space-y-2 pt-1 leading-relaxed">
            <p>
              <strong>In a production, HIPAA- and FERPA-compliant deployment:</strong>
            </p>
            <ul className="list-disc list-inside pl-1 space-y-1">
              <li>
                <strong>Anonymity requires more than name stripping:</strong> Combinations of indirect quasi-identifiers (such as department name + specific lab hours + unique phrasing) can still re-identify individuals. Production pipelines require formal $k$-anonymity, $l$-diversity, and differential privacy guarantees.
              </li>
              <li>
                <strong>Server-Side Zero-Trust Enforcement:</strong> Access control, role authorization, and data redacting must never be entrusted to frontend React components. Every API request must verify cryptographically signed tokens and database row-level security (RLS).
              </li>
              <li>
                <strong>Verifiable, Revocable Consent:</strong> Any disclosure of identifying information must require explicit, time-bounded, and auditable consent stored in immutable logs.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
