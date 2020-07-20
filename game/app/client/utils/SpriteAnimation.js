class SpriteAnimation {

    #row;
    #col;

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

        this.#row = Math.floor(this.animationSequence[this.currentFrame] / this.spritesheetBody.framesPerRow);
        this.#col = Math.floor(this.animationSequence[this.currentFrame] % this.spritesheetBody.framesPerRow);
    }


    getRow() {
        return this.#row;
    }

    getCol() {
        return this.#col;
    }

    draw(x, y) {
        
        if (!this.spritesheetBody.framesPerRow) {
            console.log("can not draw because spritesheetBody is not loaded")
            return;
        }

        ctx_avatar.drawImage(
            this.spritesheetBody.image, this.#col * this.spritesheetBody.frameWidth, this.#row * this.spritesheetBody.frameHeight,
            this.spritesheetBody.frameWidth, this.spritesheetBody.frameHeight,
            x, y,
            this.spritesheetBody.frameWidth, this.spritesheetBody.frameHeight);

        ctx_avatar.drawImage(
            this.spritesheetTopCloth.image, this.#col * this.spritesheetTopCloth.frameWidth, this.#row * this.spritesheetTopCloth.frameHeight,
            this.spritesheetTopCloth.frameWidth, this.spritesheetTopCloth.frameHeight,
            x, y,
            this.spritesheetTopCloth.frameWidth, this.spritesheetTopCloth.frameHeight);

        ctx_avatar.drawImage(
            this.spriteSheetBottomClothing.image, this.#col * this.spriteSheetBottomClothing.frameWidth, this.#row * this.spriteSheetBottomClothing.frameHeight,
            this.spriteSheetBottomClothing.frameWidth, this.spriteSheetBottomClothing.frameHeight,
            x, y,
            this.spriteSheetBottomClothing.frameWidth, this.spriteSheetBottomClothing.frameHeight);

        ctx_avatar.drawImage(
            this.spriteSheetShoes.image, this.#col * this.spriteSheetShoes.frameWidth, this.#row * this.spriteSheetShoes.frameHeight,
            this.spriteSheetShoes.frameWidth, this.spriteSheetShoes.frameHeight,
            x, y,
            this.spriteSheetShoes.frameWidth, this.spriteSheetShoes.frameHeight);
    }

}
