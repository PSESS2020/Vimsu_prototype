class GameView {

    #updateList = [];
    #gameViewInit;

    #currentMap;

    #currentLecturesView;
    #lectureView;
    #chatListView;
    #chatThreadView;
    #statusBar;
    #hudView;
    #friendListView;
    #inviteFriendsView;
    #friendRequestListView;
    #chatParticipantListView;
    #allchatView;
    #scheduleListView;
    #globalChatView;
    #profileView;
    #ownAvatarView;
    #anotherParticipantAvatarViews = [];
    #npcAvatarViews = [];
    #notifBar;
    #successesBar;
    #rankListView;
    #npcStoryView;
    #newAchievementView;
    #achievementView;
    #businessCardView;

    #gameEngine;
    #eventManager;


    constructor() {
        //bool to check, if game view is already initialized. If not, draw is not possible
        this.#gameViewInit = false;
        this.#gameEngine = new IsometricEngine();
        this.#eventManager = new EventManager();

        this.#initViews();
    }

    #initViews = function() {
        this.#hudView = new HUDView(this.#eventManager);
        this.#statusBar = new StatusBar();
        this.#notifBar = new NotificationBar(this.#eventManager);
        this.#allchatView = new AllchatView(this.#eventManager);
        new InputGroupNameView(this.#eventManager);
        this.#currentLecturesView = new CurrentLecturesView(this.#eventManager);
        this.#lectureView = new LectureView(this.#eventManager);
        this.#friendRequestListView = new FriendRequestListView(this.#eventManager);
        this.#friendListView = new FriendListView(this.#eventManager);
        this.#inviteFriendsView = new InviteFriendsView(this.#eventManager);
        this.#chatListView = new ChatListView(this.#eventManager);
        this.#chatThreadView = new ChatThreadView(this.#eventManager);
        this.#chatParticipantListView = new ChatParticipantListView();
        this.#scheduleListView = new ScheduleListView();
        this.#globalChatView = new GlobalChatView();
        this.#profileView = new ProfileView();
        this.#rankListView = new RankListView();
        this.#npcStoryView = new NPCStoryView();
        this.#newAchievementView = new NewAchievementView();
        this.#achievementView = new AchievementView();
        this.#businessCardView = new BusinessCardView(this.#eventManager);
        this.#successesBar = new SuccessesBar();
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

            if (selectedTileCords !== undefined && this.#currentMap.isCursorOnPlayGround(selectedTileCords.x, selectedTileCords.y)) {
                this.#currentMap.findClickableTileOrObject(selectedTileCords, false, canvas);
                
                this.#npcAvatarViews.forEach(npcView => {
                    if (npcView.getGridPosition().getCordX() === selectedTileCords.x
                        && npcView.getGridPosition().getCordY() === selectedTileCords.y - Settings.MAP_BLANK_TILES_LENGTH) {
                        canvas.style.cursor = "pointer";
                    }
                });

                this.getAnotherParticipantAvatarViews().forEach(ppantView => {
                    if (ppantView.getGridPosition().getCordX() === selectedTileCords.x
                        && ppantView.getGridPosition().getCordY() === selectedTileCords.y - Settings.MAP_BLANK_TILES_LENGTH) {
                        canvas.style.cursor = "pointer";
                    }
                });

                /*let alpha = ctx_avatar.getImageData(newPosition.x, newPosition.y, 1, 1).data[3];
                
                if(alpha !== 0)
                    canvas.style.cursor = "pointer";
                else
                    canvas.style.cursor = "default";*/

                this.#currentMap.selectionOnMap = true;
            } else {
                this.#currentMap.selectionOnMap = false;
                canvas.style.cursor = "default"
            }
            
            this.#currentMap.updateSelectedTile(selectedTileCords);

        });

        //Handles mouse click on canvas
        $('#avatarCanvas').on('click', (e) => {

            //Translates the current mouse position to the mouse position on the canvas.
            var newPosition = this.#gameEngine.translateMouseToCanvasPos(canvas, e);

            var selectedTileCords = this.#gameEngine.translateMouseToTileCord(newPosition);

            //check if clicked tile is a valid walkable tile
            if (this.#currentMap.isCursorOnPlayGround(selectedTileCords.x, selectedTileCords.y)) {

                //first check if click is on door or clickable object in room (not existing at this point)
                this.#currentMap.findClickableTileOrObject(selectedTileCords, true, canvas);

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

    drawProfile(username) {
        this.#hudView.drawProfile(username)
    }

    drawStatusBar() {
        this.#statusBar.draw();
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
            this.#npcAvatarViews.push(new NPCAvatarView(npc.getId(), npc.getName(), npc.getPosition(), npc.getDirection(), this.#gameEngine, this.#eventManager));
        });

        this.#currentMap = new MapView(assetPaths, map, objectMap, this.#gameEngine, this.#eventManager);
        this.#statusBar.updateLocation(typeOfRoom);
    }

    /**
     * 
     * @param {ParticipantClient} participant array of another participants / an participant instance excluding the current client
     */
    initAnotherAvatarViews(participant) {
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
                participant.getUsername(),
                participant.getIsVisible(),
                participant.getIsModerator(),
                false,
                this.#gameEngine,
                this.#eventManager
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
    initOwnAvatarView(ownParticipant) {
        TypeChecker.isInstanceOf(ownParticipant, ParticipantClient);

        let startingPos = ownParticipant.getPosition();
        let startingDir = ownParticipant.getDirection();
        let id = ownParticipant.getId();
        let username = ownParticipant.getUsername();
        let isModerator = ownParticipant.getIsModerator();

        this.#ownAvatarView = new ParticipantAvatarView(startingPos, startingDir, id, username, true, isModerator, true, this.#gameEngine, this.#eventManager);
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
        this.#currentLecturesView.draw(lectures);
    }

    updateCurrentLectures(lectureId) {
        this.#currentLecturesView.drawLectureFull(lectureId);
    }

    initCurrentSchedule(lectures) {
        this.#scheduleListView.draw(lectures);
    }

    updateCurrentLecture(lecture, hasToken, lectureChat) {
        this.#lectureView.draw(lecture, hasToken, lectureChat);
    }

    initGlobalChatView(messageHeader, messageText) {
        this.#globalChatView.draw(messageHeader, messageText);
    };

    initProfileView(businessCard, rank, isModerator) {
        this.#profileView.draw(businessCard, rank, isModerator);
    }

    initBusinessCardView(businessCard, isFriend, rank, isModerator) {
        this.#businessCardView.draw(businessCard, isFriend, rank, isModerator);
    }

    initFriendListView(businessCards) {
        this.#friendListView.draw(businessCards)
    }

    initInviteFriendsView(businessCards, groupName, limit, chatId) {
        this.#inviteFriendsView.draw(businessCards, groupName, limit, chatId);
    }

    initCurrentAchievementsView(achievements) {
        this.#achievementView.draw(achievements);
    }

    handleNewAchievement(achievement) {
        this.#newAchievementView.draw(achievement);
    }

    initNPCStoryView(name, story) {
        this.#npcStoryView.draw(name, story);
    }

    initRankListView(rankList) {
        this.#rankListView.draw(rankList);
    }

    initChatListView(chats) {
        this.#chatListView.draw(chats);
    };

    initChatThreadView(chat, openNow) {    
        if (openNow) {
            this.#chatThreadView.draw(chat);
        }
    };

    getChatThreadView() {
        return this.#chatThreadView;
    }

    addNewChat(chat, openNow) {
        if ($('#chatListModal').is(':visible')) {
            this.#chatListView.addNewChat(chat);
        }
        this.initChatThreadView(chat, openNow);
    };

    updateChatThread(chatId, areFriends, friendRequestSent) {
        if ($('#chatThreadModal').is(':visible')) {
            this.#chatThreadView.updateFriendRequestButton(chatId, areFriends, friendRequestSent);
        }
    }

    addNewChatMessage(chatId, message) {
        if ($('#chatListModal').is(':visible')) {
            this.#chatListView.addNewMessage(chatId, message);
        }

        if ($('#chatThreadModal').is(':visible')) {
            this.#chatThreadView.addNewMessage(chatId, message);
        }
    };

    appendAllchatMessage(message) {
        this.#allchatView.appendMessage(message);
    }

    initAllchatView(typeOfRoom, messages) {
        this.#allchatView.draw(typeOfRoom, messages);
    }

    updateSuccessesBar(points, rank) {
        this.#successesBar.update(points, rank);
    }

    removeFriend(participantId) {
        if ($('#friendListModal').is(':visible')) {
            this.#friendListView.deleteFriend(participantId);
        }

        this.removeFromInviteFriends(participantId, false);
    }

    removeChat(chatId) {
        this.#chatListView.deleteChat(chatId);
    }

    addFriend(businessCard) {
        if ($('#friendListModal').is(':visible')) {
            this.#friendListView.addToFriendList(businessCard);
        }

        this.addToInviteFriends(businessCard, false);
    }

    addToInviteFriends(businessCard, hasLeftChat) {
        if($('#inviteFriendsModal').is(':visible')) {
            this.#inviteFriendsView.addToInviteFriends(businessCard, hasLeftChat);
        }
    }

    addToChatParticipantList(username) {
        if($('#chatParticipantListModal').is(':visible')) {
            this.#chatParticipantListView.addToChatParticipantList(username);
        }
    }

    removeFromChatParticipantList(username) {
        if($('#chatParticipantListModal').is(':visible')) {
            this.#chatParticipantListView.removeFromChatParticipantList(username);
        }
    }

    removeFromInviteFriends(participantId, isMemberOfChat) {
        if($('#inviteFriendsModal').is(':visible')) {
            this.#inviteFriendsView.removeFromInviteFriends(participantId, isMemberOfChat);
        }
    }

    drawChatParticipantList(usernames) {
        this.#chatParticipantListView.draw(usernames);
    }

    drawNewChat(senderUsername, chatId) {
        this.#notifBar.drawNewChat(senderUsername, chatId);
    }

    drawNewGroupChat(groupName, creatorUsername, chatId) {
        this.#notifBar.drawNewGroupChat(groupName, creatorUsername, chatId);
    }

    drawNewMessage(senderUsername, chatId) {
        if ($('#chatThreadModal').is(':visible') && this.#chatThreadView.getChatId() === chatId) {
            return;
        }

        this.#notifBar.drawNewMessage(senderUsername, chatId);
    }

    drawNewFriendRequest(senderUsername) {
        this.#notifBar.drawNewFriendRequest(senderUsername);
    }

    drawNewFriend(friendUsername) {
        this.#notifBar.drawNewFriend(friendUsername);
    }

    initFriendRequestListView(businessCards) {
        this.#friendRequestListView.draw(businessCards);
    }

    updateFriendRequestListView(participantId, isAccepted) {
        if ($('#friendRequestListModal').is(':visible')) {
            this.#friendRequestListView.update(participantId, isAccepted);
        }
    }

    addFriendRequest(businessCard) {
        if ($('#friendRequestListModal').is(':visible')) {
            this.#friendRequestListView.addToFriendRequestList(businessCard);
        }
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

    appendLectureChatMessage(message) {
        if($('#lectureVideoWindow').is(':visible')) {
            this.#lectureView.appendMessage(message);
        }
    }

    updateLectureChat(lectureChat) {
        if($('#lectureVideoWindow').is(':visible')) {
            this.#lectureView.drawChat(lectureChat);
        }
    };

    updateLectureToken(hasToken) {
        if($('#lectureVideoWindow').is(':visible')) {
            this.#lectureView.drawToken(hasToken, TokenMessages.REVOKE);
        }
    };

    closeLectureView() {
        if($('#lectureVideoWindow').is(':visible')) {
            this.#lectureView.close();
        }
    };
}