import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBggVwL10gm4VXihe_NqgjPNPsSivnCjZc",
  authDomain: "sass-platform-adc1c.firebaseapp.com",
  projectId: "sass-platform-adc1c",
  storageBucket: "sass-platform-adc1c.firebasestorage.app",
  messagingSenderId: "946193880025",
  appId: "1:946193880025:web:56d7285642db16e72c3fc8",
  measurementId: "G-7WS49T047E"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };