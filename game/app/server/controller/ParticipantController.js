

module.exports = class ParticipantController {

    #participant;





    getParticipant() {
        return this.#participant;
    }

    //TODO: Sagt ClientController, dass Teilnehmer mit participantId seine Position geändert hat
    sendMovementOther(participantId, position) {

    }

    //TODO: Sagt ClientController, dass Teilnehmer mit participantId den Raum verlassen hat
    sendRoomLeftByOther(participantId) {

    }
}