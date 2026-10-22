import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  PhoneCall,
  Heart,
  EyeOff,
  UserCheck,
  Server,
  Database,
  Trash2,
  RefreshCw,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export const PrivacySafetyPage: React.FC = () => {
  const { resetDemoData, clearJournalHistory, showToast } = useApp();

  const comparisonData = [
    {
      dimension: 'Journal Storage',
      prototype: 'Browser localStorage (plain JSON)',
      production: 'Zero-knowledge client-side encrypted vault',
    },
    {
      dimension: 'Role Enforcement',
      prototype: 'Client-side role toggle (for evaluation)',
      production: 'Server-side JWT / OAuth RBAC with row-level security',
    },
    {
      dimension: 'Anonymization',
      prototype: 'Name removal & token mapping',
      production: 'k-Anonymity & differential privacy sanitization',
    },
    {
      dimension: 'AI Summarization',
      prototype: 'Server proxy (Gemini 3.8 Flash / Local)',
      production: 'HIPAA/FERPA-compliant private LLM enclave',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
      {/* Top Header */}
      <div className="space-y-2 pb-4 border-b border-neutral-200/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#174D3A] shrink-0" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#202B26] tracking-tight break-words">
            Privacy Charter &amp; Safety Guidelines
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
          Sahayak is built on transparent disclosure, data minimization, and student dignity.
          Learn how your data is handled and where to access crisis support.
        </p>
      </div>

      {/* Emergency & Crisis Support Banner (Mandatory Requirement) */}
      <section className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 w-full min-w-0">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-red-900 break-words">
              Immediate Safety &amp; Crisis Support
            </h2>
            <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
              <strong>Sahayak is an educational prototype, not an emergency hotline, psychiatric crisis service, or clinical medical provider.</strong>{' '}
              If you or someone around you is experiencing acute emotional crisis, thoughts of self-harm, or severe distress, please connect with professional emergency support right now.
            </p>
          </div>
        </div>

        {/* Global & Regional Emergency Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-2">
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-red-200 space-y-1.5 min-w-0 shadow-2xs">
            <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>India Helplines</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#174D3A] break-words">
              Tele-MANAS: 14416
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-600 break-words">
              KIRAN: 1800-599-0019 (24/7 Toll-Free)
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-red-200 space-y-1.5 min-w-0 shadow-2xs">
            <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>US &amp; Canada</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#174D3A] break-words">
              Dial or Text: 988
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-600 break-words">
              Suicide &amp; Crisis Lifeline (24/7 Free)
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-red-200 space-y-1.5 min-w-0 sm:col-span-2 lg:col-span-1 shadow-2xs">
            <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>UK &amp; International</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#174D3A] break-words">
              NHS: 111 / Shout: 85258
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-600 break-words">
              Emergency: 999 or 112
            </div>
          </div>
        </div>
      </section>

      {/* Core Privacy Pillars */}
      <section className="space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#202B26]">Our Core Privacy Principles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#202B26]">Private Journaling by Default</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every word written in your journal is stored locally on your device within your browser.
              Mentor dashboards never receive raw journal text, sentences, or personal diary files.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#202B26]">Anonymous Cohort Views</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Mentors only see anonymous identifiers (e.g. Student #03) and high-level extracted themes
              (such as &ldquo;Academic Workload&rdquo;), giving them enough context to offer support without prying.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#202B26]">Revocable Informed Consent</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              A student’s real name is never unmasked unless they explicitly opt in to share it with
              a specific mentor. Consent can be revoked at any time with immediate effect.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#202B26]">Transparent AI Processing</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Whenever reflection summaries are generated, the engine discloses whether Google Gemini
              or a local deterministic simulator was used. No text is used for training without consent.
            </p>
          </div>
        </div>
      </section>

      {/* Production vs Prototype Reality Check */}
      <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#202B26]">
          Prototype Honesty &amp; Production Roadmap
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Because this is an educational prototype built for hackathons, we explicitly disclose current implementation boundaries:
        </p>

        {/* Mobile-Friendly Cards View (Phones: < 768px) */}
        <div className="block md:hidden space-y-3 pt-1">
          {comparisonData.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#F7F8F4] rounded-xl border border-neutral-200/90 space-y-2 text-xs"
            >
              <div className="font-bold text-neutral-900 border-b border-neutral-200/70 pb-1 flex items-center justify-between">
                <span>{item.dimension}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 text-neutral-600">
                  #{idx + 1}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-neutral-500 uppercase">Current Prototype:</div>
                <div className="text-neutral-800 bg-white p-2 rounded-lg border border-neutral-200">
                  {item.prototype}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-[#174D3A] uppercase">Production Standard:</div>
                <div className="text-[#174D3A] bg-[#E3F2E8]/60 p-2 rounded-lg border border-[#A8C5A0]/60 font-medium">
                  {item.production}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Standard Table View (Tablets & Desktops: >= 768px) */}
        <div className="hidden md:block overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-semibold">
                <th className="py-2.5 px-3">Dimension</th>
                <th className="py-2.5 px-3">Current Prototype Demo</th>
                <th className="py-2.5 px-3">Required Production Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {comparisonData.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">{row.dimension}</td>
                  <td className="py-2.5 px-3">{row.prototype}</td>
                  <td className="py-2.5 px-3 text-[#174D3A] font-medium">{row.production}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Data Management Controls */}
      <section className="bg-[#F7F8F4] p-4 sm:p-6 rounded-2xl border border-neutral-200 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#202B26]">Your Data Management Controls</h2>
        <p className="text-xs text-neutral-600 leading-relaxed">
          You maintain full autonomy over your simulated demo records. Use these controls at any time:
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
          <button
            onClick={() => {
              clearJournalHistory();
              showToast('Journal history deleted from this browser.', 'info');
            }}
            className="px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-neutral-700 hover:text-red-700 hover:border-red-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Journal Entries</span>
          </button>

          <button
            onClick={() => {
              resetDemoData();
              showToast('Demo dataset restored to initial state.', 'success');
            }}
            className="px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-[#174D3A] hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Entire Demo State</span>
          </button>
        </div>
      </section>
    </div>
  );
};
