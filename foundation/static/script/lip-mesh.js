const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '');
let detection = []
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const ctx = canvasElement.getContext('2d');
var color_value = "#f1e6e505"

canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

ctx.translate(window.innerWidth, 0);
ctx.scale(-1, 1);

const host = window.location.host; 
console.log(host);


const faceMesh = new FaceMesh({locateFile: (file) => {
    console.log(`https://mediapipe-spotkwik.s3.ap-south-1.amazonaws.com/mesh/${file}`);
    return `https://mediapipe-spotkwik.s3.ap-south-1.amazonaws.com/mesh/${file}`;
}});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
faceMesh.onResults(onFace);

const camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();



function tryOnCamera(color) {
    color_value = color;
    console.log(color_value);
}

function y(a, c) {
    return a instanceof Function ? a(c) : a
}

function onFace(results) {
    detection = results;
    let lower_lips_points = [61, 146, 91, 181,84,17,314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78,146, 61 ]
    let upper_lips_points = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 191, 308, 415, 310, 311, 312, 13, 82, 81, 80, 185, 61]
    
    if(results.multiFaceLandmarks){
        document.getElementById('loadingDiv').style.display = 'none';
        canvasElement.style.display = 'block';
        
        ctx.save();
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        try {
            
            let landmarks = results.multiFaceLandmarks
            ctx.fillStyle = color_value;
            ctx.strokeStyle = "#ffffff08";
            // ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = 0.4;

            lower_lip_cordinates = [];
            upper_lip_cordinates = [];

            for(let lp of lower_lips_points) {
                lower_lip_cordinates.push(landmarks[0][lp])
            }
            for(let up of upper_lips_points) {
                upper_lip_cordinates.push(landmarks[0][up])
            }

            define(lower_lip_cordinates, ctx)
            ctx.stroke();
            ctx.fill();

            define(upper_lip_cordinates, ctx)
            ctx.stroke();
            ctx.fill();
            ctx.globalAlpha = 1;
        }catch(e) {
            console.log(e);
        }
    }
}

 
  function define(cordinates, ctx) {
    ctx.beginPath();
    e = ctx.canvas
    ctx.moveTo(cordinates[0].x * e.width, cordinates[0].y * e.height);

    for(var i=0; i<cordinates.length;i++){
      ctx.lineTo(cordinates[i].x * e.width, cordinates[i].y * e.height);
    }
    ctx.closePath();
  }
  



function drawPoints(cordinates, ctx) {
    for (let i = 0; i < cordinates.length; i++) {
        const x = cordinates[i].x;
        const y = cordinates[i].y;
        console.log(x, y);

        ctx.beginPath();
        ctx.arc(61.28503680229187, 75.25249123573303, 50, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function q(a) {
    var c = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return c ? c.call(a) : {
        next: h(a)
    }
}

function h(a) {
    var c = 0;
    return function() {
        return c < a.length ? {
            done: !1,
            value: a[c++]
        } : {
            done: !0
        }
    }
}