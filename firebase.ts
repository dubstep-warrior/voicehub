// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQGJgUI_SksgZB8tiLK_Pno-ZkioQXZgw",
  authDomain: "voicehub-f241d.firebaseapp.com",
  projectId: "voicehub-f241d",
  storageBucket: "voicehub-f241d.appspot.com",
  messagingSenderId: "232061404460",
  appId: "1:232061404460:web:110f922f1bb11fdea39889",
  measurementId: "G-94G1085QNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);
// setPersistence(auth, browserLocalPersistence)  

export { auth, db, storage };