class SpriteSheet {

    /**
     * 
     * @param {String} path 
     * @param {number} frameWidth 
     * @param {number} frameHeight 
     */
    constructor(path, frameWidth, frameHeight) {
        TypeChecker.isString(path);
        TypeChecker.isInt(frameWidth);
        TypeChecker.isInt(frameHeight);

        this.image = new Image();
        this.path = path;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        var self = this;
        this.image.onload = function () {
            self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
        };

        this.image.src = path;

    }
}

