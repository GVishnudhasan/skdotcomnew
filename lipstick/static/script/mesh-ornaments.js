const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '');

const canvasElement = document.getElementsByClassName('output_canvas')[0];

const ctx = canvasElement.getContext('2d');
var imageObj = new Image();
imageObj.src = `https://mediapipe-spotkwik.s3.ap-south-1.amazonaws.com/jwellary/5.png`;


canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

ctx.translate(window.innerWidth, 0);
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

function tryJwel(image) {
    imageObj.src = image;
}

function onFace(results) {
    detection = results;

    points = [147, 401, 152]
    // points = [147]

    if(results.multiFaceLandmarks){
        try{
            ctx.save();
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
            let landmarks = results.multiFaceLandmarks

            let cordinates = []

            for(let up of points) {
                cordinates.push(landmarks[0][up])
            }
            define(cordinates, ctx)
        } catch(err) {
            console.log(err.message)
        }
        
    }
}

function define(cordinates, ctx){
    e = ctx.canvas

    let width = (cordinates[1].x * e.width) - (cordinates[0].x * e.width)
    let h_ratio =  (imageObj.height/imageObj.width) * width
    console.log(width, h_ratio)

    ctx.drawImage(imageObj, (cordinates[0].x * e.width) - 2, (cordinates[2].y * e.height) + width/15,  width, h_ratio );
    ctx.stroke();
}