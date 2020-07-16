class FoyerView extends MapView {
    
    #loader;
    #tilePaths = ["client/assets/tile_selected.png", "client/assets/tile_normal.png", "client/assets/wall1.png", "client/assets/wall2.png", "client/assets/door_lecturehall.png", "client/assets/door_foodcourt.png", "client/assets/door_reception.png", "client/assets/table.png",];

    constructor(foyerMap) {
        super(foyerMap);
        
        this.#loader = new LoadingView();
        this.loadImages();
    }

    

    //loads the images that are needed for tilecreation.
    //this was the best not error prone way.
    async loadImages() {
        var imageLoader = new ImageLoader();
        this.tileImages = new Array();
        var loadedImages = 0;
        var totalImages = this.#tilePaths.length;

        // Load all the images before we run the app
        for (var i = 0; i < totalImages; i++) {

            this.tileImages[i] = await imageLoader.loadImage(this.#tilePaths[i]);

            loadedImages++;

            this.#loader.contentLoaded(totalImages, loadedImages);

            if (loadedImages >= totalImages) {
                Promise.all(this.tileImages).then(() => {
                    this.#loader.doneLoading();

                    var offset = {
                        tileColumnOffset: this.tileImages[1].width,
                        tileRowOffset: this.tileImages[1].width / 2,
                        wallColumnOffset: this.tileImages[2].width,
                        tableRowOffset: this.tileImages[totalImages - 1].height,
                    };
                    console.log(this.tileImages);
                    super.initProperties(offset.tileColumnOffset);
                    super.buildMap(offset);
                });

            }

        }
    }

    //adds a tile to the list of clickable tiles of the map.
    addToClickableTiles(tile) {

        super.addToClickableTiles(tile);
    
    }

    


    draw() {
        
        let tiles = super.getTiles();
        
        if (tiles.length != 0) {
            tiles.forEach( object => object.draw());
        }

    }


    //TODO
    drawGameObjects(objectType) {
        TypeChecker.isInt(objectType);
    }

}