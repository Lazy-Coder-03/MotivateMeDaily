
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getMessaging, type Messaging } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCy4GXxBNGhpfbEoWhH5_RTbR-_y2gF-aU",
  authDomain: "motivatedaily-f8208.firebaseapp.com",
  projectId: "motivatedaily-f8208",
  storageBucket: "motivatedaily-f8208.appspot.com", // Standard format. If your actual bucket URL in Firebase console is different (e.g. ends with .firebasestorage.app for direct access), ensure this config matches what Firebase expects for SDK initialization.
  messagingSenderId: "80890426065",
  appId: "1:80890426065:web:4a3bbb6cd7e3fc6c2a4bf0",
  measurementId: "G-SV7PRV3TFW"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;
let messagingInstance: Messaging | null = null;

// Check if Firebase has already been initialized to avoid reinitialization errors.
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // If already initialized, use that app
}

// Initialize Analytics only on the client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

/**
 * Retrieves the Firebase Cloud Messaging instance.
 * This function should only be called on the client-side.
 * @returns The Firebase Messaging instance, or null if not on the client.
 */
export const getClientMessaging = (): Messaging | null => {
  if (typeof window !== 'undefined') {
    if (!messagingInstance) { // Initialize messaging only once on client
        try {
            messagingInstance = getMessaging(app);
        } catch (error) {
            console.error("Error initializing Firebase Messaging:", error);
            // This can happen if the environment doesn't support messaging (e.g. missing service worker, permissions)
        }
    }
    return messagingInstance;
  }
  return null;
};

export { app, analytics };
