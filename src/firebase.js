import firebase from 'firebase';

// Firebase Config File
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
const firebaseApp = firebase.initializeApp(firebaseConfig);
  
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db, auth, storage};