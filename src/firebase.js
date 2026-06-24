import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Ganti nilai di bawah ini dengan konfigurasi Firebase Anda!
// Anda bisa mendapatkannya di Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: "API_KEY_ANDA_DI_SINI",
  authDomain: "NAMA_PROJECT.firebaseapp.com",
  projectId: "NAMA_PROJECT",
  storageBucket: "NAMA_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Autentikasi dan Database (Firestore)
export const auth = getAuth(app);
export const db = getFirestore(app);
