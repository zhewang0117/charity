import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";

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

export { auth, db };