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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Header */}
      <div className="space-y-2 pb-4 border-b border-neutral-200/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#174D3A]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202B26] tracking-tight">
            Privacy Charter &amp; Safety Guidelines
          </h1>
        </div>
        <p className="text-sm text-neutral-600 max-w-2xl">
          Sahayak is built on transparent disclosure, data minimization, and student dignity.
          Learn how your data is handled and where to access crisis support.
        </p>
      </div>

      {/* Emergency & Crisis Support Banner (Mandatory Requirement) */}
      <section className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h2 className="text-lg font-bold text-red-900">
              Immediate Safety &amp; Crisis Support
            </h2>
            <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
              <strong>Sahayak is an educational prototype, not an emergency hotline, psychiatric crisis service, or clinical medical provider.</strong>{' '}
              If you or someone around you is experiencing acute emotional crisis, thoughts of self-harm, or severe distress, please connect with professional emergency support right now.
            </p>
          </div>
        </div>

        {/* Global & Regional Emergency Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-xl border border-red-200 space-y-1">
            <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>India Helplines</span>
            </div>
            <div className="text-sm font-bold text-[#174D3A]">Tele-MANAS: 14416</div>
            <div className="text-xs text-neutral-600">KIRAN: 1800-599-0019 (24/7 Toll-Free)</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-red-200 space-y-1">
            <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>US &amp; Canada</span>
            </div>
            <div className="text-sm font-bold text-[#174D3A]">Dial or Text: 988</div>
            <div className="text-xs text-neutral-600">Suicide &amp; Crisis Lifeline (24/7 Free)</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-red-200 space-y-1">
            <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>UK &amp; International</span>
            </div>
            <div className="text-sm font-bold text-[#174D3A]">NHS: 111 / Shout: 85258</div>
            <div className="text-xs text-neutral-600">Emergency: 999 or 112</div>
          </div>
        </div>
      </section>

      {/* Core Privacy Pillars */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#202B26]">Our Core Privacy Principles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#202B26]">Private Journaling by Default</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every word written in your journal is stored locally on your device within your browser.
              Mentor dashboards never receive raw journal text, sentences, or personal diary files.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#202B26]">Anonymous Cohort Views</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Mentors only see anonymous identifiers (e.g. Student #03) and high-level extracted themes
              (such as &ldquo;Academic Workload&rdquo;), giving them enough context to offer support without prying.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#202B26]">Revocable Informed Consent</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              A student’s real name is never unmasked unless they explicitly opt in to share it with
              a specific mentor. Consent can be revoked at any time with immediate effect.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#202B26]">Transparent AI Processing</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Whenever reflection summaries are generated, the engine discloses whether Google Gemini
              or a local deterministic simulator was used. No text is used for training without consent.
            </p>
          </div>
        </div>
      </section>

      {/* Production vs Prototype Reality Check */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-[#202B26]">
          Prototype Honesty &amp; Production Roadmap
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Because this is an educational prototype built for hackathons, we explicitly disclose current implementation boundaries:
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-semibold">
                <th className="py-2.5 px-3">Dimension</th>
                <th className="py-2.5 px-3">Current Prototype Demo</th>
                <th className="py-2.5 px-3">Required Production Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">Journal Storage</td>
                <td className="py-2.5 px-3">Browser localStorage (plain JSON)</td>
                <td className="py-2.5 px-3 text-[#174D3A]">Zero-knowledge client-side encrypted vault</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">Role Enforcement</td>
                <td className="py-2.5 px-3">Client-side role toggle (for evaluation)</td>
                <td className="py-2.5 px-3 text-[#174D3A]">Server-side JWT / OAuth RBAC with row-level security</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">Anonymization</td>
                <td className="py-2.5 px-3">Name removal &amp; token mapping</td>
                <td className="py-2.5 px-3 text-[#174D3A]">k-Anonymity &amp; differential privacy sanitization</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-neutral-900">AI Summarization</td>
                <td className="py-2.5 px-3">Server proxy (Gemini 3.8 Flash / Local)</td>
                <td className="py-2.5 px-3 text-[#174D3A]">HIPAA/FERPA-compliant private LLM enclave</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* User Data Management Controls */}
      <section className="bg-[#F7F8F4] p-6 rounded-2xl border border-neutral-200 space-y-4">
        <h2 className="text-lg font-bold text-[#202B26]">Your Data Management Controls</h2>
        <p className="text-xs text-neutral-600 leading-relaxed">
          You maintain full autonomy over your simulated demo records. Use these controls at any time:
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => {
              clearJournalHistory();
              showToast('Journal history deleted from this browser.', 'info');
            }}
            className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-neutral-700 hover:text-red-700 hover:border-red-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Journal Entries</span>
          </button>

          <button
            onClick={() => {
              resetDemoData();
              showToast('Demo dataset restored to initial state.', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-[#174D3A] hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Entire Demo State</span>
          </button>
        </div>
      </section>
    </div>
  );
};
