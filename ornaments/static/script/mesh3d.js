const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '');

const canvasElement = document.getElementsByClassName('output_canvas')[0];

const ctx = canvasElement.getContext('2d');
var imageObj = new Image();
imageObj.src = `https://mirrar-medialibrary.s3.ap-south-1.amazonaws.com/tryat-home/Necklaces/222-Y3056/1611064570/222-Y3056.png`;


canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

ctx.translate(window.innerWidth, 0);
ctx.scale(-1, 1);

const type_col= 'neck'

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

            // let cordinates = []

            // for(let up of points) {
            //     cordinates.push(landmarks[0][up])
            // }
            const cheekLeft = landmarks[0][234];
            const cheekRight = landmarks[0][454];
            const chin = landmarks[0][152];

            // define(cordinates, ctx)

            const width = ((cheekRight.x - cheekLeft.x) * canvasElement.width);
            const h_ratio = (imageObj.height / imageObj.width) * width;

            const aspectRatio = imageObj.naturalWidth / imageObj.naturalHeight;
            console.log(imageObj.naturalHeight, imageObj.naturalWidth, aspectRatio)

            const centerX = (cheekLeft.x + cheekRight.x) / 2 * canvasElement.width;
            const centerY = aspectRatio > 1 ? ((chin.y * canvasElement.height) - h_ratio / 2)+ 110 : ((chin.y * canvasElement.height) - h_ratio / 2) +160;
            
            ctx.drawImage(
                imageObj,
                (centerX - width / 2) +10,  // Center the necklace horizontally
                centerY,              // Position below the chin
                width,
                h_ratio
            );

            ctx.stroke();
        } catch(err) {
            console.log(err.message)
        }
        
    }
}
