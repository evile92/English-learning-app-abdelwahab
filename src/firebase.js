// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlU8_VKdSeGLwFt5XpAhu04hfKGqGYg9c",
  authDomain: "stellar-speak.firebaseapp.com",
  projectId: "stellar-speak",
  storageBucket: "stellar-speak.appspot.com",
  messagingSenderId: "148792919641",
  appId: "1:148792919641:web:b7d8c6add977cf83bd5348"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
