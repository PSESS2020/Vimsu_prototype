class IsometricEngine {
    #xNumTiles;
    #yNumTiles;
    #mapOriginX;
    #mapOriginY;
    #tileWidth;
    #tileHeight;

    //For calculation the right positions of sprites on the map.
    #assetOffsets;
    #loader;

    constructor() {
        if(!!IsometricEngine.instance) {
            return IsometricEngine.instance;
        }
        IsometricEngine.instance = this;
        this.#xNumTiles = 0;
        this.#yNumTiles = 0;
        this.#mapOriginX = 0;
        this.#mapOriginY = 0;

        this.#loader = new LoadingView();
    }

    //Initializes the engines properties
    async initGameEngine(assetPaths, xNumTiles, yNumTiles) {
        this.#xNumTiles = xNumTiles;
        this.#yNumTiles = yNumTiles;
        
        //origin that indicates where to start drawing the map assets.
        this.#mapOriginX = 0;
        this.#mapOriginY = 0;

        return await this.loadImages(assetPaths);
    }

    setNumMapTilesXY(xNumTiles, yNumTiles) {
        this.#xNumTiles = xNumTiles;
        this.#yNumTiles = yNumTiles;
    }

    setMapOriginXY(mapOriginX, mapOriginY) {
        this.#mapOriginX = mapOriginX;
        this.#mapOriginY = mapOriginY;
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

    //loads the images that are needed for object view creation.
    async loadImages(assetPaths) {
        var imageLoader = new ImageLoader();
        var totalImages = Object.keys(assetPaths).length;

        this.tileImages = new Array(totalImages).fill(0);
        var loadedImages = 0;
        //console.log(assetPaths);

            // Load all the images before we run the app
            for (var key in assetPaths) {
                this.tileImages[loadedImages] = await imageLoader.loadImage(key, assetPaths[key]);

                loadedImages++;
                this.#loader.contentLoaded(totalImages, loadedImages);

                if (loadedImages >= totalImages) {
                    return Promise.all(this.tileImages).then(() => {
                        this.#loader.doneLoading();

                        var offset = {
                            //tileColumnOffset: this.tileImages[0],
                            //tileRowOffset: this.tileImages[0] / 2,
                            tileColumnOffset: 64,
                            tileRowOffset: 32,
                            wallColumnOffset: this.tileImages[1].width,
                            tableRowOffset: this.tileImages[totalImages - 2].height,
                            plantRowOffset: this.tileImages[totalImages - 1].height
                        };

                        this.#mapOriginX = ctx_map.canvas.width / 2 - this.#xNumTiles * offset.tileRowOffset;
                        this.#mapOriginY = ctx_map.canvas.height / 2;

                        this.#tileWidth = offset.tileColumnOffset;
                        this.#tileHeight = offset.tileRowOffset;
                        
                        this.#assetOffsets = offset;
                        return offset;
                    });

                }

        }
    }

    calculateScreenPosXY(xPos, yPos) {
        if (this.#assetOffsets !== undefined && this.#assetOffsets.tileColumnOffset !== undefined && this.#assetOffsets.tileRowOffset !== undefined) {
            return {
                x: xPos * this.#assetOffsets.tileColumnOffset / 2 + yPos * this.#assetOffsets.tileColumnOffset / 2 + this.#mapOriginX,
                y: yPos * this.#assetOffsets.tileRowOffset / 2 - xPos * this.#assetOffsets.tileRowOffset / 2 + this.#mapOriginY
            }
        }
    }

    calculateScreenPosX(xPos, yPos) {
        if (this.#assetOffsets !== undefined && this.#assetOffsets.tileColumnOffset !== undefined && this.#assetOffsets.tileRowOffset !== undefined)
            return xPos * this.#assetOffsets.tileColumnOffset / 2 + yPos * this.#assetOffsets.tileColumnOffset / 2 + this.#mapOriginX;
    }

    calculateScreenPosY(xPos, yPos) {
        if (this.#assetOffsets !== undefined && this.#assetOffsets.tileColumnOffset !== undefined && this.#assetOffsets.tileRowOffset !== undefined)
            return yPos * this.#assetOffsets.tileRowOffset / 2 - xPos * this.#assetOffsets.tileRowOffset / 2 + this.#mapOriginY;
    }

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

    translateMouseToTileCord(newPosition) {
        if (this.#assetOffsets !== undefined && this.#mapOriginX !== undefined && this.#mapOriginY !== undefined
            && this.#assetOffsets.tileColumnOffset !== undefined && this.#assetOffsets.tileRowOffset !== undefined) {

        //Adjusts mouse position to the tile position. 
        var newPosX = newPosition.x - this.#assetOffsets.tileColumnOffset / 2 - this.#mapOriginX;
        var newPosY = newPosition.y - this.#assetOffsets.tileRowOffset / 2 - this.#mapOriginY;

        //Calculate the tile at which the current mouse cursor points.
        var selectedTileX = Math.round(newPosX / this.#assetOffsets.tileColumnOffset - newPosY / this.#assetOffsets.tileRowOffset);
        var selectedTileY = Math.round(newPosX / this.#assetOffsets.tileColumnOffset + newPosY / this.#assetOffsets.tileRowOffset);

        return {
            x: selectedTileX,
            y: selectedTileY,
        }

        }
    }
}