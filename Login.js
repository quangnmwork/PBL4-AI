if (localStorage.getItem("id") != null || localStorage.getItem("id") != undefined) {
  window.location.replace("/clickmode.html");
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getDatabase, set, onValue } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-storage.js";
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
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const loginButton = document.querySelector(".login");
const signupButton = document.querySelector(".resign");
const emailLogin = document.querySelector(".email-login");
const passLogin = document.querySelector(".pass-login");
const emailSign = document.querySelector(".email-resign");
const passSign = document.querySelector(".pass-resign");
const nameSign = document.querySelector(".name-resign");
const messageResign = document.querySelector(".signup-message-resign");
const messageLogin = document.querySelector(".signup-message-login");
let fileUpload = document.querySelector(".upload-img");
const imageBorder = document.querySelector(".image-border");
const displayImage = document.querySelector(".image-resign");
signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
  // messageResign.classList.remove("error");
  // messageResign.classList.remove("success");
  // messageResign.textContent = "";
  textIMGLoading.textContent = "";
  textSpan.textContent = `Choose an Avatar`;
  messageLogin.classList.remove("error");
  messageLogin.classList.remove("success");
  messageLogin.style.opacity = "0";
  // displayImage.style.display = "none";
  messageLogin.textContent = "";
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
  messageResign.classList.remove("error");
  messageResign.classList.remove("success");
  messageResign.style.opacity = "0";
  textIMGLoading.textContent = "";
  imageBorder.style.display = "block";
  displayImage.url = "image/user.jpg";
  displayImage.style.display = "none";
  textSpan.textContent = `Choose an Avatar`;
}); //  init firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
// end init firebase
async function saveUserInfoFireStore(name, email, imageURL, id) {
  if (imageURL === undefined || imageURL === null) {
    imageURL = "";
  }
  try {
    const docRef = await addDoc(collection(db, "user"), {
      userName: name,
      userMail: email,
      userImage: imageURL,
      userID: id,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
async function getUserInfoFireStore() {
  const querySnapshot = await getDocs(collection(db, "user"));
  querySnapshot.forEach(doc => {
    console.log(doc.data());
  });
}
function handleResignError(error) {
  if (error.includes("invalid-email")) {
    return "Invalid Email";
  }
  if (error.includes("weak-password")) {
    return "Password must have at least 6 characters";
  }
  if (error.includes("email-already-in-use")) {
    return "Email have already in use";
  }
}
let urlImage;
const textIMGLoading = document.querySelector(".image-loading");
const imageGroup = document.querySelector(".loading-animation-group");
const textSpan = document.querySelector(".custom-file-upload span ");
fileUpload.addEventListener("change", async e => {
  e.preventDefault();
  // textIMGLoading.textContent = "Waiting for update Img";
  const loadingHTML = `<div class="loading-animation"></div>`;
  imageBorder.style.display = "none";
  displayImage.style.display = "block";
  imageGroup.insertAdjacentHTML("beforeend", loadingHTML);
  const httpsReference = ref(
    storage,
    `'https://firebasestorage.googleapis.com/b/bucket/o/images%${e.target.files[0].name}'`
  );
  await uploadBytes(httpsReference, e.target.files[0]).then(snapshot => {});
  await getDownloadURL(ref(storage, httpsReference))
    .then(url => {
      urlImage = url;
      displayImage.src = url;
      imageBorder.style.display = "block";
      displayImage.style.display = "block";
      document.querySelectorAll(".loading-animation").forEach(element => element.remove());
      textIMGLoading.textContent = "";
      // textSpan.textContent = `${e.target.files[0].name}`;
      textIMGLoading.style.color = "#059a0a";
    })
    .catch(error => {
      console.log(error);
    });
});

signupButton.addEventListener("click", async e => {
  e.preventDefault();

  if (nameSign.value === "" || emailSign.value === "" || passSign.value === "") {
    messageResign.classList.add("error");
    // messageResign.style.display = "block";
    messageResign.style.opacity = "1";
    messageResign.textContent = "Please full fill information";
  } else {
    let url = await urlImage;
    console.log(url);
    createUserWithEmailAndPassword(auth, emailSign.value, passSign.value)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: nameSign.value,
        });
        updateProfile(auth.currentUser, {
          photoURL: url,
        });

        saveUserInfoFireStore(nameSign.value, emailSign.value, url, user.uid);

        messageResign.classList.remove("error");
        messageResign.classList.add("sucess");
        // messageResign.style.display = "block";
        console.log(url);
        console.log(messageResign);
        messageResign.style.opacity = "1";
        messageResign.textContent = "Sign up Successfully";

        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        messageResign.classList.add("error");
        messageResign.style.opacity = "1";
        console.log(errorCode, errorMessage);
        messageResign.textContent = handleResignError(errorCode);
        // ..
      });
  }
});
function handleLoginError(error) {
  if (error.includes("invalid-email")) {
    return "Invalid Email";
  }
  if (error.includes("wrong-password")) {
    return "Invalid Password";
  }
  if (error.includes("user-not-found")) {
    return "Invalid Email";
  }
}
loginButton.addEventListener("click", e => {
  e.preventDefault();
  if (emailLogin.value === "" || passLogin.value === "") {
    messageLogin.classList.add("error");
    messageLogin.style.opacity = "1";
    messageLogin.textContent = "Please full fill information";
  } else {
    signInWithEmailAndPassword(auth, emailLogin.value, passLogin.value)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        console.log(user.displayName);
        messageLogin.classList.remove("error");
        messageLogin.classList.add("sucess");
        localStorage.setItem("id", user.uid);
        localStorage.setItem("image",user.photoURL);
        localStorage.setItem("user", user.displayName);
        window.location.pathname = "clickmode.html";
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        messageLogin.classList.add("error");
        messageLogin.style.opacity = "1";
        messageLogin.textContent = handleLoginError(errorCode);
      });
  }
});
