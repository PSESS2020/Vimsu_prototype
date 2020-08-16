/*var Views = require('./Views.js')

module.exports = */class MapView extends Views {
    #map;
    #objectMap;
    #clickableTiles;
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

        this.#selectedTile = this.#gameObjectViewFactory.createGameObjectView(GameObjectType.SELECTED_TILE, new PositionClient(0, 2), "tileselected_default");

        for (var row = (this.#xNumTiles - 1); row >= 0; row--) {
            for (var col = 0; col < this.#yNumTiles; col++) {

                var position = new PositionClient(row, col);

                var mapObject = this.#map[row][col];
                if (mapObject !== null) {
                    var tileType;
                    var tile;
                    if (mapObject instanceof DoorClient) {
                        tileType = mapObject.getTypeOfDoor();
                        tile = this.#gameObjectViewFactory.createDoorView(tileType, position, mapObject.getName());
                    } else {
                        tileType = mapObject.getGameObjectType();
                        tile = this.#gameObjectViewFactory.createGameMapElementView(tileType, position, mapObject.getName());
                    }

                    if (tile != null) {
                        this.#tiles.push(tile);

                        if (tile instanceof DoorView)
                            this.addToClickableTiles(tile);

                    }

                }

                if (this.#objectMap[row][col] !== null) {
                    var objectType = this.#objectMap[row][col].getGameObjectType();
                    var object = this.#gameObjectViewFactory.createGameObjectView(objectType, position, this.#objectMap[row][col].getName());

                    if (object != null) {
                        this.#gameObjects.push(object);
                    }
                }

            };
        };

        this.updateMapElements();
        this.update();
        this.drawMapElements();
        //this.draw();

    }

    //adds a tile to the list of clickable tiles of the map.
    addToClickableTiles(tile) {

        this.#clickableTiles.push(tile);
    }

    findClickedTile(selectedTileCords) {

        let clickedTile = this.#map[selectedTileCords.x][selectedTileCords.y];

        if (clickedTile !== null && clickedTile.isClickable()) {
            this.#clickableTiles.forEach(viewObject => {

                if (clickedTile instanceof DoorClient && clickedTile.getName() === viewObject.getName())
                    viewObject.onclick(clickedTile.getTargetRoomId());
                else if (clickedTile instanceof GameObjectClient && clickedTile.getName() === viewObject.getName())
                    viewObject.onclick();
            });
        }

    }

    isCursorOnMap(cordX, cordY) {
        if (cordX >= 0 && cordY >= 2 && cordX < (this.#xNumTiles - 2) && cordY < this.#yNumTiles) {
            let mapObject = this.#map[cordX][cordY];

            if (mapObject instanceof DoorClient) {
                return true;

                //Room walls
            } else if (mapObject !== null && mapObject.getGameObjectType() !== GameObjectType.LEFTWALL &&
                mapObject.getGameObjectType() !== GameObjectType.RIGHTWALL && mapObject.getGameObjectType() !== GameObjectType.BLANK) {
                return true;
            } else
                return false;

        }

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
