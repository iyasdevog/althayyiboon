import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut 
};

export default app;

