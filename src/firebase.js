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
// 临时禁用模拟器连接以避免超时问题
try {
  if (false && typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
  } else {
    console.info('Using Firebase production services');
  }
} catch (e) {
  console.warn('Firebase emulator connection failed:', e);
}

export { auth, db, functions, app };