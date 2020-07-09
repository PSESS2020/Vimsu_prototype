/*var Views = require('./Views.js')
/var FoyerView = require('./FoyerView.js')
var AvatarView = require('./AvatarView.js')
var TypeChecker = require('../../../utils/TypeChecker.js')
const ParticipantClient = require('../../models/ParticipantClient.js')*/

/*module.exports =*/ class GameView {

    #gameWidth;
    #gameHeight;
    #roomId;
    #updateList = [];
    #foyerView;
    #ownAvatarView;
    #anotherParticipantAvatarViews = [];

    constructor(gameWidth, gameHeight) 
    {
        TypeChecker.isInt(gameWidth);
        TypeChecker.isInt(gameHeight);
        this.#gameWidth = gameWidth;
        this.#gameHeight = gameHeight;

        this.#roomId = 1;

        this.#foyerView = new FoyerView();
        //this.addToUpdateList(this.#foyerView);
        this.initOwnAvatarView(" ");
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
        if(viewInstance instanceof Array) {
            var i;
            for(i = 0; i < viewInstance.length; i++) {
                TypeChecker.isInstanceOf(viewInstance[i], Views);
            }
        }
        else {
            TypeChecker.isInstanceOf(viewInstance, Views);
        }

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

    draw()
    {
        for (var i = 0; i < this.#updateList.length; i++) {

            if (this.#updateList[i] instanceof Array) {
                for(var j = 0; j < this.#updateList[i].length; j++) {
                    this.#updateList[i][j].draw();
                }
            }
            else {
                this.#updateList[i].draw();
            }
        }
    }

    update()
    {
        for (var i = 0; i < this.#updateList.length; i++) {

            if (this.#updateList[i] instanceof Array) {
                for(var j = 0; j < this.#updateList[i].length; j++) {
                    this.#updateList[i][j].update();
                }
            }
            else {
                this.#updateList[i].update();
            }
        }
    }

    /**
     * 
     * @param {ParticipantClient} participants array of another participants / an participant instance excluding the current client
     */
    initAnotherAvatarViews(participants)
    {
        if(!(this.#ownAvatarView instanceof ParticipantAvatarView))
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
                    var participant = participants[i];
                    this.#anotherParticipantAvatarViews.push(new ParticipantAvatarView(participant.getPosition(), participant.getDirection(), participant.getId()));
                }
            }
            this.addToUpdateList(this.#anotherParticipantAvatarViews);
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
                    console.log(participants.getId());
                    this.#anotherParticipantAvatarViews.push(new ParticipantAvatarView(participants.getPosition(), participants.getDirection(), participants.getId()));
            }
            this.addToUpdateList(this.#anotherParticipantAvatarViews);
        }
    }
        
    updateAnotherAvatarPosition(participantId, newPosition)
    {
        TypeChecker.isInstanceOf(newPosition, PositionClient);

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) 
        {
           throw new Error(participantsId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].setPosition(newPosition);
    }

    updateAnotherAvatarDirection(participantId, direction)
    {
        TypeChecker.isEnumOf(direction, DirectionClient);
 
        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) 
        {
           throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].setDirection(direction); 
    }

    updateAnotherAvatarWalking(participantId, isMoving) {

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) 
        {
           throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].updateWalking(isMoving);
        this.#anotherParticipantAvatarViews[index].updateCurrentAnimation();
        
        this.#foyerView.draw();
        this.#anotherParticipantAvatarViews[index].draw(); 
         
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

                let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantIds[i]);

                if (index < 0) 
                {
                    throw new Error(participantsIds[i] + " is not in list of participants")
                }

                this.#updateList.splice(index, 1)
            }
        }
        else {
            TypeChecker.isInt(participantIds);

            //Searches in Array of other Avatars in Update List for participant with this ID
            let index = this.#updateList[1].forEach(participant => participant.getId() === participantIds);

            if (index < 0) 
            {
                throw new Error(participantsIds + " is not in list of participants")
            }
            
            //Removes disconnected Avatar from Update List
            this.#updateList[1].splice(index, 1)
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

    initOwnAvatarView()
    {
        //var initX = 2 * 32 + this.#gameWidth / 2 - 27 * 64 / 2;
        //var initY = 2 * 16 + this.#gameHeight / 2 - (64 + 32)/4 - 64;
        //TypeChecker.isInstanceOf(participant, ParticipantClient);
        //this.#ownAvatarView = new ParticipantAvatarView(participant.getPosition(), participant.getDirection(), participant.getId());
        this.#ownAvatarView = new ParticipantAvatarView(new PositionClient(0, 0), 'DOWNLEFT', 0); 
        this.addToUpdateList(this.#ownAvatarView);

        //TypeChecker.isInstanceOf(participant, ParticipantClient);
        //this.#ownAvatarView = new ParticipantAvatarView(participant.getPosition(), participant.getDirection(), participant.getId());
        //this.#ownAvatarView = new ParticipantAvatarView(new PositionClient(200, 450), 'DOWNLEFT', 1); 
        //this.addToUpdateList(this.#ownAvatarView);
    }

    //is called after server sends participantId
    setOwnAvatarViewId(participantId) {
        TypeChecker.isInt(participantId);
        this.#ownAvatarView.setId(participantId);
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

    updateOwnAvatarWalking(isMoving) {
        this.#ownAvatarView.updateWalking(isMoving);
        this.#ownAvatarView.updateCurrentAnimation();

        this.#ownAvatarView.draw();   
        this.#foyerView.draw();
    }

    removeOwnAvatarView()
    {
        this.#ownAvatarView = undefined;
    }
}
