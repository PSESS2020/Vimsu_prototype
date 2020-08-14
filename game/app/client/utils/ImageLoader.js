class ImageLoader {

    constructor() { }

    async loadImage(key, path) {

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