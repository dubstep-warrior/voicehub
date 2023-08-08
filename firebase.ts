// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, connectAuthEmulator, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getMessaging } from "firebase/messaging";

 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig =
// kokbojin123@gmail.com config
// {
//   apiKey: "AIzaSyDQGJgUI_SksgZB8tiLK_Pno-ZkioQXZgw",
//   authDomain: "voicehub-f241d.firebaseapp.com",
//   projectId: "voicehub-f241d",
//   storageBucket: "voicehub-f241d.appspot.com",
//   messagingSenderId: "232061404460",
//   appId: "1:232061404460:web:110f922f1bb11fdea39889",
//   measurementId: "G-94G1085QNJ"
// };

// bojintech98@gmail.com config
{
  apiKey: "AIzaSyAbDIRZzY_0VBYD3wyU5zL0AXAFfty4Gl0",
  authDomain: "voicehub-70b3c.firebaseapp.com",
  projectId: "voicehub-70b3c",
  storageBucket: "voicehub-70b3c.appspot.com",
  messagingSenderId: "279002342078",
  appId: "1:279002342078:web:de11c0b6905a5de1e434ef",
  measurementId: "G-0V5VPD8BP6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
// connectAuthEmulator(auth, '127.0.0.1:9099', { disableWarnings: true })
const db = getFirestore(app);
const storage = getStorage(app);
// const messaging = getMessaging(app);
// setPersistence(auth, browserLocalPersistence)  

export { auth, db, storage };