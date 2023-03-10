/**
 * The Game View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameView {

    updateList = [];
    gameViewInit;
    languageData;

    currentMapView;

    currentLecturesView;
    lectureView;
    meetingListView;
    videoMeetingView;
    chatListView;
    chatThreadView;
    statusBar;
    hudView;
    friendListView;
    inviteFriendsView;
    friendRequestListView;
    chatParticipantListView;
    allchatView;
    scheduleListView;
    globalChatView;
    largerGlobalChatView;
    profileView;
    ownAvatarView;
    anotherParticipantAvatarViews = [];
    npcAvatarViews = [];
    notifBar;
    successesBar;
    rankListView;
    npcStoryView;
    externalWebsiteView;
    newAchievementView;
    achievementView;
    businessCardView;
    enterCodeView;

    gameEngine;
    eventManager;

    /**
     * Creates an instance of GameView
     */
    constructor() {
        if (!!GameView.instance) {
            return GameView.instance;
        }

        GameView.instance = this;

        //bool to check, if game view is already initialized. If not, draw is not possible
        this.gameViewInit = false;
    }
    
    /**
     * initializes event manager
     * 
     * @param {ClientController} clientController ClientController instance
     */
    initEventManager(clientController) {
        TypeChecker.isInstanceOf(clientController, ClientController);
        this.eventManager = new EventManager(clientController);
    } 

    /**
     * initializes View instances with language data
     * 
     * @param {json} languageData language data
     */
    initViews = function (languageData) {
        this.gameEngine = new IsometricEngine(new LoadingView(languageData.loadingConference));
        this.hudView = new HUDView(this.eventManager, languageData.hud);
        this.statusBar = new StatusBar(languageData.hud.statusBar);
        this.notifBar = new NotificationBar(this.eventManager, languageData.hud.notifBar);
        this.allchatView = new AllchatView(this.eventManager, languageData.hud.allchat);
        new InputGroupNameView(this.eventManager, languageData.chats);
        this.currentLecturesView = new CurrentLecturesView(this.eventManager, languageData.currentLectures);
        this.lectureView = new LectureView(this.eventManager, languageData.lecture);
        this.friendRequestListView = new FriendRequestListView(this.eventManager, {friendList: languageData.friendList, businessCard: languageData.businessCard});
        this.friendListView = new FriendListView(this.eventManager, {friendList: languageData.friendList, businessCard: languageData.businessCard});
        this.inviteFriendsView = new InviteFriendsView(this.eventManager, {chats: languageData.chats, businessCard: languageData.businessCard});
        this.chatListView = new ChatListView(this.eventManager, languageData.chats);
        this.meetingListView = new MeetingListView(this.eventManager, languageData.meetings);
        this.videoMeetingView = new VideoMeetingView(this.eventManager, languageData.meetings);
        this.chatThreadView = new ChatThreadView(this.eventManager, languageData.chats);
        this.chatParticipantListView = new ChatParticipantListView();
        this.scheduleListView = new ScheduleListView(languageData.schedule);
        this.globalChatView = new GlobalChatView();
        this.largerGlobalChatView = new LargerGlobalChatView();
        this.profileView = new ProfileView(languageData.businessCard);
        this.rankListView = new RankListView(this.eventManager, languageData.ranklist);
        this.npcStoryView = new NPCStoryView(languageData.npcSays);
        this.externalWebsiteView = new ExternalWebsiteView(languageData.externalWebsite);
        this.newAchievementView = new NewAchievementView(languageData.newAchievement);
        this.achievementView = new AchievementView(languageData.achievements);
        this.businessCardView = new BusinessCardView(this.eventManager, languageData.businessCard);
        this.successesBar = new SuccessesBar();
        this.enterCodeView = new EnterCodeView(this.eventManager, languageData.enterCode);
    }

    /**
     * Gets own avatar view
     * 
     * @return {ParticipantAvatarView} ownAvatarView
     */
    getOwnAvatarView() {
        return this.ownAvatarView;
    }

    /**
     * Get another participant avatar views
     * 
     * @return {ParticipantAvatarView[]} anotherParticipantAvatarViews
     */
    getAnotherParticipantAvatarViews() {
        return this.anotherParticipantAvatarViews;
    }

    /**
     * Sets game view initialization status
     * 
     * @param {boolean} bool true if ready to be initialized, otherwise false
     */
    setGameViewInit(bool) {
        TypeChecker.isBoolean(bool);
        this.gameViewInit = bool;
    }

    /**
     * Initialize canvas events
     */
    initCanvasEvents() {
        if (this.currentMapView === null || this.currentMapView === undefined)
            return;

        var canvas = document.getElementById('avatarCanvas');

        //Handle mouse movement on canvas
        $('#avatarCanvas').on('mousemove', (e) => {

            //Translates the current mouse position to the mouse position on the canvas.
            let newPosition = this.gameEngine.translateMouseToCanvasPos(canvas, e);

            let selectedTileCords = this.gameEngine.translateMouseToTileCord(newPosition);

            if (selectedTileCords !== undefined && this.currentMapView.isCursorOnPlayGround(selectedTileCords.x, selectedTileCords.y))
            {
                if (!this.currentMapView.selectionOnMap)
                    this.currentMapView.selectionOnMap = true;

                this.currentMapView.updateSelectedTile(selectedTileCords);

                if (this.currentMapView.findClickableTileOrObjectOrNPC(selectedTileCords, false))
                    return canvas.style.cursor = 'pointer';

                for (let i = 0, len = this.anotherParticipantAvatarViews.length; i < len; i++)
                {
                    let ppantView = this.anotherParticipantAvatarViews[i];
                    if (ppantView.getGridPosition().getCordX() === selectedTileCords.x && ppantView.getGridPosition().getCordY() === selectedTileCords.y - Settings.MAP_BLANK_TILES_LENGTH)
                        return canvas.style.cursor = 'pointer';
                }
            }
            else
            if (this.currentMapView.isCursorOutsidePlayGround(selectedTileCords.x, selectedTileCords.y))
            {
                if (this.currentMapView.selectionOnMap)
                    this.currentMapView.selectionOnMap = false;
                if (this.currentMapView.findClickableElementOutsideMap(newPosition, false))
                    return canvas.style.cursor = 'pointer';
            }
            else
                this.currentMapView.selectionOnMap = false;

            canvas.style.cursor = 'default';
        });

        //Handles mouse click on canvas
        $('#avatarCanvas').on('click', (e) => {
            this.clickHandler(canvas, e);
        });

        $('#avatarCanvas').on('dblclick', (e) => {
            this.dblclickHandler(canvas, e);
        });

        var timeout;
        var lastTap = 0;
        canvas.addEventListener('touchend', (e) => {
            let currentTime = new Date().getTime();
            let tapLength = currentTime - lastTap;

            clearTimeout(timeout);
            if (tapLength < 500 && tapLength > 0) {
                e.pageX = e.changedTouches[e.changedTouches.length-1].pageX;
                e.pageY = e.changedTouches[e.changedTouches.length-1].pageY;

                e.preventDefault();
                this.dblclickHandler(canvas, e);
            }
                timeout = setTimeout(()=> {
                    this.currentMapView.selectionOnMap = false;
                    clearTimeout(timeout);
                }, 500);

            lastTap = currentTime;
        });
    }
    
    /**
     * Handles a click Event on the canvas
     * @param {Canvas} canvas canvas
     * @param {Event} e click Event
     */
    clickHandler = function(canvas, e) {

        //Translates the current mouse position to the mouse position on the canvas.
        var newPosition = this.gameEngine.translateMouseToCanvasPos(canvas, e);

        var selectedTileCords = this.gameEngine.translateMouseToTileCord(newPosition);

           
        //check if clicked tile is a valid walkable tile
        if (this.currentMapView.isCursorOnPlayGround(selectedTileCords.x, selectedTileCords.y)) {
         
            //first, check if click is on door, clickable object or NPC in room
            this.currentMapView.findClickableTileOrObjectOrNPC(selectedTileCords, true);

            //then, check if there is an avatar at this position
            this.getAnotherParticipantAvatarViews().forEach(ppantView => {
                if (ppantView.getGridPosition().getCordX() === selectedTileCords.x
                    && ppantView.getGridPosition().getCordY() === selectedTileCords.y - Settings.MAP_BLANK_TILES_WIDTH) {
                    ppantView.onClick();
                }
            });
        }//check if clicked tile is outside the walkable area
        else if (this.currentMapView.isCursorOutsidePlayGround(selectedTileCords.x, selectedTileCords.y)) {
            this.currentMapView.findClickableElementOutsideMap(newPosition, true);
        }
    }

    /**
     * Handles a double click Event on the canvas.
     * @param {Canvas} canvas canvas
     * @param {Event} e dblclick Event
     */
    dblclickHandler = function(canvas, e) {

        //Translates the current mouse position to the mouse position on the canvas.
        var newPosition = this.gameEngine.translateMouseToCanvasPos(canvas, e);

        var selectedTileCords = this.gameEngine.translateMouseToTileCord(newPosition);

        //check if clicked tile is a valid walkable tile
        if (this.currentMapView.isCursorOnPlayGround(selectedTileCords.x, selectedTileCords.y)) {
            if (!this.currentMapView.selectionOnMap) this.currentMapView.selectionOnMap = true;

            //update Position of tile selection marker. Needed for double touch event.
            this.currentMapView.updateSelectedTile(selectedTileCords);

            let avatarCords = this.ownAvatarView.getGridPosition();
            let startCords = {x: avatarCords.getCordX(), y: avatarCords.getCordY() + Settings.MAP_BLANK_TILES_WIDTH};

            //Point&Click movement event
            this.eventManager.handlePlayGroundClicked(startCords, selectedTileCords);
        }
    }

    /**
     * Updates GameView's origin and redraws map
     */
    onResize() {
        if (this.currentMapView === null || this.currentMapView === undefined)
            return;
            
        this.gameEngine.setMapOriginXY(ctx_map.canvas.width, ctx_map.canvas.height);
        this.currentMapView.refreshDisplay();
    }
    
    /**
     * Adds view instance to list of views to be updated steadily
     * 
     * @param {AbstractView} viewInstance view instance
     */
    addToUpdateList = function (viewInstance) {
        if (viewInstance instanceof Array) {
            var i;
            for (i = 0; i < viewInstance.length; i++) {
                TypeChecker.isInstanceOf(viewInstance[i], AbstractView);
            }
        }
        else {
            TypeChecker.isInstanceOf(viewInstance, AbstractView);
        }

        if (!this.updateList.includes(viewInstance)) {
            this.updateList.push(viewInstance);
        }
    }

    /**
     * Draws profile in HUD. If this is not a video conference, removes schedule button from HUD
     * 
     * @param {String} username username
     * @param {boolean} isVideoConference isVideoConference
     */
    drawHUD(username, isVideoConference) {
        TypeChecker.isString(username);
        TypeChecker.isBoolean(isVideoConference);

        this.hudView.drawProfile(username);

        if (!isVideoConference) 
            this.hudView.removeScheduleButton();
    }

    /**
     * Draws status bar
     */
    drawStatusBar() {
        this.statusBar.draw();
    }

    /**
     * Draws View generally
     */
    draw() {
        //check if game view is already initalized
        if (this.gameViewInit) {
            if (this.currentMapView.selectionOnMap) {
                let selectedTile = this.currentMapView.getSelectedTile();
                if (selectedTile !== undefined) selectedTile.draw();
            }

            var gameObjects = this.currentMapView.getGameObjects();

            //put all AvatarViews and all GameObjects in one list
            var allDrawElements = (gameObjects !== undefined) ? gameObjects.concat(this.ownAvatarView)
                .concat(this.anotherParticipantAvatarViews)
                .concat(this.npcAvatarViews)
                : [this.ownAvatarView].concat(this.anotherParticipantAvatarViews)
                    .concat(this.npcAvatarViews);

            //sort all Elements 
            allDrawElements.sort(function (a, b) {
                let cordXFromA = a.getGridPosition().getCordX();
                let cordYFromA = a.getGridPosition().getCordY();
                let cordXFromB = b.getGridPosition().getCordX();
                let cordYFromB = b.getGridPosition().getCordY();

                //Make GameObjectView Position and AvatarView Position consistent
                if (a instanceof GameObjectView) {
                    cordYFromA = cordYFromA - Settings.MAP_BLANK_TILES_LENGTH; 
                }

                if (b instanceof GameObjectView) {
                    cordYFromB = cordYFromB - Settings.MAP_BLANK_TILES_LENGTH;
                }

                if (cordXFromA === cordXFromB) {
                    //if they have the same cordX value, sort in cordY descending
                    return cordYFromA - cordYFromB;
                }

                //otherwise, sort in cordX ascending
                return cordXFromB - cordXFromA;
            });

            //draw all elements
            for (var i = 0; i < allDrawElements.length; i++) {
                allDrawElements[i].draw();
            }
        }
    }

    /**
     * Update Views in update list
     */
    update() {
        for (var i = 0; i < this.updateList.length; i++) {

            if (this.updateList[i] instanceof Array) {
                for (var j = 0; j < this.updateList[i].length; j++) {
                    this.updateList[i][j].update();
                }
            }
            else {
                this.updateList[i].update();
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
        this.statusBar.updatePing(ms);
    }

    /**
     * Updates FPS
     */
    updateFPS() {
        if (this.statusBar !== undefined)
            this.statusBar.updateFPS();
    }

    /**
     * Updates connection status
     * 
     * @param {ConnectionState} status connection status
     */
    updateConnectionStatus(status) {
        TypeChecker.isEnumOf(status, ConnectionState);
        this.statusBar.updateConnectionStatus(status);
    }

    /**
     * Updates group name in status bar
     * 
     * @param {String} groupName group name
     */
    addGroupName(groupName) {
        TypeChecker.isString(groupName);
        this.statusBar.addGroupName(groupName);
    }

    /**
     * Remove group name from status bar
     */
    removeGroupName() {
        this.statusBar.removeGroupName();
    }

    /**
     * Initializes room view when own avatar enters Room
     * 
     * @param {Object[]} assetPaths asset paths
     * @param {number[][]} map map
     * @param {number[][]} objectMap object map
     * @param {NPC[]} listOfNPCs list of NPCs
     * @param {String} roomName name of room
     */
    initRoomView(assetPaths, map, objectMap, listOfNPCs, roomName) {

        $('#avatarCanvas').off();

        if(this.currentMapView !== undefined)
            this.currentMapView.setVisibility(false);

        this.npcAvatarViews = [];
        listOfNPCs.forEach(npc => {
            this.npcAvatarViews.push(new NPCAvatarView(npc.getId(), npc.getName(), npc.getPosition(), npc.getDirection(), npc.getShirtColor(), this.gameEngine, this.eventManager));
        });

        this.currentMapView = new MapView(assetPaths, map, objectMap, this.npcAvatarViews, this.eventManager);
        this.statusBar.updateLocation(roomName);
    }

    /**
     * Adds participant to another avatar views
     * 
     * @param {ParticipantClient} participant another participant
     */
    initAnotherAvatarViews(participant) {
        if (!(this.ownAvatarView instanceof ParticipantAvatarView)) {
            throw new Error("Please initialize the current client's avatar view first using initOwnAvatarView(participant)");
        }

        TypeChecker.isInstanceOf(participant, ParticipantClient);

        let index = this.anotherParticipantAvatarViews.findIndex(participantAvatarView => participantAvatarView.getId() === participant.getId());
        
        if (index >= 0) {
            throw new Error(participant + " is already in list of participants");
        }

        if (participant !== this.ownAvatarView) {
            let ppantView = new ParticipantAvatarView(
                participant.getPosition(),
                participant.getDirection(),
                participant.getShirtColor(),
                participant.getId(),
                participant.getDisplayName(),
                participant.getIsVisible(),
                participant.getIsModerator(),
                false,
                this.gameEngine,
                this.eventManager
            );
            this.anotherParticipantAvatarViews.push(ppantView);
            this.addToUpdateList(ppantView);
        }
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

        let index = this.anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants");
        }

        this.anotherParticipantAvatarViews[index].setPosition(newPosition);
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

        let index = this.anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants");
        }

        this.anotherParticipantAvatarViews[index].setDirection(direction);
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

        let index = this.anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants");
        }

        this.anotherParticipantAvatarViews[index].updateWalking(isMoving);
        this.anotherParticipantAvatarViews[index].updateCurrentAnimation();
    }

    /**
     * Removes participant from another avatar views
     * 
     * @param {String} participantId participant ID
     */
    removeAnotherAvatarViews(participantId) {
        TypeChecker.isString(participantId);

        //Searches in Array of other Avatars for participant with this ID
        var index = this.anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants");
        }

        //Removes disconnected Avatar from participant avatar views
        this.anotherParticipantAvatarViews.splice(index, 1);

    }

    /**
     * Resets another avatar views
     */
    resetAnotherAvatarViews() {
        this.anotherParticipantAvatarViews.length = 0;
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
        let shirtColor = ownParticipant.getShirtColor();
        let id = ownParticipant.getId();
        let displayName = ownParticipant.getDisplayName();
        let isModerator = ownParticipant.getIsModerator();

        this.ownAvatarView = new ParticipantAvatarView(startingPos, startingDir, shirtColor, id, displayName, true, isModerator, true, this.gameEngine, this.eventManager);
        this.addToUpdateList(this.ownAvatarView);
    }

    /**
     * Updates own avatar position
     * 
     * @param {PositionClient} newPosition new avatar position
     */
    updateOwnAvatarPosition(newPosition) {
        TypeChecker.isInstanceOf(newPosition, PositionClient);
        this.ownAvatarView.setPosition(newPosition);
    }

    /**
     * Updates own avatar direction
     * 
     * @param {Direction} direction new avatar direction
     */
    updateOwnAvatarDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.ownAvatarView.setDirection(direction);

    }

    /**
     * Updates own avatar moving status
     * 
     * @param {boolean} isMoving true if moving, otherwise false
     */
    updateOwnAvatarWalking(isMoving) {
        TypeChecker.isBoolean(isMoving);
        this.ownAvatarView.updateWalking(isMoving);
        this.ownAvatarView.updateCurrentAnimation();
    }

    /**
     * Updates own avatars moderator state
     * 
     * @param {boolean} modState true if moderator, false otherwise
     */
    setOwnModState(modState) {
        TypeChecker.isBoolean(modState);

        this.ownAvatarView.setIsModerator(modState);
    }

    /**
     * Updates other avatars moderator state
     * 
     * @param {boolean} modState true if moderator, false otherwise
     * @param {String} ppantID ID of that ppant
     */
    setOtherModState(modState, ppantID) {
        TypeChecker.isBoolean(modState);
        TypeChecker.isString(ppantID);

        let index = this.anotherParticipantAvatarViews.findIndex(participant => participant.getId() === ppantID);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants");
        }

        this.anotherParticipantAvatarViews[index].setIsModerator(modState);
    }

    /**
     * Updates own avatars shirt color
     * 
     * @param {ShirtColor} shirtColor new shirt color
     */
    setOwnShirtColor(shirtColor) {
        TypeChecker.isEnumOf(shirtColor, ShirtColor);

        this.ownAvatarView.updateShirtColor(shirtColor);
    }

    /**
     * Updates other avatars shirt color
     * 
     * @param {ShirtColor} shirtColor new shirt color
     * @param {String} ppantID ID of that ppant
     */
    setOtherShirtColor(shirtColor, ppantID) {
        TypeChecker.isEnumOf(shirtColor, ShirtColor);
        TypeChecker.isString(ppantID);

        let index = this.anotherParticipantAvatarViews.findIndex(participant => participant.getId() === ppantID);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants");
        }

        this.anotherParticipantAvatarViews[index].updateShirtColor(shirtColor);
    }

    /**
     * Draws current lectures window
     * 
     * @param {Object[]} lectures current lectures
     */
    initCurrentLectures(lectures) {
        this.currentLecturesView.draw(lectures);
    }

    /**
     * Update current lectures window because lecture is full
     * 
     * @param {String} lectureId lecture ID
     */
    updateCurrentLectures(lectureId) {
        TypeChecker.isString(lectureId);
        this.currentLecturesView.drawLectureFull(lectureId);
    }

    /**
     * Draws schedule window
     * 
     * @param {Object[]} lectures all lectures
     * @param {number} timeOffset offset if client has different local time than the server
     */
    initCurrentSchedule(lectures, timeOffset) {
        this.scheduleListView.draw(lectures, timeOffset);
    }

    /**
     * Draws lecture window
     * 
     * @param {Object} lecture lecture
     * @param {boolean} hasToken true if has token, otherwise false
     * @param {Object} lectureChat lecture chat
     * @param {boolean} isOrator true if is orator of this lecture, otherwise false
     * @param {boolean} isModerator true if is moderator of the conference, otherwise false
     * @param {number} timeOffset offset if client has different local time than the server
     */
    updateCurrentLecture(lecture, hasToken, lectureChat, isOrator, isModerator, timeOffset) {
        this.lectureView.draw(lecture, hasToken, lectureChat, isOrator, isModerator, timeOffset);
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

        this.globalChatView.draw(messageHeader, messageText);
    };

    /**
     * Draws a larger global chat window
     * 
     * @param {String} messageHeader message header
     * @param {String[]} messageText message text
     */
    initLargerGlobalChatView(messageHeader, messageText) {
        TypeChecker.isString(messageHeader);
        if (messageText instanceof Array) {
            TypeChecker.isInstanceOf(messageText, Array);
            messageText.forEach(line => {
                TypeChecker.isString(line);
            });
        } else {
            TypeChecker.isString(messageText);
        }

        this.largerGlobalChatView.draw(messageHeader, messageText);
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

        this.profileView.draw(businessCard, isModerator);
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

        //case when ppant with this businessCard is a friend or is a moderator
        if (rank) {
            TypeChecker.isInt(rank);
        }

        TypeChecker.isBoolean(isModerator);

        this.businessCardView.draw(businessCard, isFriend, rank, isModerator);
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
        });

        this.friendListView.draw(businessCards);
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
            });
        }

        TypeChecker.isString(groupName);

        if (limit)
            TypeChecker.isInt(limit);
        if (chatId)
            TypeChecker.isString(chatId);

        this.inviteFriendsView.draw(businessCards, groupName, limit, chatId);
    }

    /**
     * Draws achievement window
     * 
     * @param {Object[]} achievements achievements
     */
    initCurrentAchievementsView(achievements) {
        this.achievementView.draw(achievements);
    }

    /**
     * Draws new achievement window
     * 
     * @param {Object} achievement achievement
     */
    handleNewAchievement(achievement) {
        this.newAchievementView.draw(achievement);
    }

    /**
     * Draws NPC story window
     * 
     * @param {String} name NPC name
     * @param {String[]} story NPC story
     * @param {String} npcId NPC id
     */
    initNPCStoryView(name, story, npcId) {
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(story, Array);
        story.forEach(element => {
            TypeChecker.isString(element);
        });

        this.npcStoryView.draw(name, story, npcId);
    }

    /**
     * Add NPC story window and show
     * 
     * @param {String} npcId NPC id
     */
     addNPCStoryWindow(npcId) {
        this.npcStoryView.addNewNPCStoryWindow(npcId);
    }

    /**
     * Add external website window and show
     * 
     * @param {String} gameObjectID GameObject id
     */
     addExternalWebsiteWindow(gameObjectID) {
        TypeChecker.isString(gameObjectID);

        this.externalWebsiteView.addNewExternalWebsiteWindow(gameObjectID);
    }

    /**
     * Draws external website window 
     * 
     * @param {Object} iFrameData iFrame data object
     * @param {String} iFrameData.title title of iFrame
     * @param {String} iFrameData.url URL of iFrame
     * @param {number} iFrameData.width width of iframe in px
     * @param {number} iFrameData.height height of iframe in px
     * @param {String} gameObjectID GameObject id
     */
    initExternalWebsiteView(iFrameData, gameObjectID) {
        TypeChecker.isInstanceOf(iFrameData, Object);
        TypeChecker.isString(iFrameData.title);
        TypeChecker.isInt(iFrameData.width);
        TypeChecker.isInt(iFrameData.height);
        TypeChecker.isString(iFrameData.url);
        TypeChecker.isString(gameObjectID);

        this.externalWebsiteView.draw(iFrameData, gameObjectID);
    }

    /**
     * Draws rank list window
     * 
     * @param {Object[]} rankList rank list
     * @param {String} ownUsername current participant username
     * @param {Boolean} emptyRankList true if ranklist should be emptied
     */
    initRankListView(rankList, ownUsername, emptyRankList) {
        this.rankListView.draw(rankList, ownUsername, emptyRankList);
    }

    /**
     * Draws jitsi meeting list window
     * 
     * @param {Object[]} meetings meetings
     */
    initMeetingListView(meetings) {
        this.meetingListView.draw(meetings);
    };

    /**
     * Draws jitsi meeting window
     * 
     * @param {Object} meeting joined meeting
     * @param {String} ownDisplayName own display name that is shown in meeting
     * 
     */
    initVideoMeetingView(meeting, ownDisplayName) {
        this.videoMeetingView.draw(meeting, ownDisplayName);
    }

    /**
     * Draws chat list window
     * 
     * @param {Object[]} chats chats
     * @param {String} ownUsername current participant's username
     */
    initChatListView(chats, ownUsername) {
        this.chatListView.draw(chats, ownUsername);
    };

    /**
     * Draws chat thread window
     * 
     * @param {Object} chat chat
     * @param {boolean} openNow true if open window now, otherwise false
     * @param {String} ownUsername current participant's username
     */
    initChatThreadView(chat, openNow, ownUsername) {
        if (openNow) {
            this.addChatThreadWindow(chat.chatId);
            this.chatThreadView.draw(chat, ownUsername);
        }
    };

    /**
     * Add chat thread window and show
     * 
     * @param {Stirng} chatId chat id
     */
    addChatThreadWindow(chatId) {
        this.chatListView.addNewChatThreadWindow(chatId);
    }

    /**
     * Closes chat thread window with chatId if it is currently open 
     * 
     * @param {String} chatId chatId
     */
     closeChatThreadView(chatId) {
        if ($('#chatThreadModal' + chatId).is(':visible')) {
            this.chatThreadView.close(chatId);
        }
    };

    /**
     * Gets chat thread view
     * 
     * @return {ChatThreadView} chatThreadView
     */
    getChatThreadView() {
        return this.chatThreadView;
    }

    /**
     * Adds new chat to chat list
     * 
     * @param {Object} chat chat
     * @param {boolean} openNow true if open window now, otherwise false
     * @param {String} ownUsername current participant's username
     */
    addNewChat(chat, openNow, ownUsername) {
        if ($('#chatListModal').is(':visible')) {
            this.chatListView.addNewChat(chat);
        }
        this.initChatThreadView(chat, openNow, ownUsername);
    };

    /**
     * Adds new meeting to meeting list
     * 
     * @param {Object} meeting meeting
     */
     addNewMeeting(meeting) {
        if ($('#meetingListModal').is(':visible')) {
            this.meetingListView.addNewMeeting(meeting);
        }
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

        if ($('#chatThreadModal' + chatId).is(':visible')) {
            this.chatThreadView.updateFriendRequestButton(chatId, areFriends, friendRequestSent);
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
            this.chatListView.addNewMessage(chatId, message);
        }

        if ($('#chatThreadModal' + chatId).is(':visible')) {
            this.chatThreadView.addNewMessage(chatId, message);
        }
    };

    /**
     * Appends all chat message
     * 
     * @param {Object} message allchat message
     * @param {String} ownUsername current participant's username
     */
    appendAllchatMessage(message, ownUsername) {
        this.allchatView.appendMessage(message, ownUsername);
    }
    
    /**
     * Show allchat box
     */
    showAllchatBox() {
        this.allchatView.showAllchatBox();
    }

    /**
     * Adds command into last commands array in allchat
     * @param {String} command last command
     */
    saveCommand(command) {
        this.allchatView.saveCommand(command);
    }

    /**
     * Draws everything about all chat
     * 
     * @param {String} roomName name of room
     * @param {Object[]} messages allchat messages
     * @param {String} ownUsername current participant's username
     */
    initAllchatView(roomName, messages, ownUsername) {
        this.allchatView.draw(roomName, messages, ownUsername);
    }

    /**
     * Updates points on successesBar
     * 
     * @param {number} points points
     */
    updatePoints(points) {
        TypeChecker.isInt(points);
        this.successesBar.updatePoints(points);
    }

    /**
     * Updates rank on successesBar
     * 
     * @param {?number} rank rank
     */
    updateRank(rank) {
        if (rank) {
            TypeChecker.isInt(rank);
        }

        this.successesBar.updateRank(rank);
    }

    /**
     * Removes friend from friend list window and invite friends window
     * 
     * @param {String} participantId participant ID
     */
    removeFriend(participantId) {
        TypeChecker.isString(participantId);

        if ($('#friendListModal').is(':visible')) {
            this.friendListView.deleteFriend(participantId);
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
            this.chatListView.deleteChat(chatId);
        }
    }

    /**
     * Removes meeting from meeting list window
     * 
     * @param {String} meetingId meeting ID
     */
     removeMeeting(meetingId) {
        TypeChecker.isString(meetingId);

        if ($('#meetingListModal').is(':visible')) {
            this.meetingListView.deleteMeeting(meetingId);
        }
    }

    /**
     * Closes video meeting window with meetingId if it is currently visible
     * 
     * @param {String} meetingId meeting ID
     */
    closeVideoMeetingView(meetingId) {
        if ($('#meetingWindow').is(':visible')) {
            this.videoMeetingView.close(meetingId);
        }
    };

    /**
     * Add friends to friend list window and invite friends window
     * 
     * @param {BusinessCardClient} businessCard friend's business card
     */
    addFriend(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);

        if ($('#friendListModal').is(':visible')) {
            this.friendListView.addToFriendList(businessCard);
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
            this.inviteFriendsView.addToInviteFriends(businessCard, hasLeftChat);
        }
    }

    /**
     * Add username to group chat participant list
     * 
     * @param {String} chatId chat id
     * @param {String} username username
     */
    addToChatParticipantList(chatId, username) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(username);
        if ($('#chatParticipantListModal' + chatId).is(':visible')) {
            this.chatParticipantListView.addToChatParticipantList(chatId, username);
        }
    }

    /**
     * Removes username from group chat participant list
     * 
     * @param {String} chatId chat id
     * @param {String} username username
     */
    removeFromChatParticipantList(chatId, username) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(username);
        if ($('#chatParticipantListModal' + chatId).is(':visible')) {
            this.chatParticipantListView.removeFromChatParticipantList(username);
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
            this.inviteFriendsView.removeFromInviteFriends(participantId, isMemberOfChat);
        }
    }

    /**
     * Draws group chat participant list
     * 
     * @param {String} chatId chat id
     * @param {String[]} usernames list of usernames
     */
    drawChatParticipantList(chatId, usernames) {
        TypeChecker.isString(chatId);
        TypeChecker.isInstanceOf(usernames, Array);
        usernames.forEach(username => {
            TypeChecker.isString(username);
        });
        this.chatParticipantListView.draw(chatId, usernames);
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
        this.notifBar.drawNewChat(senderUsername, chatId);
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

        this.notifBar.drawNewGroupChat(groupName, creatorUsername, chatId);
    }

    /**
     * Draws new meeting notification
     * 
     * @param {String} meetingName meeting name
     * @param {String} meetingID meeting ID
     */
    drawNewMeeting(meetingName, meetingID) {
        TypeChecker.isString(meetingName);
        TypeChecker.isString(meetingID);
        this.notifBar.drawNewMeeting(meetingName, meetingID);
    }

    /**
     * Removes new message notif
     * 
     * @param {String} senderUsername message sender username
     * @param {String} chatId chat ID
     */
     removeNewMessageNotif(senderUsername, chatId) {
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(chatId);

        this.notifBar.removeNotifDiv(this.notifBar.getNewMessageId(senderUsername, chatId));
    }

    /**
     * Removes new chat notif
     * 
     * @param {String} chatId chat ID
     */
     removeNewChatNotif(chatId) {
        TypeChecker.isString(chatId);

        this.notifBar.removeNotifDiv(this.notifBar.getNewChatId(chatId));
    }

    /**
     * Removes new group chat notif
     * 
     * @param {String} chatId chat ID
     */
    removeNewGroupChatNotif(chatId) {
        TypeChecker.isString(chatId);

        this.notifBar.removeNotifDiv(this.notifBar.getNewGroupChatId(chatId));
    }

    /**
     * removes meeting notif
     * 
     * @param {String} meetingId meeting ID
     */
    removeNewMeetingNotif(meetingId) {
        TypeChecker.isString(meetingId);

        this.notifBar.removeNotifDiv(this.notifBar.getNewMeetingId(meetingId));
    }

    /**
     * removes new friend request notif
     * 
     * @param {String} senderUsername requester username
     */
    removeNewFriendRequestNotif(senderUsername) {
        TypeChecker.isString(senderUsername);

        this.notifBar.removeNotifDiv(this.notifBar.getNewFriendRequestId(senderUsername));
    }

    /**
     * removes new friend notif
     * 
     * @param {String} friendUsername friend username
     */
     removeNewFriendNotif(friendUsername) {
        TypeChecker.isString(friendUsername);

        this.notifBar.removeNotifDiv(this.notifBar.getNewFriendId(friendUsername));
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

        if ($('#chatThreadModal' + chatId).is(':visible') && this.chatThreadView.getChatId() === chatId) {
            return;
        }

        this.notifBar.drawNewMessage(senderUsername, chatId);
    }

    /**
     * Draws new friend request notification
     * 
     * @param {String} senderUsername requester username
     */
    drawNewFriendRequest(senderUsername) {
        TypeChecker.isString(senderUsername);
        this.notifBar.drawNewFriendRequest(senderUsername);
    }

    /**
     * Draws new friend i.e. accepted friend request notification
     * 
     * @param {String} friendUsername friend username
     */
    drawNewFriend(friendUsername) {
        TypeChecker.isString(friendUsername);
        this.notifBar.drawNewFriend(friendUsername);
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
        });

        this.friendRequestListView.draw(businessCards);
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
            this.friendRequestListView.update(participantId, isAccepted);
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
            this.friendRequestListView.addToFriendRequestList(businessCard);
        }
    }

    /**
     * Removes own avatar view
     */
    removeOwnAvatarView() {
        this.ownAvatarView = undefined;
    }

    /**
     * hide an avatar without destroying the avatarView instance
     * 
     * @param {String} participantId participant ID
     */
    hideAvatar(participantId) {
        TypeChecker.isString(participantId);

        for (var i = 0; i < this.anotherParticipantAvatarViews.length; i++) {
            var avatar = this.anotherParticipantAvatarViews[i];
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

        for (var i = 0; i < this.anotherParticipantAvatarViews.length; i++) {
            var avatar = this.anotherParticipantAvatarViews[i];
            if (avatar.getId() === participantId) {
                avatar.setVisibility(true);
            }
        }
    }

    /**
     * Appends messsage to lecture chat
     * 
     * @param {Object} message lecture chat message
     * @param {String} ownUsername current participant's username
     */
    appendLectureChatMessage(message, ownUsername) {
        if ($('#lectureVideoWindow').is(':visible')) {
            this.lectureView.appendMessage(message, ownUsername);
        }
    }

    /**
     * Draws lecture chat
     * 
     * @param {Object} lectureChat lecture chat
     * @param {String} ownUsername current participant's username
     */
    updateLectureChat(lectureChat, ownUsername) {
        if ($('#lectureVideoWindow').is(':visible')) {
            this.lectureView.drawChat(lectureChat, ownUsername);
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
            this.lectureView.drawToken(hasToken, TokenMessages.REVOKE);
        }
    };

    /**
     * draws lecture video
     * 
     * @param {String} videoUrl video URL
     */
    drawVideo(videoUrl) {
        TypeChecker.isString(videoUrl);

        if ($('#lectureVideoWindow').is(':visible')) {
            this.lectureView.drawVideo(videoUrl);
        }
    }

    /**
     * Closes lecture window
     */
    closeLectureView() {
        if ($('#lectureVideoWindow').is(':visible')) {
            this.lectureView.close();
        }
    };

    /**
     * init enter code window
     * 
     * @param {String} doorId door id for which the code is entered
     */
    initEnterCodeWindow(doorId) {
        TypeChecker.isString(doorId);
        
        this.enterCodeView.draw(doorId);
    }
}