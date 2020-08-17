class GameObjectViewFactory {
    #tileColumnWidth;
    #tileRowHeight;
    #assetImages;
    #defaultOffset;

    #gameEngine;

    constructor(assetImages, gameEngine) {
        this.#assetImages = assetImages;

        this.#gameEngine = gameEngine;

        //gets map tile size
        this.#tileColumnWidth = this.#gameEngine.getTileColumnWidth();
        this.#tileRowHeight = this.#gameEngine.getTileRowHeight();

        this.#defaultOffset = { x: 0, y: 0 };
    }

    getClickMap(image, pos, offset) {
        var clickMap = [];
        let screenPosXY = this.#gameEngine.calculateScreenPosXY(pos.getCordX(), pos.getCordY());
        let screenPosWithOffsetX = screenPosXY.x + offset.x;
        let screenPosWithOffsetY = screenPosXY.y + offset.y;

        ctx_avatar.drawImage(image, screenPosWithOffsetX, screenPosWithOffsetY);
            var imageData = ctx_avatar.getImageData(screenPosWithOffsetX, screenPosWithOffsetY, image.width, image.height).data;
        
            for ( var i = 0, n = imageData.length; i < n; i += 4) {
                var row = Math.floor((i / 4) / image.width);
                var col = (i / 4) - (row * image.width);

                if(!clickMap[row]) clickMap[row] = [];
                
                clickMap[row][col] = imageData[i+3] === 0 ? 0 : 1;
            }
        return clickMap;
    }

    /* ##################################################################### */
    /* ###################### GAMEOBJECT CREATION INFORMATIONS ############# */
    /* ##################################################################### */

    /**
     * Im order to make an Object nut tile clickable but pixel clickable a new object type and class needs to be added to 
     * one of the creation methods and also an if statement to declare on what condition this 
     * new object should be created. Also a click map should be generated with the method getClickMap()
     * and passed to the new clickable Object.
     */

    /*
    * calculates the position of a game map element and creates it.
    */
   createGameMapElementView(gameObjectType, pos, objectName) {
        TypeChecker.isInstanceOf(pos, PositionClient);
        TypeChecker.isString(objectName);

        var gameMapElementView;
        var gameMapElementImage;

        switch (gameObjectType) {

            case GameObjectType.TILE:
                gameMapElementImage = this.#assetImages[objectName];

                if (gameMapElementImage !== undefined)
                    gameMapElementView = new GameMapElementView(gameMapElementImage, pos, this.#defaultOffset, objectName);
                else throw new Error("The image for the tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;
            case GameObjectType.LEFTSCHEDULE:
            case GameObjectType.LEFTWALL:
                gameMapElementImage = this.#assetImages[objectName];

                var wallOffset = {x: 0, y: this.#tileRowHeight / 2 - gameMapElementImage.width + 1};
                
                if (gameMapElementImage !== undefined) {
                    if (gameObjectType === GameObjectType.LEFTSCHEDULE)
                        gameMapElementView = new ScheduleView(gameMapElementImage, pos, wallOffset, objectName, this.getClickMap(gameMapElementImage, pos, wallOffset));
                    else
                        gameMapElementView = new GameMapElementView(gameMapElementImage, pos, wallOffset, objectName);
                } else throw new Error("The image for the left wall view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.RIGHTWALL:
                gameMapElementImage = this.#assetImages[objectName];

                var wallOffset = {x: -this.#tileColumnWidth, y: this.#tileRowHeight / 2 - gameMapElementImage.width + 1};
                
                if (gameMapElementImage !== undefined)
                    gameMapElementView = new GameMapElementView(gameMapElementImage, pos, wallOffset, objectName);
                else throw new Error("The image for the right wall view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.LEFTTILE:
                gameMapElementImage = this.#assetImages[objectName];

                pos = new PositionClient(pos.getCordX(), (pos.getCordY() + 1));
                
                if (gameMapElementImage !== undefined)
                    gameMapElementView = new GameMapElementView(gameMapElementImage, pos, this.#defaultOffset, objectName);
                else throw new Error("The image for the left door tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.RIGHTTILE:
                gameMapElementImage = this.#assetImages[objectName];

                pos = new PositionClient((pos.getCordX() - 1), pos.getCordY());

                if (gameMapElementImage !== undefined)
                    gameMapElementView = new GameMapElementView(gameMapElementImage, pos, this.#defaultOffset, objectName);
                else throw new Error("The image for the right door tile view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;
            default:
                gameMapElementView = null;
        }

        return     gameMapElementView;
   }    

    /*
    * calculates the position of a game object and creates it.
    */
    createGameObjectView(gameObjectType, pos, objectName) {
        //TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isInstanceOf(pos, PositionClient);
        TypeChecker.isString(objectName);

        var gameObjectView;
        var gameObjectImage;

        switch (gameObjectType) {

            case GameObjectType.SELECTED_TILE:
                gameObjectImage = this.#assetImages[objectName];

                if (gameObjectImage !== undefined)
                    gameObjectView = new GameObjectView(gameObjectImage, pos, this.#defaultOffset, objectName);
                else throw new Error("The image for tile indicator view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.TABLE:
                gameObjectImage = this.#assetImages[objectName];

                //because the tble image has a different size.
                var tableOffset = {x: 0, y: this.#tileRowHeight - gameObjectImage.height + 7};

                if (gameObjectImage !== undefined)
                    gameObjectView = new GameObjectView(gameObjectImage, pos, tableOffset, objectName);
                else throw new Error("The image for the table view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case GameObjectType.PLANT:
                gameObjectImage = this.#assetImages[objectName];

                //because the plant image has a different size.
                var plantOffset = {x: 0, y: this.#tileRowHeight - gameObjectImage.height - 10};

                if (gameObjectImage !== undefined)
                    gameObjectView = new GameObjectView(gameObjectImage, pos, plantOffset, objectName);
                else throw new Error("The image for the plant view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            default:
                gameObjectView = null;
        }

        return gameObjectView;
    }

    createDoorView(typeOfDoor, pos, objectName) {

        var doorView;
        var doorImage;

        switch (typeOfDoor) {

            case TypeOfDoor.LECTURE_DOOR:
            case TypeOfDoor.LEFT_DOOR:

                doorImage = this.#assetImages[objectName];

                var leftDoorOffset = {x: 0, y: this.#tileRowHeight / 2 - doorImage.width + 1};

                if (doorImage !== undefined)
                    doorView = new DoorView(doorImage, pos, typeOfDoor, leftDoorOffset, objectName);
                else throw new Error("The image for lefthandside door view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            case TypeOfDoor.RIGHT_DOOR:

                doorImage = this.#assetImages[objectName];

                var rightDoorOffset = {x: -this.#tileColumnWidth, y: this.#tileRowHeight / 2 - doorImage.width + 1} ;

                if (doorImage !== undefined)
                    doorView = new DoorView(doorImage, pos, typeOfDoor, rightDoorOffset, objectName);
                else throw new Error("The image for righthandside door view could not be found in the cache for images. Did you reload the images after cache clear?");

                break;

            default:
                doorView = null;
        }
        return doorView;
    }

}