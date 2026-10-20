import React from 'react';
import { useApp } from '../context/AppContext';
import { LOGO_PATH } from '../components/Navbar';
import {
  Shield,
  Heart,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Lock,
  EyeOff,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Compass,
  Smile,
  Leaf,
  Layers,
  MessageSquare,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, setRole, setGuidedDemoStep } = useApp();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12">
        {/* Soft background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#E3F2E8]/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Vision & Pitch */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F2E8] border border-[#A8C5A0]/80 text-[#174D3A] text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5 text-[#174D3A]" />
                <span>Privacy-First College Wellness Initiative</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#174D3A] tracking-tight leading-[1.12] text-balance">
                Your feelings deserve a safe space.
              </h1>

              <p className="text-lg sm:text-xl text-[#202B26]/85 leading-relaxed max-w-2xl">
                Understand your emotional patterns, reflect without judgment, and connect with
                supportive mentors — while keeping your private journal private.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setRole('student');
                    setCurrentPage('student-dashboard');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-[#174D3A] text-white font-semibold text-sm hover:bg-[#113A2C] transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer active:scale-98"
                >
                  <span>Explore Student Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage('showcase-lab')}
                  className="px-6 py-3.5 rounded-xl bg-white border border-[#A8C5A0] text-[#174D3A] font-semibold text-sm hover:bg-[#E3F2E8]/50 transition-all flex items-center gap-2 shadow-2xs cursor-pointer active:scale-98"
                >
                  <Lock className="w-4 h-4 text-[#174D3A]" />
                  <span>See How Privacy Works</span>
                </button>

                <button
                  onClick={() => {
                    setGuidedDemoStep(1);
                    setCurrentPage('student-dashboard');
                  }}
                  className="px-4 py-3.5 rounded-xl text-xs font-semibold text-[#174D3A] hover:bg-[#E3F2E8]/40 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Guided Tour (Judges)</span>
                </button>
              </div>

              {/* 3 Short Core Benefits */}
              <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#E3F2E8] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#174D3A]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#202B26]">Reflect freely</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Raw diary never sent to mentors.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#E3F2E8] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#174D3A]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#202B26]">Understand patterns</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Drift detection across 14-day history.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#E3F2E8] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#174D3A]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#202B26]">Get timely support</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Mentors send care notes anonymously.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Medallion & Emotional Growth Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Decorative border card */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-lg space-y-5 relative">
                  {/* Prominent Sahayak Lotus Emblem */}
                  <div className="flex items-center justify-center pt-2">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-[#174D3A]/20 shadow-md p-1 bg-gradient-to-b from-[#E3F2E8] to-white">
                        <img
                          src={LOGO_PATH}
                          alt="Sahayak Lotus Leaf Emblem"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#174D3A] text-white p-2 rounded-full shadow-md">
                        <Leaf className="w-4 h-4 text-[#A8C5A0]" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-[#174D3A]">Sahayak Wellness Node</h3>
                    <p className="text-xs text-[#202B26]/70">
                      Emotional Growth without Identity Exposure
                    </p>
                  </div>

                  {/* Micro Preview of Emotional Transformation */}
                  <div className="space-y-2.5 pt-2">
                    <div className="p-3 bg-[#F7F8F4] rounded-xl border border-neutral-200/60 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-medium">Student Private Side</span>
                      <span className="font-semibold text-[#174D3A] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#174D3A]" />
                        100% Encrypted Diary
                      </span>
                    </div>

                    <div className="flex justify-center text-neutral-400">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#A8C5A0]">
                        Privacy Transformation Barrier
                      </span>
                    </div>

                    <div className="p-3 bg-[#E3F2E8]/60 rounded-xl border border-[#A8C5A0]/60 flex items-center justify-between text-xs">
                      <span className="text-neutral-600 font-medium">Mentor View</span>
                      <span className="font-semibold text-[#174D3A] flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        Anonymous Cohort Pulse
                      </span>
                    </div>
                  </div>

                  {/* Gentle Educational Disclaimer */}
                  <div className="text-[11px] text-neutral-500 text-center leading-normal border-t border-neutral-100 pt-3">
                    Educational prototype · Estimates only · Not a medical diagnostic tool
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#174D3A]">
            Core Lifecycle
          </span>
          <h2 className="text-3xl font-extrabold text-[#202B26] tracking-tight">
            How Sahayak Works
          </h2>
          <p className="text-sm text-neutral-600">
            A three-step cycle crafted specifically for students navigating academic pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-4 hover:border-[#174D3A]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A] font-bold text-lg">
              01
            </div>
            <h3 className="text-xl font-bold text-[#202B26]">Express</h3>
            <p className="text-sm text-[#202B26]/80 leading-relaxed">
              Write privately about your day, deadlines, and feelings. No filters or fear of being
              judged by professors or peers.
            </p>
            <div className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
              Entries remain strictly on your client device.
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-4 hover:border-[#174D3A]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A] font-bold text-lg">
              02
            </div>
            <h3 className="text-xl font-bold text-[#202B26]">Understand</h3>
            <p className="text-sm text-[#202B26]/80 leading-relaxed">
              Explore possible mood and stress patterns. The interactive graph highlights gradual
              shifts without alarming alarms.
            </p>
            <div className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
              Self-reported metrics, not psychological diagnoses.
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-4 hover:border-[#174D3A]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A] font-bold text-lg">
              03
            </div>
            <h3 className="text-xl font-bold text-[#202B26]">Connect</h3>
            <p className="text-sm text-[#202B26]/80 leading-relaxed">
              Receive supportive check-in messages from designated mentors who notice cohort trends,
              without them ever reading your diary.
            </p>
            <div className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
              Identity remains anonymous by default.
            </div>
          </div>
        </div>
      </section>

      {/* Privacy-First Feature Showcase */}
      <section className="bg-white border-y border-neutral-200/80 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#174D3A]">
                Privacy Architecture
              </span>
              <h2 className="text-3xl font-extrabold text-[#202B26] tracking-tight">
                Designed to minimize unnecessary disclosure
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Most mental health portals force students to choose between suffering in silence or
                surrendering their personal diaries to administrative staff. Sahayak bridges this gap
                using contextual theme summarization.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E3F2E8] flex items-center justify-center text-[#174D3A] shrink-0 mt-0.5">
                    <Shield className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#202B26]">No Automatic Journal Sharing</h4>
                    <p className="text-xs text-neutral-500">Mentors only ever see high-level themes, never personal entries.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E3F2E8] flex items-center justify-center text-[#174D3A] shrink-0 mt-0.5">
                    <UserCheck className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#202B26]">Anonymous by Default</h4>
                    <p className="text-xs text-neutral-500">Mentors work with anonymous tokens (e.g., Student #03) until consent is granted.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E3F2E8] flex items-center justify-center text-[#174D3A] shrink-0 mt-0.5">
                    <Lock className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#202B26]">Transparent AI Processing</h4>
                    <p className="text-xs text-neutral-500">Full disclosure whenever external APIs are invoked versus local deterministic analysis.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setCurrentPage('privacy-safety')}
                  className="text-xs font-bold text-[#174D3A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read our complete Privacy & Safety Charter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Showcase Preview Banner */}
            <div className="lg:col-span-6 bg-[#F7F8F4] rounded-2xl p-6 border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <span className="text-xs font-bold text-[#174D3A]">Showcase Experiment Preview</span>
                <span className="text-[11px] font-mono text-neutral-500">Demo Transformation</span>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Student Private Entry (Input)
                  </div>
                  <p className="text-xs font-mono text-neutral-700 bg-neutral-50 p-2 rounded">
                    &quot;My name is Rahul, and I am extremely stressed about my exams.&quot;
                  </p>
                </div>

                <div className="flex items-center justify-center text-[#174D3A] text-xs font-bold gap-2">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                  <span>Identifier Scrubbing &amp; Theme Extraction</span>
                </div>

                <div className="bg-[#E3F2E8]/80 p-3.5 rounded-xl border border-[#A8C5A0]/80">
                  <div className="text-[10px] font-bold text-[#174D3A] uppercase tracking-wider mb-1">
                    Mentor Visible Insight (Output)
                  </div>
                  <p className="text-xs font-semibold text-[#174D3A]">
                    Student #03 · Possible exam-related stress (Academic workload)
                  </p>
                  <p className="text-[11px] text-[#202B26]/70 mt-1">
                    Recommended action: Consider offering a supportive check-in.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('showcase-lab')}
                className="w-full py-2.5 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Interactive Showcase Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Previews Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-[#202B26]">Explore Platform Surfaces</h2>
          <p className="text-xs text-neutral-600">
            Switch seamlessly between student reflection spaces and mentor cohort overviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Student Dashboard */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
                <Smile className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202B26]">Student Space</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Log daily check-ins, view your 14-day mood graph, pattern insights, and nurture your personal Growth Tree.
              </p>
            </div>
            <button
              onClick={() => {
                setRole('student');
                setCurrentPage('student-dashboard');
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#F7F8F4] border border-neutral-200 text-xs font-semibold text-[#174D3A] hover:bg-[#E3F2E8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Student Space</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: AI Companion */}
          <div className="bg-white rounded-2xl p-5 border border-[#A8C5A0]/80 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#E3F2E8] text-[#174D3A] text-[10px] font-bold border border-[#A8C5A0]/60">
              New
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#174D3A] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202B26]">AI Companion</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Chat empathetically with our Gemini-powered wellness partner, practice somatic box breathing, and reframe worries.
              </p>
            </div>
            <button
              onClick={() => {
                setRole('student');
                setCurrentPage('ai-companion');
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#123E2F] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Talk to Companion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Mentor Dashboard */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202B26]">Mentor Portal</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Review anonymous cohort trends, read student-approved summaries, and send supportive notes without prying into diaries.
              </p>
            </div>
            <button
              onClick={() => {
                setRole('mentor');
                setCurrentPage('mentor-dashboard');
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#F7F8F4] border border-neutral-200 text-xs font-semibold text-[#174D3A] hover:bg-[#E3F2E8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Mentor Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Showcase Lab */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202B26]">Showcase Lab</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Interactive tri-panel experiments comparing keyword detection against Gemini contextual intelligence and privacy redaction.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('showcase-lab')}
              className="w-full py-2 px-3 rounded-lg bg-[#F7F8F4] border border-neutral-200 text-xs font-semibold text-[#174D3A] hover:bg-[#E3F2E8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Showcase Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-neutral-200/80">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-300">
              <img src={LOGO_PATH} alt="Sahayak Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#174D3A]">SAHAYAK</span>
              <p className="text-[11px] text-neutral-500">
                AI-Powered Mental Wellness Platform · College Hackathon Prototype
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 font-medium">
            <button onClick={() => setCurrentPage('privacy-safety')} className="hover:text-[#174D3A]">
              About &amp; Privacy Charter
            </button>
            <button onClick={() => setCurrentPage('privacy-safety')} className="hover:text-[#174D3A]">
              Crisis Support &amp; Helplines
            </button>
            <button onClick={() => setCurrentPage('showcase-lab')} className="hover:text-[#174D3A]">
              Interactive Lab
            </button>
            <button
              onClick={() => {
                setGuidedDemoStep(1);
                setCurrentPage('student-dashboard');
              }}
              className="text-[#174D3A] font-bold hover:underline"
            >
              Demo Tour
            </button>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-neutral-200 text-[11px] text-neutral-500 leading-relaxed text-center">
          <strong>Important Educational Prototype Notice:</strong> Sahayak is built for demonstration
          and hackathon research. Mood insights and theme summaries are statistical estimates and do
          not constitute psychological or psychiatric diagnosis, therapy, or emergency crisis care. If you or
          someone you know is in immediate distress, please call local emergency helplines immediately.
        </div>
      </footer>
    </div>
  );
};
