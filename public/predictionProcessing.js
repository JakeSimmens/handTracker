class HandPredictionsProcessing{

    constructor(handPredictions, soundBoxLocations, context){
        this.predictions = handPredictions;
        this.soundBoxLocations = soundBoxLocations;
        this.context = context;
    }

    updatePredictions(newPredictions){
        this.predictions = newPredictions;
    }

    processHandPredictionsForSoundsToPlay() {

        if (!this.predictions.length) {

            return;
        }

        let makeSounds = new SoundPosition(this.soundBoxLocations);
    
        //pulls out x,y coordinates to send to sound player
        for (let handPrediction of this.predictions) {
    
            const { centerX, centerY } = this.markCenterLocationOfHandBox(handPrediction.bbox);
            //playSoundBasedOnLocation(centerX, centerY, this.soundBoxLocations);
            makeSounds.updatePointerLocation(centerX, centerY);
            makeSounds.playSoundBasedOnLocation();
        }
    }
    
    markCenterLocationOfHandBox(box) {
    
        const [upperLeftX, upperLeftY, boxWidth, boxHeight] = box;
        let centerX = upperLeftX + boxWidth * .5;
        let centerY = upperLeftY + boxHeight * .5;
    
        //draws white dot for hand location
        this.context.fillStyle = "white";
        this.context.fillRect(centerX, centerY, 5, 5);
        return { centerX, centerY };
    }
}

class SoundPosition{

    constructor(soundBoxLocations){
        this.x = 0;//pointerLocationX;
        this.y = 0;//pointerLocationY;
        this.soundBoxLocations = soundBoxLocations;

        this.upperBoxTopEdge;
        this.upperBoxBottomEdge;
        this.lowerBoxTopEdge;
        this.lowerBoxBottomEdge;
        this.leftBoxLeftEdge;
        this.leftBoxRightEdge;
        this.rightBoxLeftEdge;
        this.rightBoxRightEdge;
        this.calculateBoxEdges();

    }

    updatePointerLocation(x,y){
        this.x = x;
        this.y = y;
    }

    calculateBoxEdges(){
        const { upperLeft, lowerLeft, upperRight, lowerRight } = this.soundBoxLocations;
    
        //box arrays:  [xStart, yStart, xWidth, yHeight]
        this.upperBoxTopEdge = upperLeft[1];
        this.upperBoxBottomEdge = upperLeft[1] + upperLeft[3];
        this.lowerBoxTopEdge = lowerLeft[1];
        this.lowerBoxBottomEdge = lowerLeft[1] + lowerLeft[3];
        this.leftBoxLeftEdge = upperLeft[0];
        this.leftBoxRightEdge = upperLeft[0] + upperLeft[2];
        this.rightBoxLeftEdge = upperRight[0];
        this.rightBoxRightEdge = upperRight[0] + upperRight[2];
    }

    playSoundBasedOnLocation() {
        let y = this.y;
    
        if (y > this.upperBoxTopEdge && y < this.upperBoxBottomEdge) {
            this.topBoxesPlaySound();
        } else if (y > this.lowerBoxTopEdge && y < this.lowerBoxBottomEdge) {
            this.bottomBoxesPlaySound();
        }
    }
    
    topBoxesPlaySound() {

        let x = this.x;

        if (x > this.leftBoxLeftEdge && x < this.leftBoxRightEdge) {
            //play left sound
            audio1.play();
        } else if (x > this.rightBoxLeftEdge && x < this.rightBoxRightEdge) {
            //play right sound
            audio2.play();
        }
    }
    
    bottomBoxesPlaySound() {
        let x = this.x;

        if (x > this.leftBoxLeftEdge && x < this.leftBoxRightEdge) {
            //play left sound
            audio3.play();
        } else if (x > this.rightBoxLeftEdge && x < this.rightBoxRightEdge) {
            //play right sound
            audio4.play();
        }
    }
}
