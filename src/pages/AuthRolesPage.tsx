import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppRole } from '../types';
import {
  KeyRound,
  ShieldCheck,
  User,
  Users,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  RefreshCw,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const AuthRolesPage: React.FC = () => {
  const { role, setRole, setCurrentPage, showToast, activeStudent } = useApp();

  const [selectedPersona, setSelectedPersona] = useState<AppRole>(role);

  const personas = [
    {
      role: 'student' as AppRole,
      title: 'Alex Sharma',
      badge: 'Student Persona',
      subtitle: 'Senior (4th Year), Design & Computing',
      email: 'alex.sharma@campus.edu',
      id: 'student-03',
      icon: <User className="w-5 h-5 text-[#174D3A]" />,
      description: 'Private journaling, 14-day mood tracking, growth tree cultivation, and receiving mentor messages without exposing raw diaries.',
      targetPage: 'student-dashboard' as const,
      permissions: [
        'Read & write private personal journal',
        'Log daily mood check-ins & view personal 14d graph',
        'Grant or revoke identity sharing consent for mentors',
        'Receive and reply to supportive mentor check-in notes',
      ],
      restricted: [
        'Cannot view other students’ journals or check-ins',
        'Cannot view mentor aggregate cohort dashboard',
      ],
    },
    {
      role: 'mentor' as AppRole,
      title: 'Dr. Meera Rao',
      badge: 'Campus Mentor Persona',
      subtitle: 'Campus Wellbeing & Academic Mentor',
      email: 'meera.rao@campus.edu',
      id: 'mentor-01',
      icon: <Users className="w-5 h-5 text-[#174D3A]" />,
      description: 'Cohort pattern monitoring, reviewing privacy-filtered theme summaries, and sending supportive outreach to anonymous tokens.',
      targetPage: 'mentor-dashboard' as const,
      permissions: [
        'View anonymous student directory (Student #01 to #05)',
        'Monitor cohort stability & pattern change indicators',
        'Read privacy-scrubbed summaries (e.g. Academic Workload)',
        'Compose and send proactive supportive check-in notes',
      ],
      restricted: [
        'Strictly blocked from reading raw student journal diaries',
        'Cannot see student real names unless explicit consent is granted',
      ],
    },
  ];

  const handleSwitchPersona = (targetRole: AppRole, targetPage: 'student-dashboard' | 'mentor-dashboard') => {
    setRole(targetRole);
    setSelectedPersona(targetRole);
    showToast(`Authenticated as ${targetRole === 'student' ? 'Alex Sharma (Student)' : 'Dr. Meera Rao (Mentor)'}`, 'success');
    setCurrentPage(targetPage);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-[#174D3A]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202B26] tracking-tight">
              Authentication &amp; Role Selection
            </h1>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Explore how role-based access control (RBAC) separates student privacy boundaries from mentor care tools.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E3F2E8] border border-[#A8C5A0]/80 rounded-xl text-xs font-semibold text-[#174D3A]">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Role: <span className="capitalize">{role}</span></span>
        </div>
      </div>

      {/* Persona Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {personas.map((persona) => {
          const isActive = role === persona.role;
          return (
            <div
              key={persona.role}
              className={`bg-white rounded-2xl border-2 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6 transition-all ${
                isActive
                  ? 'border-[#174D3A] ring-2 ring-[#174D3A]/10 shadow-md'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
                      {persona.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#202B26]">{persona.title}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F7F8F4] text-[#174D3A] border border-[#A8C5A0]/50">
                          {persona.badge}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500">{persona.subtitle}</div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#174D3A] text-white">
                      Active Session
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {persona.description}
                </p>

                {/* Simulated Credentials */}
                <div className="bg-[#F7F8F4] p-3 rounded-xl border border-neutral-200/80 text-xs font-mono space-y-1 text-neutral-700">
                  <div><strong>Email:</strong> {persona.email}</div>
                  <div><strong>Token:</strong> demo-jwt-{persona.id}</div>
                  <div><strong>Access Tier:</strong> {persona.role.toUpperCase()}_VOLUNTARY_WELLNESS</div>
                </div>

                {/* Permissions Breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Permitted Capabilities:
                  </div>
                  <ul className="space-y-1.5">
                    {persona.permissions.map((p, idx) => (
                      <li key={idx} className="text-xs text-neutral-600 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#174D3A] shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider pt-2">
                    Enforced Boundary Restrictions:
                  </div>
                  <ul className="space-y-1.5">
                    {persona.restricted.map((r, idx) => (
                      <li key={idx} className="text-xs text-neutral-500 flex items-start gap-2">
                        <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSwitchPersona(persona.role, persona.targetPage)}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#174D3A] text-white hover:bg-[#113A2C]'
                    : 'bg-[#F7F8F4] text-[#174D3A] border border-[#A8C5A0] hover:bg-[#E3F2E8]'
                }`}
              >
                <span>{isActive ? 'Continue in this Session' : `Switch to ${persona.title}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Production Security vs Demo Mode Reality Notice */}
      <div className="bg-[#F7F8F4] border border-neutral-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#174D3A]" />
          <h4 className="text-sm font-bold text-[#202B26]">
            Architectural Security Notice: Client Role Switching vs Production Zero-Trust
          </h4>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          In this educational prototype, the role selector operates client-side to allow hackathon judges
          to quickly evaluate both student and mentor perspectives.
        </p>
        <p className="text-xs text-neutral-600 leading-relaxed">
          <strong>In a production release:</strong>
          <br />
          1. Roles are validated exclusively on the backend via cryptographically signed JWTs or Firebase/Google Workspace OAuth sessions.
          <br />
          2. Database rules (e.g. Firestore security rules or SQL Row-Level Security) ensure mentors can never execute queries requesting raw journal text.
          <br />
          3. Client-side attempts to switch roles without valid server credentials are rejected with HTTP 403 Forbidden.
        </p>
      </div>
    </div>
  );
};
