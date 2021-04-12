/**
 * The Image Loader
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ImageLoader {

    /**
     * Creates an ImageLoader instance
     */
    constructor() { }

    /**
     * loads an image
     * 
     * @param {String} key image key
     * @param {String} path image path
     */
    async loadImage(key, path) {
        TypeChecker.isString(key);
        TypeChecker.isString(path);

        console.log("do we have " + key + " cached?")

        const cached = new ImageCache().getImage(key);

        if (cached !== undefined) {
            console.log("we do")
            return cached;
        }

        console.log("we don't")

        return new Promise((resolve, reject) => {
            const image = new Image();

            console.log("new image created")

            image.onload = () => {
                console.log("loading complete")
                new ImageCache().addImage(key, image);
                resolve(image);
            }

            image.src = path;
            console.log("loading image...")
        });
    }
}