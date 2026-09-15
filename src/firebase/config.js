import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8-29aPrngjeQr1e1b4lHCnsKMBQdmOlw",
  authDomain: "althayyiboon-8c49d.firebaseapp.com",
  projectId: "althayyiboon-8c49d",
  storageBucket: "althayyiboon-8c49d.firebasestorage.app",
  messagingSenderId: "775871901238",
  appId: "1:775871901238:web:14b88e47f21276c98df297",
  measurementId: "G-J9Y3Q77BPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
