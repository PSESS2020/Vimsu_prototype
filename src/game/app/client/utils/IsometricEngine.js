/**
 * The Isometric Game Engine
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class IsometricEngine {
    xNumTiles;
    yNumTiles;
    mapOriginX;
    mapOriginY;
    tileColumnWidth = Settings.TILE_WIDTH;
    tileRowHeight = Settings.TILE_HEIGHT;

    loader;

    /**
     * Creates an instance of IsometricEngine
     */
    constructor() {
        if (!!IsometricEngine.instance) {
            return IsometricEngine.instance;
        }
        IsometricEngine.instance = this;
        this.xNumTiles = 0;
        this.yNumTiles = 0;
        this.mapOriginX = 0;
        this.mapOriginY = 0;

        this.loader = new LoadingView();
    }

    /**
     * Initializes the engines properties
     * 
     * @param {String[]} assetPaths asset paths
     * @param {number} xNumTiles number of x tiles
     * @param {number} yNumTiles number of y tiles
     */
    async initGameEngine(assetPaths, xNumTiles, yNumTiles) {
        TypeChecker.isInt(xNumTiles);
        TypeChecker.isInt(yNumTiles);

        this.xNumTiles = xNumTiles;
        this.yNumTiles = yNumTiles;

        //origin that indicates where to start drawing the map assets.
        this.mapOriginX = ctx_map.canvas.width / 2 - this.xNumTiles * this.tileRowHeight;
        this.mapOriginY = ctx_map.canvas.height / 2;

        return await this.loadImages(assetPaths);
    }

    /**
     * Sets number of x and y tiles
     * 
     * @param {number} xNumTiles number of x tiles
     * @param {number} yNumTiles number of y tiles
     */
    setNumMapTilesXY(xNumTiles, yNumTiles) {
        TypeChecker.isInt(xNumTiles);
        TypeChecker.isInt(yNumTiles);

        this.xNumTiles = xNumTiles;
        this.yNumTiles = yNumTiles;
    }

    /**
     * Sets map x and y origin
     * 
     * @param {number} mapOriginX map x origin
     * @param {number} mapOriginY map y origin
     */
    setMapOriginXY(mapOriginX, mapOriginY) {
        TypeChecker.isInt(mapOriginX);
        TypeChecker.isInt(mapOriginY);

        this.mapOriginX = mapOriginX;
        this.mapOriginY = mapOriginY;
    }

    /**
     * Gets tile column width
     * 
     * @return {number} tileColumnWidth
     */
    getTileColumnWidth() {
        return this.tileColumnWidth;
    }

    /**
     * Gets tile row height
     * 
     * @return {number} tileRowHeight
     */
    getTileRowHeight() {
        return this.tileRowHeight;
    }

    /**
     * Gets number of x and y tiles
     * 
     * @return {Object} Object of xNumTiles and yNumTiles
     */
    getNumMapTilesXY() {
        return {
            x: this.xNumTiles,
            y: this.yNumTiles
        }
    }

    /**
     * Gets map x and y origin
     * 
     * @return {Object} Object of mapOriginX and mapOriginY
     */
    getMapOriginXY() {
        return {
            x: this.mapOriginX,
            y: this.mapOriginY
        }
    }

    /**
     * loads the images that are needed for object view creation.
     * 
     * @param {String[]} assetPaths asset paths
     * 
     * @return {Object} Object containing all the images loaded from the asset paths
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

            this.loader.contentLoaded(totalImages, loadedImages);

            if (loadedImages >= totalImages) {
                return Promise.all(Object.entries(assetImages)).then(() => {
                    this.loader.doneLoading();

                    return assetImages;
                });

            }

        }
    }

    /**
     * Calculates the screen position
     * 
     * @param {number} xPos x position
     * @param {number} yPos y position
     * 
     * @return {Object} Object of the coordinates of the screen position
     */
    calculateScreenPosXY(xPos, yPos) {
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);

        if (this.tileColumnWidth !== undefined && this.tileRowHeight !== undefined) {
            return {
                x: xPos * this.tileColumnWidth / 2 + yPos * this.tileColumnWidth / 2 + this.mapOriginX,
                y: yPos * this.tileRowHeight / 2 - xPos * this.tileRowHeight / 2 + this.mapOriginY
            }
        }
    }

    /**
     * Calculates the x screen position
     * 
     * @param {number} xPos x position
     * @param {number} yPos y position
     * 
     * @return {number} the x coordinate of the screen position
     */
    calculateScreenPosX(xPos, yPos) {
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);

        if (this.tileColumnWidth !== undefined && this.tileRowHeight !== undefined)
            return xPos * this.tileColumnWidth / 2 + yPos * this.tileColumnWidth / 2 + this.mapOriginX;
    }

    /**
     * Calculates the y screen position
     * 
     * @param {number} xPos x position
     * @param {number} yPos y position
     *  
     * @return {number} the y coordinate of the screen position
     */
    calculateScreenPosY(xPos, yPos) {
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);

        if (this.tileColumnWidth !== undefined && this.tileRowHeight !== undefined)
            return yPos * this.tileRowHeight / 2 - xPos * this.tileRowHeight / 2 + this.mapOriginY;
    }

    /**
     * Translates mouse to the canvas position
     * 
     * @param {Canvas} canvas canvas
     * @param {Event} e event
     * 
     * @return {Object} Object of x and y cursor position
     */
    translateMouseToCanvasPos(canvas, e) {

        //gets the absolute size of canvas and calculates the scaling factor
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        
        //gets the scrolling offset which indicates how much distance was scrolled in down and right direction of viewpage.
        var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var scrollLeft = window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        
        //Apply scaling factor to cursor position
        return {
            x: (e.pageX - rect.left - scrollLeft) * scaleX,
            y: (e.pageY - rect.top - scrollTop) * scaleY,
        }
    }

    /**
     * Translates mouse to the tile position
     * 
     * @param {{x: number, y: number}} newPosition new position
     * 
     * @return {Object} Object of selectedTileX and selectedTileY
     */
    translateMouseToTileCord(newPosition) {
        TypeChecker.isNumber(newPosition.x);
        TypeChecker.isNumber(newPosition.y);

        if (this.mapOriginX !== undefined && this.mapOriginY !== undefined
            && this.tileColumnWidth !== undefined && this.tileRowHeight !== undefined) {

            //Adjusts mouse position to the tile position. 
            var newPosX = newPosition.x - this.tileColumnWidth / 2 - this.mapOriginX;
            var newPosY = newPosition.y - this.tileRowHeight / 2 - this.mapOriginY;

            //Calculate the tile at which the current mouse cursor points.
            var selectedTileX = Math.round(newPosX / this.tileColumnWidth - newPosY / this.tileRowHeight);
            var selectedTileY = Math.round(newPosX / this.tileColumnWidth + newPosY / this.tileRowHeight);

            return {
                x: selectedTileX,
                y: selectedTileY,
            }

        }
    }
}
