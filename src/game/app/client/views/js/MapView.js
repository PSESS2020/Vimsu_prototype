/**
 * The Map View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class MapView extends AbstractView {
    map;
    objectMap;
    npcMap;
    clickableTiles;
    clickableObjects;
    tiles;
    gameObjects;
    xNumTiles;
    yNumTiles;
    tileIndicator;
    tileSelectedDefaultImage;
    tileSelectedClickableImage;

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
     * @param {NPCAvatarView[]} npcAvatarViews list of NPC views
     * @param {IsometricEngine} gameEngine game engine
     * @param {eventManager} eventManager event manager
     */
    constructor(assetPaths, map, objectMap, npcAvatarViews, eventManager) {
        super();

        this.initProperties(assetPaths, map, objectMap, npcAvatarViews, eventManager);
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
     * @param {NPCAvatarView[]} npcAvatarViews list of NPC views
     * @param {eventManager} eventManager event manager
     */
    initProperties = async (assetPaths, map, objectMap, npcAvatarViews, eventManager) => {
        this.gameEngine = new IsometricEngine();

        super.setVisibility(true);
        this.gameEngine.initGameEngine(ctx_map.canvas.width, ctx_map.canvas.height, map.length, map[0].length);
        var assetImages = await this.gameEngine.loadImages(assetPaths);
        this.tileSelectedDefaultImage = assetImages["tile_selected_default"];
        this.tileSelectedClickableImage = assetImages["tile_selected_clickable"];
        if(!super.isVisible())
            return;

        this.map = map;
        this.objectMap = objectMap;

        this.npcMap = new Array(map.length);
        for (let i = 0; i < this.npcMap.length; i++) {
            this.npcMap[i] = new Array(map[0].length).fill(null);
        }

        npcAvatarViews.forEach(nav => {
            let xPos = nav.getGridPosition().getCordX();
            let yPos = nav.getGridPosition().getCordY() + Settings.MAP_BLANK_TILES_WIDTH;
            this.npcMap[xPos][yPos] = nav;
        });
        
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
        this.refreshDisplay();
    }

    /**
     * Creates a map of gameObjects to draw on screen.
     */
    buildMap = function() {

        this.tileIndicator = this.gameObjectViewFactory.createGameObjectView(GameObjectType.SELECTED_TILE, new PositionClient(0, 2), "tile_selected_default", false, false);

        var mapObject;
        var gameObject

        for (var row = (this.xNumTiles - 1); row >= 0; row--) {
            for (var col = 0; col < this.yNumTiles; col++) {

                const position = new PositionClient(row, col);
                mapObject = this.map[row][col];
                if (mapObject !== null) {

                    if (mapObject instanceof Array) {
                        mapObject.forEach(object => {
                            this.createMapElementView(object, position);
                        });
                    } else {
                        this.createMapElementView(mapObject, position);
                    }
                }

                gameObject = this.objectMap[row][col];
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
     * Checks if tile or object or NPC is clickable at the selected position.
     * In case a click was performed, finds the tile/object in the list of clickable tiles/objects
     * and calls it's onclick function.
     * 
     * @param {Object} selectedTileCords selected tile coordinates
     * @param {boolean} isClicked true if element is clicked
     * 
     * @return {boolean} true if the selected tile or object is clickable, false otherwise
     */
    findClickableTileOrObjectOrNPC(selectedTileCords, isClicked) {
        let tile = this.map[selectedTileCords.x][selectedTileCords.y];
        let object = this.objectMap[selectedTileCords.x][selectedTileCords.y];
        let npc = this.npcMap[selectedTileCords.x][selectedTileCords.y];

        if (tile instanceof Array)
        {
            for (let i = 0, len = tile.length; i < len; i++)
            {
                let elem = tile[i];
                if (elem !== null && (elem instanceof DoorClient || elem.getIsClickable()))
                {
                    if (isClicked)
                        this.findTileAndClick(elem);
                    return true;
                }
            }
        }
        else if (tile !== null && (tile instanceof DoorClient || tile.getIsClickable()))
        {
            if(isClicked)
                this.findTileAndClick(tile);
            return true;
        }

        if (object instanceof Array)
        {
            for (let i = 0, len = object.length; i < len; i++)
            {
                let elem = object[i];
                if (elem !== null && elem.getIsClickable())
                {
                    if(isClicked)
                        this.findObjectAndClick(elem);
                    return true;
                }
            }
        }
        else if (object !== null && object.getIsClickable())
        {
            if(isClicked)
                this.findObjectAndClick(object);
            return true;
        }
        else if (npc !== null) {
            if (isClicked)
                npc.onClick();
            return true;
        }
        
        return false;
    }

    /**
     * determines if the tile is clickable and calls it's onclick function.
     * 
     * @param {number} tile selected tile
     */
    findTileAndClick = function(tile) {
        for (let i = 0, len = this.clickableTiles.length; i < len; i++)
        {
            let viewObject = this.clickableTiles[i];
            let tileName = tile.getName();
            let viewObjectName = viewObject.getName();

            if (tile instanceof DoorClient && tileName === viewObjectName) {
                let correctPosition = tile.getMapPosition().getCordX() === viewObject.getGridPosition().getCordX() && 
                    tile.getMapPosition().getCordY() + Settings.MAP_BLANK_TILES_WIDTH === viewObject.getGridPosition().getCordY();

                    if (correctPosition) {
                        viewObject.onclick(tile.getTargetRoomId());
                    }
            }
            else
                if (tile instanceof GameObjectClient && tileName === viewObjectName)
                    viewObject.onclick();
        }
    }

    /**
     * determines if the object is clickable and and calls it's onclick function.
     * 
     * @param {number} object selected object
     */
    findObjectAndClick = function(object) {
        let viewObject = this.clickableObjects.find(viewObject => {
            return object instanceof GameObjectClient && object.getId() === viewObject.getGameObjectID();
        });

        if (viewObject != undefined) {
            this.eventManager.handleMoveToObjectAndClick(viewObject);
        }
    }

    /**
     * finds the element in the list of clickable tiles
     * 
     * @param {Object} canvasMousePos mouse position
     * @param {boolean} isClicked true if element is clicked
     * @return {boolean} true if a clickable element outside map is found
     */
    findClickableElementOutsideMap(canvasMousePos, isClicked) {
        for (let i = 0; i < this.clickableTiles.length; i++)
        {
            let elem = this.clickableTiles[i];

            //determines if mouse position on canvas is inside the asset image.
            if (!(elem instanceof DoorView) && elem.assetContains(canvasMousePos.x, canvasMousePos.y))
            {
                if (elem.contains(canvasMousePos.x, canvasMousePos.y))
                {
                    if (isClicked)
                        elem.onclick(canvasMousePos);
                    return true;
                }
            } 
        }
        return false;
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

        if (this.tileIndicator !== undefined) {
            this.tileIndicator.updateScreenPos(position);

            // Check if selected tile is clickable and adjusts the image of selected tile border accordingly
            const newObjectImage = this.findClickableTileOrObjectOrNPC(selectedTileCords, false) ? this.tileSelectedClickableImage : this.tileSelectedDefaultImage;
            this.tileIndicator.updateObjectImage(newObjectImage);
        }
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
            });
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
        ctx_map.clearRect(0, 0, ctx_map.canvas.width, ctx_map.canvas.height);
        
        if(super.isVisible()) {
            this.updateMapElements();
            this.update();
            this.drawMapElements();
        }
    }
}
