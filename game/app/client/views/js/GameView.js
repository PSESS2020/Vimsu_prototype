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
    #profileView;
    #foodCourtView;
    #receptionView;
    #scheduleListView;
    #currentLecturesView;
    #lectureView;
    #rankListView;
    #chatListView;
    #chatThreadView;
    #statusBar;
    #globalChatView;
    #friendListView;
    #inviteFriendsView;
    #friendRequestListView;
    #successesBar;
    #currentMap;
    #ownAvatarView;
    #anotherParticipantAvatarViews = [];
    #businessCardView;
    #gameViewInit;
    #achievementView;
    #newAchievementView;
    #npcAvatarViews = [];
    #npcStoryView;
   
    constructor(gameWidth, gameHeight) 
    {
        TypeChecker.isInt(gameWidth);
        TypeChecker.isInt(gameHeight);
        this.#gameWidth = gameWidth;
        this.#gameHeight = gameHeight;
        this.#statusBar = new StatusBar();
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

                //first check if click is on door or clickable object in room (not existing at this point)
                self.#currentMap.findClickedTile(selectedTileCords);

                //then, check if there is an avatar at this position
                self.getAnotherParticipantAvatarViews().forEach(ppantView => {
                    
                    /*
                    console.log("avatar screen x: " + ppantView.getScreenX());
                    console.log("mouse screen x: " + newPosition.x);
                    console.log("avatar screen width: " + ppantView.getAvatarWidth());
                    */

                    /*
                   if ( newPosition.x > ppantView.getScreenX() && newPosition.x < ppantView.getScreenX() + ppantView.getAvatarWidth() 
                   && newPosition.y > ppantView.getScreenY() && newPosition.y < ppantView.getScreenY() + ppantView.getAvatarHeight()) {
                   ppantView.onclick(newPosition);
                   */
                    
                    if (ppantView.getPosition().getCordX() === selectedTileCords.x 
                     && ppantView.getPosition().getCordY() === selectedTileCords.y - 2) {
                        ppantView.onClick();
                    }
                });

                //then, check if there is an NPC at this position
                self.#npcAvatarViews.forEach(npcView => {
                    if (npcView.getPosition().getCordX() === selectedTileCords.x 
                     && npcView.getPosition().getCordY() === selectedTileCords.y - 2) {
                        npcView.onClick();
                    }
                })
            
            }
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

            this.drawClock();

            //put all AvatarViews in one list
            var allAvatars = [this.#ownAvatarView].concat(this.#anotherParticipantAvatarViews).concat(this.#npcAvatarViews);
            

            //sort all Avatars in CordX
            allAvatars.sort(function(a, b) {
                return b.getPosition().getCordX() - a.getPosition().getCordX();
            });
            
            //draw all avatars
            for (var i = 0; i < allAvatars.length; i++) {
                allAvatars[i].draw();
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

    drawClock() {
        this.#statusBar.drawClock();
    }

    //Is called when participant enters Foyer
    initFoyerView(map, listOfNPCs) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        $('#avatarCanvas').off();

        this.#npcAvatarViews = [];
        listOfNPCs.forEach(npc => {
            this.#npcAvatarViews.push(new NPCAvatarView(npc.getId(), npc.getName(), npc.getPosition(), npc.getDirection(), TypeOfRoomClient.FOYER));
        });

        this.#currentMap = new FoyerView(map);
    }

    initReceptionView(map, listOfNPCs) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        $('#avatarCanvas').off();

        this.#npcAvatarViews = [];
        listOfNPCs.forEach(npc => {
            this.#npcAvatarViews.push(new NPCAvatarView(npc.getId(), npc.getName(), npc.getPosition(), npc.getDirection(), TypeOfRoomClient.RECEPTION));
        });

        this.#currentMap = new ReceptionView(map);
    }

    initFoodCourtView(map, listOfNPCs) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        $('#avatarCanvas').off();

        this.#npcAvatarViews = [];
        listOfNPCs.forEach(npc => {
            this.#npcAvatarViews.push(new NPCAvatarView(npc.getId(), npc.getName(), npc.getPosition(), npc.getDirection(), TypeOfRoomClient.FOODCOURT));
        });

        this.#currentMap = new FoodCourtView(map);
    }

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
                                                            participant.getUsername(),
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
                                                            participants.getUsername()
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
        let username = ownParticipant.getUsername();
        this.#statusBar.updateLocation(typeOfRoom);
        
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

    initCurrentLectures(lectures) {
        this.#currentLecturesView = new CurrentLecturesView()
        this.#currentLecturesView.draw(lectures);
    }

    updateCurrentLectures(lectureId) {
        this.#currentLecturesView.drawLectureFull(lectureId);
    }

    initCurrentSchedule(lectures) {
        this.#scheduleListView = new ScheduleListView().draw(lectures);
    }
    
    updateCurrentLecture(lecture, hasToken, lectureChat) {
        this.#lectureView = new LectureView().draw(lecture, hasToken, lectureChat);
    }
    
    initGlobalChatView(messageHeader, messageText) {
        this.#globalChatView = new GlobalChatView().draw(messageHeader, messageText);
    };

    initProfileView(businessCard, rank) {
        this.#profileView = new ProfileView().draw(businessCard, rank);
    }

    initBusinessCardView(businessCard, isFriend, rank) {
        this.#businessCardView = new BusinessCardView(businessCard, isFriend, rank).draw();
    }

    initFriendListView(businessCards) {
        this.#friendListView = new FriendListView();
        this.#friendListView.draw(businessCards)
    }

    initInviteFriendsView(businessCards, groupName) {
        this.#inviteFriendsView = new InviteFriendsView();
        this.#inviteFriendsView.draw(businessCards, groupName);
    }

    initCurrentAchievementsView(achievements) {
        this.#achievementView = new AchievementView().draw(achievements);
    }

    handleNewAchievement(achievement) {
        this.#newAchievementView = new NewAchievementView().draw(achievement);
    }

    initNPCStoryView(name, story) {
        this.#npcStoryView = new NPCStoryView().draw(name, story);
    }

    initRankListView(rankList) {
        this.#rankListView = new RankListView().draw(rankList);
    }
    
    initChatListView(chats) {
        this.#chatListView = new ChatListView();
        this.#chatListView.draw(chats);
    };
    
    initChatThreadView(chat, openNow) {
        this.#chatThreadView = new ChatThreadView().draw(chat);
        if(openNow) {
            if(!$('#chatThreadModal').is(':visible'))
                $('#chatThreadModal').modal('show');
        }
    };
    
    addNewChat(chat, openNow) {
        if($('#chatListModal').is(':visible') && this.#chatListView) {
            this.#chatListView.addNewChat(chat);
        }
        this.initChatThreadView(chat, openNow);
    };
    
    addNewChatMessage(chatId, message) {
        this.#chatListView.addNewMessage(chatId, message);
        this.#chatThreadView.addNewMessage(chatId, message);
    };

    updateSuccessesBar(points, rank) {
        this.#successesBar = new SuccessesBar().update(points, rank);
    }

    removeFriend(participantId) {
        this.#friendListView.deleteFriend(participantId)
    }

    addFriend(businessCard) {
        this.#friendListView.addToFriendList(businessCard);
    }

    initFriendRequestListView(businessCards) {
        this.#friendRequestListView = new FriendRequestListView()
        this.#friendRequestListView.draw(businessCards);
    }

    updateFriendRequestListView(participantId, isAccepted) {
        this.#friendRequestListView.update(participantId, isAccepted);
    }
        
    updateOwnAvatarRoom(typeOfRoom) {
        this.#ownAvatarView.setTypeOfRoom(typeOfRoom);
        this.#statusBar.updateLocation(typeOfRoom);
    }

    removeOwnAvatarView()
    {
        this.#ownAvatarView = undefined;
    }

    //used to hide an avatar without destroying the avatarView instance
    hideAvatar(participantId) {
        for(var i = 0; i < this.#anotherParticipantAvatarViews.length; i++) {
            var avatar = this.#anotherParticipantAvatarViews[i];
            console.log(avatar.getId());
            if (avatar.getId() === participantId) {
                avatar.setVisibility(false);
            }
        }
    }

    showAvatar(participantId) {
        for(var i = 0; i < this.#anotherParticipantAvatarViews.length; i++) {
            var avatar = this.#anotherParticipantAvatarViews[i];
            if (avatar.getId() === participantId) {
                avatar.setVisibility(true);
            }
        }
    }
}
