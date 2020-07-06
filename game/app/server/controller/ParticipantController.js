const Participant = require('../models/Participant.js');
const TypeChecker = require('../../utils/TypeChecker.js');
const Position = require('../models/Positions.js');
const Direction = require('../models/Direction.js');

module.exports = class ParticipantController {

    #participant;


    constructor(ppantID) {
       TypeChecker.isInt(ppantID);
       this.#participant = new Participant(ppantID, NULL, NULL, this); // I have no clue if this will work - (E) 
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
