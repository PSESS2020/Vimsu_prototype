const AvatarView = require("./AvatarView");
var TypeChecker = require('../../../utils/TypeChecker.js')

module.exports = class ParticipantAvatarView extends AvatarView {

    #participantId;

    constructor(position, direction, participantId) {
        super(position, direction);
        TypeChecker.isInt(participantId)
        this.#participantId = participantId;
    }

    getParticipantId() {
        return this.#participantId;
    }

    draw() {

    }
}