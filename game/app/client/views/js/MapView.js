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
    #originX;
    #originY;

    //For calculation the right positions of sprites on the map.
    #offset;
    #gameObjectViewFactory;

    selectionOnMap = false;

    constructor(map, objectMap) {
        super();

        this.#map = map;
        this.#objectMap = objectMap;

        //map components that are drawn on screen
        this.#tiles = new Array();

        //map objects that are drawn on screen
        this.#objects = new Array();

        //map components that can be clicked
        this.#clickableTiles = new Array();

        this.#gameObjectViewFactory = new GameObjectViewFactory(this.tileImages);

        this.#originX = 0;
        this.#originY = 0;
        this.#offset = {};

        if (new.target === MapView) {
            throw new Error("Cannot construct abstract MapView instances directly");
        }
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

    initProperties(tileColumnOffset) {

        this.#xNumTiles = this.#map.length;
        this.#yNumTiles = this.#map[0].length;

        //origin that indicates where to start drawing the map assets.
        this.#originX = ctx_map.canvas.width / 2 - this.#xNumTiles * tileColumnOffset / 2;
        this.#originY = ctx_map.canvas.height / 2;
        console.log("origin " + this.#originX + " " + this.#originY);
    }

    //Creates a map of gameobjects to draw on screen.
    buildMap(offset) {
        this.#offset = offset;
        this.tileColumnOffset = offset.tileColumnOffset;
        this.tileRowOffset = offset.tileRowOffset;

        var originXY = {
            x: this.#originX,
            y: this.#originY
        };

        this.#selectedTile = this.#gameObjectViewFactory.createGameObjectView(GameObjectType.SELECTED_TILE, new PositionClient(0, 2), originXY, offset);

        for (var row = (this.#xNumTiles - 1); row >= 0; row--) {
            for (var col = 0; col < this.#yNumTiles; col++) {

                var position = new PositionClient(row, col);

                var mapObject = this.#map[row][col];
                if (mapObject !== null) 
                {
                    var tileType;
                    if (mapObject instanceof DoorClient) {
                        tileType = mapObject.getTypeOfDoor();
                    } else
                        tileType = mapObject.getGameObjectType();

                    var tile = this.#gameObjectViewFactory.createGameObjectView(tileType, position, originXY, offset);
                
                    if (tile != null) 
                    {
                        this.#tiles.push(tile);

                        if (tile instanceof DoorView)
                            this.addToClickableTiles(tile);

                    }

                }
                
                if (this.#objectMap[row][col] !== null) {
                    var objectType = this.#objectMap[row][col].getGameObjectType();
                    var object = this.#gameObjectViewFactory.createGameObjectView(objectType, position, originXY, offset);
                    
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
        this.#clickableTiles.forEach(object => {
            if (this.#map[selectedTileCords.x][selectedTileCords.y] instanceof DoorClient && 
                this.#map[selectedTileCords.x][selectedTileCords.y].getTypeOfDoor() === object.getDoorType())
                object.onclick();
        });

    }

    translateMouseToTileCord(newPosition) {

        //Adjusts mouse position to the tile position. 
        var newPosX = newPosition.x - this.#offset.tileColumnOffset / 2 - this.#originX;
        var newPosY = newPosition.y - this.#offset.tileRowOffset / 2 - this.#originY;

        //Calculate the tile at which the current mouse cursor points.
        var selectedTileX = Math.round(newPosX / this.#offset.tileColumnOffset - newPosY / this.#offset.tileRowOffset);
        var selectedTileY = Math.round(newPosX / this.#offset.tileColumnOffset + newPosY / this.#offset.tileRowOffset);

        return {
            x: selectedTileX,
            y: selectedTileY,
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

        //Calculate new screen Position of tile indicator.
        var screenX = selectedTileCords.x * this.#offset.tileColumnOffset / 2 + selectedTileCords.y * this.#offset.tileColumnOffset / 2 + this.#originX;
        var screenY = selectedTileCords.y * this.#offset.tileRowOffset / 2 - selectedTileCords.x * this.#offset.tileRowOffset / 2 + this.#originY;

        var position = new PositionClient(screenX, screenY);

        if (this.#selectedTile !== undefined)
            this.#selectedTile.updatePos(position);

    }

    drawSelectedTile() {

        this.#selectedTile.draw();


    }
    draw() {
        throw new Error('draw() has to be implemented!');
    }

    #drawGameObjects = function (objectType) {
        throw new Error('drawGameObjects() has to be implemented!');
    }
}
