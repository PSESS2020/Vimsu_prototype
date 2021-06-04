/**
 * The Game Object View Factory
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameObjectViewFactory {
    tileColumnWidth;
    tileRowHeight;
    assetImages;

    gameEngine;
    eventManager;

    /**
     * Creates an instance of GameObjectViewFactory
     * 
     * @param {Image[]} assetImages asset images
     * @param {IsometricEngine} gameEngine game engine instance
     * @param {EventManager} eventManager event manager instance
     */
    constructor(assetImages, gameEngine, eventManager) {
        this.assetImages = assetImages;

        this.gameEngine = gameEngine;
        this.eventManager = eventManager;

        //gets map tile size
        this.tileColumnWidth = this.gameEngine.getTileColumnWidth();
        this.tileRowHeight = this.gameEngine.getTileRowHeight();
    }

    /**
     * Gets click map
     * 
     * @param {Image} image image
     * @param {PositionClient} pos position
     * @param {number} offset offset
     * 
     * @return {number[][]} clickMap
     */
    getClickMap(image, pos, offset) {
        var clickMap = [];
        let screenPosXY = this.gameEngine.calculateScreenPosXY(pos.getCordX(), pos.getCordY());
        let screenPosWithOffsetX = screenPosXY.x + offset.x;
        let screenPosWithOffsetY = screenPosXY.y + offset.y;

        //This draws on the map canvas because getImageData is buggy when called on avatar canvas.
        //Probably because a reference to the canvas is not released after calling getImageData.
        //There is also an issue on chrome dev site: https://bugs.chromium.org/p/chromium/issues/detail?id=977179
        ctx_map.drawImage(image, screenPosWithOffsetX, screenPosWithOffsetY);
        var imageData = ctx_map.getImageData(screenPosWithOffsetX, screenPosWithOffsetY, image.width, image.height).data;
        ctx_map.clearRect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT);

        for (var i = 0, n = imageData.length; i < n; i += 4) {
            var row = Math.floor((i / 4) / image.width);
            var col = (i / 4) - (row * image.width);

            if (!clickMap[row]) clickMap[row] = [];

            clickMap[row][col] = imageData[i + 3] === 0 ? 0 : 1;
        }
        return clickMap;
    }

    /* ##################################################################### */
    /* ###################### GAMEOBJECT CREATION INFORMATIONS ############# */
    /* ##################################################################### */

    /**
     * In order to make an Object not tile clickable but pixel clickable a new object type and class needs to be added to 
     * one of the creation methods and also an if statement to declare on what condition this 
     * new object should be created. Also a click map should be generated with the method getClickMap()
     * and passed to the new clickable Object.
     */

    /**
     * calculates the position of a game map element and creates it.
     * 
     * @param {GameObjectType} gameMapElementType game object type
     * @param {PositionClient} pos position
     * @param {String} objectName object name
     * @param {boolean} isClickable true if map element is clickable, otherwise false
     * @param {Object} onClickData object containing the data needed to
     *                             properly handle a (clickable) object
     *                             being clicked.
     * @param {number} gameMapElementID ID of this gameObject if it exists
     *
     * 
     * @return {GameMapElementView} GameMapElementView instance
     */
    createGameMapElementView(gameMapElementType, pos, offsets, objectName, isClickable, onClickData, gameMapElementID) {
        TypeChecker.isEnumOf(gameMapElementType, GameObjectType);
        TypeChecker.isInstanceOf(pos, PositionClient);
        TypeChecker.isString(objectName);
        TypeChecker.isBoolean(isClickable);

        var gameMapElementView = null;
        var gameMapElementImage;

        gameMapElementImage = this.assetImages[objectName];
        
        if (gameMapElementImage !== undefined) {
            var offset = this.calculateMapElementOffset(offsets, gameMapElementImage, gameMapElementType);
            // Strange fix to make sure left & right tiles are displayed properly
            if (gameMapElementType === GameObjectType.LEFTTILE) {
                pos = new PositionClient(pos.getCordX(), pos.getCordY() + 1);
            } else if (gameMapElementType === GameObjectType.RIGHTTILE){
                pos = new PositionClient(pos.getCordX() - 1, pos.getCordY());
            }
            if (isClickable) {
                TypeChecker.isInt(gameMapElementID);
                const { type } = onClickData
                TypeChecker.isEnumOf(type, TypeOfOnClickData)
                gameMapElementView = new GameMapElementView(gameMapElementImage, this.getClickMap(gameMapElementImage, pos, offset), pos, offset, objectName);
                var creationData = { gameObjectID: gameMapElementID, gameObjectType: gameMapElementType, onClickData,eventManager: this.eventManager }
                ClickableObjectViewDecorators.decorate(type, gameMapElementView, creationData)
            } else {
                gameMapElementView = new GameMapElementView(gameMapElementImage, [], pos, offset, objectName);
            }
        } else {
            throw new Error("The image for the key " + objectName + " could not be found in the cache for images. Did you reload the images after cache clear?");
        }

        return gameMapElementView;
    }

    /**
     * calculates the position of a game object and creates it.
     * 
     * @param {GameObjectType} gameObjectType game object type
     * @param {PositionClient} pos position
     * @param {String} objectName object name
     * @param {boolean} isClickable true if object is clickable, otherwise false
     * @param {Object} onClickData object containing the data needed to
     *                             properly handle a (clickable) object
     *                             being clicked.
     * @param {number} gameObjectID ID of this gameObject if it exists
     *
     * @return {GameObjectView} GameObjectView instance
     */
    createGameObjectView(gameObjectType, pos, offsets, objectName, isClickable, onClickData, gameObjectID) {
        TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isInstanceOf(pos, PositionClient);
        TypeChecker.isString(objectName);

        var gameObjectView = null;
        var gameObjectImage;
        gameObjectImage = this.assetImages[objectName];

        if (gameObjectImage !== undefined) {
            var offset = this.calculateObjectOffset(offsets, gameObjectImage, gameObjectType);
            if (isClickable) {
                TypeChecker.isInt(gameObjectID);
                const { type } = onClickData
                TypeChecker.isEnumOf(type, TypeOfOnClickData)
                gameObjectView = new GameObjectView(gameObjectImage, this.getClickMap(gameObjectImage, pos, offset), pos, offset, objectName);
                var creationData = { gameObjectID, gameObjectType, onClickData,eventManager: this.eventManager }
                ClickableObjectViewDecorators.decorate(type, gameObjectView, creationData)
            } else {
                gameObjectView = new GameObjectView(gameObjectImage, [], pos, offset, objectName);
            }
        } else {
            throw new Error("The image for the key " + objectName + " could not be found in the cache for images. Did you reload the images after cache clear?");
        }

        return gameObjectView;
    }

    /**
     * calculates the position of a door and creates it.
     * 
     * @param {TypeOfDoor} typeOfDoor type of door
     * @param {PositionClient} pos position
     * @param {String} objectName door name
     * 
     * @return {DoorView} DoorView instance
     */
    createDoorView(typeOfDoor, pos, objectName) {
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoor);
        TypeChecker.isInstanceOf(pos, PositionClient);
        TypeChecker.isString(objectName);

        var doorView = null;
        var doorImage;

        doorImage = this.assetImages[objectName];

        // hacky solution to make sure logos above door are displayed
        // correctly. should probably be cleaned up soonishly.
        let offsets = Settings[`${typeOfDoor.split("_")[0]}WALL_OFFSET`]

        if (doorImage !== undefined) {
            var offset = this.calculateMapElementOffset(offsets, doorImage, typeOfDoor);
            doorView = new DoorView(doorImage, [], pos, typeOfDoor, offset, objectName, this.eventManager);
        } else {
            throw new Error("The image for the key " + objectName + " could not be found in the cache for images. Did you reload the images after cache clear?");
        }

        return doorView;
    }

    /**
     * @param {Object} offsets The offsets of the asset as told by server
     * @param {Image} image image asset of map element
     * @param {String} objectType type of object
     * 
     * @returns {Object} An object containing the x- and y-offset
     *                   necessary to properly portray the object
     */
    calculateObjectOffset = function (offsets, image, objectType) {
        if (offsets === undefined) {
            offsets = Settings.DEFAULT_OFFSET
        }
        if (objectType !== GameObjectType.RECEPTIONCOUNTER) {
            return { x: offsets.x, y: this.tileRowHeight - image.height + offsets.y };
        } else {
            // some offsets do not follow the usual formula
            return { x: 0, y: -this.tileRowHeight + offsets.y };
        }
    }

    /**
     * @param {Object} offsets The offsets of the asset as told by server
     * @param {Image} image image asset of map element
     * @param {String} objectType type of map element
     * 
     * @returns {Object} An object containing the x- and y-offset
     *                   necessary to properly portray the mapElement
     */
    calculateMapElementOffset = function (offsets, image, objectType) {
        if (offsets === undefined) {
            offsets = Settings.DEFAULT_OFFSET
        }
        const { x: facX, y: facY } = offsets
        return { x: this.tileColumnWidth * facX, y: ((!facY) ? facY : ((this.tileRowHeight / 2) - image.width + offsets.y)) } 
    }
}