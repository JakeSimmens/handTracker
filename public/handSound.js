
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

function processHandPredictionsForSoundsToPlay(handPredictions, soundBoxLocations) {

    if (!handPredictions.length) {
        return;
    }

    //pulls out x,y coordinates to send to sound player
    for (let handPrediction of handPredictions) {

        const { centerX, centerY } = markCenterLocationOfHandBox(handPrediction.bbox);
        playSoundBasedOnLocation(centerX, centerY, soundBoxLocations);
    }
}

function markCenterLocationOfHandBox(box) {

    const [upperLeftX, upperLeftY, boxWidth, boxHeight] = box;
    let centerX = upperLeftX + boxWidth * .5;
    let centerY = upperLeftY + boxHeight * .5;

    //draws white dot for hand location
    context.fillStyle = "white";
    context.fillRect(centerX, centerY, 5, 5);
    return { centerX, centerY };
}

function overlayColoredRectangles(video, context) {

    //figure rectangle size and spacing based on video width
    let rectWidth = video.width * .3;
    let rectHeight = rectWidth * .75;
    let horizontalSpacingAroundBox = (video.width - (rectWidth * 2)) / 3;
    let verticalSpacingAroundBox = horizontalSpacingAroundBox * .75;
    let rightBoxSpacing = 0;
    let botBoxSpacing = 0;
    let rectLocations = {};

    //upper left
    rectLocations.upperLeft = [horizontalSpacingAroundBox, verticalSpacingAroundBox, rectWidth, rectHeight];
    drawColoredRectangle("rgba(0,255,100, .5)", rectLocations.upperLeft, context);

    //upper right
    rightBoxSpacing = horizontalSpacingAroundBox * 2 + rectWidth;
    rectLocations.upperRight = [rightBoxSpacing, verticalSpacingAroundBox, rectWidth, rectHeight];
    drawColoredRectangle("rgba(255,150,0, .5)", rectLocations.upperRight, context);

    //lower left
    botBoxSpacing = verticalSpacingAroundBox * 2 + rectHeight;
    rectLocations.lowerLeft = [horizontalSpacingAroundBox, botBoxSpacing, rectWidth, rectHeight];
    drawColoredRectangle("rgba(128, 0, 128, .5)", rectLocations.lowerLeft, context);

    //lower right
    rectLocations.lowerRight = [rightBoxSpacing, botBoxSpacing, rectWidth, rectHeight];
    drawColoredRectangle("rgba(0,0,255, .5)", rectLocations.lowerRight, context);

    return rectLocations;
}

function drawColoredRectangle(color, rectangleData, context) {
    context.fillStyle = color;
    context.fillRect(rectangleData[0], rectangleData[1], rectangleData[2], rectangleData[3]);
}

function playSoundBasedOnLocation(pointerLocationX, pointerLocationY, soundBoxLocations) {

    const { upperLeft, lowerLeft, upperRight, lowerRight } = soundBoxLocations;

    //box arrays:  [xStart, yStart, xWidth, yHeight]
    let upperBoxTopEdge = upperLeft[1];
    let upperBoxBottomEdge = upperLeft[1] + upperLeft[3];
    let lowerBoxTopEdge = lowerLeft[1];
    let lowerBoxBottomEdge = lowerLeft[1] + lowerLeft[3];
    let leftBoxLeftEdge = upperLeft[0];
    let leftBoxRightEdge = upperLeft[0] + upperLeft[2];
    let rightBoxLeftEdge = upperRight[0];
    let rightBoxRightEdge = upperRight[0] + upperRight[2];


    if (pointerLocationY > upperBoxTopEdge && pointerLocationY < upperBoxBottomEdge) {
        topBoxesPlaySound(pointerLocationX, leftBoxLeftEdge, leftBoxRightEdge, rightBoxLeftEdge, rightBoxRightEdge);
    } else if (pointerLocationY > lowerBoxTopEdge && pointerLocationY < lowerBoxBottomEdge) {
        bottomBoxesPlaySound(pointerLocationX, leftBoxLeftEdge, leftBoxRightEdge, rightBoxLeftEdge, rightBoxRightEdge);
    }
}

function topBoxesPlaySound(x, leftBoxLeftEdge, leftBoxRightEdge, rightBoxLeftEdge, rightBoxRightEdge) {
    if (x > leftBoxLeftEdge && x < leftBoxRightEdge) {
        //play left sound
        audio1.play();
    } else if (x > rightBoxLeftEdge && x < rightBoxRightEdge) {
        //play right sound
        audio2.play();
    }
}

function bottomBoxesPlaySound(x, leftBoxLeftEdge, leftBoxRightEdge, rightBoxLeftEdge, rightBoxRightEdge) {
    if (x > leftBoxLeftEdge && x < leftBoxRightEdge) {
        //play left sound
        audio3.play();
    } else if (x > rightBoxLeftEdge && x < rightBoxRightEdge) {
        //play right sound
        audio4.play();
    }
}