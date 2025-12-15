// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-VNTg0tO62WaibW_4ATKA8-8QO1aWp_Y",
  authDomain: "neurozone-462a4.firebaseapp.com",
  projectId: "neurozone-462a4",
  storageBucket: "neurozone-462a4.appspot.com",
  messagingSenderId: "495808207661",
  appId: "1:495808207661:web:18e78eaf2c74b95b88d1a4"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
