if (typeof module === 'object' && typeof exports === 'object') {
    StatusBar = require('./StatusBar');
    NotificationBar = require('./NotificationBar')
}

class GameView {

    #updateList = [];
    #currentLecturesView;
    #lectureView;
    #chatListView;
    #chatThreadView;
    #statusBar;
    #friendListView;
    #inviteFriendsView;
    #friendRequestListView;
    #currentMap;
    #ownAvatarView;
    #anotherParticipantAvatarViews = [];
    #gameViewInit;
    #npcAvatarViews = [];
    #notifBar;

    #gameEngine;


    constructor() {
        this.#statusBar = new StatusBar();
        this.#notifBar = new NotificationBar();

        //bool to check, if game view is already initialized. If not, draw is not possible
        this.#gameViewInit = false;
        this.#gameEngine = new IsometricEngine();
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

        if (this.#currentMap === null || this.#currentMap === undefined)
            return;

        var canvas = document.getElementById('avatarCanvas');

        //Handle mouse movement on canvas
        $('#avatarCanvas').on('mousemove', (e) => {
            //Translates the current mouse position to the mouse position on the canvas.
            var newPosition = this.#gameEngine.translateMouseToCanvasPos(canvas, e);

            var selectedTileCords = this.#gameEngine.translateMouseToTileCord(newPosition);

            if (selectedTileCords !== undefined && this.#currentMap.isCursorOnPLayGround(selectedTileCords.x, selectedTileCords.y)) {

                /*let alpha = ctx_avatar.getImageData(newPosition.x, newPosition.y, 1, 1).data[3];
                
                if(alpha !== 0)
                    canvas.style.cursor = "pointer";
                else
                    canvas.style.cursor = "default";*/

                this.#currentMap.selectionOnMap = true;
            } else 
                this.#currentMap.selectionOnMap = false;

            this.#currentMap.updateSelectedTile(selectedTileCords);

        });

        //Handles mouse click on canvas
        $('#avatarCanvas').on('click', (e) => {

            //Translates the current mouse position to the mouse position on the canvas.
            var newPosition = this.#gameEngine.translateMouseToCanvasPos(canvas, e);

            var selectedTileCords = this.#gameEngine.translateMouseToTileCord(newPosition);

            //check if clicked tile is a valid walkable tile
            if (this.#currentMap.isCursorOnPLayGround(selectedTileCords.x, selectedTileCords.y)) {

                //first check if click is on door or clickable object in room (not existing at this point)
                this.#currentMap.findClickedTileOrObject(selectedTileCords);

                //then, check if there is an avatar at this position
                this.getAnotherParticipantAvatarViews().forEach(ppantView => {

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

                    if (ppantView.getGridPosition().getCordX() === selectedTileCords.x
                        && ppantView.getGridPosition().getCordY() === selectedTileCords.y - Settings.MAP_BLANK_TILES_LENGTH) {
                        ppantView.onClick();
                    }
                });

                //then, check if there is an NPC at this position
                this.#npcAvatarViews.forEach(npcView => {
                    if (npcView.getGridPosition().getCordX() === selectedTileCords.x
                        && npcView.getGridPosition().getCordY() === selectedTileCords.y - Settings.MAP_BLANK_TILES_LENGTH) {
                        npcView.onClick();
                    }
                })
                    //check if clicked tile is outside the walkable area
            } else if (this.#currentMap.isCursorOutsidePlayGround(selectedTileCords.x, selectedTileCords.y)) {
                this.#currentMap.findClickedElementOutsideMap(newPosition);
            }
        });
    }

    addToUpdateList(viewInstance) {
        if (viewInstance instanceof Array) {
            var i;
            for (i = 0; i < viewInstance.length; i++) {
                TypeChecker.isInstanceOf(viewInstance[i], Views);
            }
        }
        else {
            TypeChecker.isInstanceOf(viewInstance, Views);
        }

        if (!this.#updateList.includes(viewInstance)) {
            this.#updateList.push(viewInstance);
        }
    }

    removeFromUpdateList(viewInstance) {
        if (!this.#updateList.includes(viewInstance)) {
            throw new Error(viewInstance + " is not in update list")
        }

        let index = this.#updateList.indexOf(viewInstance);
        this.#updateList.splice(index, 1)
    }

    getUpdateList() {
        return this.#updateList;
    }

    drawStatusBar() {
        this.#statusBar.draw();
    }

    drawProfileBox(username) {
        this.#statusBar.drawProfile(username);
    }

    draw() {
        //check if game view is already initalized
        if (this.#gameViewInit) {
            if (this.#currentMap.selectionOnMap) {
                let selectedTile = this.#currentMap.getSelectedTile();
                if (selectedTile !== undefined) selectedTile.draw();
            }

            var gameObjects = this.#currentMap.getGameObjects();

            //put all AvatarViews and all GameObjects in one list
            var allDrawElements = (gameObjects !== undefined) ? gameObjects.concat(this.#ownAvatarView)
                                                                             .concat(this.#anotherParticipantAvatarViews)
                                                                             .concat(this.#npcAvatarViews)
                                                              : [this.#ownAvatarView].concat(this.#anotherParticipantAvatarViews)
                                                                                     .concat(this.#npcAvatarViews);

            //sort all Avatars in CordX
            allDrawElements.sort(function (a, b) {
                return b.getGridPosition().getCordX() - a.getGridPosition().getCordX();
            });

            //draw all avatars
            for (var i = 0; i < allDrawElements.length; i++) {
                allDrawElements[i].draw();
            }
        }
    }


    update() {
        for (var i = 0; i < this.#updateList.length; i++) {

            if (this.#updateList[i] instanceof Array) {
                for (var j = 0; j < this.#updateList[i].length; j++) {
                    this.#updateList[i][j].update();
                }
            }
            else {
                this.#updateList[i].update();
            }
        }
    }

    updatePing(ms) {
        this.#statusBar.updatePing(ms);
    }

    updateFPS(timeStamp) {
        this.#statusBar.updateFPS(timeStamp);
    }

    updateConnectionStatus(status) {
        this.#statusBar.updateConnectionStatus(status);
    }

    //Is called when participant enters Room
    initRoomView(assetPaths, map, objectMap, listOfNPCs, typeOfRoom) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        $('#avatarCanvas').off();

        this.#npcAvatarViews = [];
        listOfNPCs.forEach(npc => {
            this.#npcAvatarViews.push(new NPCAvatarView(npc.getId(), npc.getName(), npc.getPosition(), npc.getDirection(), typeOfRoom));
        });

        this.#currentMap = new MapView(assetPaths, map, objectMap);
    }

    /**
     * 
     * @param {ParticipantClient} participant array of another participants / an participant instance excluding the current client
     */
    initAnotherAvatarViews(participant, typeOfRoom) {
        if (!(this.#ownAvatarView instanceof ParticipantAvatarView)) {
            throw new Error("Please initialize the current client's avatar view first using initOwnAvatarView(participant)");
        }

        TypeChecker.isInstanceOf(participant, ParticipantClient);

        if (this.#anotherParticipantAvatarViews.includes(participant)) {
            throw new Error(participant + " is already in list of participants")
        }

        if (participant !== this.#ownAvatarView) {
            this.#anotherParticipantAvatarViews.push(new ParticipantAvatarView(
                participant.getPosition(),
                participant.getDirection(),
                participant.getId(),
                typeOfRoom,
                participant.getUsername(),
                participant.getIsVisible(),
                participant.getIsModerator()
            ));
        }
        this.addToUpdateList(this.#anotherParticipantAvatarViews);
    }

    updateAnotherAvatarPosition(participantId, newPosition) {
        TypeChecker.isInstanceOf(newPosition, PositionClient);

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].setPosition(newPosition);
    }

    updateAnotherAvatarDirection(participantId, direction) {
        TypeChecker.isEnumOf(direction, Direction);

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].setDirection(direction);
    }

    updateAnotherAvatarWalking(participantId, isMoving) {

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
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
    removeAnotherAvatarViews(participantId) {
        TypeChecker.isString(participantId);

        //Searches in Array of other Avatars for participant with this ID
        var index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants")
        }

        //Removes disconnected Avatar from participant avatar views
        this.#anotherParticipantAvatarViews.splice(index, 1);

    }

    resetAnotherAvatarViews() {
        this.#anotherParticipantAvatarViews.length = 0;
    }

    //inits ownAvatarView with information from ownParticipant model instance in a room of typeOfRoom
    initOwnAvatarView(ownParticipant, typeOfRoom) {
        TypeChecker.isInstanceOf(ownParticipant, ParticipantClient);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

        let startingPos = ownParticipant.getPosition();
        let startingDir = ownParticipant.getDirection();
        let id = ownParticipant.getId();
        let username = ownParticipant.getUsername();
        let isModerator = ownParticipant.getIsModerator();
        this.#statusBar.updateLocation(typeOfRoom);

        this.#ownAvatarView = new ParticipantAvatarView(startingPos, startingDir, id, typeOfRoom, username, true, isModerator);
        this.addToUpdateList(this.#ownAvatarView);



        //Game View is now fully initialized (Is now set by ClientController in initGameView())
        //this.#gameViewInit = true;
    }

    updateOwnAvatarPosition(newPosition) {
        TypeChecker.isInstanceOf(newPosition, PositionClient);
        this.#ownAvatarView.setPosition(newPosition);
    }

    updateOwnAvatarDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
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
        new ScheduleListView().draw(lectures);
    }

    updateCurrentLecture(lecture, hasToken, lectureChat) {
        this.#lectureView = new LectureView()
        this.#lectureView.draw(lecture, hasToken, lectureChat);
    }

    initGlobalChatView(messageHeader, messageText) {
        new GlobalChatView().draw(messageHeader, messageText);
    };

    initProfileView(businessCard, rank, isModerator) {
        new ProfileView().draw(businessCard, rank, isModerator);
    }

    initBusinessCardView(businessCard, isFriend, rank, isModerator) {
        new BusinessCardView(businessCard, isFriend, rank, isModerator).draw();
    }

    initFriendListView(businessCards) {
        this.#friendListView = new FriendListView();
        this.#friendListView.draw(businessCards)
    }

    initInviteFriendsView(businessCards, groupName, limit, chatId) {
        this.#inviteFriendsView = new InviteFriendsView();
        this.#inviteFriendsView.draw(businessCards, groupName, limit, chatId);
    }

    initCurrentAchievementsView(achievements) {
        new AchievementView().draw(achievements);
    }

    handleNewAchievement(achievement) {
        new NewAchievementView().draw(achievement);
    }

    initNPCStoryView(name, story) {
        new NPCStoryView().draw(name, story);
    }

    initRankListView(rankList) {
        new RankListView().draw(rankList);
    }

    initChatListView(chats) {

        this.#chatListView = new ChatListView();
        this.#chatListView.draw(chats);
    };

    initChatThreadView(chat, openNow) {
        this.#chatThreadView = new ChatThreadView();
        this.#chatThreadView.draw(chat);

        if (openNow) {
            if (!$('#chatThreadModal').is(':visible')) {
                $('#chatThreadModal').modal('show');
            }
        }
    };

    getChatThreadView() {
        return this.#chatThreadView;
    }

    addNewChat(chat, openNow) {
        if ($('#chatListModal').is(':visible') && this.#chatListView) {
            this.#chatListView.addNewChat(chat);
        }
        this.initChatThreadView(chat, openNow);
    };

    updateChatThread(chatId, areFriends, friendRequestSent) {
        if ($('#chatThreadModal').is(':visible') && this.#chatThreadView) {
            this.#chatThreadView.updateFriendRequestButton(chatId, areFriends, friendRequestSent);
        }
    }

    addNewChatMessage(chatId, message) {

        if (this.#chatListView) {
            this.#chatListView.addNewMessage(chatId, message); // TODO
        }

        if (this.#chatThreadView) {
            this.#chatThreadView.addNewMessage(chatId, message);
        }
    };

    updateSuccessesBar(points, rank) {
        new SuccessesBar().update(points, rank);
    }

    removeFriend(participantId) {
        if (this.#friendListView) {
            this.#friendListView.deleteFriend(participantId)
        }
    }

    removeChat(chatId) {
        this.#chatListView.deleteChat(chatId);
    }

    addFriend(businessCard) {
        if (this.#friendListView) {
            this.#friendListView.addToFriendList(businessCard);
        }
    }

    drawChatParticipantList(usernames) {
        new ChatParticipantListView().draw(usernames);
    }

    drawNewChat(senderUsername) {
        this.#notifBar.drawNewChat(senderUsername);
    }

    drawNewGroupChat(groupName, creatorUsername, chatId) {
        this.#notifBar.drawNewGroupChat(groupName, creatorUsername, chatId);
    }

    drawNewMessage(senderUsername, chatId) {
        this.#notifBar.drawNewMessage(senderUsername, chatId);
    }

    drawNewFriendRequest(senderUsername) {
        this.#notifBar.drawNewFriendRequest(senderUsername);
    }

    drawNewFriend(friendUsername) {
        this.#notifBar.drawNewFriend(friendUsername);
    }

    initFriendRequestListView(businessCards) {
        this.#friendRequestListView = new FriendRequestListView()
        this.#friendRequestListView.draw(businessCards);
    }

    updateFriendRequestListView(participantId, isAccepted) {
        if ($('#friendRequestListModal').is(':visible') && this.#friendRequestListView) {
            this.#friendRequestListView.update(participantId, isAccepted);
        }
    }

    addFriendRequest(businessCard) {
        if ($('#friendRequestListModal').is(':visible') && this.#friendRequestListView) {
            this.#friendRequestListView.addToFriendRequestList(businessCard);
        }
    }

    updateOwnAvatarRoom(typeOfRoom) {
        this.#ownAvatarView.setTypeOfRoom(typeOfRoom);
        this.#statusBar.updateLocation(typeOfRoom);
    }

    removeOwnAvatarView() {
        this.#ownAvatarView = undefined;
    }

    //used to hide an avatar without destroying the avatarView instance
    hideAvatar(participantId) {
        for (var i = 0; i < this.#anotherParticipantAvatarViews.length; i++) {
            var avatar = this.#anotherParticipantAvatarViews[i];
            if (avatar.getId() === participantId) {
                avatar.setVisibility(false);
            }
        }
    }

    showAvatar(participantId) {
        for (var i = 0; i < this.#anotherParticipantAvatarViews.length; i++) {
            var avatar = this.#anotherParticipantAvatarViews[i];
            if (avatar.getId() === participantId) {
                avatar.setVisibility(true);
            }
        }
    }

    updateLectureChat(lectureChat) {
        if(this.#lectureView) {
            this.#lectureView.drawChat(lectureChat);
        }
    };

    updateLectureToken(hasToken) {
        if(this.#lectureView) {
            this.#lectureView.drawChat(hasToken, TokenMessages.REVOKE);
        }
    };

    closeLectureView() {
        
        // see above
        if(this.#lectureView) {
            this.#lectureView.close();
        }
        
    };
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameView;
}
