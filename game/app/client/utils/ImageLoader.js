class ImageLoader {

    constructor() { }

    /**
     * 
     * @param {String} key 
     * @param {String} path 
     */
    async loadImage(key, path) {
        TypeChecker.isString(key);
        TypeChecker.isString(path);
        
        const cached = CacheImages.getImage(key);

        if (cached !== undefined) {
            return cached;
        }

        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                CacheImages.addImage(key, image);
                resolve(image);
            }

            image.src = path;
        });
    }
}