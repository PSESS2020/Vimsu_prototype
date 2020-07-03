/*var MapView = require('./MapView.js')
var TypeChecker = require('../../../utils/TypeChecker.js')

module.exports = */class FoyerView extends MapView {
    #tileColumnOffset = 64;
    #tileRowOffset = 32;
    #originX = 0;
    #originY = 0;


    constructor() {
        super();
        this.tileImage = new Image();
        this.run();
        this.tileImage.src = FoyerMap.tiles[0];
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
        this.tileImage.onload = () => {
                this.draw();
    
            };
    }

    updateCanvasSize() {
        var width = $(window).width();
        var height = $(window).height();
        this.ctx.canvas.width  = width;
        this.ctx.canvas.height = height;

        this.#originX = this.#tileColumnOffset * 2;
        this.#originY = height / 2;
      }

    draw() {
        for(var x = (this.xNumTiles - 1); x >= 0; x--) {
            for(var y = 0; y < this.yNumTiles; y++) {
                this.drawTile(x, y);
            }
        }
    }

    drawTile(x, y) {

        //calculates the screen position where to draw the tile
        var screenX = x * this.#tileColumnOffset / 2 + y * this.#tileColumnOffset / 2 + this.#originX;
        var screenY = y * this.#tileRowOffset / 2 - x * this.#tileRowOffset / 2 + this.#originY;
            ctx.drawImage(this.tileImage, screenX, screenY);
    }

    drawGameObjects(objectType) {
        TypeChecker.isInt(objectType);
    }

}