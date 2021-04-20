/**
 * The Map View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class MapView extends Views {
    map;
    objectMap;
    clickableTiles;
    clickableObjects;
    tiles;
    gameObjects;
    xNumTiles;
    yNumTiles;
    tileIndicator;

    gameObjectViewFactory;
    gameEngine;
    eventManager;

    selectionOnMap = false;

    /**
     * Creates an instance of MapView
     * 
     * @param {Object[]} assetPaths asset paths
     * @param {number[][]} map map array
     * @param {number[][]} objectMap object map array
     * @param {IsometricEngine} gameEngine game engine
     * @param {eventManager} eventManager event manager
     */
    constructor(assetPaths, map, objectMap, eventManager) {
        super();

        this.initProperties(assetPaths, map, objectMap, eventManager);
    }

    /**
     * Gets the amount of tiles of the map in x direction.
     * 
     * @return {number} xNumTiles
     */
    getXNumTiles() {
        return this.xNumTiles;
    }

    /**
     * Gets the amount of tiles of the map in y direction.
     * 
     * @return {number} yNumTiles
     */
    getYNumTiles() {
        return this.yNumTiles;
    }

    /**
     * Gets map array
     * 
     * @return {number[][]} map
     */
    getMap() {
        return this.map;
    }

    /**
     * Gets object map array
     * 
     * @return {number[][]} objectMap
     */
    getObjectMap() {
        return this.objectMap;
    }

    /**
     * Gets tiles
     * 
     * @return {GameObjectView[]} tiles
     */
    getTiles() {
        return this.tiles;
    }

    /**
     * Gets selected tile
     * 
     * @return {GameObjectView} the tileIndicator
     */
    getSelectedTile() {
        return this.tileIndicator;
    }

    /**
     * Gets game objects
     * 
     * @return {GameObjectClient[]} gameObjects
     */
    getGameObjects() {
        return this.gameObjects;
    }

    /**
     * Needed for waiting until all images are loaded before building the map.
     * 
     * @private initializes properties and build map
     * @param {Object[]} assetPaths asset paths
     * @param {number[][]} map map array
     * @param {number[][]} objectMap object map array
     * @param {eventManager} eventManager event manager
     */
    initProperties = async (assetPaths, map, objectMap, eventManager) => {
        assetPaths.tileselected_default = "../client/assets/tiles/tile_selected.png";
        this.gameEngine = new IsometricEngine();

        super.setVisibility(true);
        var assetImages = await this.gameEngine.initGameEngine(assetPaths, map.length, map[0].length);
        if(!super.isVisible())
            return;

        this.map = map;
        this.objectMap = objectMap;
        this.xNumTiles = map.length;
        this.yNumTiles = map[0].length;

        //map components that are drawn on screen
        this.tiles = [];

        //map gameObjects that are drawn on screen
        this.gameObjects = [];

        //map components that can be clicked
        this.clickableTiles = [];
        this.clickableObjects = [];

        this.eventManager = eventManager;
        this.gameObjectViewFactory = new GameObjectViewFactory(assetImages, this.gameEngine, this.eventManager);

        this.buildMap();
    }

    /**
     * Creates a map of gameObjects to draw on screen.
     */
    buildMap = function() {

        this.tileIndicator = this.gameObjectViewFactory.createGameObjectView(GameObjectType.SELECTED_TILE, new PositionClient(0, 2), "tileselected_default", false, false);

        for (var row = (this.xNumTiles - 1); row >= 0; row--) {
            for (var col = 0; col < this.yNumTiles; col++) {

                var position = new PositionClient(row, col);

                var mapObject = this.map[row][col];
                if (mapObject !== null) {

                    if (mapObject instanceof Array) {
                        mapObject.forEach(object => {
                            this.createMapElementView(object, position);
                        });
                    } else {
                        this.createMapElementView(mapObject, position);
                    }
                }

                var gameObject = this.objectMap[row][col];
                if (gameObject !== null) {
                    if (gameObject instanceof Array) {
                        gameObject.forEach(object => {
                            this.createObjectView(object, position);
                        });
                    } else
                        this.createObjectView(gameObject, position);
                }
            };
        };

        this.refreshDisplay();
    }

    /**
     * creates map elements that build the map terrain.
     * 
     * @param {number} mapObject map object
     * @param {PositionClient} position map element position
     */
    createMapElementView = function(mapObject, position) {
        var tileType;
        var tile;

        if (mapObject instanceof DoorClient) {
            tileType = mapObject.getTypeOfDoor();
            tile = this.gameObjectViewFactory.createDoorView(tileType, position, mapObject.getName());
        } else {
            tileType = mapObject.getGameObjectType();
            tile = this.gameObjectViewFactory.createGameMapElementView(tileType, position, mapObject.getName(), mapObject.getIsClickable());
        }

        if (tile != null) {
            this.tiles.push(tile);

            if (mapObject instanceof DoorClient || mapObject.getIsClickable())
                this.clickableTiles.push(tile);

        }
    }

    /**
     * creates game objects that are shown on the screen.
     * 
     * @param {number} gameObject game object
     * @param {PositionClient} position game object position
     */
    createObjectView = function(gameObject, position) {
        var objectType = gameObject.getGameObjectType();
        var object = this.gameObjectViewFactory.createGameObjectView(objectType, position, gameObject.getName(), gameObject.getIsClickable(), gameObject.getIsIFrameObject(), gameObject.getId(), gameObject.getStory());

        if (object != null) {
            this.gameObjects.push(object);

            if (gameObject.getIsClickable())
                this.clickableObjects.push(object);
        }
    }

    /**
     * checks if tile or object is clickable at the selected position 
     * 
     * @param {Object} selectedTileCords selected tile coordinates
     * 
     * @return {boolean} true if the selected tile or object is clickable, false otherwise
     */
    checkTileOrObjectIsClickable(selectedTileCords) {
        let tile = this.map[selectedTileCords.x][selectedTileCords.y];
        let object = this.objectMap[selectedTileCords.x][selectedTileCords.y];
        let result = false;

        //This needs a rewrite if gameobjects are not static anymore.
        if (tile instanceof Array) {
            tile.forEach(tile => {
                if ( tile !== null && (tile instanceof DoorClient || tile.getIsClickable()) )
                    result = true;
            });
        } else if (object instanceof Array) {
            object.forEach(object => {
                if ( object !== null && object.getIsClickable() )
                    result = true;
            });
        } else if ( tile !== null && (tile instanceof DoorClient || tile.getIsClickable()) || (object !== null && object.getIsClickable()) )
                    result = true;
        return result;
    }

    /**
     * finds the tile/object in the list of clickable tiles/objects
     * and calls it's onclick function.
     * 
     * @param {Object} selectedTileCords selected tile coordinates
     */
    findAndClickTileOrObject(selectedTileCords) {
        let tile = this.map[selectedTileCords.x][selectedTileCords.y];
        let object = this.objectMap[selectedTileCords.x][selectedTileCords.y];

        if (tile instanceof Array) {
            tile.forEach(tile => {
                this.findTileAndClick(tile);
            });
        } else
            this.findTileAndClick(tile);

        if (object instanceof Array) {
            object.forEach(obj => {
                this.findObjectAndClick(obj);
            });
        } else
            this.findObjectAndClick(object);
    }

    /**
     * determines if the tile is clickable and calls it's onclick function.
     * 
     * @param {number} tile selected tile
     */
    findTileAndClick = function(tile) {
        
        if (tile !== null && (tile instanceof DoorClient || tile.getIsClickable())) {
            this.clickableTiles.forEach(viewObject => {
                let tileName = tile.getName();
                let viewObjectName = viewObject.getName();

                if (tile instanceof DoorClient && tileName === viewObjectName) {
                        viewObject.onclick(tile.getTargetRoomId());
                }
                else if (tile instanceof GameObjectClient && tileName === viewObjectName) {
                        viewObject.onclick();
                }
            });
        }
    }

    /**
     * determines if the object is clickable and and calls it's onclick function.
     * 
     * @param {number} object selected object
     */
    findObjectAndClick = function(object) {
        if (object !== null && object.getIsClickable()) {

            let viewObject = this.clickableObjects.find(viewObject => {
                return object instanceof GameObjectClient && object.getId() === viewObject.getGameObjectID();
            });

            if (viewObject != undefined) {
                this.eventManager.handleMoveToObjectAndClick(viewObject);
            }
        }
    }

    /**
     * finds the element in the list of clickable tiles
     * 
     * @param {Object} canvasMousePos mouse position
     * @param {boolean} isClicked true if element is clicked
     * @param {Canvas} canvas canvas
     */
    findClickableElementOutsideMap(canvasMousePos, isClicked, canvas) {
        canvas.style.cursor = 'default';

        this.clickableTiles.forEach(elem => {
            let screenPos = elem.getScreenPosition();
            let screenPosOffset = elem.getScreenPositionOffset();
            let image = elem.getObjectImage();

            //determines if mouse position on canvas is inside the asset image.
            if (!(elem instanceof DoorView) && canvasMousePos.x > screenPos.getCordX() + screenPosOffset.x
                && canvasMousePos.x < screenPos.getCordX() + screenPosOffset.x + image.width
                && canvasMousePos.y > screenPos.getCordY() + screenPosOffset.y
                && canvasMousePos.y < screenPos.getCordY() + screenPosOffset.y + image.height) {
                    if (isClicked)
                        elem.onclick(canvasMousePos);
                    else
                        canvas.style.cursor = (elem.getClickMapValueWithGridCoords(canvasMousePos) === 1) ? 'pointer' : 'default';
            } 
        });
    }

    /**
     * Checks if the mouse cursor is in bounds of the game map.
     * 
     * @param {number} cordX x coordinate
     * @param {number} cordY y coordinate
     * 
     * @return {boolean} true if the cursor is on the floor of the game map, false otherwise
     */
    isCursorOnPlayGround(cordX, cordY) {
        if (cordX >= 0 && cordY >= 2 && cordX < (this.xNumTiles - 2) && cordY < this.yNumTiles) {
            let mapObject = this.map[cordX][cordY];
            let result = true;

            //Room walls
            if (mapObject instanceof Array) {

                for (let i = 0, n = mapObject.length; i < n; i++) {

                    if (mapObject[i] === null || mapObject[i].getGameObjectType() === GameObjectType.LEFTWALL ||
                        mapObject[i].getGameObjectType() === GameObjectType.RIGHTWALL || mapObject[i].getGameObjectType() === GameObjectType.BLANK) {
                        result = false;
                        break;
                    }

                };
            } else if ( !(mapObject instanceof DoorClient || mapObject !== null && mapObject.getGameObjectType() !== GameObjectType.LEFTWALL &&
                       mapObject.getGameObjectType() !== GameObjectType.RIGHTWALL && mapObject.getGameObjectType() !== GameObjectType.BLANK) )
                        result = false;

            return result;
        }

    }

    /**
     * Checks if the mouse cursor is out of the bounds of the game map.
     * 
     * @param {number} cordX x coordinate
     * @param {number} cordY y coordinate
     * 
     * @return {boolean} true if the mouse cursor is out of the bounds of the game map, false otherwise
     */
    isCursorOutsidePlayGround(cordX, cordY) {
        if ((cordY >= -1 && cordX <= this.xNumTiles && ((cordY <= 2 && cordX >= 0) || (cordY < this.yNumTiles && cordX >= (this.xNumTiles - 3)))))
            return true;
        else
            return false;
    }

    /**
     * Updates selected tile
     * 
     * @param {Object} selectedTileCords selected tile coordinates
     */
    updateSelectedTile(selectedTileCords) {

        //selectedTileCords not loaded yet
        if (!selectedTileCords) {
            return;
        }

        //Calculate new screen Position of tile indicator.
        let screenXY = this.gameEngine.calculateScreenPosXY(selectedTileCords.x, selectedTileCords.y);

        let position = new PositionClient(screenXY.x, screenXY.y);

        if (this.tileIndicator !== undefined)
            this.tileIndicator.updateScreenPos(position);
    }

    /**
     * update map elements
     */
    updateMapElements = function() {
        if (this.tiles.length !== 0) {
            this.tiles.forEach(object => {
                let gridPos = object.getGridPosition();

                //calculates the screen position where to draw the game object
                let screenPosXY = this.gameEngine.calculateScreenPosXY(gridPos.getCordX(), gridPos.getCordY());
                let screenPos = new PositionClient(screenPosXY.x, screenPosXY.y);

                object.updateScreenPos(screenPos);
            })
        }
    }

    /**
     * updates game object
     */
    update = function() {
        if (this.gameObjects.length !== 0) {
            this.gameObjects.forEach(object => {
                let gridPos = object.getGridPosition();

                //calculates the screen position where to draw the game object
                let screenPosXY = this.gameEngine.calculateScreenPosXY(gridPos.getCordX(), gridPos.getCordY());
                let screenPos = new PositionClient(screenPosXY.x, screenPosXY.y);

                object.updateScreenPos(screenPos);
            })
        }
    }

    /**
     * draws map elements
     */
    drawMapElements = function() {
        if (this.tiles.length !== 0) {
            this.tiles.forEach(object => object.draw());
        }
    }

    /**
     * Updates objects screen position and redraws them
     */
    refreshDisplay() {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        
        if(super.isVisible()) {
            this.updateMapElements();
            this.update();
            this.drawMapElements();
        }
    }
}
