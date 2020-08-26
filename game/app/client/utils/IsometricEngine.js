class IsometricEngine {
    #xNumTiles;
    #yNumTiles;
    #mapOriginX;
    #mapOriginY;
    #tileColumnWidth = 64;
    #tileRowHeight = 32;

    #loader;

    constructor() {
        if (!!IsometricEngine.instance) {
            return IsometricEngine.instance;
        }
        IsometricEngine.instance = this;
        this.#xNumTiles = 0;
        this.#yNumTiles = 0;
        this.#mapOriginX = 0;
        this.#mapOriginY = 0;

        this.#loader = new LoadingView();
    }

    /**
     * Initializes the engines properties
     * 
     * @param {String[]} assetPaths 
     * @param {number} xNumTiles 
     * @param {number} yNumTiles 
     */
    async initGameEngine(assetPaths, xNumTiles, yNumTiles) {
        TypeChecker.isInt(xNumTiles);
        TypeChecker.isInt(yNumTiles);

        this.#xNumTiles = xNumTiles;
        this.#yNumTiles = yNumTiles;

        //origin that indicates where to start drawing the map assets.
        this.#mapOriginX = ctx_map.canvas.width / 2 - this.#xNumTiles * this.#tileRowHeight;
        this.#mapOriginY = ctx_map.canvas.height / 2;

        return await this.loadImages(assetPaths);
    }

    /**
     * 
     * @param {number} xNumTiles 
     * @param {number} yNumTiles 
     */
    setNumMapTilesXY(xNumTiles, yNumTiles) {
        TypeChecker.isInt(xNumTiles);
        TypeChecker.isInt(yNumTiles);

        this.#xNumTiles = xNumTiles;
        this.#yNumTiles = yNumTiles;
    }

    /**
     * 
     * @param {number} mapOriginX 
     * @param {number} mapOriginY 
     */
    setMapOriginXY(mapOriginX, mapOriginY) {
        TypeChecker.isInt(mapOriginX);
        TypeChecker.isInt(mapOriginY);

        this.#mapOriginX = mapOriginX;
        this.#mapOriginY = mapOriginY;
    }

    getTileColumnWidth() {
        return this.#tileColumnWidth;
    }

    getTileRowHeight() {
        return this.#tileRowHeight;
    }

    getNumMapTilesXY() {
        return {
            x: this.#xNumTiles,
            y: this.#yNumTiles
        }
    }

    getMapOriginXY() {
        return {
            x: this.#mapOriginX,
            y: this.#mapOriginY
        }
    }

    /**
     * loads the images that are needed for object view creation.
     * 
     * @param {String[]} assetPaths 
     */
    async loadImages(assetPaths) {
        for (const [value] of Object.entries(assetPaths)) {
            TypeChecker.isString(value);
        }

        var imageLoader = new ImageLoader();
        var totalImages = Object.keys(assetPaths).length;

        var assetImages = {};
        var loadedImages = 0;

        // Load all the images before we run the app
        for (var key in assetPaths) {
            assetImages[key] = await imageLoader.loadImage(key, assetPaths[key]);

            loadedImages++;

            this.#loader.contentLoaded(totalImages, loadedImages);

            if (loadedImages >= totalImages) {
                return Promise.all(Object.entries(assetImages)).then(() => {
                    this.#loader.doneLoading();

                    return assetImages;
                });

            }

        }
    }

    /**
     * 
     * @param {number} xPos 
     * @param {number} yPos 
     */
    calculateScreenPosXY(xPos, yPos) {
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);

        if (this.#tileColumnWidth !== undefined && this.#tileRowHeight !== undefined) {
            return {
                x: xPos * this.#tileColumnWidth / 2 + yPos * this.#tileColumnWidth / 2 + this.#mapOriginX,
                y: yPos * this.#tileRowHeight / 2 - xPos * this.#tileRowHeight / 2 + this.#mapOriginY
            }
        }
    }

    /**
     * 
     * @param {number} xPos 
     * @param {number} yPos 
     */
    calculateScreenPosX(xPos, yPos) {
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);

        if (this.#tileColumnWidth !== undefined && this.#tileRowHeight !== undefined)
            return xPos * this.#tileColumnWidth / 2 + yPos * this.#tileColumnWidth / 2 + this.#mapOriginX;
    }

    /**
     * 
     * @param {number} xPos 
     * @param {number} yPos 
     */
    calculateScreenPosY(xPos, yPos) {
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);

        if (this.#tileColumnWidth !== undefined && this.#tileRowHeight !== undefined)
            return yPos * this.#tileRowHeight / 2 - xPos * this.#tileRowHeight / 2 + this.#mapOriginY;
    }

    /**
     * 
     * @param {Canvas} canvas 
     * @param {Event} e 
     */
    translateMouseToCanvasPos(canvas, e) {

        //gets the absolute size of canvas and calculates the scaling factor
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;

        //Apply scaling factor to cursor position
        return {
            x: (e.pageX - rect.left) * scaleX,
            y: (e.pageY - rect.top) * scaleY,

        }
    }

    /**
     * 
     * @param {{x: number, y: number}} newPosition 
     */
    translateMouseToTileCord(newPosition) {
        TypeChecker.isNumber(newPosition.x);
        TypeChecker.isNumber(newPosition.y);

        if (this.#mapOriginX !== undefined && this.#mapOriginY !== undefined
            && this.#tileColumnWidth !== undefined && this.#tileRowHeight !== undefined) {

            //Adjusts mouse position to the tile position. 
            var newPosX = newPosition.x - this.#tileColumnWidth / 2 - this.#mapOriginX;
            var newPosY = newPosition.y - this.#tileRowHeight / 2 - this.#mapOriginY;

            //Calculate the tile at which the current mouse cursor points.
            var selectedTileX = Math.round(newPosX / this.#tileColumnWidth - newPosY / this.#tileRowHeight);
            var selectedTileY = Math.round(newPosX / this.#tileColumnWidth + newPosY / this.#tileRowHeight);

            return {
                x: selectedTileX,
                y: selectedTileY,
            }

        }
    }
}