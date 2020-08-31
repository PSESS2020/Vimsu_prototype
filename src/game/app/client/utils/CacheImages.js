/**
 * The Cache Images
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class CacheImages {

    static images = new Map();
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
        this.images.set(key, image);
    }

    /**
     * @static gets an image with its key
     * 
     * @param {String} key image key
     */
    static getImage(key) {
        TypeChecker.isString(key);

        if (this.enabled === false) return;
        return this.images.get(key);

    }
}