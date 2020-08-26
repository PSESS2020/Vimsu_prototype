class CacheImages {

    static images = {};
    static enabled = true;

    /**
     * 
     * @param {String} key 
     * @param {Image} image 
     */
    static addImage(key, image) {
        TypeChecker.isString(key);
        TypeChecker.isInstanceOf(image, Image);

        if (this.enabled === false) return;
        this.images[key] = image;
    }

    /**
     * 
     * @param {String} key 
     */
    static getImage(key) {
        TypeChecker.isString(key);

        if (this.enabled === false) return;
        return this.images[key];

    }

    /**
     * 
     * @param {String} key 
     */
    static remove(key) {
        TypeChecker.isString(key);
        delete this.images[key];
    }

    static clear() {
        this.images = {};
    }

}