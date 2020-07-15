class ImageLoader {

    constructor() { }

    async loadImage(path) {

        const cached = CacheImages.getImage(path);
        
        if (cached !== undefined) {
            return cached;
        }
        
        return new Promise((resolve, reject) => {
            const image = new Image();
            
            image.onload = () => {
                CacheImages.addImage(path, image);
                resolve(image);
            }

            image.src = path;
        });
}
}