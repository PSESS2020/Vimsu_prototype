class SpriteAnimation {
    constructor(spritesheetBody, spritesheetTopCloth, spriteSheetBottomClothing, spriteSheetShoes, frameRate, firstFrame, lastFrame) {
        this.currentFrame = 0;
        this.counter = 0;
        this.animationSequence = [];
        this.spritesheetBody = spritesheetBody;
        this.spritesheetTopCloth = spritesheetTopCloth;
        this.spriteSheetBottomClothing = spriteSheetBottomClothing;
        this.spriteSheetShoes = spriteSheetShoes;
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
        var row = Math.floor(this.animationSequence[this.currentFrame] / this.spritesheetBody.framesPerRow);
        var col = Math.floor(this.animationSequence[this.currentFrame] % this.spritesheetBody.framesPerRow);
        console.log();
        if (!this.spritesheetBody.framesPerRow) {
            console.log("can not draw because spritesheetBody is not loaded")
            return;
        }

        ctx.drawImage(
            this.spritesheetBody.image, col * this.spritesheetBody.frameWidth, row * this.spritesheetBody.frameHeight,
            this.spritesheetBody.frameWidth, this.spritesheetBody.frameHeight,
            x, y,
            this.spritesheetBody.frameWidth, this.spritesheetBody.frameHeight);

        ctx.drawImage(
            this.spritesheetTopCloth.image, col * this.spritesheetTopCloth.frameWidth, row * this.spritesheetTopCloth.frameHeight,
            this.spritesheetTopCloth.frameWidth, this.spritesheetTopCloth.frameHeight,
            x, y,
            this.spritesheetTopCloth.frameWidth, this.spritesheetTopCloth.frameHeight);

        ctx.drawImage(
            this.spriteSheetBottomClothing.image, col * this.spriteSheetBottomClothing.frameWidth, row * this.spriteSheetBottomClothing.frameHeight,
            this.spriteSheetBottomClothing.frameWidth, this.spriteSheetBottomClothing.frameHeight,
            x, y,
            this.spriteSheetBottomClothing.frameWidth, this.spriteSheetBottomClothing.frameHeight);

        ctx.drawImage(
            this.spriteSheetShoes.image, col * this.spriteSheetShoes.frameWidth, row * this.spriteSheetShoes.frameHeight,
            this.spriteSheetShoes.frameWidth, this.spriteSheetShoes.frameHeight,
            x, y,
            this.spriteSheetShoes.frameWidth, this.spriteSheetShoes.frameHeight);
    }

}
