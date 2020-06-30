const AvatarView = require("./AvatarView");

class ParticipantAvatarView extends AvatarView {

    #participantId;

    constructor( position, direction, participantId) {
        super(position, direction);
        this.#participantId = participantId;
    }

    getParticipantId() {
        return this.#participantId;
    }

    draw() {

    }
}