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
    #scheduleListView;
    #currentLecturesView;
    #lectureView;
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

    initCanvasEvents() {

        if(this.#currentMap === null || this.#currentMap === undefined)
            return;

        var canvas = document.getElementById('avatarCanvas');
        
        var self = this;

        //Handle mouse movement on canvas
        $('#avatarCanvas').on('mousemove', function (e) {
            
            //Translates the current mouse position to the mouse position on the canvas.
            var newPosition = self.getMousePos(canvas, e);

            var selectedTileCords = self.#currentMap.translateMouseToTileCord(newPosition);

            if (self.#currentMap.isCursorOnMap(selectedTileCords.x, selectedTileCords.y)) {

                /*let alpha = ctx_avatar.getImageData(newPosition.x, newPosition.y, 1, 1).data[3];
                
                if(alpha !== 0)
                    canvas.style.cursor = "pointer";
                else
                    canvas.style.cursor = "default";*/

                self.#currentMap.selectionOnMap = true;
            } else
                self.#currentMap.selectionOnMap = false;

            self.#currentMap.updateSelectedTile(selectedTileCords);

        });

        //Handles mouse click on canvas
        $('#avatarCanvas').on('click', function (e) {

            //Translates the current mouse position to the mouse position on the canvas.
            var newPosition = self.getMousePos(canvas, e);

            var selectedTileCords = self.#currentMap.translateMouseToTileCord(newPosition);

            if (self.#currentMap.isCursorOnMap(selectedTileCords.x, selectedTileCords.y)) {

            let alpha = ctx_avatar.getImageData(newPosition.x, newPosition.y, 1, 1).data[3];

            if(alpha === 0)
                self.#currentMap.findClickedTile(selectedTileCords);
            /*else
                this.#anotherParticipantAvatarViews.forEach(object => {
                if (this.#map[selectedTileCords.x][selectedTileCords.y] === object.getDoorType())
                    object.onclick();
                     });*/
            };
        });
    }

    getMousePos(canvas, e) {

        //gets the absolute size of canvas and calculates the scaling factor
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;

        //Apply scaling factor to cursor position
        return {
            x: (e.pageX - rect.left) * scaleX,
            y: (e.pageY - rect.top) * scaleY,

        }
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
        $('#avatarCanvas').off();
        this.#currentMap = new FoyerView(map);

        //the execution of below doesn't work because FoyerView is not creating fast enough.
        //the map tile array is therefore empty.
        //this.#foyerView.draw();
    }

    initReceptionView(map) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        $('#avatarCanvas').off();
        this.#currentMap = new ReceptionView(map);
        
        //the execution of below doesn't work because FoyerView is not creating fast enough.
        //the map tile array is therefore empty.
        //this.#foyerView.draw();

    }

    initFoodCourtView(map) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        $('#avatarCanvas').off();
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
                    this.#anotherParticipantAvatarViews.push(new ParticipantAvatarView(
                                                            participant.getPosition(),
                                                            participant.getDirection(),
                                                            participant.getId(),
                                                            typeOfRoom,
                                                            participant.getBusinessCard().getUsername(),
                                                            ));
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
                    console.log("other avatarView init: " + participants.getId());
                    this.#anotherParticipantAvatarViews.push(new ParticipantAvatarView(
                                                            participants.getPosition(), 
                                                            participants.getDirection(), 
                                                            participants.getId(),
                                                            typeOfRoom,
                                                            participants.getBusinessCard().getUsername()
                                                            ));
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
        //console.log(this.#anotherParticipantAvatarViews);   //JUST FOR TEST PURPOSES
        
        this.#anotherParticipantAvatarViews.length = 0;

        //console.log('Now resetting Update list...');        //JUST FOR TEST PURPOSES
        //console.log(this.#anotherParticipantAvatarViews);   //JUST FOR TEST PURPOSES
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
        let username = ownParticipant.getBusinessCard().getUsername();

        
        this.#ownAvatarView = new ParticipantAvatarView(startingPos, startingDir, id, typeOfRoom, username);
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
        this.#currentLecturesView = new CurrentLecturesView().draw(lectures);
    }

    initCurrentSchedule(lectures) {
        this.#scheduleListView = new ScheduleListView().draw(lectures);
    }
    
    updateCurrentLecture(lecture, hasToken) {
        this.#lectureView = new LectureView().draw(lecture, hasToken);
    }

        
    updateOwnAvatarRoom(typeOfRoom) {
        this.#ownAvatarView.setTypeOfRoom(typeOfRoom);
    }

    removeOwnAvatarView()
    {
        this.#ownAvatarView = undefined;
    }
}
