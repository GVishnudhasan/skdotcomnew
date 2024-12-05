const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '');

const canvasElement = document.getElementsByClassName('output_canvas')[0];

const ctx = canvasElement.getContext('2d');
var imageObj = new Image();
// imageObj.src = `http://localhost:8000/6-removebg-preview.png`;


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
            const cheekLeft = landmarks[0][234];
            const cheekRight = landmarks[0][454];
            const chin = landmarks[0][152];

            // define(cordinates, ctx)

            const width = ((cheekRight.x - cheekLeft.x) * canvasElement.width)+35;
            const h_ratio = (imageObj.height / imageObj.width) * width;


            const centerX = (cheekLeft.x + cheekRight.x) / 2 * canvasElement.width;
            const centerY = (chin.y * canvasElement.height) - h_ratio / 2;

            ctx.drawImage(
                imageObj,
                centerX - width / 2,  // Center the necklace horizontally
                centerY+95,              // Position below the chin
                width,
                h_ratio
            );

            ctx.stroke();
        } catch(err) {
            console.log(err.message)
        }
        
    }
}

// function define(cordinates, ctx){
//     e = ctx.canvas

//     // let width = (cordinates[1].x * e.width) - (cordinates[0].x * e.width)



//     let h_ratio =  (imageObj.height/imageObj.width) * width
//     console.log(width, h_ratio)

//     ctx.drawImage(imageObj, (cordinates[0].x * e.width) - 5, (cordinates[2].y * e.height) - width/30,  width, h_ratio );
//     ctx.stroke();
// }

// Assume faceLandmarks is an array of landmark objects from MediaPipe
// function drawNecklace(faceLandmarks) {
//     const cheekLeft = faceLandmarks[234];
//     const cheekRight = faceLandmarks[454];
//     const chin = faceLandmarks[152];

//     // Calculate necklace position as a midpoint below the chin
//     const centerX = (cheekLeft.x + cheekRight.x) / 2;
//     const centerY = chin.y + (chin.y - ((cheekLeft.y + cheekRight.y) / 2));

//     // Calculate scale based on cheek distance
//     const distance = Math.hypot(cheekRight.x - cheekLeft.x, cheekRight.y - cheekLeft.y);
//     const necklaceScale = distance / necklaceWidth; // Adjust based on image size

//     // Draw on canvas
//     const canvas = document.getElementById("overlayCanvas");
//     const context = canvas.getContext("2d");
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.save();

//     // Position and scale necklace
//     context.translate(centerX, centerY);
//     context.scale(necklaceScale, necklaceScale);

//     // Rotate if needed (optional)
//     const angle = Math.atan2(cheekRight.y - cheekLeft.y, cheekRight.x - cheekLeft.x);
//     context.rotate(angle);

//     // Draw necklace image
//     const necklaceImage = document.getElementById("necklaceImage"); // Image element
//     context.drawImage(necklaceImage, -necklaceWidth / 2, -necklaceHeight / 2);

//     context.restore();
// }

// // Update function to call each frame
// function updateFaceMesh(faceLandmarks) {
//     drawNecklace(faceLandmarks);
// }
