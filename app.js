const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let loadModel;


const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
}

//access video feed based on browser
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

//detect hands in video
function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);

        //CODE TO INTERACT WITH SOUND WILL BE BASED ON PREDICTION DATA
        //console.log(predictions.length);
        if (predictions.length > 0) {
            soundPlayer(predictions);
        }



        //draws second image with boxes
        //model.renderPredictions(predictions, canvas, context, video);

        //this will request the detection over and over again
        //You can also use set interval int he startVideo function to call repeatedly
        //requestAnimationFrame(runDetection);

    });
}

//start video feed from web cam
handTrack.startVideo(video)
    .then(status => {
        if (status) {
            navigator.getUserMedia(
                { video: {} },
                (stream) => {
                    video.srcObject = stream;

                    setInterval(runDetection, 100);
                },
                (err) => {
                    console.log("Video feed not working.");
                }
            )
        }
    });



// Load the model.
handTrack.load(modelParams).then(loadModel => {
    model = loadModel;

});

function soundPlayer(objLocation) {
    console.log(objLocation[0].bbox[1]);
    console.log(objLocation[0].score);
}


// WebGL2RenderingContext.getBufferSubData()
// o.getBufferSubData(p.ARRAY_BUFFER, 0, a)


// bbox: (4) […]
// ​​​
// 0: 86.93609237670898
// ​​​
// 1: 187.18571662902832
// ​​​
// 2: 139.76024627685547
// ​​​
// 3: 171.50819778442383
// ​​​
// length: 4
// ​​​
// <prototype>: Array []
// ​​
// class: 0
// ​​
// score: 0.925246000289917