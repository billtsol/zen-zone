import { getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWCJZ-d0NLNb2oIFg5GDlcfgqk6vvLmKw",
  authDomain: "zenzone-87023.firebaseapp.com",
  projectId: "zenzone-87023",
  storageBucket: "zenzone-87023.appspot.com",
  messagingSenderId: "876836159603",
  appId: "1:876836159603:web:ff65ab330db73458786a06",
  measurementId: "G-078BDBGVKH"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const users = 'users';

export { auth, db, firebaseApp,users };