(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let target_names = ["ClickMode", "Continue", "Fan", "Light", "Off", "On", "One", "Stop", "Two"];

const video = document.querySelector("#video");
const snapButton = document.querySelector(".snap");
const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext("2d");
const contraints = {
  audio: true,
  video: {
    width: 640,
    height: 480,
  },
};

async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(contraints);
    handleSuccess(stream);
  } catch (error) {
    console.log(error);
  }
}
const drawCanvas = async (canvas, img) => {
  canvas.width = getComputedStyle(canvas).width.split("px")[0];
  canvas.height = getComputedStyle(canvas).height.split("px")[0];
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 240;
  canvas.height = 240;
  ctx.fillRect(0, 0, 240, 240);
  ctx.drawImage(img, 0, 0, 240, 240, 0, 0, 240, 240);
  const imgData = ctx.getImageData(0, 0, 240, 240);
  var download = document.getElementById("download");
  let image = canvas.toDataURL("image/jpg").replace(/^data:image\/jpg/, "data:application/octet-stream");
  console.log(image);
  download.setAttribute("href", image);
};

async function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
  snapButton.addEventListener("click", async e => {
    const track = await video.srcObject.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    imageCapture
      .grabFrame()
      .then(imageBitmap => {
        drawCanvas(canvas, imageBitmap);
      })
      .catch(error => {
        console.log(error);
      });
  });
}
init();

},{}]},{},[1]);
