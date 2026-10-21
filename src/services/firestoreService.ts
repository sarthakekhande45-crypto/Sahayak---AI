import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  limit,
} from 'firebase/firestore';
import { db, firebaseState, handleFirestoreError, OperationType } from '../lib/firebase';
import { MoodCheckIn, WellnessSummary, MentorMessage, StudentProfile } from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_MOOD_HISTORY,
  INITIAL_MENTOR_MESSAGES,
  INITIAL_SUMMARIES,
} from '../data/seedData';

const COLLECTIONS = {
  MOODS: 'mood_checkins',
  SUMMARIES: 'wellness_summaries',
  MESSAGES: 'mentor_messages',
  STUDENTS: 'students',
};

// 1. Mood Check-Ins
export async function fetchMoodCheckIns(): Promise<MoodCheckIn[]> {
  if (!firebaseState.isConfigured || !db) {
    return INITIAL_MOOD_HISTORY;
  }
  try {
    const q = query(collection(db, COLLECTIONS.MOODS), limit(50));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Seed initial records to Firestore so Student and Mentor views have synchronized records
      for (const item of INITIAL_MOOD_HISTORY) {
        await setDoc(doc(db, COLLECTIONS.MOODS, item.id), item).catch(() => {});
      }
      return INITIAL_MOOD_HISTORY;
    }
    const list: MoodCheckIn[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as MoodCheckIn);
    });
    return list;
  } catch (error) {
    console.warn('Failed to load mood check-ins from Firestore, using local fallback:', error);
    return INITIAL_MOOD_HISTORY;
  }
}

export async function persistMoodCheckIn(checkIn: MoodCheckIn): Promise<void> {
  if (!firebaseState.isConfigured || !db) return;
  try {
    const docRef = doc(db, COLLECTIONS.MOODS, checkIn.id);
    await setDoc(docRef, checkIn);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.MOODS}/${checkIn.id}`);
  }
}

export function subscribeMoodCheckIns(onUpdate: (items: MoodCheckIn[]) => void): () => void {
  if (!firebaseState.isConfigured || !db) return () => {};
  try {
    const q = query(collection(db, COLLECTIONS.MOODS), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: MoodCheckIn[] = [];
        snapshot.forEach((d) => list.push(d.data() as MoodCheckIn));
        if (list.length > 0) {
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Mood check-in subscription notice:', error?.message || error);
      }
    );
  } catch {
    return () => {};
  }
}

// 2. Approved Wellness Summaries (Privacy-Transformed Only)
export async function fetchWellnessSummaries(): Promise<WellnessSummary[]> {
  if (!firebaseState.isConfigured || !db) {
    return INITIAL_SUMMARIES;
  }
  try {
    const q = query(collection(db, COLLECTIONS.SUMMARIES), limit(30));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      for (const item of INITIAL_SUMMARIES) {
        await setDoc(doc(db, COLLECTIONS.SUMMARIES, item.id), item).catch(() => {});
      }
      return INITIAL_SUMMARIES;
    }
    const list: WellnessSummary[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as WellnessSummary);
    });
    return list;
  } catch (error) {
    console.warn('Failed to load wellness summaries from Firestore, using local fallback:', error);
    return INITIAL_SUMMARIES;
  }
}

export async function persistWellnessSummary(summary: WellnessSummary): Promise<void> {
  if (!firebaseState.isConfigured || !db) return;
  // Safety Invariant: Only persist if student explicitly consented to share
  if (!summary.sharingConsent) return;
  try {
    const docRef = doc(db, COLLECTIONS.SUMMARIES, summary.id);
    await setDoc(docRef, summary);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.SUMMARIES}/${summary.id}`);
  }
}

export function subscribeWellnessSummaries(onUpdate: (items: WellnessSummary[]) => void): () => void {
  if (!firebaseState.isConfigured || !db) return () => {};
  try {
    const q = query(collection(db, COLLECTIONS.SUMMARIES), limit(30));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: WellnessSummary[] = [];
        snapshot.forEach((d) => list.push(d.data() as WellnessSummary));
        if (list.length > 0) {
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Wellness summary subscription notice:', error?.message || error);
      }
    );
  } catch {
    return () => {};
  }
}

// 3. Mentor Care Messages & Student Replies
export async function fetchMentorMessages(): Promise<MentorMessage[]> {
  if (!firebaseState.isConfigured || !db) {
    return INITIAL_MENTOR_MESSAGES;
  }
  try {
    const q = query(collection(db, COLLECTIONS.MESSAGES), limit(50));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      for (const item of INITIAL_MENTOR_MESSAGES) {
        await setDoc(doc(db, COLLECTIONS.MESSAGES, item.id), item).catch(() => {});
      }
      return INITIAL_MENTOR_MESSAGES;
    }
    const list: MentorMessage[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as MentorMessage);
    });
    return list;
  } catch (error) {
    console.warn('Failed to load mentor messages from Firestore, using local fallback:', error);
    return INITIAL_MENTOR_MESSAGES;
  }
}

export async function persistMentorMessage(msg: MentorMessage): Promise<void> {
  if (!firebaseState.isConfigured || !db) return;
  try {
    const docRef = doc(db, COLLECTIONS.MESSAGES, msg.id);
    await setDoc(docRef, msg);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.MESSAGES}/${msg.id}`);
  }
}

export async function persistMentorMessageReply(messageId: string, replyText: string): Promise<void> {
  if (!firebaseState.isConfigured || !db) return;
  try {
    const docRef = doc(db, COLLECTIONS.MESSAGES, messageId);
    await updateDoc(docRef, { studentReply: replyText });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.MESSAGES}/${messageId}`);
  }
}

export async function persistMentorMessageRead(messageId: string): Promise<void> {
  if (!firebaseState.isConfigured || !db) return;
  try {
    const docRef = doc(db, COLLECTIONS.MESSAGES, messageId);
    await updateDoc(docRef, { readAt: new Date().toISOString() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.MESSAGES}/${messageId}`);
  }
}

export function subscribeMentorMessages(onUpdate: (items: MentorMessage[]) => void): () => void {
  if (!firebaseState.isConfigured || !db) return () => {};
  try {
    const q = query(collection(db, COLLECTIONS.MESSAGES), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: MentorMessage[] = [];
        snapshot.forEach((d) => list.push(d.data() as MentorMessage));
        if (list.length > 0) {
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Mentor message subscription notice:', error?.message || error);
      }
    );
  } catch {
    return () => {};
  }
}

// 4. Student Profiles (Consistent records across Student Space & Mentor Panel)
export async function fetchStudentProfiles(): Promise<StudentProfile[]> {
  if (!firebaseState.isConfigured || !db) {
    return INITIAL_STUDENTS;
  }
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.STUDENTS));
    if (snapshot.empty) {
      for (const student of INITIAL_STUDENTS) {
        await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), student).catch(() => {});
      }
      return INITIAL_STUDENTS;
    }
    const list: StudentProfile[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as StudentProfile);
    });
    return list;
  } catch (error) {
    console.warn('Failed to load student profiles from Firestore, using local fallback:', error);
    return INITIAL_STUDENTS;
  }
}

export async function persistStudentConsent(studentId: string, consent: boolean): Promise<void> {
  if (!firebaseState.isConfigured || !db) return;
  try {
    const docRef = doc(db, COLLECTIONS.STUDENTS, studentId);
    await updateDoc(docRef, {
      identitySharingConsent: consent,
      consentUpdatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.STUDENTS}/${studentId}`);
  }
}
