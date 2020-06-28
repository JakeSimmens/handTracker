const video = document.getElementById("video");
const audio1 = document.getElementById("audio1");
const audio2 = document.getElementById("audio2");
const audio3 = document.getElementById("audio3");
const audio4 = document.getElementById("audio4");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");


let loadModel;
video.width = 1280;
//console.log(window.screen.width);


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
        //console.log("Predictions: ", predictions);


        drawMirroredVideo(video, canvas, context);

        //draws second image with boxes
        //model.renderPredictions(predictions, canvas, context, video);

        //CODE TO INTERACT WITH SOUND WILL BE BASED ON PREDICTION DATA
        //console.log(predictions.length);
        if (predictions.length > 0) {
            processPredictions(predictions);
        }

        //need to calculate rectangles based on video width
        // Filled rectangle

        overlayRectangles(video, context);



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
                {
                    video: {}
                },
                (stream) => {
                    video.srcObject = stream;

                    setInterval(runDetection, 500);
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




// WebGL2RenderingContext.getBufferSubData()
// o.getBufferSubData(p.ARRAY_BUFFER, 0, a)