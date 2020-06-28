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

function overlayRectangles(video, context) {

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