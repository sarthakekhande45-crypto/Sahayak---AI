import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';

import logoImg from '../assets/images/regenerated_image_1792605230673.jpg';

export const LOGO_PATH = logoImg;

interface NavItem {
  page: AppPage;
  label: string;
  icon: React.ReactNode;
}

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
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setShowRoleMenu(false);
        setShowMoreMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Body scroll locking when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Primary 6 navigation links for Row 2 (Desktop) and Mobile Drawer
  const mainNavItems: NavItem[] = [
    { page: 'student-dashboard', label: 'Student Space', icon: <User className="w-4 h-4 shrink-0" /> },
    { page: 'ai-companion', label: 'AI Companion', icon: <MessageCircle className="w-4 h-4 shrink-0" /> },
    { page: 'journalling', label: 'AI Journal', icon: <BookOpen className="w-4 h-4 shrink-0" /> },
    { page: 'mentor-dashboard', label: 'Mentor Portal', icon: <Users className="w-4 h-4 shrink-0" /> },
    { page: 'showcase-lab', label: 'Showcase Lab', icon: <FlaskConical className="w-4 h-4 shrink-0" /> },
    { page: 'privacy-safety', label: 'Privacy & Safety', icon: <ShieldCheck className="w-4 h-4 shrink-0" /> },
  ];

  // Secondary destinations accessible via More dropdown
  const secondaryNavItems: NavItem[] = [
    { page: 'auth-roles', label: 'Auth & Roles', icon: <Sparkles className="w-4 h-4 shrink-0" /> },
  ];

  // All destinations for complete mobile navigation
  const allNavDestinations = [...mainNavItems, ...secondaryNavItems];

  // Bottom navigation items (Mobile)
  const bottomNavItems = [
    { page: 'student-dashboard' as AppPage, label: 'Student', icon: <User className="w-5 h-5" /> },
    { page: 'ai-companion' as AppPage, label: 'Companion', icon: <MessageCircle className="w-5 h-5" /> },
    { page: 'journalling' as AppPage, label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
    { page: 'mentor-dashboard' as AppPage, label: 'Mentor', icon: <Users className="w-5 h-5" /> },
  ];

  const isMoreActive = secondaryNavItems.some((item) => item.page === currentPage);
  const activeMoreItem = secondaryNavItems.find((item) => item.page === currentPage);
  const isBottomMoreActive = ['showcase-lab', 'auth-roles', 'privacy-safety'].includes(currentPage);

  const handleNavClick = (page: AppPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setShowMoreMenu(false);
  };

  const handleRoleSelect = (newRole: AppRole) => {
    setRole(newRole);
    if (newRole === 'mentor') {
      setCurrentPage('mentor-dashboard');
    } else {
      setCurrentPage('student-dashboard');
    }
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
  };

  const unreadCount = activeStudent.unreadMessagesCount;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F7F8F4]/98 backdrop-blur-md border-b border-neutral-200 shadow-2xs w-full min-w-0">
        
        {/* ========================================================= */}
        {/* ROW 1: Brand Wordmark (Left) & User Actions (Right)       */}
        {/* ========================================================= */}
        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3 min-w-0">
            
            {/* Brand Identity with Logo and Prototype Badge */}
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#174D3A] rounded-xl py-1 transition-transform active:scale-98 shrink-0 cursor-pointer"
              title="Return to Sahayak Home"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#A8C5A0]/80 shadow-xs group-hover:border-[#174D3A] transition-colors shrink-0 bg-white">
                <img
                  src={LOGO_PATH}
                  alt="Sahayak Lotus Leaf Emblem"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#174D3A] font-sans">
                    SAHAYAK
                  </span>
                  <span className="hidden min-[480px]:inline-block text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0]/60 tracking-wider">
                    PROTOTYPE
                  </span>
                </div>
                <span className="text-[11px] text-[#202B26]/70 hidden sm:block font-medium">
                  Safe Space for Student Feelings
                </span>
              </div>
            </button>

            {/* User Selector, Notifications, and Compact Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              
              {/* Quick Demo Tour Launch Trigger (visible on sm+) */}
              <button
                onClick={() => {
                  setGuidedDemoStep(1);
                  setCurrentPage('student-dashboard');
                }}
                className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0] hover:bg-[#A8C5A0]/30 transition-all items-center gap-1.5 shadow-2xs whitespace-nowrap active:scale-97 cursor-pointer"
                title="Launch guided interactive hackathon walkthrough"
              >
                <Compass className="w-3.5 h-3.5 text-[#174D3A] shrink-0" />
                <span>Start Guide</span>
              </button>

              {/* User Selector & Demo Role Dropdown */}
              <div className="relative shrink-0" ref={roleMenuRef}>
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white border border-neutral-300 text-[#202B26] hover:border-[#174D3A] transition-all flex items-center gap-1 sm:gap-1.5 shadow-2xs cursor-pointer min-h-[36px]"
                  title="Switch demo role between Student and Mentor"
                  aria-expanded={showRoleMenu}
                >
                  {role === 'student' ? (
                    <User className="w-3.5 h-3.5 text-[#174D3A] shrink-0" />
                  ) : (
                    <HeartHandshake className="w-3.5 h-3.5 text-[#174D3A] shrink-0" />
                  )}
                  <span className="capitalize text-[#174D3A] font-bold">{role}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-neutral-100 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Demo Role Switcher
                    </div>
                    <button
                      onClick={() => handleRoleSelect('student')}
                      className={`w-full px-3 py-2 text-left text-xs sm:text-sm flex items-center gap-2 hover:bg-[#F7F8F4] transition-colors cursor-pointer ${
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
                      className={`w-full px-3 py-2 text-left text-xs sm:text-sm flex items-center gap-2 hover:bg-[#F7F8F4] transition-colors cursor-pointer ${
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
                        className="w-full px-3 py-1.5 text-left text-xs text-neutral-600 hover:text-[#174D3A] flex items-center gap-2 hover:bg-[#F7F8F4] cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Reset Demo Dataset</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <button
                onClick={() => setCurrentPage(role === 'student' ? 'student-dashboard' : 'mentor-dashboard')}
                className="relative p-1.5 sm:p-2 rounded-lg text-[#202B26]/80 hover:text-[#174D3A] hover:bg-neutral-100 transition-colors cursor-pointer min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center shrink-0"
                title="Recent Notifications"
                aria-label="View recent notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D97706]" />
                )}
              </button>

              {/* Bold, Accessible Mobile Menu Toggle Button (visible on < md) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-[#174D3A] text-white hover:bg-[#123E2F] transition-all min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer active:scale-95 shrink-0 shadow-2xs"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[2.2]" />}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 2: Dedicated Responsive Main Navigation Bar (md+)     */}
        {/* ========================================================= */}
        <div className="hidden md:block border-t border-neutral-200/80 bg-white/60">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
            <div className="flex items-center justify-between gap-2 min-w-0">
              
              {/* 6 Main Navigation Links */}
              <nav className="flex items-center flex-wrap gap-1 sm:gap-1.5 lg:gap-2 min-w-0">
                {mainNavItems.map((item) => {
                  const isActive = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleNavClick(item.page)}
                      className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-[#174D3A] text-white shadow-2xs'
                          : 'text-[#202B26]/85 hover:text-[#174D3A] hover:bg-[#E3F2E8]/70'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Secondary Controls via "More" Dropdown */}
              <div className="relative shrink-0 ml-auto" ref={moreMenuRef}>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isMoreActive
                      ? 'bg-[#174D3A] text-white border-[#174D3A] shadow-2xs'
                      : 'bg-white border-neutral-200 text-[#202B26]/85 hover:text-[#174D3A] hover:border-[#A8C5A0] hover:bg-[#E3F2E8]/40'
                  }`}
                  aria-expanded={showMoreMenu}
                  title="Secondary tools, Firebase status, and guide"
                >
                  <span>{isMoreActive && activeMoreItem ? activeMoreItem.label : 'More'}</span>
                  {isMoreActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A8C5A0]" />
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`} />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 pb-1.5 border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Secondary &amp; Developer Controls
                    </div>

                    {/* Start Guide Walkthrough */}
                    <button
                      onClick={() => {
                        setGuidedDemoStep(1);
                        setCurrentPage('student-dashboard');
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2.5 hover:bg-[#E3F2E8]/60 text-[#174D3A] transition-colors cursor-pointer"
                    >
                      <Compass className="w-4 h-4 text-[#174D3A] shrink-0" />
                      <div>
                        <div className="font-semibold text-xs">Start Guide</div>
                        <div className="text-[11px] text-neutral-500">Interactive hackathon walkthrough</div>
                      </div>
                    </button>

                    {/* Auth & Roles */}
                    <button
                      onClick={() => {
                        handleNavClick('auth-roles');
                        setShowMoreMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2.5 hover:bg-[#F7F8F4] transition-colors cursor-pointer ${
                        currentPage === 'auth-roles' ? 'bg-[#E3F2E8]/50 font-bold text-[#174D3A]' : 'text-[#202B26]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <div className="font-semibold text-xs">Auth &amp; Roles</div>
                        <div className="text-[11px] text-neutral-500">RBAC, student tokens &amp; security rules</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE DRAWER MODAL & OVERLAY: Accessible via Hamburger   */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-in fade-in duration-200">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-out Drawer Container */}
          <div
            className="relative w-full max-w-[320px] sm:max-w-xs bg-[#F7F8F4] h-full shadow-2xl flex flex-col z-50 border-l border-neutral-300 animate-in slide-in-from-right duration-250"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-neutral-200/90 flex items-center justify-between bg-white/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#A8C5A0]/80 p-0.5 bg-white">
                  <img src={LOGO_PATH} alt="Sahayak" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="font-extrabold text-[#174D3A] text-sm tracking-tight">SAHAYAK MENU</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-[#174D3A]" />
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Role Switcher Card inside Drawer */}
              <div className="bg-white p-3 rounded-xl border border-neutral-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-bold uppercase tracking-wider">
                  <span>Current Demo Persona:</span>
                  <span className="capitalize text-[#174D3A] font-extrabold">{role} View</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('student')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      role === 'student'
                        ? 'bg-[#174D3A] text-white shadow-xs'
                        : 'bg-[#F7F8F4] border border-neutral-200 text-[#202B26] hover:bg-neutral-100'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('mentor')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      role === 'mentor'
                        ? 'bg-[#174D3A] text-white shadow-xs'
                        : 'bg-[#F7F8F4] border border-neutral-200 text-[#202B26] hover:bg-neutral-100'
                    }`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Mentor</span>
                  </button>
                </div>
              </div>

              {/* Complete Navigation Destinations List */}
              <div className="space-y-1">
                <div className="px-2 pb-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Navigation Destinations
                </div>
                {allNavDestinations.map((item) => {
                  const isActive = currentPage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleNavClick(item.page)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                        isActive
                          ? 'bg-[#174D3A] text-white shadow-xs'
                          : 'text-[#202B26] hover:bg-[#E3F2E8]/70 active:bg-[#E3F2E8]'
                      }`}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#174D3A]'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions & Walkthrough */}
              <div className="pt-2 border-t border-neutral-200/80 space-y-2">
                <button
                  onClick={() => {
                    setGuidedDemoStep(1);
                    setCurrentPage('student-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#E3F2E8] text-[#174D3A] font-bold text-xs flex items-center justify-center gap-2 border border-[#A8C5A0] shadow-xs cursor-pointer active:scale-98 min-h-[42px]"
                >
                  <Compass className="w-4 h-4 text-[#174D3A]" />
                  <span>Launch Guided Demo Tour</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR: Compact 5-tab quick bar    */}
      {/* ========================================================= */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F8F4]/98 backdrop-blur-md border-t border-neutral-200/90 shadow-lg px-1 py-1 flex items-center justify-around safe-area-pb"
        aria-label="Mobile Bottom Navigation"
      >
        {bottomNavItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors cursor-pointer min-h-[46px] ${
                isActive
                  ? 'text-[#174D3A] font-bold'
                  : 'text-neutral-500 hover:text-[#174D3A]'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-[#E3F2E8]' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] leading-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* 5th Tab: "More" button toggles full mobile drawer */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors cursor-pointer min-h-[46px] ${
            isBottomMoreActive || mobileMenuOpen
              ? 'text-[#174D3A] font-bold'
              : 'text-neutral-500 hover:text-[#174D3A]'
          }`}
          aria-label="Open More Destinations"
        >
          <div className={`p-1 rounded-lg transition-all ${isBottomMoreActive || mobileMenuOpen ? 'bg-[#E3F2E8]' : ''}`}>
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
