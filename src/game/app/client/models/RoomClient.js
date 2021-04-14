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
     * Creates an instance of Room on client-side
     * 
     * @param {number} roomId room ID
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
    constructor(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap) {
        if (!!RoomClient.instance) {
            return RoomClient.instance;
        }

        RoomClient.instance = this;

        this.swapRoom(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap)
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
        this.listOfPPants.forEach((participant, index) => {
            if (participant.getId() === participantId) {
                this.listOfPPants.splice(index, 1);
            }
        });
    }

    /**
     * Gets a Participant who is currently in this room
     * @param {String} ppantID participant ID
     */
    getParticipant(ppantID) {
        TypeChecker.isString(ppantID);
        var result;
        this.listOfPPants.forEach(ppant => {
            if (ppantID === ppant.getId()) {
                result = ppant;
            }
        });
        return result;
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
    swapRoom(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);
        TypeChecker.isInstanceOf(assetPaths, Object);
        for (var key in assetPaths) {
            TypeChecker.isString(assetPaths[key]);
        }
        TypeChecker.isInstanceOf(listOfMapElements, Array);
        listOfGameObjects.forEach(mapElement => {
            TypeChecker.isInstanceOf(mapElement, GameObjectClient);
        });
        TypeChecker.isInstanceOf(listOfGameObjects, Array);
        listOfGameObjects.forEach(gameObject => {
            TypeChecker.isInstanceOf(gameObject, GameObjectClient);
        });
        TypeChecker.isInstanceOf(listOfNPCs, Array);
        listOfNPCs.forEach(npcPosition => {
            TypeChecker.isInstanceOf(npcPosition, NPCClient);
        });
        TypeChecker.isInstanceOf(listOfDoors, Array);
        listOfDoors.forEach(door => {
            TypeChecker.isInstanceOf(door, DoorClient);
        });
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        occupationMap.forEach(line => {
            TypeChecker.isInstanceOf(line, Array);
            line.forEach(element => {
                TypeChecker.isInt(element);
            });
        });

        this.roomId = roomId;
        this.typeOfRoom = typeOfRoom;
        this.assetPaths = assetPaths;
        this.listOfMapElements = listOfMapElements;
        this.listOfGameObjects = listOfGameObjects;
        this.listOfNPCs = listOfNPCs;
        this.listOfDoors = listOfDoors;
        this.listOfPPants = [];
        this.width = width;
        this.length = length;
        this.occupationMap = occupationMap;

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

            console.log("current entry at (" + xPos + ", " + yPos + ") is " + mapEntry)

            console.log("adding " + mapElement.getGameObjectType() + " at (" + xPos + ", " + yPos + ")")

            if (mapEntry instanceof Array) {
                mapEntry.push(mapElement);
            } else if (mapEntry !== null) {
                console.log(mapEntry.getGameObjectType())
                mapEntry = [mapEntry, mapElement];
            } else
                mapEntry = mapElement;

            console.log("current entry at (" + xPos + ", " + yPos + ") is " + mapEntry)

            this.map[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH] = mapEntry;
        });

        this.listOfGameObjects.forEach(gameObject => {
            let xPos = gameObject.getPosition().getCordX();
            let yPos = gameObject.getPosition().getCordY();
            let mapEntry = this.objectMap[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH];

            console.log("current entry at (" + xPos + ", " + yPos + ") is " + mapEntry)

            if (mapEntry instanceof Array) {
                mapEntry.push(mapElement);
            } else if (mapEntry !== null) {
                console.log(mapEntry.getGameObjectType())
                mapEntry = [mapEntry, mapElement];
            } else
                mapEntry = gameObject;
            
            console.log("current entry at (" + xPos + ", " + yPos + ") is " + mapEntry)

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