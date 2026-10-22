/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { GuidedTourModal } from './components/GuidedTourModal';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { MentorDashboard } from './pages/MentorDashboard';
import { AIJournalling } from './pages/AIJournalling';
import { AICompanion } from './pages/AICompanion';
import { ShowcaseLab } from './pages/ShowcaseLab';
import { PrivacySafetyPage } from './pages/PrivacySafetyPage';
import { AuthRolesPage } from './pages/AuthRolesPage';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, toasts } = useApp();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F7F8F4] text-[#202B26] flex flex-col font-sans selection:bg-[#A8C5A0]/30 selection:text-[#174D3A]">
      {/* Top Navigation Bar with Uploaded Logo */}
      <Navbar />

      {/* Main Viewport Content with mobile bottom padding to prevent overlap */}
      <main className="flex-1 w-full overflow-x-hidden min-w-0 pb-20 md:pb-0">
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'student-dashboard' && <StudentDashboard />}
        {currentPage === 'mentor-dashboard' && <MentorDashboard />}
        {currentPage === 'ai-companion' && <AICompanion />}
        {currentPage === 'journalling' && <AIJournalling />}
        {currentPage === 'showcase-lab' && <ShowcaseLab />}
        {currentPage === 'auth-roles' && <AuthRolesPage />}
        {currentPage === 'privacy-safety' && <PrivacySafetyPage />}
      </main>

      {/* Interactive Guided Demo Modal for Judges */}
      <GuidedTourModal />

      {/* Toast Notification Stack positioned safely above bottom nav */}
      <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:right-auto sm:left-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-left duration-200 ${
              toast.type === 'success'
                ? 'bg-white border-[#A8C5A0] text-[#174D3A]'
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-white border-neutral-300 text-[#202B26]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[#174D3A] shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#174D3A] shrink-0" />}
            <span className="break-words">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
