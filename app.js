const video = document.getElementById("video");
const audio1 = document.getElementById("audio1");
const audio2 = document.getElementById("audio2");
const audio3 = document.getElementById("audio3");
const audio4 = document.getElementById("audio4");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const handLocation = document.getElementById("handLocation");

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

        //console.log(video.width);
        //console.log(video.height);

        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = video.width;
        canvas.height = video.height;
        context.save();
        context.scale(-1, 1);  //flips to mirror image
        context.translate(-video.width, 0);
        context.drawImage(video, 0, 0, video.width, video.height);
        context.restore();

        //draws second image with boxes
        //model.renderPredictions(predictions, canvas, context, video);

        //CODE TO INTERACT WITH SOUND WILL BE BASED ON PREDICTION DATA
        //console.log(predictions.length);
        if (predictions.length > 0) {
            processPredictions(predictions);
        }

        //need to calculate rectangles based on video width
        // Filled rectangle


        //figure rectangle size and spacing based on video width
        let rectWidth = video.width * .4;
        let rectHeight = rectWidth * .75;
        let verticalSpace = (video.width - (rectWidth * 2)) / 3;
        let horizontalSpace = verticalSpace * .75;
        let rightBoxSpacing = 0;
        let botBoxSpacing = 0;

        //upper left
        context.fillStyle = 'rgba(255, 255, 255, .5)';
        context.fillRect(verticalSpace, horizontalSpace, rectWidth, rectHeight);

        //upper right
        context.fillStyle = 'rgba(0,255,100, .5)';
        rightBoxSpacing = verticalSpace * 2 + rectWidth;
        context.fillRect(rightBoxSpacing, horizontalSpace, rectWidth, rectHeight);

        //lower left
        context.fillStyle = 'rgba(255,0,0, .5)';
        botBoxSpacing = horizontalSpace * 2 + rectHeight;
        context.fillRect(verticalSpace, botBoxSpacing, rectWidth, rectHeight);

        //lower right
        context.fillStyle = 'rgba(0,0,255, .5)';
        context.fillRect(rightBoxSpacing, botBoxSpacing, rectWidth, rectHeight);



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

function processPredictions(predictions) {
    //check on scores being about 90%
    //call for each hand in prediction
    let centerX = 0;
    let centerY = 0;

    if (!predictions.length) {
        return;
    }

    //pulls out x,y coordinates to send to sound player
    //2nd set of data is box size.  need to figure out center point
    for (let prediction of predictions) {

        //figure center coordinates of hand box
        centerX = prediction.bbox[0] + prediction.bbox[2] * .5;
        centerY = prediction.bbox[1] + prediction.bbox[3] * .5;
        console.log(`ctrx: ${centerX} and ctry: ${centerY}`);

        context.fillStyle = "white";
        context.fillRect(centerX, centerY, 10, 10);

        soundPlayer(centerX, centerY);
    }


}

function soundPlayer(x, y) {
    handLocation.innerHTML = `<p> x-axis: ${x}</p><p>y-axis: ${y}</p>`;

    //640 x 480

    if (x < 320 && y < 240) {
        audio1.play();
    } else if (x < 320 && y < 480) {
        audio2.play();
    } else if (x < 640 && y < 240) {
        audio3.play();
    } else if (x < 640 && y < 480) {
        audio4.play();
    }

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