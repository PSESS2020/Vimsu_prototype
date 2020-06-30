var Views = require('./Views.js')
var FoyerView = require('./FoyerView.js')
var AvatarView = require('./AvatarView.js')
var TypeChecker = require('../../../utils/TypeChecker.js')
const ParticipantClient = require('../../models/ParticipantClient.js')

module.exports = class GameView {

    #roomId;
    #updateList = [];
    #foyerView = new FoyerView();
    #ownAvatarView;
    #anotherParticipantAvatarViews = [];

    constructor() {
        this.#roomId = 1;
        this.addToUpdateList(this.#foyerView);
        this.addToUpdateList(this.#ownAvatarView);
        this.addToUpdateList(this.#anotherParticipantAvatarViews);
    }

    addToUpdateList(viewInstance)
    {
        TypeChecker.isInstanceOf(viewInstance, Views);
        this.#updateList.push(viewInstance);
    }

    removeFromUpdateList(viewInstance)
    {
        if(!this.#updateList.includes(viewInstance)){
            throw new Error(viewInstance + " is not in update list")
        }

        this.#updateList.pop(viewInstance);
    }

    getUpdateList()
    {
        return this.#updateList;
    }

    draw()
    {

    }

    update()
    {

    }

    initAnotherAvatarViews(participants)
    {
        participants.forEach(participant => 
            TypeChecker.isInstanceOf(participant, ParticipantClient),
            this.#anotherParticipantAvatarViews.push(new AvatarView(participant.getId(), participant.getPosition(), participant.getDirection()))
        );
    }

    updateAnotherAvatarViews(participants)
    {

    }

    removeAnotherAvatarViews(participantIds)
    {
        participantIds.forEach(id => 
            this.#updateList.splice(this.#updateList.findIndex(participant => participant.getId() === id), 1)
        );
    }

    setRoomId(roomId)
    {
        TypeChecker.isInt(roomId);
        this.#roomId = roomId;
    }

    initOwnAvatarView(participant)
    {
        TypeChecker.isInstanceOf(participant, ParticipantClient);
        this.#ownAvatarView = new AvatarView(participant.getId(), participant.getPosition(), participant.getDirection());
    }

    updateOwnAvatarPosition(newPosition)
    {
        TypeChecker.isInstanceOf(newPosition, PositionClient);
        this.#ownAvatarView.setPosition(newPosition);
    }

    updateOwnAvatarDirection(direction)
    {
        TypeChecker.isEnumOf(direction, DirectionClient);
        this.#ownAvatarView.setDirection(direction);
    }
}