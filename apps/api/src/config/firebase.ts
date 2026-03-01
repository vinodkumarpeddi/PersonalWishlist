import admin from 'firebase-admin';
import { env } from './env';
import { logger } from '../utils/logger';

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  if (!env.firebase.projectId) {
    logger.warn('Firebase not configured — using mock mode');
    // Return a minimal app for development
    firebaseApp = admin.initializeApp({
      projectId: 'wishpal-dev',
    });
    return firebaseApp;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
  });

  logger.info('Firebase Admin initialized');
  return firebaseApp;
}
