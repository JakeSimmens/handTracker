
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

class ColoredRectanglesOverlay{

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