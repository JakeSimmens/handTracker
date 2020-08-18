// @article{Dibia2017,
//     author = {Victor, Dibia},
//     title = {HandTrack: A Library For Prototyping Real-time Hand TrackingInterfaces using Convolutional Neural Networks},
//     year = {2017},
//     publisher = {GitHub},
//     journal = {GitHub repository},
//     url = {https://github.com/victordibia/handtracking/tree/master/docs/handtrack.pdf}, 
//   }


const video = document.getElementById("video");
const audio1 = document.getElementById("audio1");
const audio2 = document.getElementById("audio2");
const audio3 = document.getElementById("audio3");
const audio4 = document.getElementById("audio4");
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

function runHandDetection() {
    model.detect(video)
        .then(handPredictions => {

            drawMirroredVideo(video, canvas, context);
            const overlayLocations = new ColoredRectanglesOverlay(video, context).overlayColoredRectangles();

            if(!(handPredictions.length > 0)){
                return;
            }

            const processPredictions = new HandPredictionsProcessing(handPredictions, overlayLocations, context);
            processPredictions.processHandPredictionsForSoundsToPlay();

        })
        .catch(err => {
            console.log(err);
        });
}

//start video feed from web cam
handTrack.startVideo(video)
    .then(status => {
        if (status) {
            navigator.mediaDevices.getUserMedia(
                {
                    video: {
                        width: 640
                    }
                })
                .then(stream => {
                    video.srcObject = stream;
                    setInterval(runHandDetection, 500);
                });
        }
    })
    .catch(err => {
        console.log(err);
    });

// Load the model.
handTrack.load(modelParams)
    .then(loadModel => {
        model = loadModel;
    })
    .catch(err => {
        console.log(err);
    });