import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDutAUvINAPRkxWuO6LVeF3WOI7_hWHTvY",
  authDomain: "magic-item-shop-generato-7dc90.firebaseapp.com",
  projectId: "magic-item-shop-generato-7dc90",
  storageBucket: "magic-item-shop-generato-7dc90.firebasestorage.app",
  messagingSenderId: "118189365886",
  appId: "1:118189365886:web:20ef95b9a273051759d62f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);