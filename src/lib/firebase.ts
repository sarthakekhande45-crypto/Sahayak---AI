import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo:
        auth?.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirebaseClientState {
  isConfigured: boolean;
  projectId: string;
  databaseId: string;
}

// Resolve configuration from JSON or Vite environment variables
const projectId = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId || '';
const apiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY || rawConfig.apiKey || '';
const authDomain = (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain || (projectId ? `${projectId}.firebaseapp.com` : '');
const appId = (import.meta as any).env?.VITE_FIREBASE_APP_ID || rawConfig.appId || '';
const firestoreDatabaseId = (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || rawConfig.firestoreDatabaseId || '(default)';

const hasValidConfig = Boolean(
  projectId &&
  projectId !== 'remixed-project-id' &&
  apiKey &&
  apiKey !== 'YOUR_API_KEY' &&
  !apiKey.startsWith('AQ.')
);

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

if (hasValidConfig) {
  try {
    const existingApps = getApps();
    app = existingApps.length > 0 ? getApp() : initializeApp({
      projectId,
      apiKey,
      authDomain,
      appId,
      storageBucket: rawConfig.storageBucket,
      messagingSenderId: rawConfig.messagingSenderId,
    });

    // Initialize Firestore with specific databaseId as specified by Firebase Skill
    dbInstance = firestoreDatabaseId && firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firestoreDatabaseId)
      : getFirestore(app);

    authInstance = getAuth(app);
  } catch (err) {
    console.warn('Firebase initialization skipped or failed, using local offline state:', err);
    app = null;
    dbInstance = null;
    authInstance = null;
  }
}

export const firebaseApp = app;
export const db = dbInstance as Firestore;
export const auth = authInstance as Auth;

export const firebaseState: FirebaseClientState = {
  isConfigured: Boolean(dbInstance),
  projectId,
  databaseId: firestoreDatabaseId,
};

// Probe connection on initial boot
export async function testConnection(): Promise<boolean> {
  if (!dbInstance) return false;
  try {
    await getDocFromServer(doc(dbInstance, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is currently offline or unreachable. Using offline state.');
    }
    return false;
  }
}
