import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyADzu7AZHAd7u3-nK74_OOXvDiZSQaCXnc",
  authDomain: "new-barter-app.firebaseapp.com",
  databaseURL: "https://new-barter-app.firebaseio.com",
  projectId: "new-barter-app",
  storageBucket: "new-barter-app.appspot.com",
  messagingSenderId: "700127132248",
  appId: "1:700127132248:web:b470e3507343ba3c34e82d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
