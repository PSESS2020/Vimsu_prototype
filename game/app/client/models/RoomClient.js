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

class RoomClient {

    #roomId;
    #typeOfRoom;
    #assetPaths;
    #listOfMapElements;
    #listOfGameObjects;
    #listOfNPCs;
    #listOfDoors;
    #width;
    #length;

    #listOfPPants;
    #occupationMap;

    #map;
    #objectMap;

    /**
     * Erzeugt RoomClient Instanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoom} typeOfRoom
     * @param {Object} assetPaths
     * @param {Array of GameObjectClient} listOfMapElements
     * @param {Array of GameObjectClient} listOfGameObjects
     * @param {Array of NPCClient} listOfNPCs
     * @param {Array of DoorClient} listOfDoors
     * @param {int} length 
     * @param {int} width 
     * @param {Array of Array of int} occupationMap
     */
    constructor(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);
        TypeChecker.isInstanceOf(assetPaths, Object);
        for (var key in assetPaths) {
            //TypeChecker.isInstanceOf(key, String);
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
        listOfNPCs.forEach(npc => {
            TypeChecker.isInstanceOf(npc, NPCClient);
        });
        TypeChecker.isInstanceOf(listOfDoors, Array);
        listOfDoors.forEach(door => {
            TypeChecker.isInstanceOf(door, DoorClient);
        });
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(occupationMap, Array);
        occupationMap.forEach(line => {
            TypeChecker.isInstanceOf(line, Array);
            line.forEach(element => {
                TypeChecker.isInt(element);
            });
        });

        //Es existiert nur RoomClientInstanz des Raumes, in dem sich der Teilnehmer gerade befindet
        if (!!RoomClient.instance) {
            return RoomClient.instance;
        }

        RoomClient.instance = this;

        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        this.#assetPaths = assetPaths;
        this.#listOfMapElements = listOfMapElements;
        this.#listOfGameObjects = listOfGameObjects;
        this.#listOfNPCs = listOfNPCs;
        this.#listOfDoors = listOfDoors;
        this.#listOfPPants = [];
        this.#width = width;
        this.#length = length;
        this.#occupationMap = occupationMap;

        this.#buildMapArray();
    }

    getRoomId() {
        return this.#roomId;
    }

    getTypeOfRoom() {
        return this.#typeOfRoom;
    }

    getAssetPaths() {
        return this.#assetPaths;
    }

    getWidth() {
        return this.#width;
    }

    getLength() {
        return this.#length;
    }

    getListOfPPants() {
        return this.#listOfPPants;
    }

    getListOfMapElements() {
        return this.#listOfMapElements;
    }

    getListOfGameObjects() {
        return this.#listOfGameObjects;
    }

    getListOfNPCs() {
        return this.#listOfNPCs;
    }

    getListOfDoors() {
        return this.#listOfDoors;
    }

    /**
     * Fügt Participant in Raumliste ein, falls dieser noch nicht darin ist
     * 
     * @author Philipp
     * 
     * @param {ParticipantClient} participant 
     */
    enterParticipant(participant) {
        TypeChecker.isInstanceOf(participant, ParticipantClient);
        if (!this.#listOfPPants.includes(participant)) {
            this.#listOfPPants.push(participant);
        }
    }

    /**
     * Entfernt Participant aus Raumliste, falls dieser darin ist
     * 
     * @author Philipp
     * 
     * @param {int} participantId 
     */
    exitParticipant(participantId) {
        TypeChecker.isString(participantId);
        this.#listOfPPants.forEach(participant => {
            if (participant.getId() === participantId) {
                let index = this.#listOfPPants.indexOf(participant);
                this.#listOfPPants.splice(index, 1);
            }
        });
    }

    //Method to get a Participant who is currently in this room
    getParticipant(ppantID) {
        TypeChecker.isString(ppantID);
        var result;
        this.#listOfPPants.forEach(ppant => {
            if (ppantID === ppant.getId()) {
                result = ppant;
            }
        });
        return result;
    }

    /**
     * Checkt, ob es auf der gelieferten Position zu einer Kollision kommt. 
     * 
     * @author Philipp
     * 
     * @param {PositionClient} position 
     * @returns true, bei Kollision
     * @returns false, sonst
     */
    checkForCollision(position) {
        TypeChecker.isInstanceOf(position, PositionClient);
        let cordX = position.getCordX();
        let cordY = position.getCordY();

        //WALLS
        if (cordX < 0 || cordY < 0 || cordX >= this.#length || cordY >= this.#width) {
            return true;
        }

        //GAMEOBJECTS in room
        if (this.#occupationMap[cordX][cordY] == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Wird bei Raumwechsel aufgerufen
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoom} typeOfRoom
     * @param {Object} assetPaths
     * @param {Array of GameObjectClient} listOfMapElements
     * @param {Array of GameObjectClient} listOfGameObjects
     * @param {Array of NPCClient} listOfNPCs
     * @param {Array of DoorClient} listOfDoors
     * @param {int} length 
     * @param {int} width  
     * @param {Array of Array of int} occupationMap
     */
    swapRoom(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);
        TypeChecker.isInstanceOf(assetPaths, Object);
        for (var key in assetPaths) {
            //TypeChecker.isInstanceOf(key, String);
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

        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        this.#assetPaths = assetPaths;
        this.#listOfMapElements = listOfMapElements;
        this.#listOfGameObjects = listOfGameObjects;
        this.#listOfNPCs = listOfNPCs;
        this.#listOfDoors = listOfDoors;
        this.#listOfPPants = [];
        this.#width = width;
        this.#length = length;
        this.#occupationMap = occupationMap;

        this.#buildMapArray();
    }

    #buildMapArray = function() {

        var mapLength = this.#width + Settings.MAP_BLANK_TILES_LENGTH;
        this.#map = new Array(mapLength);
        this.#objectMap = new Array(mapLength);

        for (var i = 0; i < mapLength; i++) {
            this.#map[i] = new Array(this.#length + Settings.MAP_BLANK_TILES_LENGTH).fill(null);
            this.#objectMap[i] = new Array(this.#length + Settings.MAP_BLANK_TILES_LENGTH).fill(null);
        }

        this.#listOfMapElements.forEach(mapElement => {
            let xPos = mapElement.getPosition().getCordX();
            let yPos = mapElement.getPosition().getCordY();
            let mapEntry = this.#map[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH];

            if (mapEntry !== null) {
                mapEntry = [ mapEntry, mapElement ];
            } else if (mapEntry instanceof Array) {
                mapEntry.push(mapElement);
            } else
                mapEntry = mapElement;

            this.#map[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH] = mapEntry;
        });

        this.#listOfGameObjects.forEach(gameObject => {
            let xPos = gameObject.getPosition().getCordX();
            let yPos = gameObject.getPosition().getCordY();
            let mapEntry = this.#objectMap[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH];

            if (mapEntry !== null) {
                mapEntry = [ mapEntry, gameObject ];
            } else if (mapEntry instanceof Array) {
                mapEntry.push(gameObject);
            } else
                mapEntry = gameObject;
                
            this.#objectMap[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH] = mapEntry;
        });

        //set door positions in map
        this.#listOfDoors.forEach(door => {

            var positionX = door.getMapPosition().getCordX();
            var positionY = door.getMapPosition().getCordY();

            this.#map[positionX][positionY + Settings.MAP_BLANK_TILES_WIDTH] = door;

        });
    }


    getMap() {
        return this.#map;
    }

    getObjectMap() {
        return this.#objectMap;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = RoomClient;
}