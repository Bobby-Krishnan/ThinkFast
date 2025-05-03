// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAbGUU4A6HIJhCafiCnocigKIerWpwSLE",
  authDomain: "thinkfast-df319.firebaseapp.com",
  projectId: "thinkfast-df319",
  storageBucket: "thinkfast-df319.appspot.com",
  messagingSenderId: "1094438522843",
  appId: "1:1094438522843:web:6480a03d8b6975006861fe",
  measurementId: "G-PZGETJ88QT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
