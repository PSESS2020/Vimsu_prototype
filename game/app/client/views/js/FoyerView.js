/*var MapView = require('./MapView.js')
var TypeChecker = require('../../../utils/TypeChecker.js')

module.exports = */class FoyerView extends MapView {
    #tileColumnOffset = 64;
    #tileRowOffset = 32;
    #wallColumnOffset = 128;
    #wallRowOffset = 158;
    #originX = 0;
    #originY = 0;


    constructor() {
        super();
        this.load();
    }
    load() {
        this.tileImages = new Array();
        var loadedImages = 0;
        var totalImages = FoyerMap.tiles.length;
    
        // Load all the images before we run the app
        var self = this;
        for(var i = 0; i < FoyerMap.tiles.length; i++) {
          this.tileImages[i] = new Image();
          this.tileImages[i].onload = () => {
            if(++loadedImages >= totalImages) {
              this.run();
            }
          };
          this.tileImages[i].src = FoyerMap.tiles[i];
        }
      }

    run() {
        this.canvas = $('#canvas');
        this.ctx = this.canvas[0].getContext("2d");

        this.xNumTiles = FoyerMap.map.length;
        this.yNumTiles = FoyerMap.map[0].length;

        $(window).on('resize', () => {
            this.updateCanvasSize();
            this.draw();
        });

        $(window).on('mousemove', function(e) {
            //Calc the mouseposition in the game world.
            //Transforms the x,y coordinates of the current mouseposition
            //to the coordinates in the game map.
            //coordinates origin is the middle of the left tile.
            //e.pageX = e.pageX - this.#tileColumnOffset / 2 - this.#originX;
            //e.pageY = e.pageY - this.#tileRowOffset / 2 - this.#originY;
            
            //calculate the coordinates of the tiles.
            //tile origin is the first left tile, it has the transformed position (0,0)
            //mapTilePosX = Math.round(e.pageX / this.#tileColumnOffset - e.pageY / this.#tileRowOffset);
            //mapTilePosY = Math.round(e.pageX / this.#tileColumnOffset + e.pageY / this.#tileRowOffset);
        });

        this.updateCanvasSize();
        this.draw();
    }

    updateCanvasSize() {
        
        var width = window.screen.width;
        var height = window.screen.height;
        this.ctx.canvas.width  = width;
        this.ctx.canvas.height = height;

        this.#originX = this.#tileColumnOffset - 45;
        this.#originY = height / 2 - 20;
      }


    draw() {
        
        for(var x = (this.xNumTiles - 1); x >= 0; x--) {
            for(var y = 0; y < this.yNumTiles; y++) {
                
                var imageType = FoyerMap.map[x][y];

                this.drawTile(imageType, x, y);
            }
        }
    }

    drawTile(imageType, x, y) {

        //calculates the screen position where to draw the tile
        var screenX = x * this.#tileColumnOffset / 2 + y * this.#tileColumnOffset / 2 + this.#originX;
        if(imageType == 0)
        var screenY = y * this.#tileRowOffset / 2 - x * this.#tileRowOffset / 2 + this.#originY;
        else if(imageType == 1)
        var screenY = y * this.#tileRowOffset / 2 - x * this.#tileRowOffset / 2 + this.#originY - this.#wallColumnOffset + this.#tileRowOffset / 2 + 1;
        else {
        var screenX = x * this.#tileColumnOffset / 2 + y * this.#tileColumnOffset / 2 + this.#originX - this.#tileColumnOffset;
        var screenY = y * this.#tileRowOffset / 2 - x * this.#tileRowOffset / 2 + this.#originY - this.#wallColumnOffset + this.#tileRowOffset / 2 + 1;
        }

        ctx.drawImage(this.tileImages[imageType], screenX, screenY);
    }

    drawGameObjects(objectType) {
        TypeChecker.isInt(objectType);
    }

}