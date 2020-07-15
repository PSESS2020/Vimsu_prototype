class GameObjectViewFactory {
    #tileColumnOffset;
    #tileRowOffset;
    #wallColumnOffset;
    #tableRowOffset;
    #tilePaths = ["client/assets/tile_selected.png", "client/assets/tile_normal.png", "client/assets/wall1.png", "client/assets/wall2.png", "client/assets/door_lecturehall.png", "client/assets/door_foodcourt.png", "client/assets/door_reception.png", "client/assets/door_foyer.png", "client/assets/table.png",];


    constructor(){

    }

    /*
    *calculates the screenpostition of an game object and creates it.
    */
    createGameObjectView(gameObjectType, pos, originXY, offset) {
        var gameObjectView;
        var gameObjectImage;
        var screenPos;

        this.#tileColumnOffset = offset.tileColumnOffset;
        this.#tileRowOffset = offset.tileRowOffset;
        this.#wallColumnOffset = offset.wallColumnOffset;
        this.#tableRowOffset = offset.tableRowOffset;
        
        //calculates the screen position where to draw the tile
        var screenX = pos.getCordX() * this.#tileColumnOffset / 2 + pos.getCordY() * this.#tileColumnOffset / 2 + originXY.x;
        var screenY = pos.getCordY() * this.#tileRowOffset / 2 - pos.getCordX() * this.#tileRowOffset / 2 + originXY.y;

        //because the door image has a different size.
        var doorOffsetY = this.#tileRowOffset / 2 - this.#wallColumnOffset + 1;

        //because the table image has a different size.
        var tableOffsetY = this.#tileRowOffset - this.#tableRowOffset + 7;

        var leftDoorScreenX = screenX;
        var leftDoorScreenY = screenY + doorOffsetY;
        var rightDoorScreenX = screenX - this.#tileColumnOffset
        var rightDoorScreenY = screenY + doorOffsetY;
        
        switch(gameObjectType) {

            case  GameObjectTypeClient.SELECTED_TILE:

                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[0]);

                if(gameObjectImage !== undefined)
                    gameObjectView = new SelectedTileView(gameObjectImage, screenPos);
                else throw new Error("The image for the selected tile view could not be found in the cache for images. Did you reload the images after cache clear?");

            break;

            case  GameObjectTypeClient.TILE:

                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[1]);
              
                if(gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the tile view could not be found in the cache for images. Did you reload the images after cache clear?");

            break;

            case GameObjectTypeClient.LEFTWALL:

                screenPos = new PositionClient(screenX, screenY + doorOffsetY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[2]);

                if(gameObjectImage !== undefined)
                    gameObjectView = new WallView(gameObjectImage, screenPos);
                else throw new Error("The image for the left wall view could not be found in the cache for images. Did you reload the images after cache clear?");

            break;
            
            case GameObjectTypeClient.RIGHTWALL:

                screenPos = new PositionClient(screenX  - this.#tileColumnOffset, screenY + doorOffsetY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[3]);

                if(gameObjectImage !== undefined)
                    gameObjectView = new WallView(gameObjectImage, screenPos);
                else throw new Error("The image for the right wall view could not be found in the cache for images. Did you reload the images after cache clear?");

            break;

            case GameObjectTypeClient.LECTUREDOOR:

                screenPos = new PositionClient(leftDoorScreenX, leftDoorScreenY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[4]);

                if(gameObjectImage !== undefined)
                    gameObjectView = new DoorView(gameObjectImage, screenPos, GameObjectTypeClient.LECTUREDOOR);
                else throw new Error("The image for the lecture door view could not be found in the cache for images. Did you reload the images after cache clear?");

            break;

            case GameObjectTypeClient.FOODCOURTDOOR:

                screenPos = new PositionClient(rightDoorScreenX, rightDoorScreenY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[5]);

                if(gameObjectImage !== undefined)
                    gameObjectView = new DoorView(gameObjectImage, screenPos, GameObjectTypeClient.FOODCOURTDOOR);
                else throw new Error("The image for the foodcourt door view could not be found in the cache for images. Did you reload the images after cache clear?");

            break;

            case  GameObjectTypeClient.RECEPTIONDOOR:

                screenPos = new PositionClient(rightDoorScreenX, rightDoorScreenY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[6]);
                
                if(gameObjectImage !== undefined)
                    gameObjectView = new DoorView(gameObjectImage, screenPos, GameObjectTypeClient.RECEPTIONDOOR);
                else throw new Error("The image for the reception door view could not be found in the cache for images. Did you reload the images after cache clear?");
                
            break;

            case  GameObjectTypeClient.FOYERDOOR:

                screenPos = new PositionClient(leftDoorScreenX, leftDoorScreenY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[7]);
                
                if(gameObjectImage !== undefined)
                    gameObjectView = new DoorView(gameObjectImage, screenPos, GameObjectTypeClient.FOYERDOOR);
                else throw new Error("The image for the foyer door view could not be found in the cache for images. Did you reload the images after cache clear?");
                
            break;

            case GameObjectTypeClient.TABLE:

                screenPos = new PositionClient(screenX, screenY + tableOffsetY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[8]);

                if(gameObjectImage !== undefined)
                    gameObjectView = new TableView(gameObjectImage, screenPos);
                else throw new Error("The image for the table view could not be found in the cache for images. Did you reload the images after cache clear?");
            
            break;
            
            case GameObjectTypeClient.LEFTTILE:

                screenX = pos.getCordX() * this.#tileColumnOffset / 2 + (pos.getCordY() + 1) * this.#tileColumnOffset / 2 + originXY.x;
                screenY = (pos.getCordY() + 1) * this.#tileRowOffset / 2 - pos.getCordX() * this.#tileRowOffset / 2 + originXY.y;
                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[1]);

                if(gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the left door tile view could not be found in the cache for images. Did you reload the images after cache clear?");

            break;

            case GameObjectTypeClient.RIGHTTILE:

                screenX = (pos.getCordX() - 1) * this.#tileColumnOffset / 2 + pos.getCordY() * this.#tileColumnOffset / 2 + originXY.x;
                screenY = pos.getCordY() * this.#tileRowOffset / 2 - (pos.getCordX() - 1) * this.#tileRowOffset / 2 + originXY.y;
                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = CacheImages.getImage(this.#tilePaths[1]);

                if(gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the right door tile view could not be found in the cache for images. Did you reload the images after cache clear?");

            break;
            default:
               gameObjectView = null;
        }

        return gameObjectView;
    }
}