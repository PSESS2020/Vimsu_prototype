/*var Views = require('./Views.js')

module.exports = */class MapView extends Views {
    #map;
    #clickableTiles;
    #tiles;
    #xNumTiles;
    #yNumTiles;
    #selectedTile;
    #originX;
    #originY;

    //For calculation the right positions of sprites on the map.
    #offset;
    selectionOnMap = false;

    constructor(map) {
        super();

        this.#map = map;

        //map components that are drawn on screen
        this.#tiles = new Array();

        //map components that can be clicked
        this.#clickableTiles = new Array();

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

    getTiles() {

        return this.#tiles;

    }

    initProperties(tileColumnOffset) {

        this.#xNumTiles = this.#map.length;
        this.#yNumTiles = this.#map[0].length;

        //origin that indicates where to start drawing the map assets.
        this.#originX = ctx_map.canvas.width / 2 - this.#xNumTiles * tileColumnOffset / 2;
        this.#originY = ctx_map.canvas.height / 2;

    }

    //Creates a map of gameobjects to draw on screen.
    buildMap(offset) {
        this.#offset = offset;
        this.tileColumnOffset = offset.tileColumnOffset;
        this.tileRowOffset = offset.tileRowOffset;

        var gameObjectViewFactory = new GameObjectViewFactory(this.tileImages);
        var originXY = {
            x: this.#originX,
            y: this.#originY
        };

        this.#selectedTile = gameObjectViewFactory.createGameObjectView(GameObjectTypeClient.SELECTED_TILE, new PositionClient(0, 2), originXY, offset);

        for (var row = (this.#xNumTiles - 1); row >= 0; row--) {
            for (var col = 0; col < this.#yNumTiles; col++) {

                var position = new PositionClient(row, col);
                var tileType = this.#map[row][col];

                var tile = gameObjectViewFactory.createGameObjectView(tileType, position, originXY, offset);

                if (tile != null) {

                    this.#tiles.push(tile);

                    if (tile instanceof DoorView)
                        this.addToClickableTiles(tile);

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
            if (this.#map[selectedTileCords.x][selectedTileCords.y] === object.getDoorType())
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

        //Room walls
        if (cordX >= 0 && cordY >= 1 && cordX < this.#xNumTiles - 1 && cordY < this.#yNumTiles &&
            this.#map[cordX][cordY] !== GameObjectTypeClient.LEFTWALL && this.#map[cordX][cordY] !== GameObjectTypeClient.RIGHTWALL &&
            this.#map[cordX][cordY] !== GameObjectTypeClient.BLANK)
            return true;
        else
            return false;

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
