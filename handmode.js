// define variables
let detections = {};
const userID = localStorage.getItem("id");
const btnLogout = document.querySelector(".header-logout");
document.querySelector('.header__avatar img').src=`${localStorage.getItem('image')}`;
document.querySelector('.header__avatar p').textContent=`${localStorage.getItem('user')}`;
btnLogout.addEventListener("click", e => {
  e.preventDefault();
  localStorage.removeItem("image");
  localStorage.removeItem("id");
  localStorage.removeItem("user");
  window.location.pathname = "/Login.html";
});
if (userID == null || userID == undefined) {
  window.location.replace("/404.html");
}

const video = document.querySelector("#video");
const snapButton = document.querySelector(".snap");
const myCanvas = document.querySelector(".myCanvas");
const ctx = myCanvas.getContext("2d");
const headingList = document.querySelectorAll(".stateHeading");
const predictGesture = document.querySelector(".videoBox__notify");
const predictGestureContinue = document.querySelector(".videoBox__notify-continue");
const Fan1 = document.querySelector("#fan-11");
const Light1 = document.querySelector("#light-11");
const Light21 = document.querySelector("#light-21");
const Light22 = document.querySelector("#light-22");
const headingFan = document.querySelector(".toggleFan11");
const headingLight1 = document.querySelector(".toggleLight11");
const headingLight21 = document.querySelector(".toggleLight21");
const headingLight22 = document.querySelector(".toggleLight22");
const stateBox = document.querySelector(".stateBox");
const stateBoxTop = document.querySelectorAll(".state");
const stateSleep = document.querySelector(".stateSleep");
const modalOverlay = document.querySelector(".modal-overlay");
const btnConfirm = document.querySelector(".quitBox__confirm");
const btnCancel = document.querySelector(".quitBox__cancel");
const quitBox = document.querySelector(".quitBox");
const videoBoxCapture = document.querySelector(".videoBox__capture");
const selectBoxOption = document.querySelector(".select-box");
let allUserProfile = [];

// not click
Fan1.onclick = () => {
  return false;
};
Light1.onclick = () => {
  return false;
};
Light21.onclick = () => {
  return false;
};
Light22.onclick = () => {
  return false;
};

// const stateAction = document.querySelector(".stateGesture__detail");
// const stateDevice = document.querySelector(".stateGesture__device");
let countHandOccurence = 0;
const handOccurenceThresHold = 4;
let isHandInBox = false;
let isCatchFrame = true;
let isClickMode = false;
// define state variable and firebase
const postActionGesture = async (device, action) => {
  try {
    const object = { device: device, action: action };
    console.log(object);
    const response = await fetch("http://127.0.0.1:3000/upload", {
      method: "POST",

      body: JSON.stringify(object),

      headers: {
        "Content-type": "application/json",
      },
    });
    const data = response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyC60p-hmGBO4LI-CwAgMJDRH-XfkMUARgw",
  authDomain: "crud-57581.firebaseapp.com",
  projectId: "crud-57581",
  storageBucket: "crud-57581.appspot.com",
  messagingSenderId: "898017152299",
  appId: "1:898017152299:web:9e721626aa65e20ac0896e",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);
const loadingElement = `  <div class="loading-animation"></div>`;
// Initialize Firebase and State
const mainSection = document.querySelector(".box_flex");
const mainBox = document.querySelector(".main");
mainSection.style.display = "none";
mainBox.insertAdjacentHTML("afterbegin", loadingElement);
function resetAllHeading() {
  if (Fan1.checked === true) {
    headingFan.classList.add("stateToggle");
  } else {
    headingFan.classList.remove("stateToggle");
  }
  if (Light1.checked === true) {
    headingLight1.classList.add("stateToggle");
  } else {
    headingLight1.classList.remove("stateToggle");
  }
  if (Light21.checked === true) {
    headingLight21.classList.add("stateToggle");
  } else {
    headingLight21.classList.remove("stateToggle");
  }
  if (Light22.checked === true) {
    headingLight22.classList.add("stateToggle");
  } else {
    headingLight22.classList.remove("stateToggle");
  }
  headingFan.classList.remove("text-shadow");
  headingLight1.classList.remove("text-shadow");
  headingLight21.classList.remove("text-shadow");
  headingLight22.classList.remove("text-shadow");
}
async function initState() {
  const starCountRef = ref(database, "Devices/");
  onValue(starCountRef, snapshot => {
    let fanHaveState = false;
    let lightLeftHaveState = false;
    let lightRightHaveState = false;
    let lightHaveState = false;
    let stateData = snapshot.val();
    let newData = [];

    for (let e in stateData) {
      newData.push(stateData[e]);
    }
    for (let i = newData.length - 1; i >= 0; i--) {
      if (newData[i].Devices == "Light of Floor 1" && lightHaveState === false) {
        Light1.checked = newData[i].Action == "On" ? true : false;
        lightHaveState = true;
      }
      if (newData[i].Devices == "Light Left of Floor 2" && lightLeftHaveState === false) {
        Light21.checked = newData[i].Action == "On" ? true : false;
        lightLeftHaveState = true;
      }
      if (newData[i].Devices == "Light Right of Floor 2" && lightRightHaveState === false) {
        Light22.checked = newData[i].Action == "On" ? true : false;
        lightRightHaveState = true;
      }
      if (newData[i].Devices == "Fan" && fanHaveState === false) {
        Fan1.checked = newData[i].Action == "On" ? true : false;
        fanHaveState = true;
      }
    }
    resetAllHeading();
    mainSection.style.display = "flex";
    document.querySelector(".loading-animation").style.display = "none";
  });
}
async function getUserInfoFireStore() {
  const querySnapshot = await getDocs(collection(db, "user"));
  let userArray = [];

  querySnapshot.forEach(doc => {
    if (doc.data().userName !== "novalue") {
      allUserProfile.push(doc.data());
      userArray.push(doc.data());
    }
  });
  console.log(allUserProfile);
  selectBoxOption.innerHTML = "";
  const optionHTML = userArray
    .map(user => {
      return `<option value="${user.userName}" id='${user.userID}'>${user.userName}</option>`;
    })
    .join(" ");
  console.log(optionHTML);
  const optionAll = `<option class='option' id='all' value="all">All</option>`;
  selectBoxOption.insertAdjacentHTML("afterbegin", optionAll);
  selectBoxOption.insertAdjacentHTML("beforeend", optionHTML);
}
await getUserInfoFireStore();
await initState();
function stateInit() {
  headingList.forEach(head => {
    head.classList.remove("stateHeading");
  });
}

function getImageUser() {
  for (let i = 0; i < allUserProfile.length; i++) {
    if (allUserProfile[i].userID === userID) {
      return allUserProfile[i].userImage;
    }
  }
  return null;
}
stateInit();

let handGesture = {
  action: [],
  device: [],
};

// end define variables

// add event for component

// end add event for component
function onResults(results) {
  if (results.multiHandLandmarks.length != 0) {
    if (handleHandInBox(results.multiHandLandmarks[0]) == true) {
      countHandOccurence += 1;
      isHandInBox = true;
      predictGesture.style.display = "none";
      videoBoxCapture.style.animation = "changeColor 1s infinite";
      videoBoxCapture.style.boxShadow = ".2rem .2rem 1rem rgba(241, 85, 23, .8)";
    } else {
      countHandOccurence = 0;
      isHandInBox = false;
      predictGestureContinue.style.display = "none";
      predictGesture.style.display = "block";
      predictGesture.textContent = "Hand not in Box";
      resetAllHeading();
      videoBoxCapture.style.boxShadow = "";
      videoBoxCapture.style.animation = "none";
    }
  } else {
    countHandOccurence = 0;
    videoBoxCapture.style.boxShadow = "";
    predictGestureContinue.style.display = "none";
    predictGesture.style.display = "block";
    predictGesture.textContent = "Put hand into box";
    resetAllHeading();
    videoBoxCapture.style.animation = "none";
  }
}

const hands = new Hands({
  locateFile: file => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

const convertGestureToDevice = device => {
  if (device === "Fan") {
    return ["Fan", headingFan, Fan1];
  }
  if (device === "Light") {
    return ["Light of Floor 1", headingLight1, Light1];
  }
  if (device === "One") {
    return ["Light Left of Floor 2", headingLight21, Light21];
  }
  if (device === "Two") {
    return ["Light Right of Floor 2", headingLight22, Light22];
  }
  return ["", null, null];
};
const countGesture = {
  One: 0,
  Two: 0,
  Fan: 0,
  Light: 0,
  Stop: 0,
  Continue: 0,
  ClickMode: 0,
  On: 0,
  Off: 0,
};
function resetCountGesture() {
  for (let i in countGesture) {
    countGesture[i] = 0;
  }
}
const handleGesture = (gesture, accuracy) => {
  if (accuracy >= 90) {
    countGesture[gesture] += 1;
    if (countGesture[gesture] >= 3) {
      if (gesture === "On" || gesture == "Off") {
        if (handGesture.device.length > 0) {
          handGesture.action.length = 0;
          handGesture.action.push(gesture);
          console.log("gesture", handGesture);
        }
      } else if (gesture === "Continue" || gesture === "Stop") {
        if (gesture === "Continue") {
          isCatchFrame = true;
          console.log("continue");
          predictGestureContinue.style.display = "block";
          predictGestureContinue.textContent = "System is working";
        } else {
          if (countHandOccurence >= 6) {
            isCatchFrame = false;
            stateBox.style.filter = "brightness(0.3)";
            stateSleep.style.display = "block";
            stateSleep.style.opacity = 1;
          }
        }
      } else if (gesture === "ClickMode") {
        quitBox.style.display = "block";
        stateBoxTop.forEach(box => {
          box.style.display = "none";
        });
        handGesture.device.length = 0;
        handGesture.device.push(gesture);
        isClickMode = true;
      } else {
        if (isClickMode === false) {
          handGesture.device.length = 0;
          handGesture.device.push(gesture);
          const [device1, heading1, toggleButton1] = convertGestureToDevice(handGesture.device[0]);
          resetAllHeading();
          heading1.classList.add("stateToggle");
          heading1.classList.add("text-shadow");
        }
      }
      if (handGesture.action.length > 0 && handGesture.device.length > 0) {
        if (handGesture.device[0] === "ClickMode") {
          console.log(handGesture.device[0], handGesture.action[0]);
          btnConfirm.addEventListener("click", event => {
            event.preventDefault();
            window.location.pathname = "/clickmode.html";
          });
          btnCancel.addEventListener("click", event => {
            event.preventDefault();
            quitBox.style.display = "none";
          });
          if (handGesture.action[0] === "On") {
            btnConfirm.click();
            isClickMode = false;
            resetCountGesture();
          } else if (handGesture.action[0] === "Off") {
            btnCancel.click();
            stateBoxTop.forEach(box => {
              box.style.display = "flex";
            });
            handGesture.device.length = 0;
            handGesture.action.length = 0;
            isClickMode = false;
            resetCountGesture();
            resetAllHeading();
          }
        } else {
          const [device, heading, toggleButton] = convertGestureToDevice(handGesture.device[0]);
          toggleButton.checked = handGesture.action[0] === "On" ? true : false;
          var today = new Date();
          var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
          var time =
            today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
          var dateTime = date + " " + time;
          set(ref(database, "Devices/" + today.getTime()), {
            image: getImageUser(),
            User: localStorage.getItem("user"),
            Devices: device,
            Time: dateTime,
            Action: handGesture.action[0],
            Date: today.getTime(),
          });
          resetCountGesture();
          postActionGesture(handGesture.device[0], handGesture.action[0]);
          handGesture.action.length = 0;
          handGesture.device.length = 0;
          resetAllHeading();
          console.log("After clear", handGesture);
        }
      }
    }
    countHandOccurence = 0;
  }
};

const drawCanvas = async (canvas, img) => {
  canvas.width = getComputedStyle(canvas).width.split("px")[0];
  canvas.height = getComputedStyle(canvas).height.split("px")[0];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 400;
  canvas.height = 400;
  ctx.fillRect(0, 0, 400, 400);
  ctx.drawImage(img, 0, 0, 400, 400, 0, 0, 400, 400);
  let image = canvas.toDataURL("image/jpg");
  $.post("http://localhost:3000/", { label: "video capture", content: image }, function (res, status) {
    console.log(res);
    if (isCatchFrame === true) {
      stateSleep.style.display = "none";
      handleGesture(res["Class Name"], res["Percent"]);
    } else {
      if (res["Percent"] >= 90) countGesture[res["Class Name"]] += 1;
      if (countGesture[res["Class Name"]] >= 4){
      if (res["Class Name"] == "Continue") {
        if(res["Percent"]>=90){
          isCatchFrame = true;
          stateBox.style.filter = "brightness(1)";
          stateSleep.style.display = "none";
          stateSleep.style.opacity = 0;
          predictGestureContinue.style.display = "none";
          stateSleep.style.animation = "none";
        }
      } else {
        if(res["Percent"]>=90){
          predictGestureContinue.style.display = "block";
          predictGestureContinue.textContent = "Only Reiceive Continue";
        }
       
      }
      countHandOccurence = 0 ;
    }}
  });
};

const camera = new Camera(video, {
  onFrame: async () => {
    if (countHandOccurence >= handOccurenceThresHold && isHandInBox === true) {
      const track = await video.srcObject.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      imageCapture
        .grabFrame()
        .then(imageBitmap => {
          drawCanvas(myCanvas, imageBitmap);
        })
        .catch(error => {
          console.log(error);
        });
    }
   
    await hands.send({ image: video });
  },
  width: 800,
  height: 600,
});
function handleHandInBox(multiHandLandmarks) {
  for (let i = 0; i < multiHandLandmarks.length; i++) {
    if (multiHandLandmarks[i].x > 0.4375 || multiHandLandmarks[i].y > 0.584) {
      return false;
    }
  }
  return true;
}
camera.start();

// handle notification modal here
var modal = document.getElementById("myModal");
var btnNofications = document.getElementById("btn__nofications");
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
function getImageName(username) {
  const nameArray = username.split(" ");
  if (nameArray.length === 1) return `${nameArray[0].charAt(0)}`;
  else if (nameArray.length > 1) return `${nameArray[0].charAt(0)}${nameArray[1].charAt(0)}`;
  else return ``;
}
function getDeviceIcon(device) {
  if (device.includes("Light")) {
    return ["", '<span class="fas fa-lightbulb item-icon"></span>'];
  } else {
    return ["item-green", '<span class="fas fa-fan item-icon"></span>'];
  }
}
function getTime(time) {
  let dateNow = new Date().getTime();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const diffTime = dateNow - time;
  let minutes = Math.round(diffTime / minute);
  let hours = Math.round(diffTime / hour);
  let days = Math.round(diffTime / day);
  if (minutes === 0) {
    return "Just now";
  } else if (minutes <= 60 && minute > 0) {
    return `${minutes} minutes ago`;
  } else if (minutes > 60) {
    if (hours >= 0 && hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  }
}
function getDateAndTime(time) {
  const [realTime, realDate] = time.split(" ");
  const realTimeArray = realTime.split("-");
  const realDateArray = realDate.split(":");
  realDateArray.pop();
  return [realTimeArray.join("/"), realDateArray.join(":")];
}
btnNofications.onclick = function () {
  const starCountRef = ref(database, "Devices/");
  onValue(starCountRef, snapshot => {
    const data = snapshot.val(); // data = all data on firebse
    const historyArr = [];
    for (let element in data) {
      historyArr.push(data[element]);
    }
    historyArr.reverse();
    const container = document.querySelector(".content-list");
    console.log(container);
    const textHTML = historyArr
      .map(function (item) {
        const imageLink = item.image;
        const imageName = getImageName(item.User);
        console.log(imageName);
        const [classColor, iconDevice] = getDeviceIcon(item.Devices);
        const [realDate, realTime] = getDateAndTime(item.Time);
        return ` <div class="item-content">
        <div class="item-content__img">
            ${
              imageLink !== "noimage"
                ? `<img src="${imageLink}" />`
                : `<div class='item-content-avatar'><span>${imageName}</span></div>`
            }
            <div class="item-content-flag ${classColor}">${iconDevice}</div>
            </div>
            <div class="item-content-mess-box">
            <p class="item-content-mess-box__des">The <span class='lowercase'>${
              item.Devices
            }</span> is <span class=${item.Action === "On" ? "text-on" : "text-off"}>${item.Action}</span></p>
            <p class="item-content-mess-box-hour">${getTime(item.Date)}</p>
            </div>
            <div class="item-content-date">
                <div class='item-content-date-detail'>${realDate}</div>
                <div class='item-content-date-hour'>${realTime}</div>
              </div>
        </div>`;
      })
      .join(" ");
    container.innerHTML = "";
    container.insertAdjacentHTML("afterbegin", textHTML);
  });
  modal.style.display = "block";
};
const optionBox = document.querySelectorAll(".select-box");
optionBox.forEach(option => {
  option.addEventListener("change", function (e) {
    const name = e.target.value;
    const starCountRef = ref(database, "Devices/");
    onValue(starCountRef, snapshot => {
      const data = snapshot.val(); // data = all data on firebse
      const historyArr = [];
      for (let element in data) {
        if (name !== "all") {
          if (data[element].User == name) {
            historyArr.push(data[element]);
          }
        } else historyArr.push(data[element]);
      }
      historyArr.reverse();
      console.log(historyArr);
      const container = document.querySelector(".content-list");

      const textHTML = historyArr
        .map(function (item) {
          const imageLink = item.image;
          const imageName = getImageName(item.User);
          console.log(imageName);
          const [classColor, iconDevice] = getDeviceIcon(item.Devices);
          const [realDate, realTime] = getDateAndTime(item.Time);
          return ` <div class="item-content">
        <div class="item-content__img">
            ${
              imageLink !== "noimage"
                ? `<img src="${imageLink}" />`
                : `<div class='item-content-avatar'><span>${imageName}</span></div>`
            }
            <div class="item-content-flag ${classColor}">${iconDevice}</div>
            </div>
            <div class="item-content-mess-box">
            <p class="item-content-mess-box__des">The <span class='lowercase'>${
              item.Devices
            }</span> is <span class=${item.Action === "On" ? "text-on" : "text-off"}>${item.Action}</span></p>
            <p class="item-content-mess-box-hour">${getTime(item.Date)}</p>
            </div>
            <div class="item-content-date">
                <div class='item-content-date-detail'>${realDate}</div>
                <div class='item-content-date-hour'>${realTime}</div>
              </div>
        </div>`;
        })
        .join(" ");
      container.innerHTML = "";
      container.insertAdjacentHTML("afterbegin", textHTML);
    });
  });
});

// end here

document.querySelector(".local-library").addEventListener("click", () => {
  window.location.pathname = "/instruction.html";
});
