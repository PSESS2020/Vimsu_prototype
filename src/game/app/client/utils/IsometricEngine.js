/**
 * The Isometric Game Engine
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class IsometricEngine {
    mapNumTilesX;
    mapNumTilesY;

    //origin that indicates where to start drawing the map assets.
    mapOriginX;
    mapOriginY;

    tileWidth = Settings.TILE_WIDTH;
    tileHeight = Settings.TILE_HEIGHT;

    mapContextWidth;
    mapContextHeight;

    loader;

    /**
     * Creates an instance of IsometricEngine
     * 
     * @param {LoadingView} loadingView loading view
     */
    constructor(loadingView) {
        if (!!IsometricEngine.instance) {
            return IsometricEngine.instance;
        }
        IsometricEngine.instance = this;
        this.mapNumTilesX = 0;
        this.mapNumTilesY = 0;
        this.mapOriginX = 0;
        this.mapOriginY = 0;

        this.loader = loadingView;
    }

    /**
     * Initializes the engines properties
     * 
     * @param {number} canvasWidth width of canvas
     * @param {number} canvasHeight height of canvas
     * @param {number} mapNumTilesX number of map's x tiles
     * @param {number} mapNumTilesY number of map's y tiles
     */
    async initGameEngine(canvasWidth, canvasHeight, mapNumTilesX, mapNumTilesY) {
        TypeChecker.isInt(mapNumTilesX);
        TypeChecker.isInt(mapNumTilesY);

        this.mapNumTilesX = mapNumTilesX;
        this.mapNumTilesY = mapNumTilesY;

        this.setMapOriginXY(canvasWidth, canvasHeight);
        this.setMapContextXY(canvasWidth, canvasHeight);
    }

    /**
     * Sets number of x and y tiles
     * 
     * @param {number} mapNumTilesX number of map's x tiles
     * @param {number} mapNumTilesY number of map's y tiles
     */
    setNumMapTilesXY(mapNumTilesX, mapNumTilesY) {
        TypeChecker.isInt(mapNumTilesX);
        TypeChecker.isInt(mapNumTilesY);

        this.mapNumTilesX = mapNumTilesX;
        this.mapNumTilesY = mapNumTilesY;
    }

    /**
     * Sets map x and y origin
     * @param {number} canvasWidth width of canvas
     * @param {number} canvasHeight height of canvas
     */
    setMapOriginXY(canvasWidth, canvasHeight) {
        TypeChecker.isInt(canvasWidth);
        TypeChecker.isInt(canvasHeight);

        let mapWidth = (this.mapNumTilesX + this.mapNumTilesY) * this.tileHeight;
        let diffTopBottomMapHeight = (this.mapNumTilesX - this.mapNumTilesY) * (this.tileHeight / 2);
        this.mapOriginX = Math.floor( (canvasWidth - mapWidth) / 2 );
        this.mapOriginY = Math.floor( (canvasHeight / 2) + (diffTopBottomMapHeight / 2) );
    }

    /**
     * Sets width and height of canvas context
     * @param {number} contextWidth width of context
     * @param {number} contextHeight height of canvas context
     */
    setMapContextXY(contextWidth, contextHeight) {
        TypeChecker.isInt(contextWidth);
        TypeChecker.isInt(contextHeight);

        this.mapContextWidth = contextWidth;
        this.mapContextHeight = contextHeight;
    }

    /**
     * Gets tile column width
     * 
     * @return {number} tileWidth
     */
    getTileWidth() {
        return this.tileWidth;
    }

    /**
     * Gets tile row height
     * 
     * @return {number} tileHeight
     */
    getTileHeight() {
        return this.tileHeight;
    }

    /**
     * Gets number of x and y tiles
     * 
     * @return {Object} Object of mapNumTilesX and mapNumTilesY
     */
    getNumMapTilesXY() {
        return {
            x: this.mapNumTilesX,
            y: this.mapNumTilesY
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

        if (this.tileWidth !== undefined && this.tileHeight !== undefined) {
            return {
                x: xPos * this.tileWidth / 2 + yPos * this.tileWidth / 2 + this.mapOriginX,
                y: yPos * this.tileHeight / 2 - xPos * this.tileHeight / 2 + this.mapOriginY
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

        if (this.tileWidth !== undefined && this.tileHeight !== undefined)
            return xPos * this.tileWidth / 2 + yPos * this.tileWidth / 2 + this.mapOriginX;
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

        if (this.tileWidth !== undefined && this.tileHeight !== undefined)
            return yPos * this.tileHeight / 2 - xPos * this.tileHeight / 2 + this.mapOriginY;
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
            && this.tileWidth !== undefined && this.tileHeight !== undefined) {

            //Adjusts mouse position to the tile position. 
            var newPosX = newPosition.x - this.tileWidth / 2 - this.mapOriginX;
            var newPosY = newPosition.y - this.tileHeight / 2 - this.mapOriginY;

            //Calculate the tile at which the current mouse cursor points.
            var selectedTileX = Math.round(newPosX / this.tileWidth - newPosY / this.tileHeight);
            var selectedTileY = Math.round(newPosX / this.tileWidth + newPosY / this.tileHeight);

            return {
                x: selectedTileX,
                y: selectedTileY,
            }

        }
    }
}
