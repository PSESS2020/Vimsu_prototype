/*var Views = require('./Views.js')
/var FoyerView = require('./FoyerView.js')
var AvatarView = require('./AvatarView.js')
var TypeChecker = require('../../../utils/TypeChecker.js')
const ParticipantClient = require('../../models/ParticipantClient.js')*/




/*module.exports =*/ class GameView {

    #gameWidth;
    #gameHeight;
    //#roomId;
    #updateList = [];
    #foyerView;
    #foodCourtView;
    #receptionView;
    #currentMap;
    #ownAvatarView;
    #anotherParticipantAvatarViews = [];
    #gameViewInit;

    constructor(gameWidth, gameHeight) 
    {
        TypeChecker.isInt(gameWidth);
        TypeChecker.isInt(gameHeight);
        this.#gameWidth = gameWidth;
        this.#gameHeight = gameHeight;
        //this.#roomId = 1;
        //this.initOwnAvatarView(" ");

        //bool to check, if game view is already initialized. If not, draw is not possible
        this.#gameViewInit = false;
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

    setGameViewInit(bool) {
        TypeChecker.isBoolean(bool);
        this.#gameViewInit = bool;
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

        //check if game view is already initalized
        if (this.#gameViewInit) {
            if(this.#currentMap.selectionOnMap) {
                this.#currentMap.drawSelectedTile();
            }   

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

    //Is called when participant enters Foyer
    initFoyerView(map) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        this.#currentMap = new FoyerView(map);
        
        //the execution of below doesn't work because FoyerView is not creating fast enough.
        //the map tile array is therefore empty.
        //this.#foyerView.draw();

    }

    initReceptionView(map) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        this.#currentMap = new ReceptionView(map);
        
        //the execution of below doesn't work because FoyerView is not creating fast enough.
        //the map tile array is therefore empty.
        //this.#foyerView.draw();

    }

    initFoodCourtView(map) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        this.#currentMap = new FoodCourtView(map);
        
        //the execution of below doesn't work because FoyerView is not creating fast enough.
        //the map tile array is therefore empty.
        //this.#foyerView.draw();

    }

    /*
    //Is called when participant enters FoodCourt
    initFoodCourtView(map) {
        this.#foodCourtView = new FoodCourtView(map);   //TODO: implement FoodCourtView

    }

    //Is called when participant enters Reception
    initReceptionView(map) {
        this.#receptionView = new ReceptionView(map);   //TODO: implement ReceptionView
    }
    */

    /**
     * 
     * @param {ParticipantClient} participants array of another participants / an participant instance excluding the current client
     */
    initAnotherAvatarViews(participants, typeOfRoom)
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
                    this.#anotherParticipantAvatarViews.push(new ParticipantAvatarView(participant.getPosition(), participant.getDirection(), participant.getId(), typeOfRoom));
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
                    this.#anotherParticipantAvatarViews.push(new ParticipantAvatarView(participants.getPosition(), participants.getDirection(), participants.getId(), typeOfRoom));
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
           throw new Error(participantId + " is not in list of participants")
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
                TypeChecker.isString(participantIds[i]);

                var index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantIds[i]);

                if (!(index >= 0)) 
                {
                    throw new Error(participantsIds[i] + " is not in list of participants")
                }

                this.#anotherParticipantAvatarViews.splice(index, 1)
            }
        }
        else {
            TypeChecker.isString(participantIds);

            //Searches in Array of other Avatars for participant with this ID
            var index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantIds);
            
            if (!(index >= 0)) 
            {
                throw new Error(participantsIds + " is not in list of participants")
            }
            
            //Removes disconnected Avatar from participant avatar views
            this.#anotherParticipantAvatarViews.splice(index, 1);

        }
    }

    resetAnotherAvatarViews() {
        console.log(this.#anotherParticipantAvatarViews);   //JUST FOR TEST PURPOSES
        
        this.#anotherParticipantAvatarViews.forEach(element => {
            this.removeAnotherAvatarViews(element.getId());
        });

        console.log('Now resetting Update list...');        //JUST FOR TEST PURPOSES
        console.log(this.#anotherParticipantAvatarViews);   //JUST FOR TEST PURPOSES
    }   

    /*
    setRoomId(roomId)
    {
        TypeChecker.isInt(roomId);
        this.#roomId = roomId;
    }
    */

    //inits ownAvatarView with information from ownParticipant model instance in a room of typeOfRoom
    initOwnAvatarView(ownParticipant, typeOfRoom)
    {
        TypeChecker.isInstanceOf(ownParticipant, ParticipantClient);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoomClient);
        
        let startingPos = ownParticipant.getPosition();
        let startingDir = ownParticipant.getDirection();
        let id = ownParticipant.getId();

        
        this.#ownAvatarView = new ParticipantAvatarView(startingPos, startingDir, id, typeOfRoom); 
        this.addToUpdateList(this.#ownAvatarView);
        
        

        //Game View is now fully initialized (Is now set by ClientController in initGameView())
        //this.#gameViewInit = true;
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
    }

    updateCurrentLectures(lectures) {
        $('#currentLecturesContainer').empty();
        
        lectures.forEach(lecture => {
            // this is really messy i know, should move it somewhere else
            $('#currentLecturesContainer').append(`
                <div class="currentLecturesContainer d-flex flex-column align-items-start col-4 m-1 pt-2">
                    <h5>${lecture.title}</h5>
                    <div class="small">${lecture.speaker}</div>
                    <div>${lecture.summary}</div>
                    <button id="${lecture.id}" class="btn btn-lecture m-2 align-self-end mt-auto" onclick="(new EventManager()).handleLectureClicked(${lecture.id})">Show</button>
                </div>
            `)
        });

        $('#currentLectures').show(); // TODO: maybe move somewhere else if logic requires it
    }

    updateCurrentLecture(lecture) {
        $('#currentLectures').hide(); // hide the overview of current lectures

        $('#lectureTitleLabel').text(lecture.title);
        $('#lectureSpeakerLabel').text(lecture.speaker);
        $('#lectureVideo').attr('src', lecture.videoUrl);
        $('#lectureVideo').load();
        
        $('#lectureVideoWindow').show();
    }
        
    updateOwnAvatarRoom(typeOfRoom) {
        this.#ownAvatarView.setTypeOfRoom(typeOfRoom);
    }

    removeOwnAvatarView()
    {
        this.#ownAvatarView = undefined;
    }
}
