
function drawMirroredVideo(video, canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = video.width;
    canvas.height = video.height;
    context.save();
    context.scale(-1, 1);  //flips to mirror image
    context.translate(-video.width, 0);
    context.drawImage(video, 0, 0, video.width, video.height);
    context.restore();
}

function processPredictions(predictions, rectLocations) {

    let centerX = 0;
    let centerY = 0;

    if (!predictions.length) {
        return;
    }

    //pulls out x,y coordinates to send to sound player
    for (let prediction of predictions) {

        //figure center coordinates of hand box
        centerX = prediction.bbox[0] + prediction.bbox[2] * .5;
        centerY = prediction.bbox[1] + prediction.bbox[3] * .5;

        //draws white dot for hand location
        context.fillStyle = "white";
        context.fillRect(centerX, centerY, 10, 10);

        soundPlayer(centerX, centerY, rectLocations);
    }


}

function overlayRectangles(video, context) {

    //figure rectangle size and spacing based on video width
    let rectWidth = video.width * .3;
    let rectHeight = rectWidth * .75;
    let xSpacing = (video.width - (rectWidth * 2)) / 3;
    let ySpacing = xSpacing * .75;
    let rightBoxSpacing = 0;
    let botBoxSpacing = 0;
    let rectLocations = {};

    //upper left
    rectLocations = {
        upperLeft: [xSpacing, ySpacing, rectWidth, rectHeight]
    };
    drawRect("rgba(0,255,100, .5)", rectLocations.upperLeft, context);

    //upper right
    rightBoxSpacing = xSpacing * 2 + rectWidth;
    rectLocations.upperRight = [rightBoxSpacing, ySpacing, rectWidth, rectHeight];
    drawRect("rgba(255,150,0, .5)", rectLocations.upperRight, context);

    //lower left
    botBoxSpacing = ySpacing * 2 + rectHeight;
    rectLocations.lowerLeft = [xSpacing, botBoxSpacing, rectWidth, rectHeight];
    drawRect("rgba(128, 0, 128, .5)", rectLocations.lowerLeft, context);

    //lower right
    rectLocations.lowerRight = [rightBoxSpacing, botBoxSpacing, rectWidth, rectHeight];
    drawRect("rgba(0,0,255, .5)", rectLocations.lowerRight, context);

    return rectLocations;
}

function drawRect(color, rect, context) {
    context.fillStyle = color;
    context.fillRect(rect[0], rect[1], rect[2], rect[3]);
}

function soundPlayer(x, y, locations) {

    const { upperLeft, lowerLeft, upperRight, lowerRight } = locations;

    //box arrays:  xStart, yStart, xWidth, yHeight
    let upperTopEdge = upperLeft[1];
    let upperBotEdge = upperLeft[1] + upperLeft[3];
    let lowerTopEdge = lowerLeft[1];
    let lowerBotEdge = lowerLeft[1] + lowerLeft[3];
    let leftBoxLeftEdge = upperLeft[0];
    let leftBoxRightEdge = upperLeft[0] + upperLeft[2];
    let rightBoxLeftEdge = upperRight[0];
    let rightBoxRightEdge = upperRight[0] + upperRight[2];


    if (y > upperTopEdge && y < upperBotEdge) {
        //top boxes
        if (x > leftBoxLeftEdge && x < leftBoxRightEdge) {
            //play upper left sound
            audio1.play();
        } else if (x > rightBoxLeftEdge && x < rightBoxRightEdge) {
            //play upper right sound
            audio2.play();
        }
    } else if (y > lowerTopEdge && y < lowerBotEdge) {
        //bottom boxes
        if (x > leftBoxLeftEdge && x < leftBoxRightEdge) {
            //play lower left sound
            audio3.play();
        } else if (x > rightBoxLeftEdge && x < rightBoxRightEdge) {
            //play lower right sound
            audio4.play();
        }
    }


}