const handLocation = document.getElementById("handLocation");

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
    context.fillStyle = 'rgba(255, 255, 255, .5)';
    context.fillRect(xSpacing, ySpacing, rectWidth, rectHeight);
    rectLocations = {
        upperLeft: [xSpacing, ySpacing, rectWidth, rectHeight]
    };

    //upper right
    context.fillStyle = 'rgba(0,255,100, .5)';
    rightBoxSpacing = xSpacing * 2 + rectWidth;
    context.fillRect(rightBoxSpacing, ySpacing, rectWidth, rectHeight);
    rectLocations.upperRight = [rightBoxSpacing, ySpacing, rectWidth, rectHeight];

    //lower left
    context.fillStyle = 'rgba(255,0,0, .5)';
    botBoxSpacing = ySpacing * 2 + rectHeight;
    context.fillRect(xSpacing, botBoxSpacing, rectWidth, rectHeight);
    rectLocations.lowerLeft = [xSpacing, botBoxSpacing, rectWidth, rectHeight];

    //lower right
    context.fillStyle = 'rgba(0,0,255, .5)';
    context.fillRect(rightBoxSpacing, botBoxSpacing, rectWidth, rectHeight);
    rectLocations.lowerRight = [rightBoxSpacing, botBoxSpacing, rectWidth, rectHeight];

    return rectLocations;
}

function soundPlayer(x, y, locations) {
    handLocation.innerHTML = `<p> x-axis: ${x}</p><p>y-axis: ${y}</p>`;

    //destructure into variables of arrays
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
            //play upperleft sound
            audio1.play();
        } else if (x > rightBoxLeftEdge && x < rightBoxRightEdge) {
            //play upperright sound
            audio2.play();
        }
    } else if (y > lowerTopEdge && y < lowerBotEdge) {
        //bottom boxes
        if (x > leftBoxLeftEdge && x < leftBoxRightEdge) {
            //play lowerleft sound
            audio3.play();
        } else if (x > rightBoxLeftEdge && x < rightBoxRightEdge) {
            //play lowerright sound
            audio4.play();
        }
    }


}