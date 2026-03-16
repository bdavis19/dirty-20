import { auth, provider, db } from './firebase.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Expose to non-module scripts
window.db = db;
window.currentUser = null;
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.collection = collection;
window.getDocs = getDocs;
window.deleteDoc = deleteDoc;

document.getElementById('btn-google-signin').addEventListener('click', () => {
  signInWithPopup(auth, provider);
});

document.getElementById('btn-signout').addEventListener('click', () => {
  signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.currentUser = user;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    setTimeout(() => {
    window.dispatchEvent(new CustomEvent('userSignedIn'));
    }, 500);
    document.getElementById('user-email').textContent = user.email;
  } else {
    window.currentUser = null;
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
  }
});