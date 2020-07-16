var TypeChecker = require('../../utils/TypeChecker.js');
var TypeOfRoom = require('./TypeOfRoom.js');
var RoomController = require('../controller/RoomController.js');
var GameObject = require('./GameObject.js');
var Participant = require('./Participant.js');
var GameObjectService = require('../services/GameObjectService.js');
var RoomDimensions = require('./RoomDimensions.js');
const Position = require('./Position.js');
const Direction = require('./Direction.js');
const Settings = require('../../utils/Settings.js');
const Door = require('./Door.js');

module.exports = class Room {

    #roomId;
    #typeOfRoom;
    //roomChat
    #length;
    #width;
    #listOfPPants;
    #occupationMap;
    //listOfNPCs
    #listOfGameObjects;
    //listOfDoors;
    #startPosition; // The position in which new participants are initialized - (E)
    #startDirection; // The direction in which new particpants are looking on initialization - (E)
    #listOfDoors; //TODO: Get right doors from service
    #listOfMessages; // instead of a seperate chat-class, we just have a list of messages for each room for now

    /**
     * Erstellt Rauminstanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoom} typeOfRoom 
     */
    constructor(roomId, typeOfRoom) {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

        this.#roomId = roomId;
        this.#typeOfRoom = typeOfRoom;
        this.#listOfPPants = [];
        this.#listOfMessages = [];

        //andere Fälle später
        if (typeOfRoom == "FOYER") {

            this.#length = RoomDimensions.FOYER_LENGTH;
            this.#width = RoomDimensions.FOYER_WIDTH;
            this.#startPosition = new Position(this.#roomId, Settings.STARTPOSITION_X, Settings.STARTPOSITION_Y); // Sets the startPosition to (0,0).
                                                              // This should prolly be a constant loaded from
                                                              // a settings file somewhere - (E)
            this.#startDirection = Direction.DOWNRIGHT; // See above

        } else if (typeOfRoom === "FOODCOURT") {

            this.#length = RoomDimensions.FOODCOURT_LENGTH;
            this.#width = RoomDimensions.FOODCOURT_WIDTH;

            //TODO: start position and direction should be room dependent
           
            this.#startPosition = new Position(this.#roomId, Settings.STARTPOSITION_X, Settings.STARTPOSITION_Y);
            this.#startDirection = Direction.DOWNRIGHT;
        
        } else if (typeOfRoom === "RECEPTION") {

            this.#length = RoomDimensions.RECEPTION_LENGTH;
            this.#width = RoomDimensions.RECEPTION_WIDTH;

            //TODO: start position and direction should be room dependent
        
            this.#startPosition = new Position(this.#roomId, Settings.STARTPOSITION_X, Settings.STARTPOSITION_Y);
            this.#startDirection = Direction.DOWNRIGHT;

        }
        //Initialisiert width*length Feld gefüllt mit 0
        this.#occupationMap = new Array(this.#width);
        for (var i = 0; i < this.#width; i++) {
            this.#occupationMap[i] = new Array(this.#length).fill(0);
        }
        
        //Alle GameObjekte die in diesen Raum gehören von Service holem
        let objService = new GameObjectService();
        this.#listOfGameObjects = objService.getObjects(this.#roomId, typeOfRoom);

        this.#buildOccMap();
    }

    getRoomId() {
        return this.#roomId;
    }

    getTypeOfRoom() {
        return this.#typeOfRoom;
    }

    getMessages() {
        return this.#listOfMessages;
    }
    
    /*
    getRoomController() {
        return this.#roomController;
    }
    */

    getWidth() {
        return this.#width;
    }

    getLength() {
        return this.#length;
    }

    getListOfPPants() {
        return this.#listOfPPants;
    }

    /* A simple getter for the startPosition-field.
     * Is needed to make sure positions of new participants
     * can be set correctly. 
     * - (E) */
    getStartPosition() {
        return this.#startPosition;
    }
    
    /* A simple getter for the startDirection-field
     * Is needed because see above.
     * - (E) */
    getStartDirection() {
        return this.#startDirection;
    }

    getListOfGameObjects() {
        return this.#listOfGameObjects;
    }

    /**
     * Fügt Participant in Raumliste ein, falls dieser noch nicht darin ist
     * 
     * @author Philipp
     * 
     * @param {Participant} participant 
     */
    enterParticipant(participant) {
        TypeChecker.isInstanceOf(participant, Participant);
        if (!this.#listOfPPants.includes(participant)) {
            this.#listOfPPants.push(participant);
        }

        //TODO: Einfügen in Allchat
    }

     /**
     * Entfernt Participant aus Raumliste, falls dieser darin ist
     * 
     * @author Philipp
     * 
     * @param {Participant} participant 
     */
    exitParticipant(participant) {
        TypeChecker.isInstanceOf(participant, Participant);
        if (this.#listOfPPants.includes(participant)) {
            let index = this.#listOfPPants.indexOf(participant);
            this.#listOfPPants.splice(index, 1);
        }

        //TODO: Entfernen aus Allchat
    }

    /**
     * Checkt, ob es auf der gelieferten Position zu einer Kollision kommt. 
     * 
     * @author Philipp
     * 
     * @param {Position} position 
     * @returns true, bei Kollision
     * @returns false, sonst
     */

     
    checkForCollision(position) {
        TypeChecker.isInstanceOf(position, Position);
        let cordX = position.getCordX();
        let cordY = position.getCordY();

        if(position.getRoomId() != this.#roomId) {
            throw new Error('Wrong room id!');
        }

        //WALLS
        if (cordX < 0 || cordY < 0 || cordX >= this.#width || cordY >= this.#length) {
            return true;
        }

        if (this.#occupationMap[cordX][cordY]  == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    addMessage(ppantID, date, text) {
        var message = { senderID: ppantID, timestamp: date, text: text };
        this.#listOfMessages.push(message);
    }

   #buildOccMap = function() {
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
    }
}
