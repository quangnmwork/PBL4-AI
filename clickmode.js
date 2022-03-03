const baseURL = "http://192.168.0.103/"
// const checkBox0 = document.querySelector('.check0');
// const checkBox1 = document.querySelector('.check1');
// const checkBox2 = document.querySelector('.check2');
// const checkBox3 = document.querySelector('.check3');
// const btnOnAll1 = document.querySelector('.all-1-on');
// const btnOffAll1 = document.querySelector('.all-1-off');
// const btnOnAll2 = document.querySelector('.all-2-on');
// const btnOffAll2 = document.querySelector('.all-2-off');

document.querySelector('.header__avatar img').src=`${localStorage.getItem('image')}`;
document.querySelector('.header__avatar p').textContent=`${localStorage.getItem('user')}`;


// postRequest(false, [0, 1, 2, 3])

// checkBox0.addEventListener('click', () => { postRequest(checkBox0.checked, 0) })
// checkBox1.addEventListener('click', () => { postRequest(checkBox1.checked, 1) })
// checkBox2.addEventListener('click', () => { postRequest(checkBox2.checked, 2) })
// checkBox3.addEventListener('click', () => { postRequest(checkBox3.checked, 3) })
// btnOnAll1.addEventListener('click', () => { postRequest(true, [0, 1]) })
// btnOffAll1.addEventListener('click', () => { postRequest(false, [0, 1]) })
// btnOnAll2.addEventListener('click', () => { postRequest(true, [2, 3]) })
// btnOffAll2.addEventListener('click', () => { postRequest(false, [2, 3]) })

function postRequest(checked, devices) {
  if (devices.length > 1) {
    console.log(devices)
    devices.forEach(e => {
      const url = makeUrl(checked, e)
      console.log(e, url)
      // post(url);
      setTimeout(()=>{
        post(url);
      },500)
    });
  }
  else {
    const url = makeUrl(checked, devices)
    console.log("1 request",url)
    // post(url)
    setTimeout(()=>{
      post(url);
    },500)
  }
}
function makeUrl(checked, device) {
  let url = ""
  if (checked == true) {
    url = baseURL + 'onD' + device
  }
  else {
    url = baseURL + 'offD' + device
  }
  return url
}
function post(url) {
  fetch(url, {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: 'foo=bar&lorem=ipsum'
  })
}

// declare variables here
const userID = localStorage.getItem("id");
if (userID == null || userID == undefined) {
  window.location.replace("/404.html");
}
const btnLogout = document.querySelector(".header-logout");
document.querySelector(".pan_tool").addEventListener("click", e => {
  e.preventDefault();
  window.location.pathname = "/handmode.html";
});
document.querySelector(".touch_app").addEventListener("click", e => {
  e.preventDefault();
  window.location.pathname = "/clickmode.html";
});
btnLogout.addEventListener("click", e => {
  e.preventDefault();
  localStorage.removeItem("image");
  localStorage.removeItem("id");
  localStorage.removeItem("user");
  window.location.pathname = "/Login.html";
});
const light_2_Left = document.getElementById("light_2_Left");
const userName = localStorage.getItem("user");
const light_2_Right = document.getElementById("light_2_Right");
const fan = document.getElementById("fan");
const light_1 = document.getElementById("light_1");
const floor1TurnOnAll = document.querySelector(".btn-floor-1-on");
const floor1TurnOffAll = document.querySelector(".btn-floor-1-off");
const floor2TurnOnAll = document.querySelector(".btn-floor-2-on");
const floor2TurnOffAll = document.querySelector(".btn-floor-2-off");
const selectBoxOption = document.querySelector(".select-box");
const mainSection = document.querySelector(".section-light");
const mainBox = document.querySelector(".main");
let allUserProfile = [];
// end declare variable
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
const loadingElement = `  <div class="loading-animation"></div>`;
// Initialize Firebase and State
mainSection.style.display = "none";
mainBox.insertAdjacentHTML("afterbegin", loadingElement);
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
// set State init for all button

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
    console.log("initstate");
    for (let i = newData.length - 1; i >= 0; i--) {
      if (
        lightHaveState === true &&
        lightLeftHaveState === true &&
        lightRightHaveState === true &&
        fanHaveState === true
      ) {
        break;
      }
      if (newData[i].Devices == "Light of Floor 1" && lightHaveState === false) {
        light_1.checked = newData[i].Action == "On" ? true : false;
        lightHaveState = true;
      }
      if (newData[i].Devices == "Light Left of Floor 2" && lightLeftHaveState === false) {
        light_2_Left.checked = newData[i].Action == "On" ? true : false;
        lightLeftHaveState = true;
      }
      if (newData[i].Devices == "Light Right of Floor 2" && lightRightHaveState === false) {
        light_2_Right.checked = newData[i].Action == "On" ? true : false;
        lightRightHaveState = true;
      }
      if (newData[i].Devices == "Fan" && fanHaveState === false) {
        fan.checked = newData[i].Action == "On" ? true : false;
        fanHaveState = true;
      }
    }

    mainSection.style.display = "block";
    document.querySelector(".loading-animation").style.display = "none";
  });
}
initState();

function getImageUser() {
  for (let i = 0; i < allUserProfile.length; i++) {
    if (allUserProfile[i].userID === userID) {
      return allUserProfile[i].userImage;
    }
  }
  return null;
}
const lightDevice = "Light";
const fanDevice = "Fan";
const lightLeftDevice = "One";
const lightRightDevice = "Two";
function stateToStringGesture(x) {
  if (x === true) {
    return 'On';
  }
  else {
    return 'Off';
  }
}
light_1.addEventListener("click", async e => {
  var device = "Light of Floor 1";
  var action = "On";
  var today = new Date();
  var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
  var dateTime = date + " " + time;
  console.log(await light_1.checked);
  if ((await light_1.checked) === true) {
    // $("ol").append(txt);
    console.log("light 1 on");
    set(ref(database, "Devices/" + today.getTime()), {
      image: getImageUser(),
      User: userName,
      Devices: device,
      Time: dateTime,
      Action: action,
      Date: today.getTime(),
    });
    //postActionGesture(lightDevice, stateToStringGesture(light_1.checked));
  }
  if ((await light_1.checked) === false) {
    var action = "Off";
    console.log("light 1 off");
    set(ref(database, "Devices/" + today.getTime()), {
      image: getImageUser(),
      User: userName,
      Devices: device,
      Time: dateTime,
      Action: action,
      Date: today.getTime(),
    });
  //  postActionGesture(lightDevice, stateToStringGesture(light_1.checked));
  }
  postRequest((await light_1.checked),1);
});

light_2_Left.addEventListener("click", async e => {
  var device = "Light Left of Floor 2";

  var action = "On";

  var today = new Date();
  var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
  var dateTime = date + " " + time;
  const checked = await light_2_Left.checked;
  console.log(checked);
  if (checked == true) {
    // $("ol").append(txt);
    set(ref(database, "Devices/" + today.getTime()), {
      image: getImageUser(),
      User: userName,
      Devices: device,
      Time: dateTime,
      Action: action,
      Date: today.getTime(),
    });
   // postActionGesture(lightLeftDevice, stateToStringGesture(light_2_Left.checked));
  }
  if (checked == false) {
    var action = "Off";

    set(ref(database, "Devices/" + today.getTime()), {
      image: getImageUser(),
      User: userName,
      Devices: device,
      Time: dateTime,
      Action: action,
      Date: today.getTime(),
    });
   // postActionGesture(lightLeftDevice, stateToStringGesture(light_2_Left.checked));
  }
  postRequest(checked,2);
});

light_2_Right.addEventListener("click", async e => {
  var device = "Light Right of Floor 2";

  var action = "On";

  var today = new Date();
  var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
  var dateTime = date + " " + time;
  const checked = await light_2_Right.checked;
  if (checked == true) {
    // $("ol").append(txt);
    set(ref(database, "Devices/" + today.getTime()), {
      image: getImageUser(),
      User: userName,
      Devices: device,
      Time: dateTime,
      Action: action,
      Date: today.getTime(),
    });
    //postActionGesture(lightRightDevice, stateToStringGesture(light_2_Right.checked));
  } else {
    var action = "Off";

    set(ref(database, "Devices/" + today.getTime()), {
      image: getImageUser(),
      User: userName,
      Devices: device,
      Time: dateTime,
      Action: action,
      Date: today.getTime(),
    });
    //postActionGesture(lightRightDevice, stateToStringGesture(light_2_Right.checked));
  }
  postRequest(checked,3);
});

fan.addEventListener("click", async e => {
  var device = "Fan";

  var action = "On";

  var today = new Date();
  var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
  var dateTime = date + " " + time;
  const checked = await fan.checked;
  if (checked == true) {
    // $("ol").append(txt);
    set(ref(database, "Devices/" + today.getTime()), {
      image: getImageUser(),
      User: userName,
      Devices: device,
      Time: dateTime,
      Action: action,
      Date: today.getTime(),
    });
   // postActionGesture(fanDevice, stateToStringGesture(fan.checked));
  } else {
    var action = "Off";

    set(ref(database, "Devices/" + today.getTime()), {
      image: getImageUser(),
      User: userName,
      Devices: device,
      Time: dateTime,
      Action: action,
      Date: today.getTime(),
    });
   // postActionGesture(fanDevice, stateToStringGesture(fan.checked));
  }
  postRequest(checked,0);
});

// notification handle here
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

floor1TurnOnAll.addEventListener("click", e => {
  e.preventDefault();
  if (light_1.checked == false) {
    light_1.click();
  }
  setTimeout(() => {
    if (fan.checked == false) {
      fan.click();
    }
  }, 50);
});
floor1TurnOffAll.addEventListener("click", e => {
  e.preventDefault();
  if (light_1.checked == true) {
    light_1.click();
  }
  setTimeout(() => {
    if (fan.checked == true) {
      fan.click();
    }
  }, 50);
});
floor2TurnOnAll.addEventListener("click", e => {
  e.preventDefault();
  if (light_2_Left.checked == false) {
    light_2_Left.click();
  }
  setTimeout(() => {
    if (light_2_Right.checked == false) {
      light_2_Right.click();
    }
  }, 50);
});
floor2TurnOffAll.addEventListener("click", e => {
  e.preventDefault();
  if (light_2_Left.checked == true) {
    light_2_Left.click();
  }
  setTimeout(() => {
    if (light_2_Right.checked == true) {
      light_2_Right.click();
    }
  }, 50);
});
function getDateAndTime(time) {
  const [realTime, realDate] = time.split(" ");
  const realTimeArray = realTime.split("-");
  const realDateArray = realDate.split(":");
  realDateArray.pop();
  if(realDateArray[2].length==1){
    realDateArray[2]="0"+realDateArray[2];
  }
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
            ${imageLink !== "noimage"
            ? `<img src="${imageLink}" />`
            : `<div class='item-content-avatar'><span>${imageName}</span></div>`
          }
            <div class="item-content-flag ${classColor}">${iconDevice}</div>
            </div>
            <div class="item-content-mess-box">
            <p class="item-content-mess-box__name">${item.User}</p>
            <p class="item-content-mess-box__des">The <span class='lowercase'>${item.Devices
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

// route here

//option box
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
            ${imageLink !== "noimage"
              ? `<img src="${imageLink}" />`
              : `<div class='item-content-avatar'><span>${imageName}</span></div>`
            }
            <div class="item-content-flag ${classColor}">${iconDevice}</div>
            </div>
            <div class="item-content-mess-box">
            <p class="item-content-mess-box__name">${item.User}</p>
            <p class="item-content-mess-box__des">The <span class='lowercase'>${item.Devices
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
