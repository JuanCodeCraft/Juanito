import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "main2.html";
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      if (error.code === 'auth/wrong-password') {
        passwordError.textContent = 'Incorrect password';
      } else if (error.code === 'auth/user-not-found') {
        emailError.textContent = 'No account found with this email';
      } else {
        emailError.textContent = 'Login failed. Please try again';
      }
    });
});
