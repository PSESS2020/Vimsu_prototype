class GameObjectViewFactory {
    #tileColumnOffset;
    #tileRowOffset;
    #wallColumnOffset;
    #tableRowOffset;
    #loadedImages;

    constructor(loadedImages){
        this.#loadedImages = loadedImages;
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
        var tableOffsetY = this.#tileRowOffset - this.#tableRowOffset + 7;
        
        switch(gameObjectType) {

            case  GameObjectTypeClient.SELECTED_TILE:
                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = this.#loadedImages[0];

                gameObjectView = new SelectedTileView(gameObjectImage, screenPos);
            break;

            case  GameObjectTypeClient.TILE:
                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = this.#loadedImages[1];

                gameObjectView = new TileView(gameObjectImage, screenPos);
            break;

            case GameObjectTypeClient.LEFTWALL:
                screenPos = new PositionClient(screenX, screenY + doorOffsetY);
                gameObjectImage = this.#loadedImages[2];

                gameObjectView = new WallView(gameObjectImage, screenPos);
            break;
            
            case GameObjectTypeClient.RIGHTWALL:
                screenPos = new PositionClient(screenX  - this.#tileColumnOffset, screenY + doorOffsetY);
                gameObjectImage = this.#loadedImages[3];

                gameObjectView = new WallView(gameObjectImage, screenPos);
            break;

            case GameObjectTypeClient.LECTUREDOOR:
                screenPos = new PositionClient(screenX, screenY + doorOffsetY);
                gameObjectImage = this.#loadedImages[4];

                gameObjectView = new DoorView(gameObjectImage, screenPos);
            break;

            case GameObjectTypeClient.FOODCOURTDOOR:
                screenPos = new PositionClient(screenX - this.#tileColumnOffset, screenY + doorOffsetY);
                gameObjectImage = this.#loadedImages[5];

                gameObjectView = new DoorView(gameObjectImage, screenPos);
            break;

            case  GameObjectTypeClient.RECEPTIONDOOR:
                screenPos = new PositionClient(screenX - this.#tileColumnOffset, screenY + doorOffsetY);
                gameObjectImage = this.#loadedImages[6];

                gameObjectView = new DoorView(gameObjectImage, screenPos);
            break;

            case GameObjectTypeClient.TABLE:
                screenPos = new PositionClient(screenX, screenY + tableOffsetY);
                gameObjectImage = this.#loadedImages[7];
                gameObjectView = new TableView(gameObjectImage, screenPos);
            break;
            
            case GameObjectTypeClient.LEFTTILE:
                screenX = pos.getCordX() * this.#tileColumnOffset / 2 + (pos.getCordY() + 1) * this.#tileColumnOffset / 2 + originXY.x;
                screenY = (pos.getCordY() + 1) * this.#tileRowOffset / 2 - pos.getCordX() * this.#tileRowOffset / 2 + originXY.y;
                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = this.#loadedImages[1];

                gameObjectView = new TileView(gameObjectImage, screenPos);
            break;

            case GameObjectTypeClient.RIGHTTILE:
                screenX = (pos.getCordX() - 1) * this.#tileColumnOffset / 2 + pos.getCordY() * this.#tileColumnOffset / 2 + originXY.x;
                screenY = pos.getCordY() * this.#tileRowOffset / 2 - (pos.getCordX() - 1) * this.#tileRowOffset / 2 + originXY.y;
                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = this.#loadedImages[1];

                gameObjectView = new TileView(gameObjectImage, screenPos);
            break;
            default:
               gameObjectView = null;
        }
        return gameObjectView;
    }
}