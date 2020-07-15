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
    selectionOnMap = false;

    constructor(foyerMap) {
        super();

        this.#map = foyerMap;

        //map components that are drawn on screen
        this.#tiles = new Array();

        //map components that can be clicked
        this.#clickableTiles = new Array();

        this.#originX = 0;
        this.#originY = 0;

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

        this.tileColumnOffset = offset.tileColumnOffset;
        this.tileRowOffset = offset.tileRowOffset;

        var gameObjectViewFactory = new GameObjectViewFactory(this.tileImages);
        var originXY = {
            x: this.#originX,
            y: this.#originY
        };

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


        var canvas = document.getElementById('avatarCanvas');
        var self = this;
        this.#selectedTile = gameObjectViewFactory.createGameObjectView(GameObjectTypeClient.SELECTED_TILE, new PositionClient(0, 2), originXY, offset);

        //Handle mouse movement on canvas
        $('#avatarCanvas').on('mousemove', function (e) {

            var selectedTileCords = self.translateMouseToTileCord(canvas, e, offset);

            if (self.isCursorOnMap(selectedTileCords.x, selectedTileCords.y))
                self.selectionOnMap = true;
            else
                self.selectionOnMap = false;

            //Calculate new screen Position.
            var screenX = selectedTileCords.x * offset.tileColumnOffset / 2 + selectedTileCords.y * offset.tileColumnOffset / 2 + self.#originX;
            var screenY = selectedTileCords.y * offset.tileRowOffset / 2 - selectedTileCords.x * offset.tileRowOffset / 2 + self.#originY;

            var position = new PositionClient(screenX, screenY);

            self.#selectedTile.updatePos(position);

        });

        //Handles mouse click on canvas
        $('#avatarCanvas').on('click', function (e) {

            var selectedTileCords = self.translateMouseToTileCord(canvas, e, offset);

            if (self.isCursorOnMap(selectedTileCords.x, selectedTileCords.y))

                self.#clickableTiles.forEach(object => {
                    if (self.#map[selectedTileCords.x][selectedTileCords.y] === object.getDoorType())
                        object.onclick();
                });
        });
    }

    //adds a tile to the list of clickable tiles of the map.
    addToClickableTiles(tile) {

        this.#clickableTiles.push(tile);
    }

    translateMouseToTileCord(canvas, e, offset) {

        //Translates the current mouse position to the mouse position on the map.
        var newPosition = this.getMousePos(canvas, e);

        //Adjusts mouse position to the tile position. 
        var newPosX = newPosition.x - offset.tileColumnOffset / 2 - this.#originX;
        var newPosY = newPosition.y - offset.tileRowOffset / 2 - this.#originY;

        //Calculate the tile at which the current mouse cursor points.
        var selectedTileX = Math.round(newPosX / offset.tileColumnOffset - newPosY / offset.tileRowOffset);
        var selectedTileY = Math.round(newPosX / offset.tileColumnOffset + newPosY / offset.tileRowOffset);

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

    getMousePos(canvas, e) {

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
