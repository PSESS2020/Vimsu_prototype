class FoyerView extends MapView {
    #originX = 0;
    #originY = 0;
    #map;
    #loader;
    #tiles;
    #xNumTiles;
    #yNumTiles;
    #selectedTile;
    selectionOnMap = false;
    #tilePaths = ["client/assets/tile_selected.png", "client/assets/tile1.png", "client/assets/wall1.png", "client/assets/wall2.png", "client/assets/door1.png", "client/assets/door2.png", "client/assets/door3.png", "client/assets/table.png",];

    constructor(foyerMap) {
        super();
        this.#map = foyerMap;

        //map components that are drawn on screen
        this.#tiles = new Array();

        this.#loader = new LoadingView();
        this.loadImages();
    }

    initProperties(tileColumnOffset) {

        this.#xNumTiles = this.#map.length;
        this.#yNumTiles = this.#map[0].length;

        //origin that indicates where to start drawing the map assets.
        this.#originX = ctx_map.canvas.width / 2 - this.#xNumTiles * tileColumnOffset / 2;
        this.#originY = ctx_map.canvas.height / 2;
    
    }

    //loads the images that are needed for tilecreation.
    //this was the best not error prone way.
    loadImages() {

        this.tileImages = new Array();
        var loadedImages = 0;
        var totalImages = this.#tilePaths.length;

        // Load all the images before we run the app
        for (var i = 0; i < totalImages; i++) {

            this.tileImages[i] = new Image();
            
            this.tileImages[i].onload = () => {
                loadedImages++;

                this.#loader.contentLoaded(totalImages, loadedImages);

                if (loadedImages >= totalImages) {
                    this.#loader.doneLoading();
                    
                    var offset = {
                        tileColumnOffset: this.tileImages[1].width,
                        tileRowOffset: this.tileImages[1].width / 2,
                        wallColumnOffset: this.tileImages[2].width,
                        tableRowOffset: this.tileImages[totalImages - 1].height
                    };

                    this.initProperties(offset.tileColumnOffset);
                    this.buildMap(offset);
                }
            };
            
            this.tileImages[i].src = this.#tilePaths[i];
        }
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
                    
                if( tile != null)
                    this.#tiles.push(tile);
                
            };
        };
        
        this.draw();

        
        var canvas = document.getElementById('avatarCanvas');
        var self = this;
        this.#selectedTile = gameObjectViewFactory.createGameObjectView(GameObjectTypeClient.SELECTED_TILE, new PositionClient(0,2), originXY, offset);
        
        $('#avatarCanvas').on('mousemove', function(e) {

            //Translates the current mouse position to the mouse position on the map.
            var newPosition = self.getMousePos(canvas, e);
        
            //Adjusts mouse position to the tile position. 
            var newPosX = newPosition.x - self.tileColumnOffset / 2 - self.#originX;
            var newPosY = newPosition.y - self.tileRowOffset / 2 - self.#originY;
             
            //Calculate the tile at which the current mouse cursor points.
            var selectedTileX = Math.round(newPosX/ offset.tileColumnOffset - newPosY / offset.tileRowOffset);
            var selectedTileY = Math.round(newPosX / offset.tileColumnOffset + newPosY / offset.tileRowOffset);

            if(self.isCursorOnMap(selectedTileX, selectedTileY)) 
                self.selectionOnMap = true;
            else 
                self.selectionOnMap = false;
            
                //Calculate new screen Position.
            var screenX = selectedTileX * offset.tileColumnOffset / 2 + selectedTileY * offset.tileColumnOffset / 2 + originXY.x;
            var screenY = selectedTileY * offset.tileRowOffset / 2 - selectedTileX * offset.tileRowOffset / 2 + originXY.y;

            var position = new PositionClient(screenX, screenY);
            
            self.#selectedTile.updatePos(position);

        });
    }

    isCursorOnMap(cordX, cordY) {
        //LECTURE DOOR
        if (cordX === 2 && cordY === 1) {
            return true;
        //FOOD COURT DOOR
        } else if (cordX === 25 && cordY === 4) {
            return true;
        //RECEPTION DOOR
        } else if (cordX === 25 && cordY === 24) {
            return true;
        }
        //OTHER TILES IN ROOM
        return !(cordX < 0 || cordY < 2 || cordX >= this.#xNumTiles - 2 || cordY >= this.#yNumTiles);
    }

    getMousePos(canvas, e) {

        //gets the absolute size of canvas and calculates the scaling factor
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;

        //Apply scaling factor to cursor position
        return { 
            x:  (e.pageX - rect.left) * scaleX,
            y:  (e.pageY - rect.top) * scaleY,
        }

    }

    drawSelectedTile() {

        this.#selectedTile.draw();
      
    }

    draw() {
        
        if (this.#tiles.length != 0) {
            this.#tiles.forEach( object => object.draw());
        }
    }



    drawGameObjects(objectType) {
        TypeChecker.isInt(objectType);
    }

}