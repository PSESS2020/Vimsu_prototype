class FoyerView extends MapView {
    #originX = 0;
    #originY = 0;
    #map;
    #loader;
    #tiles;
    #tilePaths = ["../assets/tile1.png", "../assets/wall1.png", "../assets/wall2.png", "../assets/door1.png", "../assets/door2.png", "../assets/door3.png", "../assets/table.png",];

    constructor(foyerMap) {
        super();
        this.#map = foyerMap;
        this.#tiles = new Array();
        this.#loader = new LoadingView();
        this.loadImages();
    }

    initProperties(tileColumnOffset) {
        this.xNumTiles = this.#map.length;
        this.yNumTiles = this.#map[0].length;
        this.#originX = ctx_map.canvas.width / 2 - this.xNumTiles * tileColumnOffset / 2;
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
                        tileColumnOffset: this.tileImages[0].width,
                        tileRowOffset: this.tileImages[0].width / 2,
                        wallColumnOffset: this.tileImages[1].width,
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
        var gameObjectViewFactory = new GameObjectViewFactory(this.tileImages);
        var originXY = {
            x: this.#originX,
            y: this.#originY
        };


        for (var row = (this.xNumTiles - 1); row >= 0; row--) {
            for (var col = 0; col < this.yNumTiles; col++) {

                var position = new PositionClient(row, col);
                var tileType = this.#map[row][col];
                var tile = gameObjectViewFactory.createGameObjectView(tileType, position, originXY, offset);
                    
                if( tile != null)
                    this.#tiles.push(tile);
                
            };
        };
        this.draw();
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