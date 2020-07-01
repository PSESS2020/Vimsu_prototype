var Views = require('./Views.js')
var FoyerView = require('./FoyerView.js')
var AvatarView = require('./AvatarView.js')
var TypeChecker = require('../../../utils/TypeChecker.js')
const ParticipantClient = require('../../models/ParticipantClient.js')

module.exports = class GameView {

    #gameWidth;
    #gameHeight;
    #roomId;
    #updateList = [];
    #foyerView = new FoyerView();
    #ownAvatarView;
    #anotherParticipantAvatarViews = [];

    constructor(gameWidth, gameHeight) 
    {
        TypeChecker.isInt(gameWidth);
        TypeChecker.isInt(gameHeight);
        this.#gameWidth = gameWidth;
        this.#gameHeight = gameHeight;

        this.#roomId = 1;
        this.addToUpdateList(this.#foyerView);
        this.addToUpdateList(this.#ownAvatarView);
        this.addToUpdateList(this.#anotherParticipantAvatarViews);
    }

    getFoyerView() {
        return this.#foyerView;
    }

    getOwnAvatarView() {
        return this.#ownAvatarView;
    }

    getAnotherParticipantAvatarViews() {
        return this.#anotherParticipantAvatarViews;
    }

    addToUpdateList(viewInstance)
    {
        //TypeChecker.isInstanceOf(viewInstance, Views);
        
        if(!this.#updateList.includes(viewInstance))
        {
            this.#updateList.push(viewInstance);
        }
    }

    removeFromUpdateList(viewInstance)
    {
        if(!this.#updateList.includes(viewInstance))
        {
            throw new Error(viewInstance + " is not in update list")
        }
        
        let index = this.#updateList.indexOf(viewInstance);
        this.#updateList.splice(index, 1)
    }

    getUpdateList()
    {
        return this.#updateList;
    }

    draw(ctx)
    {

    }

    update(deltaTime)
    {

    }

    /**
     * 
     * @param {ParticipantClient} participants array of another participants / an participant instance excluding the current client
     */
    initAnotherAvatarViews(participants)
    {
        if(!(this.#ownAvatarView instanceof AvatarView))
        {
            throw new Error("Please initialize the current client's avatar view first using initOwnAvatarView(participant)");
        }

        if(participants instanceof Array) 
        {
            var i;
            for(i = 0; i < participants.length; i++)
            {
                TypeChecker.isInstanceOf(participants[i], ParticipantClient);

                if(this.#anotherParticipantAvatarViews.includes(participants[i])) 
                {
                    throw new Error(participants[i] + " is already in list of participants")
                }

                if(participants[i] !== this.#ownAvatarView) 
                {
                    this.#anotherParticipantAvatarViews.push(new AvatarView(participant.getId(), participant.getPosition(), participant.getDirection()));
                }
            }
        }
        else 
        {
            TypeChecker.isInstanceOf(participants, ParticipantClient);

            if(this.#anotherParticipantAvatarViews.includes(participants)) 
            {
                throw new Error(participants + " is already in list of participants")
            }

            if(participants !== this.#ownAvatarView) 
            {
                    this.#anotherParticipantAvatarViews.push(new AvatarView(participant.getId(), participant.getPosition(), participant.getDirection()));
            }
        }

        /*participants.forEach(participant => 
            TypeChecker.isInstanceOf(participant, ParticipantClient),
            this.#anotherParticipantAvatarViews.push(new AvatarView(participant.getId(), participant.getPosition(), participant.getDirection()))
        );*/
    }
        
    updateAnotherAvatarViews(participants)
    {

    }

    /**
     * 
     * @param {ParticipantClient} participants array of another participants / an participant instance excluding the current client
     */
    removeAnotherAvatarViews(participantIds)
    {

        if (participantIds instanceof Array) {
            var i;
            for (i = 0; i < participantIds.length; i++)
            {
                TypeChecker.isInt(participantIds[i]);

                let index = this.#updateList.findIndex(participant => participant.getId() === participantIds[i]);

                if (index < 0) 
                {
                    throw new Error(participantsIds[i] + " is not in list of participants")
                }

                this.#updateList.splice(index, 1)
            }
        }
        else {
            TypeChecker.isInt(participantIds);
            let index = this.#updateList.findIndex(participant => participant.getId() === participantIds);

            if (index < 0) 
            {
                throw new Error(participantsIds + " is not in list of participants")
            }
            
            this.#updateList.splice(index, 1)
        }
        
        /*participantIds.forEach(id => 
            TypeChecker.isInt(id),
            this.#updateList.splice(index, 1)
        );*/
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

    removeOwnAvatarView()
    {
        this.#ownAvatarView = undefined;
    }
}