const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '');
let detection = []
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const ctx = canvasElement.getContext('2d');
var color_value = "#000"

canvasElement.width = 300;
canvasElement.height = 300;

ctx.translate(300, 0);
ctx.scale(-1, 1);

const host = window.location.host; 

const faceMesh = new FaceMesh({locateFile: (file) => {
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
    let left_blush = [227, 137, 147, 207, 206, 203, 36, 101,  227]  //[36, 203, 206, 207, 147, 137, 116, 117, 118, 101, 36] //

    let right_blush = [346, 347, 330, 266, 423, 391, 322, 436, 427, 411, 323, 352, 346]
    
    if(results.multiFaceLandmarks){        
        ctx.save();
        ctx.clearRect(0, 0, 300, 300);
        ctx.drawImage(results.image, 0, 0, 300, 300);
        try {
            
            let landmarks = results.multiFaceLandmarks
            let grd = getGrd(ctx, color_value)

            ctx.fillStyle = grd;
            ctx.strokeStyle = "#ffffff08";
            // ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = .3;

            left_blush_cordinates = [];
            right_blush_cordinates= [];


            for(let lp of right_blush) {
                right_blush_cordinates.push(landmarks[0][lp])
            }

            
            for(let lp of left_blush) {
                left_blush_cordinates.push(landmarks[0][lp])
            }

            define(left_blush_cordinates, ctx)
            ctx.stroke();
            ctx.fill();

            
            define(right_blush_cordinates, ctx)
            ctx.stroke();
            ctx.fill();

            ctx.globalAlpha = 1;
        }catch(e) {
            console.log(e);
        }
    }
}


// function onFace(results) {
//     let left_blush = [227]  //[36, 203, 206, 207, 147, 137, 116, 117, 118, 101, 36] //

//     let right_blush = [346]
//     if(results.multiFaceLandmarks){  
//         ctx.save();
//         ctx.clearRect(0, 0, 300, 300);
//         ctx.drawImage(results.image, 0, 0, 300, 300);
//         try {
//             let landmarks = results.multiFaceLandmarks

//             left_blush_cordinates = landmarks[0][36];
//             right_blush_cordinates= landmarks[0][346];
//             console.log(left_blush_cordinates, landmarks)

//             // cordinates[0].x * e.width, cordinates[0].y * e.height

//             e = ctx.canvas
//             drawBlush(left_blush_cordinates.x * e.width, left_blush_cordinates.y * e.height)
//             drawBlush(right_blush_cordinates.x * e.width, right_blush_cordinates.y * e.height)
//         }catch(e) {
//             console.log(e);
//         }
//     }
// }

function drawBlush(x, y) {

    console.log("blush draw start");
    // Create radial gradient for blush
    const gradient = ctx.createRadialGradient(x, y, 10, x, y, 80);
    gradient.addColorStop(0, 'rgba(255, 182, 193, 0.8)'); // lightpink at center
    gradient.addColorStop(0.8, 'rgba(255, 182, 193, 0.4)'); // faded pink
    gradient.addColorStop(1, 'rgba(255, 182, 193, 0)'); // fully transparent at the edges

    // Apply the gradient to the blush area
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI); // blush radius
    ctx.fill();
}

 
  function define(cordinates, ctx) {
    ctx.beginPath();
    e = ctx.canvas
    ctx.moveTo(cordinates[0].x * e.width, cordinates[0].y * e.height);

    // ctx.ellipse(cordinates[0].x * e.width, cordinates[0].y * e.height, 10, 5, (Math.PI / 4), 0, 2 * Math.PI);


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

function getGrd(ctx, hex){
    let w = ctx.canvas.width
    let h = ctx.canvas.height
    let x = hexToRgb(hex)
            // create radial gradient

    var outerRadius = w * .5;
    var innerRadius = w * .2;
    var grd = ctx.createRadialGradient(w / 2, h / 2, innerRadius, w / 2, h / 2, outerRadius);
    // light blue
    grd.addColorStop(0, "rgba(" + x.r + ","+ x.g + "," +x.b +","+ 0.7 +")");
    // dark blue
    grd.addColorStop(1, "rgba(" + x.r + ","+ x.g + "," +x.b +","+ 0 +")");

    return grd;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 0
    } : null;
  }