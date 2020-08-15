/*var Views = require('./Views.js')

module.exports = */class MapView extends Views {
    #map;
    #objectMap;
    #clickableTiles;
    #tiles;
    #objects;
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
        this.#tiles = new Array();

        //map objects that are drawn on screen
        this.#objects = new Array();

        //map components that can be clicked
        this.#clickableTiles = new Array();

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

    getObjects() {
        return this.#objects;
    }

    async initProperties(assetPaths) {
        this.#xNumTiles = this.#map.length;
        this.#yNumTiles = this.#map[0].length;
        
        assetPaths.tileselected_default =  "client/assets/tile_selected.png";
        var assetImages = await this.#gameEngine.initGameEngine(assetPaths, this.#xNumTiles, this.#yNumTiles);

        this.#gameObjectViewFactory = new GameObjectViewFactory(assetImages, this.#gameEngine);

        this.buildMap();
    }

    //Creates a map of gameobjects to draw on screen.
    buildMap() {

        this.#selectedTile = this.#gameObjectViewFactory.createGameObjectView(GameObjectType.SELECTED_TILE, new PositionClient(0, 2), "tileselected_default");

        for (var row = (this.#xNumTiles - 1); row >= 0; row--) {
            for (var col = 0; col < this.#yNumTiles; col++) {

                var position = new PositionClient(row, col);

                var mapObject = this.#map[row][col];
                if (mapObject !== null) 
                {
                    var tileType;
                    var tile;
                    if (mapObject instanceof DoorClient) {
                        tileType = mapObject.getTypeOfDoor();
                        tile = this.#gameObjectViewFactory.createDoorView(tileType, position, mapObject.getName());
                    } else {
                        tileType = mapObject.getGameObjectType();
                        tile = this.#gameObjectViewFactory.createGameObjectView(tileType, position, mapObject.getName());
                    }
                
                    if (tile != null) 
                    {
                        this.#tiles.push(tile);

                        if (tile instanceof DoorView)
                            this.addToClickableTiles(tile);

                    }

                }
                
                if (this.#objectMap[row][col] !== null) {
                    var objectType = this.#objectMap[row][col].getGameObjectType();
                    var object = this.#gameObjectViewFactory.createGameObjectView(objectType, position, this.#objectMap[row][col].getName());
                    
                    if (object != null) {
                        this.#objects.push(object);
                    }
                }

            };
        };

        this.draw();

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
        var screenXY = this.#gameEngine.calculateScreenPosXY(selectedTileCords.x, selectedTileCords.y);

        var position = new PositionClient(screenXY.x, screenXY.y);

        if (this.#selectedTile !== undefined)
            this.#selectedTile.updatePos(position);

    }

    drawSelectedTile() {

        this.#selectedTile.draw();


    }
    draw() {
        //throw new Error('draw() has to be implemented!');
        //let tiles = super.getTiles();
        //let objects = super.getObjects();

        if (this.#tiles.length != 0) {
            this.#tiles.forEach(object => object.draw());
        }
        if (this.#objects.length != 0) {
            this.#objects.forEach(object => object.draw());
        }
    }
}
