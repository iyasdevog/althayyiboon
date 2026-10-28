import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore,
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAlbtwFWjromx1UEj7_mmgg620Uj49RRQ",
  authDomain: "althayyiboon-e6f3d.firebaseapp.com",
  projectId: "althayyiboon-e6f3d",
  storageBucket: "althayyiboon-e6f3d.firebasestorage.app",
  messagingSenderId: "131521622054",
  appId: "1:131521622054:web:da22f8dc9e8c2cdb4ab6e7",
  measurementId: "G-TQ43BE70ZF"
};

// Initialize Firebase App (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with Multi-Tab Persistent Offline Cache
let db;
try {
  if (typeof window !== "undefined" && typeof window.indexedDB !== "undefined") {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } else {
    db = getFirestore(app);
  }
} catch {
  // If already initialized or IndexedDB unsupported, gracefully fallback
  db = getFirestore(app);
}

export { db };
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut 
};

export default app;

