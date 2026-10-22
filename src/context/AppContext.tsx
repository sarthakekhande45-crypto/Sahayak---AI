import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppRole,
  AppPage,
  StudentProfile,
  MoodCheckIn,
  JournalEntry,
  MentorMessage,
  WellnessSummary,
  MoodLevel,
  AIProviderStatus,
  FirebaseStatusInfo,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_MOOD_HISTORY,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_MENTOR_MESSAGES,
  INITIAL_SUMMARIES,
} from '../data/seedData';
import {
  fetchMoodCheckIns,
  persistMoodCheckIn,
  subscribeMoodCheckIns,
  fetchWellnessSummaries,
  persistWellnessSummary,
  subscribeWellnessSummaries,
  fetchMentorMessages,
  persistMentorMessage,
  persistMentorMessageReply,
  persistMentorMessageRead,
  subscribeMentorMessages,
  fetchStudentProfiles,
  persistStudentConsent,
} from '../services/firestoreService';
import { firebaseState, testConnection } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  students: StudentProfile[];
  moodHistory: MoodCheckIn[];
  journalEntries: JournalEntry[];
  mentorMessages: MentorMessage[];
  wellnessSummaries: WellnessSummary[];
  activeStudent: StudentProfile;
  guidedDemoStep: number;
  setGuidedDemoStep: (step: number) => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  aiStatus: AIProviderStatus;
  refreshAIStatus: () => Promise<void>;
  firebaseStatus: FirebaseStatusInfo;
  refreshFirebaseStatus: () => Promise<void>;
  addMoodCheckIn: (mood: MoodLevel, emotions: string[], note?: string) => void;
  saveJournalEntry: (content: string, title?: string, moodLabel?: string) => JournalEntry;
  deleteJournalEntry: (id: string) => void;
  clearJournalHistory: () => void;
  addWellnessSummary: (summary: WellnessSummary) => void;
  sendMentorMessage: (studentId: string, message: string) => void;
  replyToMentorMessage: (messageId: string, replyText: string) => void;
  markMessageAsRead: (messageId: string) => void;
  toggleIdentitySharing: (studentId: string, consent: boolean) => void;
  resetDemoData: () => void;
  triggerGrowthCelebration: () => void;
}

const STORAGE_KEY = 'SAHAYAK_APP_STATE_V1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<AppRole>('student');
  const [currentPage, setCurrentPageState] = useState<AppPage>('landing');
  const [guidedDemoStep, setGuidedDemoStep] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // AI Provider status (AI Mode vs Demo Mode)
  const [aiStatus, setAiStatus] = useState<AIProviderStatus>({
    status: 'ok',
    mode: 'demo',
    geminiConfigured: false,
    activeProvider: 'Google Gemini (gemini-3.8-flash)',
    timestamp: new Date().toISOString(),
  });

  const refreshAIStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setAiStatus(data);
      }
    } catch {
      // Keep demo mode fallback
    }
  }, []);

  useEffect(() => {
    refreshAIStatus();
  }, [refreshAIStatus]);

  // Firebase Firestore connection state
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseStatusInfo>({
    isConfigured: firebaseState.isConfigured,
    projectId: firebaseState.projectId,
    databaseId: firebaseState.databaseId,
    connected: false,
  });

  const refreshFirebaseStatus = useCallback(async () => {
    if (firebaseState.isConfigured) {
      const isOnline = await testConnection();
      setFirebaseStatus({
        isConfigured: true,
        projectId: firebaseState.projectId,
        databaseId: firebaseState.databaseId,
        connected: isOnline,
      });
    } else {
      setFirebaseStatus({
        isConfigured: false,
        projectId: '',
        databaseId: '',
        connected: false,
      });
    }
  }, []);

  // Initialize and synchronize with Firestore when configured
  useEffect(() => {
    let unsubMoods: (() => void) | undefined;
    let unsubSummaries: (() => void) | undefined;
    let unsubMessages: (() => void) | undefined;

    async function initFirestore() {
      if (firebaseState.isConfigured) {
        const isOnline = await testConnection();
        setFirebaseStatus({
          isConfigured: true,
          projectId: firebaseState.projectId,
          databaseId: firebaseState.databaseId,
          connected: isOnline,
        });

        try {
          const [loadedStudents, loadedMoods, loadedSummaries, loadedMessages] = await Promise.all([
            fetchStudentProfiles(),
            fetchMoodCheckIns(),
            fetchWellnessSummaries(),
            fetchMentorMessages(),
          ]);

          if (loadedStudents.length > 0) setStudents(loadedStudents);
          if (loadedMoods.length > 0) setMoodHistory(loadedMoods);
          if (loadedSummaries.length > 0) setWellnessSummaries(loadedSummaries);
          if (loadedMessages.length > 0) setMentorMessages(loadedMessages);

          unsubMoods = subscribeMoodCheckIns((updated) => setMoodHistory(updated));
          unsubSummaries = subscribeWellnessSummaries((updated) => setWellnessSummaries(updated));
          unsubMessages = subscribeMentorMessages((updated) => setMentorMessages(updated));
        } catch (err) {
          console.warn('Firestore initial sync notice:', err);
        }
      }
    }

    initFirestore();

    return () => {
      unsubMoods?.();
      unsubSummaries?.();
      unsubMessages?.();
    };
  }, []);

  // Persistent / demo state
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_STUDENTS`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [moodHistory, setMoodHistory] = useState<MoodCheckIn[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_MOODS`);
      return saved ? JSON.parse(saved) : INITIAL_MOOD_HISTORY;
    } catch {
      return INITIAL_MOOD_HISTORY;
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_JOURNALS`);
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_MESSAGES`);
      return saved ? JSON.parse(saved) : INITIAL_MENTOR_MESSAGES;
    } catch {
      return INITIAL_MENTOR_MESSAGES;
    }
  });

  const [wellnessSummaries, setWellnessSummaries] = useState<WellnessSummary[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_SUMMARIES`);
      return saved ? JSON.parse(saved) : INITIAL_SUMMARIES;
    } catch {
      return INITIAL_SUMMARIES;
    }
  });

  // Save to localStorage as resilient offline backing
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_STUDENTS`, JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_MOODS`, JSON.stringify(moodHistory));
    } catch {}
  }, [moodHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_JOURNALS`, JSON.stringify(journalEntries));
    } catch {}
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_MESSAGES`, JSON.stringify(mentorMessages));
    } catch {}
  }, [mentorMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_SUMMARIES`, JSON.stringify(wellnessSummaries));
    } catch {}
  }, [wellnessSummaries]);

  const activeStudent = students.find((s) => s.id === 'student-03') || students[0];

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const triggerGrowthCelebration = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#174D3A', '#A8C5A0', '#E3F2E8', '#D97706'],
        disableForReducedMotion: true,
      });
    } catch {}
  };

  const setRole = (newRole: AppRole) => {
    setRoleState(newRole);
    showToast(`Switched view to ${newRole === 'student' ? 'Student Dashboard' : 'Mentor Portal'} (Demo Mode)`, 'info');
  };

  const setCurrentPage = (page: AppPage) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addMoodCheckIn = (mood: MoodLevel, emotions: string[], note?: string) => {
    const scoreMap: Record<MoodLevel, number> = {
      'Very low': 1,
      Low: 2,
      Okay: 3,
      Good: 4,
      Great: 5,
    };
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const displayDate = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    const newCheckIn: MoodCheckIn = {
      id: `mood-${Date.now()}`,
      studentId: 'student-03',
      date: dateStr,
      displayDate,
      moodScore: scoreMap[mood],
      moodLabel: mood,
      emotions,
      note,
      createdAt: new Date().toISOString(),
    };

    setMoodHistory((prev) => [...prev, newCheckIn]);
    persistMoodCheckIn(newCheckIn).catch(() => {});
    showToast(`Mood check-in saved: "${mood}". Your wellness tree grew a new leaf! 🌱`, 'success');
    triggerGrowthCelebration();
  };

  // Private journaling: NEVER written to Firestore or shared with mentors
  const saveJournalEntry = (content: string, title?: string, moodLabel: string = 'Reflective'): JournalEntry => {
    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      studentId: 'student-03',
      title: title || 'Private Reflection',
      content,
      moodLabel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setJournalEntries((prev) => [entry, ...prev]);
    showToast('Reflection saved privately to your local space.', 'success');
    triggerGrowthCelebration();
    return entry;
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((item) => item.id !== id));
    showToast('Journal entry deleted from your local device.', 'info');
  };

  const clearJournalHistory = () => {
    setJournalEntries([]);
    showToast('Private journal history cleared.', 'info');
  };

  const addWellnessSummary = (summary: WellnessSummary) => {
    setWellnessSummaries((prev) => [summary, ...prev]);
    if (summary.sharingConsent) {
      persistWellnessSummary(summary).catch(() => {});
    }
  };

  const sendMentorMessage = (studentId: string, message: string) => {
    const newMsg: MentorMessage = {
      id: `msg-${Date.now()}`,
      studentId,
      mentorId: 'mentor-current',
      mentorName: 'Dr. Meera Rao',
      mentorRole: 'Campus Wellbeing Counselor',
      message,
      createdAt: new Date().toISOString(),
      readAt: null,
    };

    setMentorMessages((prev) => [newMsg, ...prev]);
    persistMentorMessage(newMsg).catch(() => {});

    // Update unread count on student profile
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, unreadMessagesCount: s.unreadMessagesCount + 1 } : s))
    );

    showToast(`Supportive message sent to ${studentId === 'student-03' ? 'Student #03' : 'student'}.`, 'success');
  };

  const replyToMentorMessage = (messageId: string, replyText: string) => {
    setMentorMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, studentReply: replyText } : m))
    );
    persistMentorMessageReply(messageId, replyText).catch(() => {});
    showToast('Your supportive reply was delivered to the mentor.', 'success');
  };

  const markMessageAsRead = (messageId: string) => {
    setMentorMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, readAt: new Date().toISOString() } : m))
    );
    persistMentorMessageRead(messageId).catch(() => {});
    setStudents((prev) =>
      prev.map((s) =>
        s.id === 'student-03' ? { ...s, unreadMessagesCount: Math.max(0, s.unreadMessagesCount - 1) } : s
      )
    );
  };

  const toggleIdentitySharing = (studentId: string, consent: boolean) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              identitySharingConsent: consent,
              consentUpdatedAt: new Date().toISOString(),
            }
          : s
      )
    );
    persistStudentConsent(studentId, consent).catch(() => {});
    showToast(
      consent
        ? 'Identity sharing granted for this mentor check-in.'
        : 'Identity sharing revoked. Profile reverts to anonymous identifier.',
      'info'
    );
  };

  const resetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setMoodHistory(INITIAL_MOOD_HISTORY);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setMentorMessages(INITIAL_MENTOR_MESSAGES);
    setWellnessSummaries(INITIAL_SUMMARIES);
    localStorage.removeItem(`${STORAGE_KEY}_STUDENTS`);
    localStorage.removeItem(`${STORAGE_KEY}_MOODS`);
    localStorage.removeItem(`${STORAGE_KEY}_JOURNALS`);
    localStorage.removeItem(`${STORAGE_KEY}_MESSAGES`);
    localStorage.removeItem(`${STORAGE_KEY}_SUMMARIES`);
    showToast('Demo dataset reset to initial state.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentPage,
        setCurrentPage,
        students,
        moodHistory,
        journalEntries,
        mentorMessages,
        wellnessSummaries,
        activeStudent,
        guidedDemoStep,
        setGuidedDemoStep,
        toasts,
        showToast,
        aiStatus,
        refreshAIStatus,
        firebaseStatus,
        refreshFirebaseStatus,
        addMoodCheckIn,
        saveJournalEntry,
        deleteJournalEntry,
        clearJournalHistory,
        addWellnessSummary,
        sendMentorMessage,
        replyToMentorMessage,
        markMessageAsRead,
        toggleIdentitySharing,
        resetDemoData,
        triggerGrowthCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
