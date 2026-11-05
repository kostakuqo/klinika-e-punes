"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/** Browser-side Firebase, used only by the admin panel. */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseClientConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | undefined;

function firebaseApp(): FirebaseApp {
  if (!isFirebaseClientConfigured) {
    throw new Error("Firebase web config missing: fill NEXT_PUBLIC_FIREBASE_* in .env.local");
  }
  app ??= getApps().length ? getApp() : initializeApp(config);
  return app;
}

export const clientAuth = (): Auth => getAuth(firebaseApp());
export const clientDb = (): Firestore => getFirestore(firebaseApp());
