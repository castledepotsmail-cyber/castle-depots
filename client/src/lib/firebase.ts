import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtxCNEecgo6_tsD8rJ0nFSkBCvR7NzOkI",
  authDomain: "castledepots-123.firebaseapp.com",
  projectId: "castledepots-123",
  storageBucket: "castledepots-123.firebasestorage.app",
  messagingSenderId: "179867501560",
  appId: "1:179867501560:web:2e3372d247ef64e3f14c0d",
  measurementId: "G-LS0FMYSKS3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();