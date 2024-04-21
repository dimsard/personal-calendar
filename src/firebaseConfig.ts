// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsB5wRvumo-gaJHXx5kabPEvXww_b-bwk",
  authDomain: "dimsard-personal-calendar.firebaseapp.com",
  projectId: "dimsard-personal-calendar",
  storageBucket: "dimsard-personal-calendar.appspot.com",
  messagingSenderId: "80906669284",
  appId: "1:80906669284:web:141156d3e256f2d964b0f1",
  measurementId: "G-ZMW76FZXV6",
  databaseURL: "https://dimsard-personal-calendar-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
getAnalytics(app);
