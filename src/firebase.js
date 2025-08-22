import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth"; 
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = { 
  apiKey: "AIzaSyCFuW9Rp8PHx2Kv2qqeiUghCRCErt6Q5Ps", 
  authDomain: "carenexus-e94da.firebaseapp.com", 
  projectId: "carenexus-e94da", 
  storageBucket: "carenexus-e94da.appspot.com", 
  messagingSenderId: "945800852092", 
  appId: "1:945800852092:web:53d68ed8e66f4c92fa0ff9" 
}; 

const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Auto-connect to emulators when running on localhost (development)
try {
  if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
    // Functions emulator default port 5001, Firestore emulator default port 8080
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.info('Connected to Firebase emulators: functions@5001 firestore@8080');
  }
} catch (e) {
  // ignore in non-browser environments
}

export { auth, db, functions, app };