class SpriteAnimation {

        
    constructor(spritesheet, frameRate, firstFrame, lastFrame) {
        this.currentFrame = 0;
        this.counter = 0;
        this.animationSequence = [];
        this.spritesheet = spritesheet;
        this.firstFrame = firstFrame;
        this.lastFrame = lastFrame;
        this.frameRate = frameRate;
        
    


        for (var frameNumber = this.firstFrame; frameNumber <= this.lastFrame; frameNumber++) {
            this.animationSequence.push(frameNumber);

        }
    }

    update() {
 
        if (this.counter == (this.frameRate - 1)) {
            this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
        }
        this.counter = (this.counter + 1) % this.frameRate;
    }




    draw(x, y) {
        var row = Math.floor(this.animationSequence[this.currentFrame] / this.spritesheet.framesPerRow);
        var col = Math.floor(this.animationSequence[this.currentFrame] % this.spritesheet.framesPerRow);
        console.log();
        if (!this.spritesheet.framesPerRow) {
            console.log("can not draw because spritesheet is not loaded")
            return;
        }

        ctx.drawImage(
        this.spritesheet.image, col * this.spritesheet.frameWidth, row * this.spritesheet.frameHeight,
        this.spritesheet.frameWidth, this.spritesheet.frameHeight,
        x, y,
        this.spritesheet.frameWidth, this.spritesheet.frameHeight);
        }
}