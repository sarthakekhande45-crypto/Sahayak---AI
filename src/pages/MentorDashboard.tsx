import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile, PatternStatus } from '../types';
import {
  Users,
  Heart,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Send,
  X,
  Lock,
  EyeOff,
  UserCheck,
  Shield,
  HelpCircle,
  Info,
  Calendar,
  Search,
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const {
    students,
    mentorMessages,
    sendMentorMessage,
    toggleIdentitySharing,
    wellnessSummaries,
    moodHistory,
  } = useApp();

  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | PatternStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [composeMessageText, setComposeMessageText] = useState(
    "Hi! Just checking in as midterm deadlines approach. How have things been going for you lately? My office door is open if you'd like to grab a quiet tea or chat."
  );
  const [sendingMessage, setSendingMessage] = useState(false);

  // Computed metrics
  const totalStudents = students.length;
  const recentCheckInsCount = students.filter((s) => s.activitySummary.includes('check-in')).length;
  const mayBenefitCount = students.filter(
    (s) => s.patternStatus === 'changed' || s.patternStatus === 'checkin_helpful'
  ).length;
  const unreadMentorMessagesCount = students.reduce(
    (acc, curr) => acc + curr.unreadMessagesCount,
    0
  );

  const filteredStudents = students.filter((s) => {
    const matchesFilter = filterStatus === 'all' || s.patternStatus === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      s.anonymousId.toLowerCase().includes(query) ||
      s.limitedSummary.toLowerCase().includes(query) ||
      s.recentTrend.toLowerCase().includes(query) ||
      (s.identitySharingConsent && s.displayName.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const handleOpenDrawer = (student: StudentProfile) => {
    setSelectedStudent(student);
  };

  const handleCloseDrawer = () => {
    setSelectedStudent(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !composeMessageText.trim()) return;

    setSendingMessage(true);
    setTimeout(() => {
      sendMentorMessage(selectedStudent.id, composeMessageText.trim());
      setSendingMessage(false);
      // Close drawer or keep open to see message history
    }, 400);
  };

  const getStatusBadge = (status: PatternStatus) => {
    switch (status) {
      case 'stable':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Stable pattern
          </span>
        );
      case 'changed':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-[#D97706]" />
            Pattern changed
          </span>
        );
      case 'checkin_helpful':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            Check-in may be helpful
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#202B26] tracking-tight">
              Student Wellbeing Overview
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E3F2E8] text-[#174D3A] border border-[#A8C5A0]/60">
              Mentor Portal (Demo)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Understand patterns. Offer support. Respect privacy.
          </p>
        </div>

        {/* Privacy Guard Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E3F2E8]/60 border border-[#A8C5A0]/80 rounded-xl text-xs text-[#174D3A] self-start md:self-auto">
          <EyeOff className="w-4 h-4 shrink-0" />
          <span className="truncate">Zero Diary Access · Only Themes &amp; Tokens</span>
        </div>
      </div>

      {/* Section A: Overview Metric Cards */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Demo Students */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs space-y-2 min-w-0">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Total Demo Cohort</span>
            <Users className="w-4 h-4 text-[#174D3A]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#202B26] font-mono tabular-nums">
            {totalStudents}
          </div>
          <div className="text-xs text-neutral-500 truncate">
            Sample undergraduate cohort
          </div>
        </div>

        {/* Metric 2: Recent Check-ins */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs space-y-2 min-w-0">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Recent Check-Ins</span>
            <Calendar className="w-4 h-4 text-[#174D3A]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#202B26] font-mono tabular-nums">
            {recentCheckInsCount}
          </div>
          <div className="text-xs text-neutral-500 truncate">
            Voluntary student submissions
          </div>
        </div>

        {/* Metric 3: May Benefit From Check-In */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs space-y-2 min-w-0">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Support Check-In Helpful</span>
            <Heart className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#D97706] font-mono tabular-nums">
            {mayBenefitCount}
          </div>
          <div className="text-xs text-neutral-500 truncate">
            Based on self-reported shifts
          </div>
        </div>

        {/* Metric 4: Unread Mentor Messages */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs space-y-2 min-w-0">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Unread Support Notes</span>
            <MessageSquare className="w-4 h-4 text-[#174D3A]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#202B26] font-mono tabular-nums">
            {unreadMentorMessagesCount}
          </div>
          <div className="text-xs text-neutral-500 truncate">
            Delivered to student dashboards
          </div>
        </div>
      </div>

      {/* Section B: Anonymous Student Directory */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-6 shadow-xs space-y-5 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-neutral-100">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#174D3A] uppercase">
              Cohort Directory
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#202B26] mt-0.5">
              Anonymous Student Profiles
            </h2>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search token (e.g. #03)..."
                className="text-xs pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-[#F7F8F4] focus:bg-white focus:outline-none focus:border-[#174D3A] w-full sm:w-44 min-h-[38px]"
              />
            </div>

            {/* Filter Segmented Control */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F7F8F4] rounded-lg border border-neutral-200">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[36px] flex items-center ${
                  filterStatus === 'all'
                    ? 'bg-white text-[#174D3A] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setFilterStatus('changed')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[36px] flex items-center ${
                  filterStatus === 'changed'
                    ? 'bg-white text-[#174D3A] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Changed Pattern
              </button>
              <button
                onClick={() => setFilterStatus('checkin_helpful')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[36px] flex items-center ${
                  filterStatus === 'checkin_helpful'
                    ? 'bg-white text-[#174D3A] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Support Suggested
              </button>
              <button
                onClick={() => setFilterStatus('stable')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer min-h-[36px] flex items-center ${
                  filterStatus === 'stable'
                    ? 'bg-white text-[#174D3A] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Stable
              </button>
            </div>
          </div>
        </div>

        {/* Directory Cards & Empty State */}
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs space-y-3 bg-[#F7F8F4] rounded-2xl border border-neutral-200">
              <Users className="w-8 h-8 text-[#A8C5A0] mx-auto opacity-70" />
              <p className="font-semibold text-neutral-700">No student profiles match your filter or search.</p>
              <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                Try clearing your search query or selecting &quot;All&quot;.
              </p>
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSearchQuery('');
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-neutral-300 text-[#174D3A] hover:bg-neutral-50 cursor-pointer min-h-[40px]"
              >
                Clear Search &amp; Filters
              </button>
            </div>
          ) : (
            filteredStudents.map((student) => {
            const hasConsent = student.identitySharingConsent;
            return (
              <div
                key={student.id}
                onClick={() => handleOpenDrawer(student)}
                className="p-4 sm:p-5 rounded-2xl bg-[#F7F8F4] border border-neutral-200/80 hover:border-[#174D3A]/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-xs min-w-0"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-sm sm:text-base font-bold text-[#174D3A] group-hover:text-[#113A2C] break-words">
                      {hasConsent ? `${student.displayName} (${student.anonymousId})` : student.anonymousId}
                    </span>

                    {getStatusBadge(student.patternStatus)}

                    {hasConsent ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Consent Granted
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-200/70 text-neutral-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Anonymous Token
                      </span>
                    )}
                  </div>

                  {/* Trend & Limited Summary */}
                  <div className="text-xs text-neutral-600 space-y-1">
                    <div className="break-words">
                      <strong className="text-neutral-800">Trend: </strong>
                      {student.recentTrend}
                    </div>
                    <div className="break-words">
                      <strong className="text-neutral-800">Activity: </strong>
                      {student.activitySummary}
                    </div>
                    <div className="bg-white/90 p-2.5 sm:p-3 rounded-xl border border-neutral-200/70 text-neutral-700 leading-relaxed break-words">
                      <strong className="text-[#174D3A]">Privacy-Filtered Summary: </strong>
                      {student.limitedSummary}
                    </div>
                  </div>
                </div>

                {/* Right Action: Suggested Action & Drawer Trigger */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-200 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Suggested Next Step
                    </div>
                    <div className="text-xs font-medium text-[#174D3A] max-w-xs break-words">
                      {student.suggestedAction}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDrawer(student);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#A8C5A0] text-xs font-semibold text-[#174D3A] group-hover:bg-[#174D3A] group-hover:text-white transition-all shadow-2xs whitespace-nowrap cursor-pointer min-h-[44px] flex items-center justify-center"
                  >
                    View Details &amp; Reach Out
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

        {/* Legend & Educational Disclaimer */}
        <div className="pt-4 border-t border-neutral-100 bg-[#F7F8F4] p-4 rounded-xl text-xs text-neutral-600 space-y-1">
          <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#174D3A] shrink-0" />
            Mentor Directory Legend &amp; Ethical Guidance
          </div>
          <p className="leading-relaxed">
            Status classifications (<strong>Stable pattern</strong>, <strong>Pattern changed</strong>,{' '}
            <strong>Check-in may be helpful</strong>) are heuristic indicators derived from self-reported check-in score trends.
            They are designed solely to prompt friendly, supportive touchpoints and are{' '}
            <strong>never clinical diagnoses or verified crisis predictions</strong>.
          </p>
        </div>
      </div>

      {/* Section C: Student Detail Drawer Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-full sm:max-w-xl bg-white h-full shadow-2xl p-4 sm:p-6 overflow-y-auto space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Top Bar of Drawer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E3F2E8] flex items-center justify-center text-[#174D3A]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#202B26]">
                      {selectedStudent.identitySharingConsent
                        ? selectedStudent.displayName
                        : selectedStudent.anonymousId}
                    </h3>
                    <div className="text-xs text-neutral-500 font-mono">
                      Token ID: {selectedStudent.id}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCloseDrawer}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Identity Sharing State Demonstration */}
              <div className="p-4 rounded-xl bg-[#F7F8F4] border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700">
                    Consent &amp; Authorization Status
                  </span>
                  {selectedStudent.identitySharingConsent ? (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Identity Revealed (Alex Sharma)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded">
                      Protected (Anonymous Token)
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Real names are only unmasked when (1) student explicitly grants informed permission,
                  (2) backend verifies mentor authorization, and (3) disclosure is logged.
                </p>
                {selectedStudent.id === 'student-03' && (
                  <div className="pt-2 flex items-center justify-between border-t border-neutral-200/60">
                    <span className="text-xs text-neutral-600">Simulate Consent Toggle:</span>
                    <button
                      onClick={() =>
                        toggleIdentitySharing(
                          'student-03',
                          !selectedStudent.identitySharingConsent
                        )
                      }
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-neutral-300 text-[#174D3A] hover:bg-neutral-50"
                    >
                      {selectedStudent.identitySharingConsent
                        ? 'Revoke & Hide Name'
                        : 'Grant & Reveal Name'}
                    </button>
                  </div>
                )}
              </div>

              {/* Status and Trend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">Pattern Status:</span>
                  {getStatusBadge(selectedStudent.patternStatus)}
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs text-neutral-700 space-y-1">
                  <div className="font-semibold text-neutral-900">Observed Check-In Trend:</div>
                  <div>{selectedStudent.recentTrend}</div>
                  <div className="text-neutral-500 text-[11px] pt-1">
                    Activity: {selectedStudent.activitySummary}
                  </div>
                </div>

                {/* Privacy Filtered Summary */}
                <div className="p-4 bg-[#E3F2E8]/50 rounded-xl border border-[#A8C5A0]/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#174D3A]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Privacy-Filtered Wellness Summary</span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {selectedStudent.limitedSummary}
                  </p>
                  <div className="text-[11px] text-[#174D3A]/80 font-medium">
                    Strict Privacy Enforcement: Raw journal content is strictly excluded from mentor payloads.
                  </div>
                </div>
              </div>

              {/* Prior Support Messages */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Prior Support Notes to Student
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {mentorMessages
                    .filter((m) => m.studentId === selectedStudent.id)
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-1"
                      >
                        <div className="flex justify-between text-[10px] text-neutral-400">
                          <span>From: {msg.mentorName}</span>
                          <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-neutral-800 italic">&ldquo;{msg.message}&rdquo;</p>
                        {msg.studentReply && (
                          <div className="bg-[#E3F2E8]/60 p-2 rounded text-[11px] text-[#174D3A] font-medium">
                            Student reply: {msg.studentReply}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Section D: Supportive Message Composer */}
              <div className="pt-2 border-t border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#174D3A]">
                  Compose Supportive Note
                </h4>
                <p className="text-xs text-neutral-500">
                  Send a voluntary, non-intrusive check-in note directly to this student&apos;s dashboard.
                </p>

                {/* Quick Templates */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-neutral-500">Quick Empathetic Templates:</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setComposeMessageText(
                          "Hi! Just checking in as midterm deadlines approach. How have things been going for you lately? My office door is open if you'd like to grab a quiet tea or chat."
                        )
                      }
                      className="text-[10px] px-2 py-1 rounded bg-[#F7F8F4] border border-neutral-200 text-neutral-700 hover:border-[#174D3A] text-left cursor-pointer"
                    >
                      Tea &amp; Open Door Check-in
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setComposeMessageText(
                          "Hello! Noticed the academic demands have been heavy this week. Just a gentle reminder that your health and rest always matter more than any individual assignment. Reach out if you need anything."
                        )
                      }
                      className="text-[10px] px-2 py-1 rounded bg-[#F7F8F4] border border-neutral-200 text-neutral-700 hover:border-[#174D3A] text-left cursor-pointer"
                    >
                      Rest &amp; Balance Reminder
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setComposeMessageText(
                          "Hi there! Thinking of our students navigating exam preparations right now. You are doing an admirable job managing everything. Take it one day at a time."
                        )
                      }
                      className="text-[10px] px-2 py-1 rounded bg-[#F7F8F4] border border-neutral-200 text-neutral-700 hover:border-[#174D3A] text-left cursor-pointer"
                    >
                      Exam Season Encouragement
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea
                    value={composeMessageText}
                    onChange={(e) => setComposeMessageText(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#174D3A] leading-relaxed"
                    placeholder="Type your message here..."
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">
                      Simulated delivery in Demo Mode
                    </span>
                    <button
                      type="submit"
                      disabled={sendingMessage || !composeMessageText.trim()}
                      className="px-4 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#113A2C] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingMessage ? 'Sending...' : 'Send Supportive Note'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-4 border-t border-neutral-200 flex justify-end">
              <button
                onClick={handleCloseDrawer}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
