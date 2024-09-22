import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMolsjFUtisMQK21heoXNrB-OyZb2JyGg",
  authDomain: "im2-project-capistrano.firebaseapp.com",
  projectId: "im2-project-capistrano",
  storageBucket: "im2-project-capistrano.appspot.com",
  messagingSenderId: "926803659069",
  appId: "1:926803659069:web:abc09d0d4513d030439d54"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('submit').addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  emailError.textContent = '';
  passwordError.textContent = '';

  if (!email || !password) {
    if (!email) emailError.textContent = 'Email is required';
    if (!password) passwordError.textContent = 'Password is required';
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
  .then(() => {
    window.location.href = "index.html"; // 4
  })
  .catch((error) => {
    console.error("Error during registration:", error.message);
    if (error.code === 'auth/email-already-in-use') {
      emailError.textContent = 'This email is already in use';
    } else if (error.code === 'auth/weak-password') {
      passwordError.textContent = 'Password should be at least 6 characters';
    } else {
      emailError.textContent = 'Registration failed. Please try again';
    }
    });
});
