class GameObjectViewFactory {
    #tileColumnOffset;
    #tileRowOffset;
    #wallColumnOffset;
    #tableRowOffset;
    #gameEngine;

    constructor(offset, gameEngine) {
        this.#tileColumnOffset = offset.tileColumnOffset;
        this.#tileRowOffset = offset.tileRowOffset;
        this.#wallColumnOffset = offset.wallColumnOffset;
        this.#tableRowOffset = offset.tableRowOffset;

        this.#gameEngine = gameEngine;
    }

    /*
    * calculates the screenpostition of an game object and creates it.
    */
    createGameObjectView(gameObjectType, pos, objectName) {
        //TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isInstanceOf(pos, PositionClient);
        TypeChecker.isString(objectName);

        var gameObjectView;
        var gameObjectImage;
        var screenPos;

        //calculates the screen position where to draw the tile
        var screenX = this.#gameEngine.calculateScreenPosX(pos.getCordX(), pos.getCordY());
        var screenY = this.#gameEngine.calculateScreenPosY(pos.getCordX(), pos.getCordY());


        //because the door image has a different size.
        var doorOffsetY = this.#tileRowOffset / 2 - this.#wallColumnOffset + 1;

        //because the table image has a different size.
        var tableOffsetY = this.#tileRowOffset - this.#tableRowOffset + 7;

        var leftDoorScreenX = screenX;
        var leftDoorScreenY = screenY + doorOffsetY;
        var rightDoorScreenX = screenX - this.#tileColumnOffset;
        var rightDoorScreenY = screenY + doorOffsetY;

        switch (gameObjectType) {

            case GameObjectType.SELECTED_TILE:

                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = CacheImages.getImage(objectName);
                gameObjectView = new SelectedTileView(gameObjectImage, screenPos);

                break;

            case GameObjectType.TILE:

                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.LEFTWALL:

                screenPos = new PositionClient(screenX, screenY + doorOffsetY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new WallView(gameObjectImage, screenPos);
                else throw new Error("The image for the left wall view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.RIGHTWALL:

                screenPos = new PositionClient(screenX - this.#tileColumnOffset, screenY + doorOffsetY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new WallView(gameObjectImage, screenPos);
                else throw new Error("The image for the right wall view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case TypeOfDoor.LECTURE_DOOR:

                screenPos = new PositionClient(leftDoorScreenX, leftDoorScreenY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new DoorView(gameObjectImage, screenPos, TypeOfDoor.LECTURE_DOOR);
                else throw new Error("The image for the lecture door view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case TypeOfDoor.FOODCOURT_DOOR:

                screenPos = new PositionClient(rightDoorScreenX, rightDoorScreenY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new DoorView(gameObjectImage, screenPos, TypeOfDoor.FOODCOURT_DOOR);
                else throw new Error("The image for the foodcourt door view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case TypeOfDoor.RECEPTION_DOOR:

                screenPos = new PositionClient(rightDoorScreenX, rightDoorScreenY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new DoorView(gameObjectImage, screenPos, TypeOfDoor.RECEPTION_DOOR);
                else throw new Error("The image for the reception door view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case TypeOfDoor.FOYER_DOOR:

                screenPos = new PositionClient(leftDoorScreenX, leftDoorScreenY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new DoorView(gameObjectImage, screenPos, TypeOfDoor.FOYER_DOOR);
                else throw new Error("The image for the foyer door view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.TABLE:

                screenPos = new PositionClient(screenX, screenY + tableOffsetY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new TableView(gameObjectImage, screenPos);
                else throw new Error("The image for the table view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.LEFTTILE:

                screenX = this.#gameEngine.calculateScreenPosX( pos.getCordX(), (pos.getCordY() + 1) );
                screenY = this.#gameEngine.calculateScreenPosY( (pos.getCordY() + 1), pos.getCordX() );

                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the left door tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.RIGHTTILE:

                screenX = this.#gameEngine.calculateScreenPosX( (pos.getCordX() - 1), pos.getCordY() );
                screenY = this.#gameEngine.calculateScreenPosY( (pos.getCordX() - 1),  pos.getCordY());
                
                screenPos = new PositionClient(screenX, screenY);
                gameObjectImage = CacheImages.getImage(objectName);

                if (gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the right door tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;
            default:
                gameObjectView = null;
        }

        return gameObjectView;
    }
}