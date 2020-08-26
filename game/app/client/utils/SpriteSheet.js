class SpriteSheet {

    /**
     * @constructor Creates an instance of SpriteSheet
     * 
     * @param {String} path Sprite sheet path
     * @param {number} frameWidth frame width
     * @param {number} frameHeight frame height
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

