const Participant = require('../../server/models/Participant.js');
const TypeChecker = require('../../utils/TypeChecker.js');
const Position = require('../models/Position.js');
const Direction = require('../models/Direction.js');

module.exports = class ParticipantController {

    #participant;


    constructor(ppantID) {
       TypeChecker.isInt(ppantID);

       // Throws an error-Message that this is not a constructor?
       this.#participant = new Participant(ppantID, new Position(1,1,1), Direction.DOWNRIGHT); // PLACEHOLDER
    }
    

    getParticipant() {
        return this.#participant;
    }

    

    //TODO: Sagt ClientController, dass Teilnehmer mit participantId seine Position geändert hat
    sendMovementOther(participantId, position) {

    }

    //TODO: Sagt ClientController, dass Teilnehmer mit participantId den Raum verlassen hat
    sendRoomLeftByOther(participantId) {

    }

    //TODO: Schickt ClientController Ergebnis der Kollisionserkennung, collision ist ein bool
    sendResultCollisionDetection(collision) {
        
    }
}
