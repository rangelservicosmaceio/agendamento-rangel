import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: FirebaseFirestore.Firestore | null = null;

export function getAdminDb() {
  if (adminDb) return adminDb;

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });

  adminDb = getFirestore(app);
  return adminDb;
}
