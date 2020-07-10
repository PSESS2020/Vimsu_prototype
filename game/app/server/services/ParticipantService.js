var TypeChecker = require('../../client/utils/TypeChecker.js');
var Position = require('../models/Position.js');

//TODO
module.exports = class ParticipantService {
    static createParticipant(accountId) {
        TypeChecker.isInt(accountId);
    }

    static getRoomId(accountId) {
        TypeChecker.isInt(accountId)
    }

    static updateParticipantPosition(participantId, position) {
        TypeChecker.isInt(participantId);
        TypeChecker.isInstanceOf(position, Position);
    }
} 