if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    GameObjectClient = require('./GameObjectClient.js');
    NPCClient = require('./NPCClient.js');
    DoorClient = require('./DoorClient.js');
    ParticipantClient = require('./ParticipantClient.js');
    TypeOfRoom = require('../shared/TypeOfRoom');
    GameObjectType = require('../shared/GameObjectType.js');
    Settings = require('../utils/Settings.js');
}

/**
 * The Room Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class RoomClient {

    roomId;
    roomName;
    typeOfRoom;
    assetPaths;
    listOfMapElements;
    listOfGameObjects;
    listOfNPCs;
    listOfDoors;
    width;
    length;
    listOfPPants;
    occupationMap;
    map;
    objectMap;

    /**
     * TODO rewrite comments
     * Creates an instance of Room on client-side
     * 
     * @param {number} roomId room ID
     * @param {String} roomName room name
     * @param {TypeOfRoom} typeOfRoom type of room
     * @param {Object} assetPaths asset paths
     * @param {GameObjectClient[]} listOfMapElements list of map elements
     * @param {GameObjectClient[]} listOfGameObjects list of game objects
     * @param {NPCClient[]} listOfNPCs list of NPCs
     * @param {DoorClient[]} listOfDoors list of Doors
     * @param {number} width room width
     * @param {number} length room length
     * @param {number[][]} occupationMap room occupation map
     */
    constructor(assetPaths, roomData) {
        if (!!RoomClient.instance) {
            return RoomClient.instance;
        }

        RoomClient.instance = this;

        this.swapRoom(assetPaths, roomData)
    }

    /**
     * Gets room ID
     * 
     * @return {number} roomId
     */
    getRoomId() {
        return this.roomId;
    }

    /**
     * Gets room name
     * 
     * @returns {String} roomName
     */
    getRoomName() {
        return this.roomName;
    }

    /**
     * Gets type of room
     * 
     * @return {TypeOfRoom} typeOfRoom
     */
    getTypeOfRoom() {
        return this.typeOfRoom;
    }

    /**
     * Gets asset paths
     * 
     * @return {Object} assetPaths
     */
    getAssetPaths() {
        return this.assetPaths;
    }

    /**
     * Gets room width
     * 
     * @return {number} width
     */
    getWidth() {
        return this.width;
    }

    /**
     * Gets room length
     * 
     * @return {number} length
     */
    getLength() {
        return this.length;
    }

    /**
     * Gets list of participants in the room
     * 
     * @return {ParticipantClient[]} list of ppants
     */
    getListOfPPants() {
        return this.listOfPPants;
    }

    /**
     * Gets list of map elements
     * 
     * @return {GameObjectClient[]} list of map elements
     */
    getListOfMapElements() {
        return this.listOfMapElements;
    }

    /**
     * Gets list of game objects
     * 
     * @return {GameObjectClient[]} list of game objects
     */
    getListOfGameObjects() {
        return this.listOfGameObjects;
    }

    /**
     * Gets list of NPCs
     * 
     * @return {NPCClient[]} list of NPCs
     */
    getListOfNPCs() {
        return this.listOfNPCs;
    }

    /**
     * Gets list of doors
     * 
     * @return {DoorClient[]} list of doors
     */
    getListOfDoors() {
        return this.listOfDoors;
    }

    /**
     * Adds ppant into room
     * 
     * @param {ParticipantClient} participant participant
     */
    enterParticipant(participant) {
        TypeChecker.isInstanceOf(participant, ParticipantClient);
        if (!this.listOfPPants.includes(participant)) {
            this.listOfPPants.push(participant);
        }
    }

    /**
     * Deletes ppant from room
     * 
     * @param {number} participantId participant ID
     */
    exitParticipant(participantId) {
        TypeChecker.isString(participantId);

        for (let index = 0; index < this.listOfPPants.length; index++) {
            if (this.listOfPPants[index].getId() === participantId) {
                this.listOfPPants.splice(index, 1);
                return;
            }
        }
    }

    /**
     * Gets a Participant who is currently in this room
     * @param {String} ppantID participant ID
     */
    getParticipant(ppantID) {
        TypeChecker.isString(ppantID);

        for (let index = 0; index < this.listOfPPants.length; index++) {
            const ppant = this.listOfPPants[index]
            if (ppant.getId() === ppantID) {
                return ppant
            }
        }

        return undefined;
    }

    /**
     * Checks, if there is a collision at this position
     * 
     * @param {PositionClient} position position
     * @return {boolean} true, when collision, false otherwise
     */
    checkForCollision(position) {
        TypeChecker.isInstanceOf(position, PositionClient);
        let cordX = position.getCordX();
        let cordY = position.getCordY();

        //WALLS
        if (cordX < 0 || cordY < 0 || cordX >= this.length || cordY >= this.width) {
            return true;
        }

        //GAMEOBJECTS in room
        if (this.occupationMap[cordX][cordY + Settings.MAP_BLANK_TILES_WIDTH] == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Called when a user enters a new room
     * 
     * @param {number} roomId room ID
     * @param {TypeOfRoom} typeOfRoom type of room
     * @param {Object} assetPaths asset paths
     * @param {GameObjectClient[]} listOfMapElements list of map elements
     * @param {GameObjectClient[]} listOfGameObjects list of game objects
     * @param {NPCClient[]} listOfNPCs list of NPCs
     * @param {DoorClient[]} listOfDoors list of doors
     * @param {number} length room length
     * @param {number} width room width
     * @param {number[][]} occupationMap room occupation map
     */
    swapRoom(assetPaths, roomData) {
        const { id, name, type, width, length, mapElementData, gameObjectData, npcData, doorData, occMap } = roomData

        TypeChecker.isInt(id);
        TypeChecker.isString(name);
        TypeChecker.isEnumOf(type, TypeOfRoom);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(mapElementData, Array);
        TypeChecker.isInstanceOf(gameObjectData, Array);
        TypeChecker.isInstanceOf(npcData, Array);
        TypeChecker.isInstanceOf(occMap, Array);
        TypeChecker.isInstanceOf(doorData, Array);
        TypeChecker.isInstanceOf(occMap, Array);
        occMap.forEach(line => {
            TypeChecker.isInstanceOf(line, Array);
            line.forEach(element => {
                TypeChecker.isInt(element);
            });
        });

        TypeChecker.isInstanceOf(assetPaths, Object);
        for (var key in assetPaths) {
            TypeChecker.isString(assetPaths[key]);
        }
        
        this.roomId = id;
        this.roomName = name;
        this.typeOfRoom = type;
        this.assetPaths = assetPaths;
        this.listOfMapElements = [] 
        mapElementData.map( data => {
            console.log(`${data.type} has on click data ${data.onClickData}`)
            this.listOfMapElements.push( new GameObjectClient(data) );
            if ( data.isClickable && (data.width > 1 || data.length > 1) ) {
                this.addDummyClickers(this.listOfMapElements, data)
            }
        });
        this.listOfGameObjects = []
        gameObjectData.forEach( data => {
            console.log(`${data.type} has on click data ${data.onClickData}`)
            this.listOfGameObjects.push( new GameObjectClient(data) );
            if ( data.isClickable && (data.width > 1 || data.length > 1) ) {
                this.addDummyClickers(this.listOfGameObjects, data)
            } 
        });
        this.listOfNPCs = npcData.map( data => new NPCClient(data) );
        this.listOfDoors = doorData.map( data => new DoorClient(data) );
        this.listOfPPants = [];
        this.width = width;
        this.length = length;
        this.occupationMap = occMap;

        this.buildMapArray();
    }

    /**
     * Builds room map and game object map array
     */
    buildMapArray = function () {

        var mapLength = this.length + Settings.MAP_BLANK_TILES_LENGTH;
        this.map = new Array(mapLength);
        this.objectMap = new Array(mapLength);

        for (var i = 0; i < mapLength; i++) {
            this.map[i] = new Array(this.width + Settings.MAP_BLANK_TILES_LENGTH).fill(null);
            this.objectMap[i] = new Array(this.width + Settings.MAP_BLANK_TILES_LENGTH).fill(null);
        }

        this.listOfMapElements.forEach(mapElement => {
            let xPos = mapElement.getPosition().getCordX();
            let yPos = mapElement.getPosition().getCordY();
            let mapEntry = this.map[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH];

            if (mapEntry instanceof Array) {
                mapEntry.push(mapElement);
            } else if (mapEntry !== null) {
                mapEntry = [mapEntry, mapElement];
            } else
                mapEntry = mapElement;

            this.map[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH] = mapEntry;
        });

        this.listOfGameObjects.forEach(gameObject => {
            let xPos = gameObject.getPosition().getCordX();
            let yPos = gameObject.getPosition().getCordY();
            let mapEntry = this.objectMap[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH];

            if (mapEntry instanceof Array) {
                mapEntry.push(gameObject);
            } else if (mapEntry !== null) {
                mapEntry = [mapEntry, gameObject];
            } else
                mapEntry = gameObject;
            
            this.objectMap[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH] = mapEntry;
        });

        //set door positions in map
        this.listOfDoors.forEach(door => {

            var positionX = door.getMapPosition().getCordX();
            var positionY = door.getMapPosition().getCordY();

            this.map[positionX][positionY + Settings.MAP_BLANK_TILES_WIDTH] = door;

        });
    }

    /**
     * Adds invisible, clickable dummy objects to map s.t.
     * larger clickable objects can be clicked everywhere
     * 
     * @param {GameObjectClient[]} listToAddTo dummy objects should
     *                                         be added to same list
     *                                         as parent object
     * @param {objData} Object The data object containing the data
     *                         for which the dummy clickers are added
     */
    addDummyClickers(listToAddTo, objData) {
        const { id, cordX, cordY, width, length, onClickData } = objData
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < length; j++) {
                // don't add dummy clicker where original object is clickable
                if ( (i + j) !== 0 ) {
                    listToAddTo.push(
                        new GameObjectClient({
                            id, 
                            type: GameObjectType.BLANK,
                            name: "blank",
                            width: Settings.SMALL_OBJECT_WIDTH,
                            length: Settings.SMALL_OBJECT_LENGTH,
                            cordX: cordX + i,
                            cordY: cordY + j,
                            isClickable: true,
                            onClickData
                        })
                    )
                }
            }
        }
    }

    /**
     * Gets map array
     * 
     * @return {number[][]} map array
     */
    getMap() {
        return this.map;
    }

    /**
     * Gets object map array
     * 
     * @return {number[][]} object map array
     */
    getObjectMap() {
        return this.objectMap;
    }

    /**
     * Gets occupation map array
     * 
     * @return {number[][]} occupation map array
     */
    getOccupationMap() {
        return this.occupationMap;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = RoomClient;
}