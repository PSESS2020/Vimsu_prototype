const TypeChecker = require('../../utils/TypeChecker.js');
var TypeOfRoom = require('./TypeOfRoom.js');
var RoomController = require('../controller/RoomController.js');
var GameObject = require('./GameObject.js');
var Participant = require('./Participant.js');
var GameObjectService = require('../services/GameObjectService.js');
var RoomDimensions = require('./RoomDimensions.js');
const Position = require('./Position.js');
const Direction = require('./Direction.js');

module.exports = class Room {

    #roomId;
    //roomController;
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
    

    /**
     * Erstellt Rauminstanz
     * 
     * @author Philipp
     * 
     * @param {int} roomId 
     * @param {TypeOfRoom} typeOfRoom 
     */
    constructor(roomId, typeOfRoom) {
        // This throws an error, telling me .isInt is not a function? - (E)
        //TypeChecker.isInt(roomId);
        //TypeChecker.isInstanceOf(roomController, RoomController);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

        this.#roomId = roomId;
        //this.#roomController = roomController;
        this.#listOfPPants = [];

        //andere Fälle später
        if (typeOfRoom == "FOYER") {
            
            
            this.#length = RoomDimensions.FOYER_LENGTH;
            this.#width = RoomDimensions.FOYER_WIDTH;
            this.#startPosition = new Position(roomId, 1, 1); // Sets the startPosition to (1,1).
                                                              // This should prolly be a constant loaded from
                                                              // a settings file somewhere - (E)
            this.#startDirection = Direction.DOWNRIGHT; // See above

            //Initialisiert width*length Feld gefüllt mit 0
            this.#occupationMap = new Array(this.#width);
            var i;
            for (i = 0; i < this.#width; i++) {
                this.#occupationMap[i] = new Array(this.#length).fill(0);
            }
            
            //Alle GameObjekte die in diesen Raum gehören von Service holen
            
            /* As there is no ObjectService Class yet, this is broken.

            let objService = new GameObjectService(this.#roomId, this.#width, this.#length);
            this.#listOfGameObjects = objService.getObjects(this.#roomId);

            var i;
            //Geht jedes Objekt in der Objektliste durch
            for (i = 0; i < this.#listOfGameObjects.length; i++) {
                
                //Check ob Objekt fest ist oder nicht
                if (this.#listOfGameObjects[i].isStatic()) {

                    let objectPosition = this.#listOfGameObjects[i].getPosition();
                    let objectWidth = this.#listOfGameObjects.getWidth();
                    let objectLength = this.#listOfGameObjects.getLength();

                    var j;
                    //Jedes Feld, das festes Objekt bedeckt, auf 1 setzen
                    for (j = objectPosition.getCordX(); j <= objectPosition.getCordX + objectWidth; j++) {
                        var k;
                        for (k = objectPosition.getCordY(); k <= objectPosition.getCordY + objectLength; k++) {
                            this.#occupationMap[j][k] = 1;      
                        }
                    }
                } 
            } */
        }
    }

    getRoomId() {
        return this.#roomId;
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

        if (this.#occupationMap[cordX][cordY] == 1) {
            return true;
        }
        else {
            return false;
        }
    }
}
