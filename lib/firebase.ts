import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYLh_JEoF7VvZ8Oq0QXPo4czbL1kMyrQ8",
  authDomain: "codingholygrail.firebaseapp.com",
  projectId: "codingholygrail",
  storageBucket: "codingholygrail.appspot.com",
  messagingSenderId: "83049184362",
  appId: "1:83049184362:web:d6998ed96565762c8e1e13",
  measurementId: "G-7CJ2NKQKD6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
