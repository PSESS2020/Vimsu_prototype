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

    /**
     * 
     * @param {boolean} bool 
     */
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

    /**
     * 
     * @param {Views} viewInstance 
     */
    #addToUpdateList = function(viewInstance) {
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

    /**
     * 
     * @param {String} username 
     */
    drawProfile(username) {
        TypeChecker.isString(username);
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

    /**
     * 
     * @param {number} ms 
     */
    updatePing(ms) {
        TypeChecker.isInt(ms);
        this.#statusBar.updatePing(ms);
    }

    /**
     * 
     * @param {number} timeStamp 
     */
    updateFPS(timeStamp) {
        TypeChecker.isNumber(timeStamp);
        this.#statusBar.updateFPS(timeStamp);
    }

    /**
     * 
     * @param {ConnectionState} status 
     */
    updateConnectionStatus(status) {
        TypeChecker.isEnumOf(status, ConnectionState);
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
     * @param {ParticipantClient} participant an participant instance excluding the current client
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
        this.#addToUpdateList(this.#anotherParticipantAvatarViews);
    }

    /**
     * 
     * @param {String} participantId 
     * @param {PositionClient} newPosition 
     */
    updateAnotherAvatarPosition(participantId, newPosition) {
        TypeChecker.isString(participantId);
        TypeChecker.isInstanceOf(newPosition, PositionClient);

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].setPosition(newPosition);
    }

    /**
     * 
     * @param {String} participantId 
     * @param {Direction} direction 
     */
    updateAnotherAvatarDirection(participantId, direction) {
        TypeChecker.isString(participantId);
        TypeChecker.isEnumOf(direction, Direction);

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].setDirection(direction);
    }

    /**
     * 
     * @param {String} participantId 
     * @param {boolean} isMoving 
     */
    updateAnotherAvatarWalking(participantId, isMoving) {
        TypeChecker.isString(participantId);
        TypeChecker.isBoolean(isMoving);

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
     * @param {String} participantId
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

    /**
     * inits ownAvatarView with information from ownParticipant model instance in a room of typeOfRoom
     * 
     * @param {ParticipantClient} ownParticipant 
     */
    initOwnAvatarView(ownParticipant) {
        TypeChecker.isInstanceOf(ownParticipant, ParticipantClient);

        let startingPos = ownParticipant.getPosition();
        let startingDir = ownParticipant.getDirection();
        let id = ownParticipant.getId();
        let username = ownParticipant.getUsername();
        let isModerator = ownParticipant.getIsModerator();

        this.#ownAvatarView = new ParticipantAvatarView(startingPos, startingDir, id, username, true, isModerator, true, this.#gameEngine, this.#eventManager);
        this.#addToUpdateList(this.#ownAvatarView);

        //Game View is now fully initialized (Is now set by ClientController in initGameView())
        //this.#gameViewInit = true;
    }

    /**
     * 
     * @param {PositionClient} newPosition 
     */
    updateOwnAvatarPosition(newPosition) {
        TypeChecker.isInstanceOf(newPosition, PositionClient);
        this.#ownAvatarView.setPosition(newPosition);
    }

    /**
     * 
     * @param {Direction} direction 
     */
    updateOwnAvatarDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#ownAvatarView.setDirection(direction);

    }

    /**
     * 
     * @param {boolean} isMoving 
     */
    updateOwnAvatarWalking(isMoving) {
        TypeChecker.isBoolean(isMoving);
        this.#ownAvatarView.updateWalking(isMoving);
        this.#ownAvatarView.updateCurrentAnimation();
    }

    initCurrentLectures(lectures) {
        this.#currentLecturesView.draw(lectures);
    }

    /**
     * 
     * @param {String} lectureId 
     */
    updateCurrentLectures(lectureId) {
        TypeChecker.isString(lectureId);
        this.#currentLecturesView.drawLectureFull(lectureId);
    }

    initCurrentSchedule(lectures) {
        this.#scheduleListView.draw(lectures);
    }

    updateCurrentLecture(lecture, hasToken, lectureChat) {
        this.#lectureView.draw(lecture, hasToken, lectureChat);
    }

    /**
     * 
     * @param {String} messageHeader 
     * @param {String} messageText 
     */
    initGlobalChatView(messageHeader, messageText) {
        TypeChecker.isString(messageHeader);
        TypeChecker.isString(messageText);

        this.#globalChatView.draw(messageHeader, messageText);
    };

    /**
     * 
     * @param {BusinessCardClient} businessCard 
     * @param {boolean} isModerator 
     */
    initProfileView(businessCard, isModerator) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);
        TypeChecker.isBoolean(isModerator);

        this.#profileView.draw(businessCard, isModerator);
    }

    /**
     * 
     * @param {BusinessCardClient} businessCard 
     * @param {boolean} isFriend 
     * @param {?number} rank 
     * @param {boolean} isModerator 
     */
    initBusinessCardView(businessCard, isFriend, rank, isModerator) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);
        TypeChecker.isBoolean(isFriend);

        //case when ppant with this businessCard is a friend
        if (rank !== undefined) {
            TypeChecker.isInt(rank);
        }

        TypeChecker.isBoolean(isModerator);

        this.#businessCardView.draw(businessCard, isFriend, rank, isModerator);
    }

    /**
     * 
     * @param {BusinessCardClient[]} businessCards 
     */
    initFriendListView(businessCards) {
        TypeChecker.isInstanceOf(businessCards, Array);
        businessCards.forEach(busCard => {
            TypeChecker.isInstanceOf(busCard, BusinessCardClient);
        })

        this.#friendListView.draw(businessCards)
    }

    /**
     * 
     * @param {BusinessCardClient[]} businessCards 
     * @param {?String} groupName 
     * @param {?number} limit 
     * @param {?String} chatId 
     */
    initInviteFriendsView(businessCards, groupName, limit, chatId) {
        TypeChecker.isInstanceOf(businessCards, Array);
        businessCards.forEach(busCard => {
            TypeChecker.isInstanceOf(busCard, BusinessCardClient);
        })
        if (groupName)
            TypeChecker.isString(groupName);
        if (limit)
            TypeChecker.isInt(limit)
        if (chatId)
            TypeChecker.isString(chatId);

        this.#inviteFriendsView.draw(businessCards, groupName, limit, chatId);
    }

    initCurrentAchievementsView(achievements) {
        this.#achievementView.draw(achievements);
    }

    handleNewAchievement(achievement) {
        this.#newAchievementView.draw(achievement);
    }

    /**
     * 
     * @param {String} name 
     * @param {String[]} story 
     */
    initNPCStoryView(name, story) {
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(story, Array);
        story.forEach(element => {
            TypeChecker.isString(element);
        })

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

    /**
     * 
     * @param {String} chatId 
     * @param {boolean} areFriends 
     * @param {boolean} friendRequestSent 
     */
    updateChatThread(chatId, areFriends, friendRequestSent) {
        TypeChecker.isString(chatId);
        TypeChecker.isBoolean(areFriends);
        TypeChecker.isBoolean(friendRequestSent);
        
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

    /**
     * 
     * @param {?number} points 
     * @param {?number} rank 
     */
    updateSuccessesBar(points, rank) {
        if (points) {
            TypeChecker.isInt(points);
        }

        if (rank) {
            TypeChecker.isInt(rank);
        }

        this.#successesBar.update(points, rank);
    }

    /**
     * 
     * @param {String} participantId 
     */
    removeFriend(participantId) {
        TypeChecker.isString(participantId);

        if ($('#friendListModal').is(':visible')) {
            this.#friendListView.deleteFriend(participantId);
        }

        this.removeFromInviteFriends(participantId, false);
    }

    /**
     * 
     * @param {String} chatId 
     */
    removeChat(chatId) {
        TypeChecker.isString(chatId);
        this.#chatListView.deleteChat(chatId);
    }

    /**
     * 
     * @param {BusinessCardClient} businessCard 
     */
    addFriend(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);

        if ($('#friendListModal').is(':visible')) {
            this.#friendListView.addToFriendList(businessCard);
        }

        this.addToInviteFriends(businessCard, false);
    }

    /**
     * 
     * @param {?BusinessCardClient} businessCard 
     * @param {boolean} hasLeftChat 
     */
    addToInviteFriends(businessCard, hasLeftChat) {
        if (businessCard)
            TypeChecker.isInstanceOf(businessCard, BusinessCardClient);

        TypeChecker.isBoolean(hasLeftChat);

        if($('#inviteFriendsModal').is(':visible')) {
            this.#inviteFriendsView.addToInviteFriends(businessCard, hasLeftChat);
        }
    }

    /**
     * 
     * @param {String} username 
     */
    addToChatParticipantList(username) {
        TypeChecker.isString(username);
        if($('#chatParticipantListModal').is(':visible')) {
            this.#chatParticipantListView.addToChatParticipantList(username);
        }
    }

    /**
     * 
     * @param {String} username 
     */
    removeFromChatParticipantList(username) {
        TypeChecker.isString(username);
        if($('#chatParticipantListModal').is(':visible')) {
            this.#chatParticipantListView.removeFromChatParticipantList(username);
        }
    }

    /**
     * 
     * @param {?String} participantId 
     * @param {boolean} isMemberOfChat 
     */
    removeFromInviteFriends(participantId, isMemberOfChat) {
        if (participantId)
            TypeChecker.isString(participantId);

        TypeChecker.isBoolean(isMemberOfChat);

        if($('#inviteFriendsModal').is(':visible')) {
            this.#inviteFriendsView.removeFromInviteFriends(participantId, isMemberOfChat);
        }
    }

    /**
     * 
     * @param {String[]} usernames 
     */
    drawChatParticipantList(usernames) {
        TypeChecker.isInstanceOf(usernames, Array);
        usernames.forEach(username => {
            TypeChecker.isString(username);
        })
        this.#chatParticipantListView.draw(usernames);
    }

    /**
     * 
     * @param {String} senderUsername 
     * @param {String} chatId 
     */
    drawNewChat(senderUsername, chatId) {
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(chatId);
        this.#notifBar.drawNewChat(senderUsername, chatId);
    }

    /**
     * 
     * @param {String} groupName 
     * @param {String} creatorUsername 
     * @param {String} chatId 
     */
    drawNewGroupChat(groupName, creatorUsername, chatId) {
        TypeChecker.isString(groupName);
        TypeChecker.isString(creatorUsername);
        TypeChecker.isString(chatId);

        this.#notifBar.drawNewGroupChat(groupName, creatorUsername, chatId);
    }

    /**
     * 
     * @param {String} senderUsername 
     * @param {String} chatId 
     */
    drawNewMessage(senderUsername, chatId) {
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(chatId);

        if ($('#chatThreadModal').is(':visible') && this.#chatThreadView.getChatId() === chatId) {
            return;
        }

        this.#notifBar.drawNewMessage(senderUsername, chatId);
    }

    /**
     * 
     * @param {String} senderUsername 
     */
    drawNewFriendRequest(senderUsername) {
        TypeChecker.isString(senderUsername);
        this.#notifBar.drawNewFriendRequest(senderUsername);
    }

    /**
     * 
     * @param {String} friendUsername 
     */
    drawNewFriend(friendUsername) {
        TypeChecker.isString(friendUsername);
        this.#notifBar.drawNewFriend(friendUsername);
    }

    /**
     * 
     * @param {BusinessCardClient[]} businessCards 
     */
    initFriendRequestListView(businessCards) {
        TypeChecker.isInstanceOf(businessCards, Array);
        businessCards.forEach(busCard => {
            TypeChecker.isInstanceOf(busCard, BusinessCardClient);
        })

        this.#friendRequestListView.draw(businessCards);
    }

    /**
     * 
     * @param {String} participantId 
     * @param {boolean} isAccepted 
     */
    updateFriendRequestListView(participantId, isAccepted) {
        TypeChecker.isString(participantId);
        TypeChecker.isBoolean(isAccepted);

        if ($('#friendRequestListModal').is(':visible')) {
            this.#friendRequestListView.update(participantId, isAccepted);
        }
    }

    /**
     * 
     * @param {BusinessCardClient} businessCard 
     */
    addFriendRequest(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);

        if ($('#friendRequestListModal').is(':visible')) {
            this.#friendRequestListView.addToFriendRequestList(businessCard);
        }
    }

    removeOwnAvatarView() {
        this.#ownAvatarView = undefined;
    }

    /**
     * hide an avatar without destroying the avatarView instance
     * 
     * @param {String} participantId 
     */
    hideAvatar(participantId) {
        TypeChecker.isString(participantId);

        for (var i = 0; i < this.#anotherParticipantAvatarViews.length; i++) {
            var avatar = this.#anotherParticipantAvatarViews[i];
            if (avatar.getId() === participantId) {
                avatar.setVisibility(false);
            }
        }
    }

    /**
     * 
     * @param {String} participantId 
     */
    showAvatar(participantId) {
        TypeChecker.isString(participantId);

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

    /**
     * 
     * @param {boolean} hasToken 
     */
    updateLectureToken(hasToken) {
        TypeChecker.isBoolean(hasToken);
        
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