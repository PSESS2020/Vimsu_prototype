const Participant = require('../models/Participant.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');

module.exports = class ParticipantController {

    #participant;


    constructor(participant) {
       //TypeChecker.isInstanceOf(participant, Participant);

       this.#participant = participant;

       // Throws an error-Message that this is not a constructor?
       //this.#participant = new Participant(ppantID, new Position(1,0,0), Direction.DOWNRIGHT); // PLACEHOLDER
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
