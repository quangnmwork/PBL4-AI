import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyC60p-hmGBO4LI-CwAgMJDRH-XfkMUARgw",
  authDomain: "crud-57581.firebaseapp.com",
  projectId: "crud-57581",
  storageBucket: "crud-57581.appspot.com",
  messagingSenderId: "898017152299",
  appId: "1:898017152299:web:9e721626aa65e20ac0896e",
};
// Initialize Firebase and State

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
document.querySelector(".signup").addEventListener("click", e => {
  e.preventDefault();
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;
  const name = document.querySelector(".name").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      return updateProfile(auth.currentUser, {
        displayName: name,
      });
      alert("Success");
      // ...
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ..
    });
});
document.querySelector(".login").addEventListener("click", e => {
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;
  e.preventDefault();
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      alert("login succcess");
      console.log(user);
      // ...
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage, errorCode);
    });
});
