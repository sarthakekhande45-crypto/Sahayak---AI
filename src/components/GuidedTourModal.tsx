import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Lock,
  User,
  Users,
  BookOpen,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react';

export const GuidedTourModal: React.FC = () => {
  const { guidedDemoStep, setGuidedDemoStep, setCurrentPage, setRole } = useApp();

  if (guidedDemoStep === 0) return null;

  const steps = [
    {
      step: 1,
      title: 'Step 1: Student Mood Check-In',
      role: 'student' as const,
      targetPage: 'student-dashboard' as const,
      icon: <User className="w-5 h-5 text-[#174D3A]" />,
      summary: 'Experience how students log their feelings without clinical pressure.',
      actionPrompt: 'Pick a mood (e.g., "Okay" or "Low"), select emotions like "Stressed" or "Hopeful", and click "Save Mood Check-In". Watch the wellness graph and Growth Tree update in real-time!',
    },
    {
      step: 2,
      title: 'Step 2: Private AI Journalling & Reflection',
      role: 'student' as const,
      targetPage: 'journalling' as const,
      icon: <BookOpen className="w-5 h-5 text-[#174D3A]" />,
      summary: 'Express thoughts in a private local space without exposing entries to mentors.',
      actionPrompt: 'Use a prompt or write a thought, then click "Analyze Reflection". See how the system extracts high-level themes (like Academic Workload) while leaving the raw text private to the student.',
    },
    {
      step: 3,
      title: 'Step 3: Mentor Overview & Anonymous Discovery',
      role: 'mentor' as const,
      targetPage: 'mentor-dashboard' as const,
      icon: <Users className="w-5 h-5 text-[#174D3A]" />,
      summary: 'Observe how mentors monitor student cohorts without seeing identities or raw journals.',
      actionPrompt: 'Locate "Student #03" in the anonymous directory. Notice the "Pattern changed" status based on recent self-reported trends. Click Student #03 to open their privacy-filtered drawer.',
    },
    {
      step: 4,
      title: 'Step 4: Sending Non-Intrusive Mentor Support',
      role: 'mentor' as const,
      targetPage: 'mentor-dashboard' as const,
      icon: <CheckCircle2 className="w-5 h-5 text-[#174D3A]" />,
      summary: 'Proactively reach out with warmth, respecting the student’s agency.',
      actionPrompt: 'Inside Student #03 drawer, type a supportive message (or use the prefilled sample) and click "Send Supportive Note". The student receives it instantly on their dashboard without sharing their diary.',
    },
    {
      step: 5,
      title: 'Step 5: Showcase Lab (Compare & Privacy Proof)',
      role: 'student' as const,
      targetPage: 'showcase-lab' as const,
      icon: <FlaskConical className="w-5 h-5 text-[#174D3A]" />,
      summary: 'Interactive experiments proving why contextual theme extraction beats naive keyword matching.',
      actionPrompt: 'Run Experiment A (Keyword vs Contextual Summary), then step through Experiment B (Privacy Proof) to see the 3-stage transformation from private reflection to limited mentor insight.',
    },
    {
      step: 6,
      title: 'Step 6: Production Privacy vs Prototype Architecture',
      role: 'student' as const,
      targetPage: 'privacy-safety' as const,
      icon: <ShieldCheck className="w-5 h-5 text-[#174D3A]" />,
      summary: 'Understanding the honest technical boundary between this prototype and a HIPAA/FERPA compliant system.',
      actionPrompt: 'Review the technical architecture, zero-trust backend enforcement requirements, consent lifecycle, and campus emergency crisis helplines.',
    },
  ];

  const current = steps[guidedDemoStep - 1] || steps[0];

  const handleNext = () => {
    if (guidedDemoStep < steps.length) {
      const nextStep = guidedDemoStep + 1;
      const target = steps[nextStep - 1];
      setRole(target.role);
      setCurrentPage(target.targetPage);
      setGuidedDemoStep(nextStep);
    } else {
      setGuidedDemoStep(0);
    }
  };

  const handlePrev = () => {
    if (guidedDemoStep > 1) {
      const prevStep = guidedDemoStep - 1;
      const target = steps[prevStep - 1];
      setRole(target.role);
      setCurrentPage(target.targetPage);
      setGuidedDemoStep(prevStep);
    }
  };

  const handleJump = (stepNum: number) => {
    const target = steps[stepNum - 1];
    setRole(target.role);
    setCurrentPage(target.targetPage);
    setGuidedDemoStep(stepNum);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] bg-white rounded-2xl border-2 border-[#174D3A] shadow-2xl p-5 animate-in slide-in-from-bottom-5 duration-300">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E3F2E8] flex items-center justify-center">
            {current.icon}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#174D3A]">
              Guided Hackathon Tour · {guidedDemoStep} of {steps.length}
            </div>
            <h4 className="text-sm font-bold text-[#202B26]">{current.title}</h4>
          </div>
        </div>
        <button
          onClick={() => setGuidedDemoStep(0)}
          className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Exit Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Pills */}
      <div className="flex items-center gap-1.5 py-3">
        {steps.map((s) => (
          <button
            key={s.step}
            onClick={() => handleJump(s.step)}
            className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
              s.step === guidedDemoStep
                ? 'bg-[#174D3A]'
                : s.step < guidedDemoStep
                ? 'bg-[#A8C5A0]'
                : 'bg-neutral-200'
            }`}
            title={`Jump to ${s.title}`}
          />
        ))}
      </div>

      {/* Body info */}
      <div className="space-y-2 mb-4">
        <p className="text-xs text-neutral-600 font-medium leading-relaxed">
          {current.summary}
        </p>
        <div className="p-2.5 bg-[#F7F8F4] rounded-xl border border-neutral-200/80 text-xs text-[#202B26] leading-relaxed">
          <span className="font-semibold text-[#174D3A]">Suggested Action: </span>
          {current.actionPrompt}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={handlePrev}
          disabled={guidedDemoStep === 1}
          className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGuidedDemoStep(0)}
            className="px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-800"
          >
            End Tour
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-lg bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>{guidedDemoStep === steps.length ? 'Finish' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
