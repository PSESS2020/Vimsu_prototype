class CacheImages {

    static images = {};
    static enabled = true;

    static addImage(key, image) {
        if (this.enabled === false) return;

        this.images[key] = image;
    }

    static getImage(key) {

        if (this.enabled === false) return;
        return this.images[key];

    }

    static remove(key) {

        delete this.images[key];

    }

    static clear() {

        this.images = {};

    }

}