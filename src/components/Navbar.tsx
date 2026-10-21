import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppPage, AppRole } from '../types';
import {
  Menu,
  X,
  Compass,
  Sparkles,
  ShieldCheck,
  User,
  Users,
  BookOpen,
  Bell,
  RefreshCw,
  FlaskConical,
  HeartHandshake,
  MessageCircle,
  Database,
} from 'lucide-react';

export const LOGO_PATH = '/assets/aistudio/WhatsApp_Image_2026-10-20_at_3.19.43_PM_415b6f35.jpeg';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentPage,
    setCurrentPage,
    activeStudent,
    setGuidedDemoStep,
    resetDemoData,
    firebaseStatus,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navItems: { page: AppPage; label: string; icon: React.ReactNode }[] = [
    { page: 'student-dashboard', label: 'Student Space', icon: <User className="w-4 h-4" /> },
    { page: 'ai-companion', label: 'AI Companion', icon: <MessageCircle className="w-4 h-4" /> },
    { page: 'journalling', label: 'AI Journal', icon: <BookOpen className="w-4 h-4" /> },
    { page: 'mentor-dashboard', label: 'Mentor Portal', icon: <Users className="w-4 h-4" /> },
    { page: 'showcase-lab', label: 'Showcase Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { page: 'auth-roles', label: 'Auth & Roles', icon: <Sparkles className="w-4 h-4" /> },
    { page: 'privacy-safety', label: 'Privacy & Safety', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: AppPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleRoleSelect = (newRole: AppRole) => {
    setRole(newRole);
    if (newRole === 'mentor') {
      setCurrentPage('mentor-dashboard');
    } else {
      setCurrentPage('student-dashboard');
    }
    setShowRoleMenu(false);
  };

  const unreadCount = activeStudent.unreadMessagesCount;

  return (
    <header className="sticky top-0 z-40 bg-[#F7F8F4]/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark with Uploaded Logo, links directly back to Home */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#174D3A] rounded-xl p-1 -ml-1 transition-transform active:scale-98"
            title="Return to Sahayak Home"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#A8C5A0]/80 shadow-xs group-hover:border-[#174D3A] transition-colors shrink-0 bg-white">
              <img
                src={LOGO_PATH}
                alt="Sahayak Lotus Leaf Emblem"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#174D3A] font-sans">
                  SAHAYAK
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0]/50 tracking-wider">
                  PROTOTYPE
                </span>
              </div>
              <span className="text-[11px] text-[#202B26]/70 hidden sm:block -mt-1 font-medium">
                Safe Space for Student Feelings
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#174D3A] text-white shadow-xs'
                      : 'text-[#202B26]/80 hover:text-[#174D3A] hover:bg-[#E3F2E8]/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions - Guided Tour, Role Switcher, Reset Demo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Firebase Cloud Firestore status badge */}
            <div
              className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${
                firebaseStatus.isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200'
              }`}
              title={
                firebaseStatus.isConfigured
                  ? `Firebase Firestore active (Project: ${firebaseStatus.projectId})`
                  : 'Local offline dataset active'
              }
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>{firebaseStatus.isConfigured ? 'Firestore' : 'Local Demo'}</span>
            </div>

            {/* Guided Demo Tour Button (Hackathon Highlight) */}
            <button
              onClick={() => {
                setGuidedDemoStep(1);
                setCurrentPage('student-dashboard');
              }}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0] hover:bg-[#A8C5A0]/30 transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap active:scale-97 cursor-pointer"
              title="Launch guided interactive hackathon walkthrough"
            >
              <Compass className="w-4 h-4 text-[#174D3A] shrink-0" />
              <span className="hidden md:inline">Start Guided Demo</span>
              <span className="md:hidden">Demo Tour</span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="px-2.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-white border border-neutral-300 text-[#202B26] hover:border-[#174D3A] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Switch demo role between Student and Mentor"
              >
                {role === 'student' ? (
                  <User className="w-3.5 h-3.5 text-[#174D3A]" />
                ) : (
                  <HeartHandshake className="w-3.5 h-3.5 text-[#174D3A]" />
                )}
                <span className="font-semibold capitalize text-[#174D3A]">{role}</span>
                <span className="text-[10px] text-[#202B26]/60 hidden sm:inline">(Demo)</span>
              </button>

              {/* Direct Quick Reset Button for Judges */}
              <button
                onClick={resetDemoData}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-[#174D3A] hover:border-[#174D3A] transition-all cursor-pointer ml-2"
                title="Reset all demo records back to baseline"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                <span>Reset Demo</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-neutral-100 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Demo Role Switcher
                  </div>
                  <button
                    onClick={() => handleRoleSelect('student')}
                    className={`w-full px-3 py-2 text-left text-xs sm:text-sm flex items-center gap-2 hover:bg-[#F7F8F4] transition-colors ${
                      role === 'student' ? 'font-bold text-[#174D3A] bg-[#E3F2E8]/40' : 'text-[#202B26]'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#174D3A]" />
                    <div>
                      <div className="font-semibold">Student View (Alex)</div>
                      <div className="text-[11px] text-[#202B26]/60">Private journal & check-ins</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('mentor')}
                    className={`w-full px-3 py-2 text-left text-xs sm:text-sm flex items-center gap-2 hover:bg-[#F7F8F4] transition-colors ${
                      role === 'mentor' ? 'font-bold text-[#174D3A] bg-[#E3F2E8]/40' : 'text-[#202B26]'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4 text-[#174D3A]" />
                    <div>
                      <div className="font-semibold">Mentor View (Counselor)</div>
                      <div className="text-[11px] text-[#202B26]/60">Anonymous trends & support</div>
                    </div>
                  </button>
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setShowRoleMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-neutral-600 hover:text-[#174D3A] flex items-center gap-2 hover:bg-[#F7F8F4]"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Reset Demo Dataset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell (Simulated) */}
            <button
              onClick={() => {
                if (role === 'student') {
                  setCurrentPage('student-dashboard');
                } else {
                  setCurrentPage('mentor-dashboard');
                }
              }}
              className="relative p-2 rounded-lg text-[#202B26]/80 hover:text-[#174D3A] hover:bg-neutral-100/80 transition-colors cursor-pointer"
              title="Recent Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D97706]" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#202B26] hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-[#F7F8F4] px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#174D3A] text-white'
                    : 'text-[#202B26] hover:bg-[#E3F2E8]/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-neutral-200/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setGuidedDemoStep(1);
                setCurrentPage('student-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-[#E3F2E8] text-[#174D3A] font-semibold text-sm flex items-center justify-center gap-2 border border-[#A8C5A0]"
            >
              <Compass className="w-4 h-4" />
              <span>Launch Guided Demo Tour</span>
            </button>

            <button
              onClick={() => {
                resetDemoData();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-600 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
