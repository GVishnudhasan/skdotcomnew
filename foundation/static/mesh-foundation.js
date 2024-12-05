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

var a  = "{{device_type}}";
console.log(a)

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

function define(cordinates, ctx) {
    ctx.beginPath();
    e = ctx.canvas
    ctx.shadowOffsetX = cordinates[0].x * e.width;
    ctx.shadowOffsetY = cordinates[0].y * e.height;
    ctx.moveTo(cordinates[0].x * e.width, cordinates[0].y * e.height);
    for(var i=0; i<cordinates.length;i++){
        ctx.lineTo(cordinates[i].x * e.width, cordinates[i].y * e.height);
    }
    ctx.closePath();
}

function h(cordinates, context){
    e = ctx.canvas
    context.fillStyle = color_value;
    context.beginPath();
    context.filter = "blur(" + (e.width * 0.015) + "px)"
    context.ellipse(cordinates[0].x * e.width, cordinates[0].y * e.height,1+ (e.width/100),  e.width/100, -Math.PI / 4, 0, 2 * Math.PI);
    context.ellipse(cordinates[1].x * e.width, cordinates[1].y * e.height, 1+ (e.width/100),  e.width/100, Math.PI / 4, 0, 2 * Math.PI);
    context.shadowColor = color_value;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowBlur = 10;
}

function q(cordinates, context){
    e = ctx.canvas
    context.fillStyle = color_value;
    context.beginPath();
    console.log(e.width, e.height)
    for (var i = 0; i < cordinates.length; i++){
        context.ellipse(cordinates[i].x * e.width, cordinates[i].y * e.height,2* (e.width/100),  2*e.width/100, -Math.PI / 3, 0, 2 * Math.PI);
    context.closePath();

    }

    // context.ellipse(cordinates[1].x * e.width, cordinates[1].y * e.height, 2 * (e.width/100),  2*e.width/100, Math.PI / 3, 0, 2 * Math.PI);   
    context.shadowColor = color_value;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowBlur = 40;
    context.filter = "blur(100px)"
}



function getGrd(ctx, hex){
    let w = ctx.canvas.width
    let h = ctx.canvas.height
    let x = hexToRgb(hex)

    var outerRadius = w * .5;
    var innerRadius = w * .2;
    var grd = ctx.createRadialGradient(w / 2, h / 2, innerRadius, w / 2, h / 2, outerRadius);
    grd.addColorStop(0, "rgba(" + x.r + ","+ x.g + "," +x.b +","+ 0.7 +")");
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


function onFace(results) {
    detection = results;
    let blushpoints = [10, 338, 297, 332, 284, 251, 389, 264, 447, 376, 433, 288, 367, 397, 365, 379, 378, 400, 377, 152,
        148, 176, 149, 150, 136, 172, 138, 213, 147, 234, 127, 162, 21, 54, 103, 67, 109]
    
    if(results.multiFaceLandmarks){ 
        document.getElementById('loadingDiv').style.display = 'none';
        canvasElement.style.display = 'block';
                
        ctx.save();
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        try {   
            let landmarks = results.multiFaceLandmarks
            ctx.globalAlpha = 1;

            // ctx.fillStyle = color_value;
            ctx.strokeStyle = "#ffffff08";
            blush_cord = [...blushpoints].map(c => landmarks[0][c])
            q(blush_cord, ctx)

            ctx.stroke();
            ctx.fill();

            ctx.filter = "blur(0px)"
            ctx.globalAlpha = 1;
        }catch(e) {
            console.log(e);
        }
    }
}