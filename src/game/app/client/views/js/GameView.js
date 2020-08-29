/**
 * The Game View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
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

    /**
     * @constructor Creates an instance of GameView
     */
    constructor() {
        if (!!GameView.instance) {
            return GameView.instance;
        }

        GameView.instance = this;

        //bool to check, if game view is already initialized. If not, draw is not possible
        this.#gameViewInit = false;
        this.#gameEngine = new IsometricEngine();
    }
    
    /**
     * initializes event manager
     * 
     * @param {ClientController} clientController ClientController instance
     */
    initEventManager(clientController) {
        TypeChecker.isInstanceOf(clientController, ClientController)
        this.#eventManager = new EventManager(clientController);

        //initialize some Views at the very beginning
        this.#initViews();
    } 

    /**
     * @private initializes View instances
     */
    #initViews = function () {
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

    /**
     * Gets own avatar view
     * 
     * @return ownAvatarView
     */
    getOwnAvatarView() {
        return this.#ownAvatarView;
    }

    /**
     * Get another participant avatar views
     * 
     * @return anotherParticipantAvatarViews
     */
    getAnotherParticipantAvatarViews() {
        return this.#anotherParticipantAvatarViews;
    }

    /**
     * Sets game view initialization status
     * 
     * @param {boolean} bool true if ready to be initialized, otherwise false
     */
    setGameViewInit(bool) {
        TypeChecker.isBoolean(bool);
        this.#gameViewInit = bool;
    }

    /**
     * Initialize canvas events
     */
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
     * Adds view instance to list of views to be updated steadily
     * 
     * @param {Views} viewInstance view instance
     */
    #addToUpdateList = function (viewInstance) {
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
     * Draws profile username
     * 
     * @param {String} username username
     */
    drawProfile(username) {
        TypeChecker.isString(username);
        this.#hudView.drawProfile(username)
    }

    /**
     * Draws status bar
     */
    drawStatusBar() {
        this.#statusBar.draw();
    }

    /**
     * Draws View generally
     */
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

    /**
     * Update Views in update list
     */
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
     * Updates ping 
     * 
     * @param {number} ms ping in miliseconds
     */
    updatePing(ms) {
        TypeChecker.isInt(ms);
        this.#statusBar.updatePing(ms);
    }

    /**
     * Updates FPS
     * 
     * @param {number} timeStamp timestamp
     */
    updateFPS(timeStamp) {
        TypeChecker.isNumber(timeStamp);
        this.#statusBar.updateFPS(timeStamp);
    }

    /**
     * Updates connection status
     * 
     * @param {ConnectionState} status connection status
     */
    updateConnectionStatus(status) {
        TypeChecker.isEnumOf(status, ConnectionState);
        this.#statusBar.updateConnectionStatus(status);
    }

    /**
     * Initializes room view when participant enters Room
     * 
     * @param {Object[]} assetPaths asset paths
     * @param {number[][]} map map
     * @param {number[][]} objectMap object map
     * @param {NPC[]} listOfNPCs list of NPCs
     * @param {TypeOfRoom} typeOfRoom type of room
     */
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
     * Adds participant to another avatar views
     * 
     * @param {ParticipantClient} participant another participant
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
     * Updates another avatar position
     * 
     * @param {String} participantId participant ID
     * @param {PositionClient} newPosition new participant position
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
     * Updates another avatar direction
     * 
     * @param {String} participantId participant ID
     * @param {Direction} direction new participant direction
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
     * Updates another avatar moving status
     * 
     * @param {String} participantId participant ID
     * @param {boolean} isMoving true if participant is moving, otherwise false
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
     * Removes participant from another avatar views
     * 
     * @param {String} participantId participant ID
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

    /**
     * Resets another avatar views
     */
    resetAnotherAvatarViews() {
        this.#anotherParticipantAvatarViews.length = 0;
    }

    /**
     * inits ownAvatarView with information from ownParticipant model instance in a room of typeOfRoom
     * 
     * @param {ParticipantClient} ownParticipant own participant
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
    }

    /**
     * Updates own avatar position
     * 
     * @param {PositionClient} newPosition new avatar position
     */
    updateOwnAvatarPosition(newPosition) {
        TypeChecker.isInstanceOf(newPosition, PositionClient);
        this.#ownAvatarView.setPosition(newPosition);
    }

    /**
     * Updates own avatar direction
     * 
     * @param {Direction} direction new avatar direction
     */
    updateOwnAvatarDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#ownAvatarView.setDirection(direction);

    }

    /**
     * Updates own avatar moving status
     * 
     * @param {boolean} isMoving true if moving, otherwise false
     */
    updateOwnAvatarWalking(isMoving) {
        TypeChecker.isBoolean(isMoving);
        this.#ownAvatarView.updateWalking(isMoving);
        this.#ownAvatarView.updateCurrentAnimation();
    }

    /**
     * Draws current lectures window
     * 
     * @param {Object[]} lectures current lectures
     */
    initCurrentLectures(lectures) {
        this.#currentLecturesView.draw(lectures);
    }

    /**
     * Update current lectures window because lecture is full
     * 
     * @param {String} lectureId lecture ID
     */
    updateCurrentLectures(lectureId) {
        TypeChecker.isString(lectureId);
        this.#currentLecturesView.drawLectureFull(lectureId);
    }

    /**
     * Draws schedule window
     * 
     * @param {Object[]} lectures all lectures
     */
    initCurrentSchedule(lectures) {
        this.#scheduleListView.draw(lectures);
    }

    /**
     * Draws lecture window
     * 
     * @param {Object} lecture lecture
     * @param {boolean} hasToken true if has token, otherwise false
     * @param {Object} lectureChat lecture chat
     * @param {boolean} isOrator true if is orator of this lecture, otherwise false
     */
    updateCurrentLecture(lecture, hasToken, lectureChat, isOrator) {
        this.#lectureView.draw(lecture, hasToken, lectureChat, isOrator);
    }

    /**
     * Draws global chat window
     * 
     * @param {String} messageHeader message header
     * @param {String[]} messageText message text
     */
    initGlobalChatView(messageHeader, messageText) {
        TypeChecker.isString(messageHeader);
        if (messageText instanceof Array) {
            TypeChecker.isInstanceOf(messageText, Array);
            messageText.forEach(line => {
                TypeChecker.isString(line);
            });
        } else {
            TypeChecker.isString(messageText);
        }

        this.#globalChatView.draw(messageHeader, messageText);
    };

    /**
     * Draws profile window
     * 
     * @param {BusinessCardClient} businessCard own business card
     * @param {boolean} isModerator true if moderator, otherwise false
     */
    initProfileView(businessCard, isModerator) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);
        TypeChecker.isBoolean(isModerator);

        this.#profileView.draw(businessCard, isModerator);
    }

    /**
     * Draws business card window
     * 
     * @param {BusinessCardClient} businessCard other participant business card
     * @param {boolean} isFriend true if friend, otherwise false
     * @param {?number} rank other participant rank
     * @param {boolean} isModerator other participant moderator status
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
     * Draws friend list window
     * 
     * @param {BusinessCardClient[]} businessCards friends' business card
     */
    initFriendListView(businessCards) {
        TypeChecker.isInstanceOf(businessCards, Array);
        businessCards.forEach(busCard => {
            TypeChecker.isInstanceOf(busCard, BusinessCardClient);
        })

        this.#friendListView.draw(businessCards)
    }

    /**
     * Draws invite friends window
     * 
     * @param {?BusinessCardClient[]} businessCards friends' business card
     * @param {String} groupName group chat name
     * @param {?number} limit group chat limit
     * @param {?String} chatId group chat ID
     */
    initInviteFriendsView(businessCards, groupName, limit, chatId) {
        if (businessCards !== undefined) {
            TypeChecker.isInstanceOf(businessCards, Array);
            businessCards.forEach(busCard => {
                TypeChecker.isInstanceOf(busCard, BusinessCardClient);
            })
        }

        TypeChecker.isString(groupName);

        if (limit)
            TypeChecker.isInt(limit)
        if (chatId)
            TypeChecker.isString(chatId);

        this.#inviteFriendsView.draw(businessCards, groupName, limit, chatId);
    }

    /**
     * Draws achievement window
     * 
     * @param {Object[]} achievements achievements
     */
    initCurrentAchievementsView(achievements) {
        this.#achievementView.draw(achievements);
    }

    /**
     * Draws new achievement window
     * 
     * @param {Object} achievement achievement
     */
    handleNewAchievement(achievement) {
        this.#newAchievementView.draw(achievement);
    }

    /**
     * Draws NPC story window
     * 
     * @param {String} name NPC name
     * @param {String[]} story NPC story
     */
    initNPCStoryView(name, story) {
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(story, Array);
        story.forEach(element => {
            TypeChecker.isString(element);
        })

        this.#npcStoryView.draw(name, story);
    }

    /**
     * Draws rank list window
     * 
     * @param {Object[]} rankList rank list
     */
    initRankListView(rankList) {
        this.#rankListView.draw(rankList);
    }

    /**
     * Draws chat list window
     * 
     * @param {Object[]} chats chats
     */
    initChatListView(chats) {
        this.#chatListView.draw(chats);
    };

    /**
     * Draws chat thread window
     * 
     * @param {Object} chat chat
     * @param {boolean} openNow true if open window now, otherwise false
     */
    initChatThreadView(chat, openNow) {
        if (openNow) {
            this.#chatThreadView.draw(chat);
        }
    };

    /**
     * Gets chat thread view
     * 
     * @return chatThreadView
     */
    getChatThreadView() {
        return this.#chatThreadView;
    }

    /**
     * Adds new chat to chat list
     * 
     * @param {Object} chat chat
     * @param {*} openNow ture if open window now, otherwise false
     */
    addNewChat(chat, openNow) {
        if ($('#chatListModal').is(':visible')) {
            this.#chatListView.addNewChat(chat);
        }
        this.initChatThreadView(chat, openNow);
    };

    /**
     * Updates friend request button in chat thread
     * 
     * @param {String} chatId chat ID
     * @param {boolean} areFriends true if friend, otherwise false
     * @param {boolean} friendRequestSent true if friend request sent/received, otherwise false
     */
    updateChatThread(chatId, areFriends, friendRequestSent) {
        TypeChecker.isString(chatId);
        TypeChecker.isBoolean(areFriends);
        TypeChecker.isBoolean(friendRequestSent);

        if ($('#chatThreadModal').is(':visible')) {
            this.#chatThreadView.updateFriendRequestButton(chatId, areFriends, friendRequestSent);
        }
    }

    /**
     * Adds new chat message to chat list and chat thread
     * 
     * @param {String} chatId chat ID
     * @param {Object} message chat message
     */
    addNewChatMessage(chatId, message) {
        if ($('#chatListModal').is(':visible')) {
            this.#chatListView.addNewMessage(chatId, message);
        }

        if ($('#chatThreadModal').is(':visible')) {
            this.#chatThreadView.addNewMessage(chatId, message);
        }
    };

    /**
     * Appends all chat message
     * 
     * @param {Object} message allchat message
     */
    appendAllchatMessage(message) {
        this.#allchatView.appendMessage(message);
    }

    /**
     * Draws everything about all chat
     * 
     * @param {TypeOfRoom} typeOfRoom type of room
     * @param {Object[]} messages allchat messages
     */
    initAllchatView(typeOfRoom, messages) {
        this.#allchatView.draw(typeOfRoom, messages);
    }

    /**
     * Updates points and rank on successesBar
     * 
     * @param {?number} points points
     * @param {?number} rank rank
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
     * Removes friend from friend list window and invite friends window
     * 
     * @param {String} participantId participant ID
     */
    removeFriend(participantId) {
        TypeChecker.isString(participantId);

        if ($('#friendListModal').is(':visible')) {
            this.#friendListView.deleteFriend(participantId);
        }

        this.removeFromInviteFriends(participantId, false);
    }

    /**
     * Removes chat from chat list window
     * 
     * @param {String} chatId chat ID
     */
    removeChat(chatId) {
        TypeChecker.isString(chatId);

        if ($('#chatListModal').is(':visible')) {
            this.#chatListView.deleteChat(chatId);
        }
    }

    /**
     * Add friends to friend list window and invite friends window
     * 
     * @param {BusinessCardClient} businessCard friend's business card
     */
    addFriend(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);

        if ($('#friendListModal').is(':visible')) {
            this.#friendListView.addToFriendList(businessCard);
        }

        this.addToInviteFriends(businessCard, false);
    }

    /**
     * Add friends to invite friends window
     * 
     * @param {?BusinessCardClient} businessCard friend's business card
     * @param {boolean} hasLeftChat true if friend has left chat, otherwise false
     */
    addToInviteFriends(businessCard, hasLeftChat) {
        if (businessCard)
            TypeChecker.isInstanceOf(businessCard, BusinessCardClient);

        TypeChecker.isBoolean(hasLeftChat);

        if ($('#inviteFriendsModal').is(':visible')) {
            this.#inviteFriendsView.addToInviteFriends(businessCard, hasLeftChat);
        }
    }

    /**
     * Add username to group chat participant list
     * 
     * @param {String} username username
     */
    addToChatParticipantList(username) {
        TypeChecker.isString(username);
        if ($('#chatParticipantListModal').is(':visible')) {
            this.#chatParticipantListView.addToChatParticipantList(username);
        }
    }

    /**
     * Removes username from group chat participant list
     * 
     * @param {String} username username
     */
    removeFromChatParticipantList(username) {
        TypeChecker.isString(username);
        if ($('#chatParticipantListModal').is(':visible')) {
            this.#chatParticipantListView.removeFromChatParticipantList(username);
        }
    }

    /**
     * Removes friend from invite friends window
     * 
     * @param {?String} participantId participant ID
     * @param {boolean} isMemberOfChat true if friend is member of chat, otherwise false
     */
    removeFromInviteFriends(participantId, isMemberOfChat) {
        if (participantId)
            TypeChecker.isString(participantId);

        TypeChecker.isBoolean(isMemberOfChat);

        if ($('#inviteFriendsModal').is(':visible')) {
            this.#inviteFriendsView.removeFromInviteFriends(participantId, isMemberOfChat);
        }
    }

    /**
     * Draws group chat participant list
     * 
     * @param {String[]} usernames list of usernames
     */
    drawChatParticipantList(usernames) {
        TypeChecker.isInstanceOf(usernames, Array);
        usernames.forEach(username => {
            TypeChecker.isString(username);
        })
        this.#chatParticipantListView.draw(usernames);
    }

    /**
     * Draws new chat notification
     * 
     * @param {String} senderUsername chat sender username
     * @param {String} chatId chat ID
     */
    drawNewChat(senderUsername, chatId) {
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(chatId);
        this.#notifBar.drawNewChat(senderUsername, chatId);
    }

    /**
     * Draws new group chat notification
     * 
     * @param {String} groupName group chat name
     * @param {String} creatorUsername inviter username
     * @param {String} chatId group chat ID
     */
    drawNewGroupChat(groupName, creatorUsername, chatId) {
        TypeChecker.isString(groupName);
        TypeChecker.isString(creatorUsername);
        TypeChecker.isString(chatId);

        this.#notifBar.drawNewGroupChat(groupName, creatorUsername, chatId);
    }

    /**
     * Draws new chat message notification
     * 
     * @param {String} senderUsername message sender username
     * @param {String} chatId chat ID
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
     * Draws new friend request notification
     * 
     * @param {String} senderUsername requester username
     */
    drawNewFriendRequest(senderUsername) {
        TypeChecker.isString(senderUsername);
        this.#notifBar.drawNewFriendRequest(senderUsername);
    }

    /**
     * Draws new friend i.e. accepted friend request notification
     * 
     * @param {String} friendUsername friend username
     */
    drawNewFriend(friendUsername) {
        TypeChecker.isString(friendUsername);
        this.#notifBar.drawNewFriend(friendUsername);
    }

    /**
     * Draws friend request list window
     * 
     * @param {BusinessCardClient[]} businessCards requester's business cards
     */
    initFriendRequestListView(businessCards) {
        TypeChecker.isInstanceOf(businessCards, Array);
        businessCards.forEach(busCard => {
            TypeChecker.isInstanceOf(busCard, BusinessCardClient);
        })

        this.#friendRequestListView.draw(businessCards);
    }

    /**
     * Updates friend request list window after accepting/rejecting request
     * 
     * @param {String} participantId participant ID
     * @param {boolean} isAccepted true if request is accepted, otherwise false
     */
    updateFriendRequestListView(participantId, isAccepted) {
        TypeChecker.isString(participantId);
        TypeChecker.isBoolean(isAccepted);

        if ($('#friendRequestListModal').is(':visible')) {
            this.#friendRequestListView.update(participantId, isAccepted);
        }
    }

    /**
     * Adds request to friend request window
     * 
     * @param {BusinessCardClient} businessCard requester business card
     */
    addFriendRequest(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);

        if ($('#friendRequestListModal').is(':visible')) {
            this.#friendRequestListView.addToFriendRequestList(businessCard);
        }
    }

    /**
     * Removes own avatar view
     */
    removeOwnAvatarView() {
        this.#ownAvatarView = undefined;
    }

    /**
     * hide an avatar without destroying the avatarView instance
     * 
     * @param {String} participantId participant ID
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
     * Show another avatar
     * 
     * @param {String} participantId participant ID
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

    /**
     * Appends messsage to lecture chat
     * 
     * @param {Object} message lecture chat message
     */
    appendLectureChatMessage(message) {
        if ($('#lectureVideoWindow').is(':visible')) {
            this.#lectureView.appendMessage(message);
        }
    }

    /**
     * Draws lecture chat
     * 
     * @param {Object} lectureChat lecture chat
     */
    updateLectureChat(lectureChat) {
        if ($('#lectureVideoWindow').is(':visible')) {
            this.#lectureView.drawChat(lectureChat);
        }
    };

    /**
     * Draws participant's token
     * 
     * @param {boolean} hasToken true if has token, otherwise false
     */
    updateLectureToken(hasToken) {
        TypeChecker.isBoolean(hasToken);

        if ($('#lectureVideoWindow').is(':visible')) {
            this.#lectureView.drawToken(hasToken, TokenMessages.REVOKE);
        }
    };

    /**
     * Closes lecture window
     */
    closeLectureView() {
        if ($('#lectureVideoWindow').is(':visible')) {
            this.#lectureView.close();
        }
    };
}