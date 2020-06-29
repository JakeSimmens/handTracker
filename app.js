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
//video.width = 720;


const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
}

//access video feed based on browser
// navigator.getUserMedia = navigator.getUserMedia ||
//     navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia ||
//     navigator.msGetUserMedia;


//detect hands in video
function runDetection() {
    model.detect(video)
        .then(predictions => {

            let overlayLocations;

            drawMirroredVideo(video, canvas, context);

            //Handtrack's method of drawing second image with boxes of hand locations
            //model.renderPredictions(predictions, canvas, context, video);

            overlayLocations = overlayRectangles(video, context);

            //Code to interact wtih sound is based on prediction data
            if (predictions.length > 0) {
                processPredictions(predictions, overlayLocations);
            }

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
                    },
                    audio: false
                })
                .then(stream => {
                    video.srcObject = stream;
                    setInterval(runDetection, 500);
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
