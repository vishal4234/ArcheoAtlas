const firebaseConfig = {
  apiKey: "AIzaSyAjDYy7kSmaI5pZv-Pr2OCQlMR64gY4Xwc",
  authDomain: "atlas-ea17f.firebaseapp.com",
  projectId: "atlas-ea17f",
  storageBucket: "atlas-ea17f.appspot.com",
  messagingSenderId: "522391815616",
  appId: "1:522391815616:web:75b3f5f82a1e7ae4cfb425"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; secure; SameSite=Strict";
}

function handleAuthSuccess() {
  const sessionId = generateSessionId();
  setCookie('session_id', sessionId, 7);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function signup() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm_password').value;

  // Check if passwords match
  if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
          alert('Signup successful!');
          setCookie('session_id', userCredential.user.uid, 7);
          
          return db.collection('users').doc(userCredential.user.uid).set({
              name: name,
              email: email,
              accountType: "normal",
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
      })
      .then(() => {
          window.location.href = '/login.html'; // Redirect after signup
      })
      .catch((error) => {
          alert('An error occurred while saving user data. Please try again: ' + error.message);
      });
}

// Functionality for Login
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          alert('Login successful!');
          setCookie('session_id', userCredential.user.uid, 7);
          return db.collection('users').doc(userCredential.user.uid).get();
      })
      .then((doc) => {
          if (doc.exists) {
              console.log('User data:', doc.data());
          }
          window.location.href = './index.html'; // Redirect after login
      })
      .catch((error) => {
          alert('Error: ' + error.message); // Capture the error message
      });
}

function generateSessionId() {
  return 'session-' + Math.random().toString(36).substr(2, 9);
}

