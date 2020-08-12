
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

class ColoredRectanglesOverlay {

    constructor(video, context) {
        this.videoDisplay = video;
        this.context = context;
        this.rectWidth = video.width * .3;
        this.rectHeight = this.rectWidth * .75;
        this.horizontalSpaceBetweenBox = (video.width - (this.rectWidth * 2)) / 3;
        this.verticalSpaceBetweenBox = this.horizontalSpaceBetweenBox * .75;
        this.rectLocations = {
            upperLeft: [],
            upperRight: [],
            lowerLeft: [],
            lowerRight: []
        };
    }


    overlayColoredRectangles() {

        this.calculateRectangleLocations();

        let rect = this.rectLocations;
        this.drawColoredRectangle("rgba(0,255,100, .5)", rect.upperLeft);
        this.drawColoredRectangle("rgba(255,150,0, .5)", rect.upperRight);
        this.drawColoredRectangle("rgba(128, 0, 128, .5)", rect.lowerLeft);
        this.drawColoredRectangle("rgba(0,0,255, .5)", rect.lowerRight);

        return rect;
    }

    calculateRectangleLocations() {
        this.rectLocations.upperLeft = [
            this.horizontalSpaceBetweenBox,
            this.verticalSpaceBetweenBox,
            this.rectWidth,
            this.rectHeight
        ];

        let leftEdgeOfRightBox = this.horizontalSpaceBetweenBox * 2 + this.rectWidth;
        this.rectLocations.upperRight = [
            leftEdgeOfRightBox,
            this.verticalSpaceBetweenBox,
            this.rectWidth,
            this.rectHeight
        ];

        let topEdgeOfBottomBox = this.verticalSpaceBetweenBox * 2 + this.rectHeight;
        this.rectLocations.lowerLeft = [
            this.horizontalSpaceBetweenBox,
            topEdgeOfBottomBox,
            this.rectWidth,
            this.rectHeight
        ];

        this.rectLocations.lowerRight = [
            leftEdgeOfRightBox,
            topEdgeOfBottomBox,
            this.rectWidth,
            this.rectHeight
        ];
    }

    drawColoredRectangle(color, rectangleData) {
        this.context.fillStyle = color;
        this.context.fillRect(rectangleData[0], rectangleData[1], rectangleData[2], rectangleData[3]);
    }
}



function overlayColoredRectangles(video, context) {

    //figure rectangle size and spacing based on video width
    let rectWidth = video.width * .3;
    let rectHeight = rectWidth * .75;
    let horizontalSpaceBetweenBox = (video.width - (rectWidth * 2)) / 3;
    let verticalSpaceBetweenBox = horizontalSpaceBetweenBox * .75;
    let leftEdgeOfRightBox = 0;
    let topEdgeOfBottomBox = 0;
    let rectLocations = {};

    //upper left
    rectLocations.upperLeft = [horizontalSpaceBetweenBox, verticalSpaceBetweenBox, rectWidth, rectHeight];
    drawColoredRectangle("rgba(0,255,100, .5)", rectLocations.upperLeft, context);

    //upper right
    leftEdgeOfRightBox = horizontalSpaceBetweenBox * 2 + rectWidth;
    rectLocations.upperRight = [leftEdgeOfRightBox, verticalSpaceBetweenBox, rectWidth, rectHeight];
    drawColoredRectangle("rgba(255,150,0, .5)", rectLocations.upperRight, context);

    //lower left
    topEdgeOfBottomBox = verticalSpaceBetweenBox * 2 + rectHeight;
    rectLocations.lowerLeft = [horizontalSpaceBetweenBox, topEdgeOfBottomBox, rectWidth, rectHeight];
    drawColoredRectangle("rgba(128, 0, 128, .5)", rectLocations.lowerLeft, context);

    //lower right
    rectLocations.lowerRight = [leftEdgeOfRightBox, topEdgeOfBottomBox, rectWidth, rectHeight];
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