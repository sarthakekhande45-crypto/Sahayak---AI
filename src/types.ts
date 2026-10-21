export type MoodLevel = 'Very low' | 'Low' | 'Okay' | 'Good' | 'Great';

export interface MoodCheckIn {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Oct 14"
  moodScore: number; // 1 to 5
  moodLabel: MoodLevel;
  emotions: string[];
  note?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  studentId: string;
  title?: string;
  content: string;
  moodLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface WellnessSummary {
  id: string;
  studentId: string;
  possibleMood?: string;
  summary: string;
  themes: string[];
  stressIndicators: string[];
  confidence: string;
  reflectionSuggestion: string;
  uncertaintyNote?: string;
  createdAt: string;
  sharingConsent: boolean;
  source: 'gemini-3.8-flash' | 'demo-analyzer';
  mode?: 'ai' | 'demo';
}

export interface RedactionItem {
  type: string;
  original: string;
  replacement: string;
  explanation: string;
}

export interface PrivacyTransformationResult {
  originalCharCount: number;
  redactedCharCount: number;
  redactionsFound: RedactionItem[];
  redactedTextPreview: string;
  themes: string[];
  trendDirection: string;
  mentorSafeSummary: string;
  suggestedMentorReachout: string;
  uncertaintyNote: string;
  source: 'gemini-3.8-flash' | 'demo-analyzer';
  mode: 'ai' | 'demo';
}

export interface AIProviderStatus {
  status: string;
  mode: 'ai' | 'demo';
  geminiConfigured: boolean;
  activeProvider: string;
  timestamp: string;
}

export interface FirebaseStatusInfo {
  isConfigured: boolean;
  projectId: string;
  databaseId: string;
  connected: boolean;
}

export interface MentorMessage {
  id: string;
  studentId: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  studentReply?: string;
}

export type PatternStatus = 'stable' | 'changed' | 'checkin_helpful';

export interface StudentProfile {
  id: string;
  anonymousId: string;
  displayName: string;
  department: string;
  year: string;
  identitySharingConsent: boolean;
  consentUpdatedAt: string;
  patternStatus: PatternStatus;
  recentTrend: string;
  activitySummary: string;
  suggestedAction: string;
  limitedSummary: string;
  unreadMessagesCount: number;
}

export type AppRole = 'student' | 'mentor';

export type AppPage =
  | 'landing'
  | 'student-dashboard'
  | 'mentor-dashboard'
  | 'journalling'
  | 'ai-companion'
  | 'showcase-lab'
  | 'privacy-safety'
  | 'auth-roles';
