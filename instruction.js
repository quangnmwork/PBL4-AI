const userID = localStorage.getItem("id");
if (userID == null || userID == undefined) {
  window.location.replace("/404.html");
}
document.querySelector('.header__avatar img').src=`${localStorage.getItem('image')}`;
document.querySelector('.header__avatar p').textContent=`${localStorage.getItem('user')}`;
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
const selectBoxOption = document.querySelector(".select-box");
let allUserProfile = [];
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);

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

const guideArr = [
  {
    head: "I. One Gesture",
    img: "image/one.jpg",
    use: " This is gesture number 1 . If you want to choose the left light device on the 2nd floor. Please do gesture number 1",
    fig: "Fig 1 : One Gesture",
    id: "one",
  },
  {
    head: "II. Two Gesture",
    img: "image/two.jpg",
    use: " This is gesture number 2 . If you want to choose the right light device on the 2nd floor. Please do gesture number 2",
    fig: "Fig 2 : Two Gesture",
    id: "two",
  },
  {
    head: "III. Fan Gesture",
    img: "image/fan.jpg",
    use: " This is gesture fan . If you want to choose the fan device on the 1st floor. Please do gesture fan",
    fig: "Fig 3 : Fan Gesture",
    id: "fan",
  },
  {
    head: "IV. Light Gesture",
    img: "image/light.jpg",
    use: " This is gesture light. If you want to choose the light device on the 1st floor. Please do gesture light",
    fig: "Fig 4 : Light Gesture",
    id: "light",
  },
  {
    head: "V. On Gesture",
    img: "image/on.jpg",
    use: " This is gesture on . If you want to turn on device. Please do gesture on",
    fig: "Fig 5 : On Gesture",
    id: "on",
  },
  {
    head: "VI. Off Gesture",
    img: "image/off.jpg",
    use: " This is gesture off . If you want to turn off device. Please do gesture off",
    fig: "Fig 6 : Off Gesture",
    id: "off",
  },
  {
    head: "VII. Stop Gesture",
    img: "image/one.jpg",
    use: " This is gesture stop. If you want to stop system. Please do gesture stop",
    fig: "Fig 7 : Stop Gesture",
    id: "stop",
  },
  {
    head: "VIII. Continue Gesture",
    img: "image/continue.jpg",
    use: " This is gesture continue . If you want to continue system. Please do gesture continue",
    fig: "Fig 8 : Continue Gesture",
    id: "continue",
  },
  {
    head: "IX. ClickMode Gesture",
    img: "image/clickmode.jpg",
    use: " This is gesture clickmode . If you want to direct to ClickMode page. Please do gesture ClickMode",
    fig: "Fig 9 : ClickMode Gesture",
    id: "clickmode",
  },
];
//<div class="guide__gesture-heading">${item.head}</div>
// <p class="guide__quote">${item.fig}</p>
const handGestureDiv = guideArr
  .map(item => {
    return `<div class="guide__gesture" id='${item.id}'>

<div class="guide__img">
  <img src="${item.img}" alt="${item.img}" />
  
</div>
<div class="guide__use">
  ${item.use}
</div>
</div>`;
  })
  .join(" ");

// document.querySelector("#how").insertAdjacentHTML("beforebegin", handGestureDiv);
document.querySelector("body").scrollIntoView({
  behavior: "smooth",
});

const mainNavLinks = document.querySelectorAll(".guide__item");
const resetColorNav = () =>
  mainNavLinks.forEach(element => {
    element.classList.remove("guide__item--active");
  });
const handleClickNavItem = () => {
  mainNavLinks.forEach(element => {
    element.addEventListener("click", e => {
      resetColorNav();
      element.classList.add("guide__item--active");
    });
  });
};

document.querySelectorAll(".guide__item").forEach(nav => {
  nav.addEventListener("click", e => {
    if (e.target.classList.value.includes("guide__item")) {
      const id = e.target.firstChild.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  });
});

handleClickNavItem();
const btnLogout = document.querySelector(".header-logout");

btnLogout.addEventListener("click", e => {
  e.preventDefault();
  localStorage.removeItem("id");
  localStorage.removeItem("image");
  localStorage.removeItem("user");
  window.location.pathname = "/Login.html";
});
