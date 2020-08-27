/**
 * The Sprite Animation
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class SpriteAnimation {

    /**
     * @constructor Creates an instance of Sprite Animation
     * 
     * @param {SpriteSheet} spritesheetBody sprite sheet avatar body
     * @param {SpriteSheet} spritesheetTopCloth sprite sheet avatar top cloth
     * @param {SpriteSheet} spriteSheetBottomClothing sprite sheet avatar bottom clothing
     * @param {SpriteSheet} spriteSheetShoes sprite sheet avatar shoes
     * @param {number} frameRate frame rate
     * @param {number} firstFrame first frame
     * @param {number} lastFrame last frame
     */
    constructor(spritesheetBody, spritesheetTopCloth, spriteSheetBottomClothing, spriteSheetShoes, frameRate, firstFrame, lastFrame) {
        TypeChecker.isInstanceOf(spritesheetBody, SpriteSheet);
        TypeChecker.isInstanceOf(spritesheetTopCloth, SpriteSheet);
        TypeChecker.isInstanceOf(spriteSheetBottomClothing, SpriteSheet);
        TypeChecker.isInstanceOf(spriteSheetShoes, SpriteSheet);
        TypeChecker.isInt(frameRate);
        TypeChecker.isInt(firstFrame);
        TypeChecker.isInt(lastFrame);

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

    /**
     * Update sprite animation
     */
    update() {
        if (this.counter == (this.frameRate - 1)) {
            this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
        }
        this.counter = (this.counter + 1) % this.frameRate;
    }

    /**
     * Draw sprite animation
     * 
     * @param {number} x x position
     * @param {number} y y position
     */
    draw(x, y) {
        TypeChecker.isInt(x);
        TypeChecker.isInt(y);

        var row = Math.floor(this.animationSequence[this.currentFrame] / this.spritesheetBody.framesPerRow);
        var col = Math.floor(this.animationSequence[this.currentFrame] % this.spritesheetBody.framesPerRow);
        if (!this.spritesheetBody.framesPerRow) {
            return;
        }

        ctx_avatar.drawImage(
            this.spritesheetBody.image, col * this.spritesheetBody.frameWidth, row * this.spritesheetBody.frameHeight,
            this.spritesheetBody.frameWidth, this.spritesheetBody.frameHeight,
            x, y,
            this.spritesheetBody.frameWidth, this.spritesheetBody.frameHeight);

        ctx_avatar.drawImage(
            this.spritesheetTopCloth.image, col * this.spritesheetTopCloth.frameWidth, row * this.spritesheetTopCloth.frameHeight,
            this.spritesheetTopCloth.frameWidth, this.spritesheetTopCloth.frameHeight,
            x, y,
            this.spritesheetTopCloth.frameWidth, this.spritesheetTopCloth.frameHeight);

        ctx_avatar.drawImage(
            this.spriteSheetBottomClothing.image, col * this.spriteSheetBottomClothing.frameWidth, row * this.spriteSheetBottomClothing.frameHeight,
            this.spriteSheetBottomClothing.frameWidth, this.spriteSheetBottomClothing.frameHeight,
            x, y,
            this.spriteSheetBottomClothing.frameWidth, this.spriteSheetBottomClothing.frameHeight);

        ctx_avatar.drawImage(
            this.spriteSheetShoes.image, col * this.spriteSheetShoes.frameWidth, row * this.spriteSheetShoes.frameHeight,
            this.spriteSheetShoes.frameWidth, this.spriteSheetShoes.frameHeight,
            x, y,
            this.spriteSheetShoes.frameWidth, this.spriteSheetShoes.frameHeight);
    }

}
