const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//start video feed from web cam
handTrack.startVideo(video)
    .then(status => {
        if (status) {
            navigator.mediaDevices.getUserMedia(
                { video: {} },
                (stream) => {
                    video.srcObject = stream;
                },
                (err) => {
                    console.log("Video feed not working.");
                }
            )
        }
    });

// Load the model.
handTrack.load().then(model => {
    // detect objects in the image.
    model.detect(video).then(predictions => {
        console.log('Predictions: ', predictions);
    });
});



const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
}

handTrack.load(modelParams).then(model => {
    // model.detect(video).then(predictions => {
    //     //console.log(predictions);
    // });
});

// WebGL2RenderingContext.getBufferSubData()
// o.getBufferSubData(p.ARRAY_BUFFER, 0, a)
