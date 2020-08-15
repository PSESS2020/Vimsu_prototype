class GameObjectViewFactory {
    #tileColumnWidth;
    #tileRowHeight;
    #assetImages;

    #gameEngine;

    constructor(assetImages, gameEngine) {
        this.#assetImages = assetImages;

        this.#gameEngine = gameEngine;
       
        //gets map tile size
        this.#tileColumnWidth = this.#gameEngine.getTileColumnWidth();
        this.#tileRowHeight = this.#gameEngine.getTileRowHeight();
    }

    /*
    * calculates the screenposition of a game object and creates it.
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

        switch (gameObjectType) {

            case GameObjectType.SELECTED_TILE:
                gameObjectImage = this.#assetImages[objectName];

                screenPos = new PositionClient(screenX, screenY);

                if (gameObjectImage !== undefined)
                    gameObjectView = new SelectedTileView(gameObjectImage, screenPos);
                else throw new Error("The image for tile indicator view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.TILE:
                gameObjectImage = this.#assetImages[objectName];

                screenPos = new PositionClient(screenX, screenY);

                if (gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.LEFTWALL:
                gameObjectImage = this.#assetImages[objectName];

                var wallOffsetY = this.#tileRowHeight / 2 - gameObjectImage.width + 1;
                
                screenPos = new PositionClient(screenX, screenY + wallOffsetY);

                if (gameObjectImage !== undefined)
                    gameObjectView = new WallView(gameObjectImage, screenPos);
                else throw new Error("The image for the left wall view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.RIGHTWALL:
                gameObjectImage = this.#assetImages[objectName];

                var wallOffsetY = this.#tileRowHeight / 2 - gameObjectImage.width + 1;
                
                screenPos = new PositionClient(screenX - this.#tileColumnWidth, screenY + wallOffsetY);

                if (gameObjectImage !== undefined)
                    gameObjectView = new WallView(gameObjectImage, screenPos);
                else throw new Error("The image for the right wall view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.TABLE:
                gameObjectImage = this.#assetImages[objectName];

                //because the table image has a different size.
                var tableOffsetY = this.#tileRowHeight - gameObjectImage.height + 7;

                screenPos = new PositionClient(screenX, screenY + tableOffsetY);

                if (gameObjectImage !== undefined)
                    gameObjectView = new TableView(gameObjectImage, screenPos);
                else throw new Error("The image for the table view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.LEFTTILE:
                gameObjectImage = this.#assetImages[objectName];

                screenX = this.#gameEngine.calculateScreenPosX( pos.getCordX(), (pos.getCordY() + 1) );
                screenY = this.#gameEngine.calculateScreenPosY( (pos.getCordY() + 1), pos.getCordX() );

                screenPos = new PositionClient(screenX, screenY);

                if (gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the left door tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.RIGHTTILE:
                gameObjectImage = this.#assetImages[objectName];

                screenX = this.#gameEngine.calculateScreenPosX( (pos.getCordX() - 1), pos.getCordY() );
                screenY = this.#gameEngine.calculateScreenPosY( (pos.getCordX() - 1),  pos.getCordY());
                
                screenPos = new PositionClient(screenX, screenY);

                if (gameObjectImage !== undefined)
                    gameObjectView = new TileView(gameObjectImage, screenPos);
                else throw new Error("The image for the right door tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;
            default:
                gameObjectView = null;
        }

        return gameObjectView;
    }

    createDoorView(typeOfDoor, pos, objectName) {

        var doorView;
        var doorImage;
        var screenPos;

        //calculates the screen position where to draw the tile
        var screenX = this.#gameEngine.calculateScreenPosX(pos.getCordX(), pos.getCordY());
        var screenY = this.#gameEngine.calculateScreenPosY(pos.getCordX(), pos.getCordY());

        switch(typeOfDoor) {

            case TypeOfDoor.LECTURE_DOOR:
            case TypeOfDoor.LEFT_DOOR:

                doorImage = this.#assetImages[objectName];

                var leftDoorScreenX = screenX;
                var leftDoorScreenY = screenY + this.#tileRowHeight / 2 - doorImage.width + 1;

                screenPos = new PositionClient(leftDoorScreenX, leftDoorScreenY);

                if (doorImage !== undefined)
                    doorView = new DoorView(doorImage, screenPos, typeOfDoor, objectName);
                else throw new Error("The image for lefthandside door view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case TypeOfDoor.RIGHT_DOOR:

                doorImage = this.#assetImages[objectName];

                var rightDoorScreenX = screenX - this.#tileColumnWidth;
                var rightDoorScreenY = screenY + this.#tileRowHeight / 2 - doorImage.width + 1;

                screenPos = new PositionClient(rightDoorScreenX, rightDoorScreenY);

                if (doorImage !== undefined)
                    doorView = new DoorView(doorImage, screenPos, typeOfDoor, objectName);
                else throw new Error("The image for righthandside door view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

                default:
                    doorView = null; 
        }
        return doorView;
    }

}