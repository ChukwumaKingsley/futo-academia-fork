// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjH_GMMwwxRRW2I5hPJms1-PigTi9ysM0",
  authDomain: "autograding-807d4.firebaseapp.com",
  projectId: "autograding-807d4",
  storageBucket: "autograding-807d4.appspot.com",
  messagingSenderId: "975837193883",
  appId: "1:975837193883:web:8544eb1a79b70fa65dc83e",
  measurementId: "G-1QYMJRN7QR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);