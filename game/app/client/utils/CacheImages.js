class CacheImages {

    static images = {};
    static enabled = true;

    /**
     * @static adds an image to the images
     * 
     * @param {String} key image key
     * @param {Image} image image
     */
    static addImage(key, image) {
        TypeChecker.isString(key);
        TypeChecker.isInstanceOf(image, Image);

        if (this.enabled === false) return;
        this.images[key] = image;
    }

    /**
     * @static gets an image with its key
     * 
     * @param {String} key image key
     */
    static getImage(key) {
        TypeChecker.isString(key);

        if (this.enabled === false) return;
        return this.images[key];

    }
}