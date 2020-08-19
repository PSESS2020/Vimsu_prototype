/*var Views = require('./Views.js')

module.exports = */class MapView extends Views {
    #map;
    #objectMap;
    #clickableTiles;
    #clickableObjects;
    #tiles;
    #gameObjects;
    #xNumTiles;
    #yNumTiles;
    #selectedTile;

    #gameObjectViewFactory;
    #gameEngine;

    selectionOnMap = false;

    constructor(assetPaths, map, objectMap) {
        super();

        this.#map = map;
        this.#objectMap = objectMap;

        //map components that are drawn on screen
        this.#tiles = [];

        //map gameObjects that are drawn on screen
        this.#gameObjects = [];

        //map components that can be clicked
        this.#clickableTiles = [];
        this.#clickableObjects = [];

        this.#gameEngine = new IsometricEngine();

        /*if (new.target === MapView) {
            throw new Error("Cannot construct abstract MapView instances directly");
        }*/
        this.initProperties(assetPaths);
    }

    getMap() {

        return this.#map;

    }

    getObjectMap() {
        return this.#objectMap;
    }

    getTiles() {

        return this.#tiles;

    }

    getSelectedTile() {
        return this.#selectedTile;
    }

    getGameObjects() {
        return this.#gameObjects;
    }

    async initProperties(assetPaths) {
        this.#xNumTiles = this.#map.length;
        this.#yNumTiles = this.#map[0].length;

        assetPaths.tileselected_default = "client/assets/tiles/tile_selected.png";
        var assetImages = await this.#gameEngine.initGameEngine(assetPaths, this.#xNumTiles, this.#yNumTiles);

        this.#gameObjectViewFactory = new GameObjectViewFactory(assetImages, this.#gameEngine);

        this.buildMap();
    }

    //Creates a map of gamegameObjects to draw on screen.
    buildMap() {

        this.#selectedTile = this.#gameObjectViewFactory.createGameObjectView(GameObjectType.SELECTED_TILE, new PositionClient(0, 2), "tileselected_default", false);

        for (var row = (this.#xNumTiles - 1); row >= 0; row--) {
            for (var col = 0; col < this.#yNumTiles; col++) {

                var position = new PositionClient(row, col);

                var mapObject = this.#map[row][col];
                if (mapObject !== null) {
                   
                    if (mapObject instanceof Array) {
                        mapObject.forEach(object => {
                            this.createMapElementView(object, position);
                        });
                    } else {
                        this.createMapElementView(mapObject, position);
                    }
                }

                var gameObject = this.#objectMap[row][col];
                if (gameObject !== null) {
                    if (gameObject instanceof Array) {
                        gameObject.forEach(object => {
                            this.createObjectView(object, position);
                        });
                    }
                    this.createObjectView(gameObject, position);
                }

            };
        };

        this.updateMapElements();
        this.update();
        this.drawMapElements();
        //this.draw();

    }

    //HELPER FUNCTION: creates map elements that build the map terrain.
    createMapElementView(mapObject, position) {
        var tileType;
        var tile;

        if (mapObject instanceof DoorClient) {
            tileType = mapObject.getTypeOfDoor();
            tile = this.#gameObjectViewFactory.createDoorView(tileType, position, mapObject.getName());
        } else {
            tileType = mapObject.getGameObjectType();
            tile = this.#gameObjectViewFactory.createGameMapElementView(tileType, position, mapObject.getName(), mapObject.isClickable());
        }

        if (tile != null) {
            this.#tiles.push(tile);

            if (mapObject instanceof DoorClient || mapObject.isClickable())
                this.#clickableTiles.push(tile);

        }
    }

    //HELPER FUNCTION: creates game objects that are shown on the screen.
    createObjectView(gameObject, position) {
        var objectType = gameObject.getGameObjectType();
        var object = this.#gameObjectViewFactory.createGameObjectView(objectType, position, gameObject.getName(), gameObject.isClickable());

        if (object != null) {
            this.#gameObjects.push(object);

            if (gameObject.isClickable())
                this.#clickableObjects.push(object);
        }
    }

    //finds the clicked tile in the list of clickable tiles
    findClickedTileOrObject(selectedTileCords) {
        let clickedTile = this.#map[selectedTileCords.x][selectedTileCords.y];
        let clickedObject = this.#objectMap[selectedTileCords.x][selectedTileCords.y];

        if (clickedTile instanceof Array) {
            clickedTile.forEach(tile => {
                this.findAndClickTile(tile);
            });
        } else 
            this.findAndClickTile(clickedTile);

        if (clickedObject instanceof Array) {
            clickedObject.forEach(obj => {
                this.findAndClickObject(obj);
            });
        } else
            this.findAndClickObject(clickedObject);
    }

    //HELPER FUNCTION: determines if the clicked tile is clickable and clicks it in that case.
    findAndClickTile(clickedTile) {
        if (clickedTile !== null && (clickedTile instanceof DoorClient || clickedTile.isClickable())) {
            this.#clickableTiles.forEach(viewObject => {
                let clickedTileName = clickedTile.getName();
                let viewObjectName = viewObject.getName();

                if (clickedTile instanceof DoorClient && clickedTileName === viewObjectName)
                    viewObject.onclick(clickedTile.getTargetRoomId());
                else if (clickedTile instanceof GameObjectClient && clickedTileName === viewObjectName)
                    viewObject.onclick();
            });
        }
    }

    //HELPER FUNCTION: determines if the clicked tile is clickable and clicks it in that case.
    findAndClickObject(clickedObject) {
        if (clickedObject !== null && clickedObject.isClickable()) {
            this.#clickableObjects.forEach(viewObject => {
                let clickedObjectName = clickedObject.getName();
                let viewObjectName = viewObject.getName();

                if (clickedObject instanceof GameObjectClient && clickedObjectName === viewObjectName)
                    viewObject.onclick();
            });
        }
    }

    //finds the clicked element in the list of clickable tiles
    findClickedElementOutsideMap(canvasMousePos) {
        this.#clickableTiles.forEach(elem => {
            let screenPos = elem.getScreenPosition();
            let screenPosOffset = elem.getScreenPositionOffset();
            let image = elem.getObjectImage();
            //console.log("screen pos" + screenPos.getCordX() + " " + screenPos.getCordY())
            //console.log("image size" + image.width + " " + image.height)
            //determines if mouse position on canvas is inside the asset image.
            if (!(elem instanceof DoorView) && canvasMousePos.x > screenPos.getCordX() + screenPosOffset.x 
                                            && canvasMousePos.x < screenPos.getCordX() + screenPosOffset.x + image.width 
                                            && canvasMousePos.y > screenPos.getCordY() + screenPosOffset.y
                                            && canvasMousePos.y < screenPos.getCordY() + screenPosOffset.y + image.height) {
                //console.log("hi" + elem.getName())
                //let withoffsetx = screenPos.getCordX() + screenPosOffset.x;
                //let withoffsety = screenPos.getCordY() + screenPosOffset.y
                //console.log("screenposBefore: " + withoffsetx + " " + withoffsety)

                   //elem.onclick(canvasMousePos);
            }
        });
    }

    //Checks if the mouse cursor is in bounds of the game map.
    isCursorOnPLayGround(cordX, cordY) {
        if (cordX >= 0 && cordY >= 2 && cordX < (this.#xNumTiles - 2) && cordY < this.#yNumTiles) {
            let mapObject = this.#map[cordX][cordY];
            let result = true;

           //Room walls
           if (mapObject instanceof Array) {

                for(let i = 0, n = mapObject.length; i < n; i++) {

                    if (mapObject[i] === null || mapObject[i].getGameObjectType() === GameObjectType.LEFTWALL ||
                        mapObject[i].getGameObjectType() === GameObjectType.RIGHTWALL || mapObject[i].getGameObjectType() === GameObjectType.BLANK) {
                        result = false;
                        break;
                    }
                
                };
            } else if (mapObject instanceof DoorClient || mapObject !== null && mapObject.getGameObjectType() !== GameObjectType.LEFTWALL &&
                       mapObject.getGameObjectType() !== GameObjectType.RIGHTWALL && mapObject.getGameObjectType() !== GameObjectType.BLANK) {
            } else
                result = false;

            return result;
        }

    }

    isCursorOutsidePlayGround(cordX, cordY) {
        if ( ( cordY >= -1 && cordX <= this.#xNumTiles && ( (cordY <= 2 &&  cordX >= 0) || (cordY < this.#yNumTiles && cordX >= (this.#xNumTiles - 3)) ) ) ) 
            return true;
        else
            return false;
    }

    updateSelectedTile(selectedTileCords) {

        //selectedTileCords not loaded yet
        if (!selectedTileCords) {
            return;
        }

        //Calculate new screen Position of tile indicator.
        let screenXY = this.#gameEngine.calculateScreenPosXY(selectedTileCords.x, selectedTileCords.y);

        let position = new PositionClient(screenXY.x, screenXY.y);

        if (this.#selectedTile !== undefined)
            this.#selectedTile.updateScreenPos(position);

    }

    updateMapElements() {
        if (this.#tiles.length !== 0) {
            this.#tiles.forEach(object => {
                let gridPos = object.getGridPosition();
        
                //calculates the screen position where to draw the game object
                let screenPosXY = this.#gameEngine.calculateScreenPosXY(gridPos.getCordX(), gridPos.getCordY());
                let screenPos = new PositionClient(screenPosXY.x, screenPosXY.y);

                object.updateScreenPos(screenPos);
            })
        }
    }

    update() {
        if (this.#gameObjects.length !== 0) {
            this.#gameObjects.forEach(object => {
                let gridPos = object.getGridPosition();
        
                //calculates the screen position where to draw the game object
                let screenPosXY = this.#gameEngine.calculateScreenPosXY(gridPos.getCordX(), gridPos.getCordY());
                let screenPos = new PositionClient(screenPosXY.x, screenPosXY.y);

                object.updateScreenPos(screenPos);
            })
        }
    }

    drawMapElements() {
        if (this.#tiles.length !== 0) {
            this.#tiles.forEach(object => object.draw());
        }
    }

    /*draw() {
        if (this.#gameObjects.length !== 0) {
            this.#gameObjects.forEach(object => object.draw());
        }
    }*/
}
