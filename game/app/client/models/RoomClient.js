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
     */
    constructor(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length) {
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


        //TODO: add other room types

        //Initialisiert width*length Feld gefüllt mit 0
        this.#occupationMap = new Array(this.#width);
        for (var i = 0; i < this.#width; i++) {
            this.#occupationMap[i] = new Array(this.#length).fill(0);
        }

        this.#buildOccMap();
        this.buildMapArray();
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
     ** @param {int} roomId 
     * @param {TypeOfRoom} typeOfRoom
     * @param {Array of GameObjectClient} listOfGameObjects
     * @param {Array of NPCClient} listOfNPCs
     * @param {Array of DoorClient} listOfDoors
     * @param {int} length 
     * @param {int} width 
     */
    swapRoom(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);
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

        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        //reset list of game objects, participants, occMap
        this.#assetPaths = assetPaths;
        this.#listOfMapElements = listOfMapElements;
        this.#listOfGameObjects = listOfGameObjects;
        this.#listOfNPCs = listOfNPCs;
        this.#listOfDoors = listOfDoors;
        this.#listOfPPants = [];
        this.#width = width;
        this.#length = length;

        this.#occupationMap = new Array(this.#width);
        for (var i = 0; i < this.#width; i++) {
            this.#occupationMap[i] = new Array(this.#length).fill(0);
        }

        this.#buildOccMap();
        this.buildMapArray();
    }

    buildMapArray() {

        var mapLength = this.#width + 3;
        this.#map = new Array(mapLength);
        this.#objectMap = new Array(mapLength);

        for (var i = 0; i < mapLength; i++) {
            this.#map[i] = new Array(this.#length + Settings.MAP_BLANK_TILES_LENGTH).fill(null);
            this.#objectMap[i] = new Array(this.#length + Settings.MAP_BLANK_TILES_LENGTH).fill(null);
        }

        this.#listOfMapElements.forEach(mapElement => {
            let xPos = mapElement.getPosition().getCordX();
            let yPos = mapElement.getPosition().getCordY();

            if (this.#map[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH] !== undefined)
                this.#map[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH] = mapElement;
            else
                throw Error();
            
        });

        this.#listOfGameObjects.forEach(object => {
            let xPos = object.getPosition().getCordX();
            let yPos = object.getPosition().getCordY();

            this.#objectMap[xPos][yPos + Settings.MAP_BLANK_TILES_WIDTH] = object;
            
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


    #buildOccMap = function () {
        //Geht jedes Objekt in der Objektliste durch
        for (var i = 0; i < this.#listOfGameObjects.length; i++) {

            //Check ob Objekt fest ist oder nicht
            if (this.#listOfGameObjects[i].getSolid()) {

                let objectPosition = this.#listOfGameObjects[i].getPosition();
                let objectWidth = this.#listOfGameObjects[i].getWidth();
                let objectLength = this.#listOfGameObjects[i].getLength();

                //Jedes Feld, das festes Objekt bedeckt, auf 1 setzen
                for (var j = objectPosition.getCordX(); j < objectPosition.getCordX() + objectWidth; j++) {

                    for (var k = objectPosition.getCordY(); k < objectPosition.getCordY() + objectLength; k++) {
                        this.#occupationMap[j][k] = 1;
                    }
                }
            }
        }

        //NPC collision
        for (var i = 0; i < this.#listOfNPCs.length; i++) {
            let cordX = this.#listOfNPCs[i].getPosition().getCordX();
            let cordY = this.#listOfNPCs[i].getPosition().getCordY();

            this.#occupationMap[cordX][cordY] = 1;

        }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = RoomClient;
}