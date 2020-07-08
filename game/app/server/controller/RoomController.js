var ConferenceController = require('./ConferenceController.js');
var ParticipantController = require('./ParticipantController.js');
var Room = require('../models/Room.js');
var TypeChecker = require('../../client/utils/TypeChecker.js');
var Position = require('../models/Position.js');

module.exports = class RoomController {

    #conferenceController;
    #listOfPPantController;
    #room;

    /**
     * Erstellt RoomController Instanz
     * 
     * @author Philipp
     * 
     * @param {ConferenceController} conferenceController 
     * @param {Room} room 
     */
    constructor(conferenceController, room) {
        TypeChecker.isInstanceOf(conferenceController, ConferenceController);
        TypeChecker.isInstanceOf(room, Room);

        this.#conferenceController = conferenceController;
        this.#listOfPPantController = [];
        this.#room = room;
    }

    /**
     * Fügt neuen ParticipantController in Liste ein und fügt participant (Model) in room (Model) ein
     * 
     * @author Philipp 
     * 
     * @param {ParticipantController} participantController 
     */
    addParticipantController(participantController) {
        TypeChecker.isInstanceOf(participantController, ParticipantController);

        if (!this.#listOfPPantController.includes(participantController)) {
            this.#listOfPPantController.push(participantController);
            this.#room.enterParticipant(participantController.getParticipant());
        }

        //TODO: Falls (1,1) die Spawnposition ist
        this.#notifyNewPosition(participantController, new Position(this.#room.getId(), 1, 1));
    }

    /**
     * Entfernt ParticipantController aus Liste und entfernt participant (Model) aus room (Model)
     * 
     * @author Philipp
     * 
     * @param {ParticipantController} participantController 
     */
    removeParticipantController(participantController) {
        TypeChecker.isInstanceOf(participantController, ParticipantController);

        if (this.#listOfPPantController.includes(participantController)) {
            let index = this.#listOfPPantController.indexOf(participantController);
            this.#listOfPPantController.splice(index, 1);
            this.#room.exitParticipant(participantController.getParticipant());
        }

        this.#notifyLeftRoom(participantController);
    }

    /**
     * Handelt Bewegung eines Participants zur mitgelieferten position
     * 
     * @author Philipp
     * 
     * @param {ParticipantController} participantController 
     * @param {Position} position 
     * @returns true, wenn Bewegung möglich ist
     * @returns false, sonst
     */
    handleMove(participantController, position) {
        TypeChecker.isInstanceOf(participantController, ParticipantController);
        TypeChecker.isInstanceOf(position, Position);

        //let collision = this.#room.checkForCollision(position);

        //Wenn es zu keiner Kollision kommt, müssen alle anderen ParticipantController davon erfahren
        //if(!collision) {
            this.#notifyNewPosition(participantController, position);
        //}

        //return !collision;
    }


    //TODO: handleNewMessage()
    

    #notifyNewPosition = function(participantController, position) {
        TypeChecker.isInstanceOf(participantController, ParticipantController);
        TypeChecker.isInstanceOf(position, Position);
        let participantId = participantController.getParticipant().getId();

        //Teilt jedem anderem ParticipantController mit, dass Participant mit participantId eine neue Position hat
        this.#listOfPPantController.foreach(function(item) {
            if (item != participantController) {
                item.sendMovementOther(participantId, position);
            }
        });
    }

    #notifyLeftRoom = function(participantController) {
        TypeChecker.isInstanceOf(participantController, ParticipantController);
        let participantId = participantController.getParticipant().getId();

        //Teilt jedem anderem ParticipantController mit, dass Participant mit participantId den Raum verlassen hat
        this.#listOfPPantController.foreach(function(item) {
            if (item != participantController) {
                item.sendRoomLeftByOther(participantId);
            }
        });
    } 
}
