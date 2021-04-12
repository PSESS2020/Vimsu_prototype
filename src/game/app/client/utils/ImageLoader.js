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

        const cached = new ImageCache().getImage(key);

        if (cached !== undefined) {
            return cached;
        }

        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                new ImageCache().addImage(key, image);
                resolve(image);
            }

            image.onerror = (errorMsg, url, lineNumber, column, errorObj) => {
                console.log("big broken!")
                console.log('Fehler: ' + errorMsg + 
                ' Script: ' + url + 
                ' Zeile: ' + lineNumber + 
                ' Spalte: ' + column + 
                ' StackTrace: ' +  errorObj)
            }

            image.src = path;
            console.log("loading image...")
        });
    }
}