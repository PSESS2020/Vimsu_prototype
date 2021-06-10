/**
 * The Client Controller
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ClientController {

    port;
    socket;
    currentRoom;
    ownParticipant;
    ownBusinessCard;
    gameView;
    isVideoConference;
    displayName;

    /**
     * creates an instance of ClientController only if there is not an instance already.
     * Otherwise the existing instance will be returned.
     * 
     * @param {number} port client port
     * @param {GameView} gameView GameView instance
     */
    constructor(port, gameView) {
        if (!!ClientController.instance) {
            return ClientController.instance;
        }

        ClientController.instance = this;

        TypeChecker.isInt(port);
        TypeChecker.isInstanceOf(gameView, GameView);
        
        this.port = port;
        this.openSocketConnection();
        this.gameView = gameView;
        this.gameView.initEventManager(this);


    }

    /**
     * Gets the current room
     * 
     * @return {RoomClient}
     */
    getCurrentRoom() {
        return this.currentRoom; 
    }

    /**
     * Gets own participants position
     * 
     * @return {PositionClient}
     */
    getOwnParticipantPosition() {
        return this.ownParticipant.getPosition();
    }

    /**
     * checks if there is an existing socket
     * 
     * @return {boolean} true if socket is ready, otherwise false
     */
    socketReady = function () {
        if (!this.socket) {
            return false;
        }
        return true;
    }

    /**
     * Initializes the initial view for the player
     */
    initGameView = function () {
        var assetPaths = this.currentRoom.getAssetPaths();
        var map = this.currentRoom.getMap();
        var objectMap = this.currentRoom.getObjectMap();
        var roomName = this.currentRoom.getRoomName();
        var listOfNPCs = this.currentRoom.getListOfNPCs();

        if (map !== null) {
            this.gameView.initRoomView(assetPaths, map, objectMap, listOfNPCs, roomName);
        }

        this.gameView.drawStatusBar();
        this.gameView.drawHUD(this.ownBusinessCard.getUsername(), this.isVideoConference);
        this.gameView.initOwnAvatarView(this.ownParticipant);
        this.gameView.initCanvasEvents();

        //Game View is now fully initialised
        this.gameView.setGameViewInit(true);
        this.gameView.updateConnectionStatus(ConnectionState.CONNECTED);
    }

    /**
     * Initializes the view for the player after switching room
     */
    switchRoomGameView = function () {

        //disables update of gameview
        this.gameView.setGameViewInit(false);

        var assetPaths = this.currentRoom.getAssetPaths();
        var map = this.currentRoom.getMap();
        var objectMap = this.currentRoom.getObjectMap();
        var roomName = this.currentRoom.getRoomName();
        var listOfNPCs = this.currentRoom.getListOfNPCs();

        if (map !== null) {
            this.gameView.initRoomView(assetPaths, map, objectMap, listOfNPCs, roomName);
        }

        this.gameView.resetAnotherAvatarViews();
        this.gameView.initCanvasEvents();
        this.gameView.setGameViewInit(true);
    }

    /**
     * opens a new socket connection between the client and the server and initializes the events to be handled.
     * also handles socket on disconnect.
     */
    openSocketConnection = function () {
        if (this.port && !this.socket) {
            /**
             * Arguments prevent initial http polling and start the websocket directly.
             * Without the arguments the client starts a http connection and upgrades later to websocket protocol.
             * This caused a disconnect from the server and therefore a server scrash. 
             */
            this.socket = io({
                transports: ['websocket'],
                upgrade: false,
                'reconnection': true,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 5000,
                'reconnectionAttempts': Infinity,
                'force new connection': true
            });

            this.socket.on('connect', () => {
                this.socket.emit('new participant');

                if (this.connectedOnce) {
                    this.gameView.updateConnectionStatus(ConnectionState.RECONNECTED);
                }
                
                this.connectedOnce = true;
            });

            this.socket.on('pong', (ms) => {
                this.gameView.updatePing(ms);
            });

            this.socket.on('disconnect', (reason) => {
                this.gameView.updateConnectionStatus(ConnectionState.DISCONNECTED);
                
                if (reason === "transport close" || reason === "ping timeout" || reason === "transport error") {
                    setTimeout(() => { this.openSocketConnection() }, 5000 );
                } else {
                    this.socket.close();
                }
            });

            this.setUpSocket();
        }
    }

    /**
     * Initializes the events to be handled
     */
    setUpSocket = function () {
        this.socket.on('isVideoConference', this.handleFromServerSetIsVideoConference.bind(this));
        this.socket.on('selectedLanguageData', this.handleFromServerSetSelectedLanguageData.bind(this));
        this.socket.on('initOwnParticipantState', this.handleFromServerInitOwnParticipant.bind(this));
        this.socket.on('currentGameStateYourRoom', this.handleFromServerUpdateRoom.bind(this));
        this.socket.on('currentGameStateYourPosition', this.handleFromServerUpdatePosition.bind(this)); //Called when server wants to update your position
        this.socket.on('roomEnteredByParticipant', this.handleFromServerRoomEnteredByParticipant.bind(this));
        this.socket.on('movementOfAnotherPPantStart', this.handleFromServerStartMovementOther.bind(this)); // onKeyDown, start recalculating position
        this.socket.on('movementOfAnotherPPantStop', this.handleFromServerStopMovementOther.bind(this));  // onKeyUp, check if position fits server 
        this.socket.on('remove player', this.handleFromServerRemovePlayer.bind(this)); // handles remove event
        this.socket.on('currentLectures', this.handleFromServerCurrentLectures.bind(this));
        this.socket.on('currentSchedule', this.handleFromServerCurrentSchedule.bind(this));
        this.socket.on('lectureEntered', this.handleFromServerLectureEntered.bind(this));
        this.socket.on('lectureFull', this.handleFromServerLectureFull.bind(this));
        this.socket.on('businessCard', this.handleFromServerBusinessCard.bind(this));
        this.socket.on('friendList', this.handleFromServerFriendList.bind(this));
        this.socket.on('friendRequestList', this.handleFromServerFriendRequestList.bind(this));
        this.socket.on('rankList', this.handleFromServerRankList.bind(this));
        this.socket.on('newAllchatMessage', this.handleFromServerNewAllchatMessage.bind(this)); // handles new message in allchat
        this.socket.on('initAllchat', this.handleFromServerInitAllchat.bind(this)); // called on entering a new room to load the allchat
        this.socket.on('lectureMessageFromServer', this.handleFromServerNewLectureChatMessage.bind(this));
        this.socket.on('videoUrl', this.handleFromServerVideoUrl.bind(this));
        this.socket.on('updateLectureChat', this.handleFromServerUpdateLectureChat.bind(this));
        this.socket.on('update token', this.handleFromServerUpdateToken.bind(this));
        this.socket.on('force close lecture', this.handleFromServerForceCloseLecture.bind(this));
        this.socket.on('New notification', this.handleFromServerNewNotification.bind(this));
        this.socket.on('New large notification', this.handleFromServerNewLargerNotification.bind(this));
        this.socket.on('New global announcement', this.handleFromServerNewGlobalAnnouncement.bind(this));
        this.socket.on('remove yourself', this.handleFromServerRemoved.bind(this));
        this.socket.on('hideAvatar', this.handleFromServerHideAvatar.bind(this));
        this.socket.on('showAvatar', this.handleFromServerShowAvatar.bind(this));
        this.socket.on('achievements', this.handleFromServerAchievements.bind(this));
        this.socket.on('removeFromChatParticipantList', this.handleFromServerRemoveFromChatParticipantList.bind(this));
        this.socket.on('addToInviteFriends', this.handleFromServerAddToInviteFriends.bind(this));
        this.socket.on('removeFromInviteFriends', this.handleFromServerRemoveFromInviteFriends.bind(this));
        this.socket.on('updatePoints', this.handleFromServerUpdatePoints.bind(this));
        this.socket.on('updateRank', this.handleFromServerUpdateRank.bind(this));
        this.socket.on('acceptedFriendRequest', this.handleFromServerAcceptedFriendRequest.bind(this));
        this.socket.on('rejectedFriendRequest', this.handleFromServerRejectedFriendRequest.bind(this));
        this.socket.on('addToChatParticipantList', this.handleFromServerAddToChatParticipantList.bind(this));
        this.socket.on('removedFriend friendList', this.handleFromServerRemovedFriendUpdateFriendList.bind(this));
        this.socket.on('removedFriend chatThread', this.handleFromServerRemovedFriendUpdateChatThread.bind(this));
        this.socket.on('removeFriendRequest', this.handleFromServerRemoveFriendRequest.bind(this));
        this.socket.on('showNPCStory', this.handleFromServerShowNPCStory.bind(this));
        this.socket.on('chatParticipantList', this.handleFromServerChatParticipantList.bind(this))
        this.socket.on('gameEntered', this.handleFromServerGameEntered.bind(this));
        this.socket.on('gotNewChat', this.handleFromServerGotNewChat.bind(this));
        this.socket.on('gotNewGroupChat', this.handleFromServerGotNewGroupChat.bind(this));
        this.socket.on('gotNewChatMessage', this.handleFromServerGotNewChatMessage.bind(this));
        this.socket.on('gotNewMeeting', this.handleFromServerGotNewMeeting.bind(this));
        this.socket.on('chatMeeting', this.handleFromServerChatMeeting.bind(this));
        this.socket.on('evalAnswer', function (data) {   //Displays evaluated input.
            console.log(data);
        });
        this.socket.on('newChat', this.handleFromServerNewChat.bind(this));
        this.socket.on('newMeeting', this.handleFromServerNewMeeting.bind(this));
        this.socket.on('newAchievement', this.handleFromServerNewAchievement.bind(this));
        this.socket.on('newFriendRequestReceived', this.handleFromServerNewFriendRequest.bind(this));
        this.socket.on('chatList', this.handleFromServerShowChatList.bind(this));
        this.socket.on('chatThread', this.handleFromServerShowChatThread.bind(this));
        this.socket.on('newChatMessage', this.handleFromServerNewChatMessage.bind(this));
        this.socket.on('inviteFriends', this.handleFromServerInviteFriends.bind(this));
        this.socket.on('enterCode', this.handleFromServerEnterCode.bind(this));
        this.socket.on('your mod state changed', this.handleFromServerChangeYourModState.bind(this));
        this.socket.on('other mod state changed', this.handleFromServerChangeOtherModState.bind(this));
        this.socket.on('your shirt color changed', this.handleFromServerChangeYourShirtColor.bind(this));
        this.socket.on('other shirt color changed', this.handleFromServerChangeOtherShirtColor.bind(this));
        this.socket.on('join group', this.handleFromServerJoinGroup.bind(this));
        this.socket.on('leave group', this.handleFromServerLeaveGroup.bind(this));
        this.socket.on('leave chat', this.handleFromServerLeaveChat.bind(this));
        this.socket.on('leave meeting', this.handleFromServerLeaveMeeting.bind(this));
        this.socket.on('meetingList', this.handleFromServerShowMeetingList.bind(this));
        this.socket.on('showExternalWebsite', this.handleFromServerShowExternalWebsite.bind(this));
    }

    /*  */
    /*  EDIT VIEW  */
    /*  */

    /**
     * updates game view
     */
    updateGame() {
        this.gameView.update()
        this.gameView.draw();
        this.gameView.updateFPS();
    }

    /**
     * Gets send message failure text
     * @returns message failure text
     */
    getSendMessageFailureText() {
        return {
            username: "VIMSU Bot", 
            timestamp: new Date(), 
            text: "Failed to send message. No connection to the server."
        }
    }

    /*  */
    /*  RECEIVE FROM SERVER  */
    /*  */

    /**
     * Message from server, gives you information if this conference is with video storage or without video storage
     * 
     * @param {boolean} isVideoConference
     */
    handleFromServerSetIsVideoConference = function (isVideoConference) {
        TypeChecker.isBoolean(isVideoConference);

        this.isVideoConference = isVideoConference;
    }

    /**
     * Message from server, receives language data from selected language and sends it directly to view and dateParser
     * 
     * @param {json} languageData
     */
    handleFromServerSetSelectedLanguageData = function (languageData) {
        this.gameView.initViews(languageData);

        /* Init DateParser and emit languageData */
        new DateParser(languageData.days, languageData.months);
    }

    /**
     * Second message from server, gives you information of starting position, business card and participant id.
     * After that, there is everything to init the game view
     * 
     * @param {Object} initInfo initial own participant info
     */
    handleFromServerInitOwnParticipant = function (initInfo) {
        
        TypeChecker.isInstanceOf(initInfo, Object);
        TypeChecker.isString(initInfo.id);
        TypeChecker.isInstanceOf(initInfo.businessCard, Object);
        TypeChecker.isString(initInfo.businessCard.id);
        TypeChecker.isString(initInfo.businessCard.username);
        TypeChecker.isString(initInfo.businessCard.forename);
        TypeChecker.isInt(initInfo.cordX);
        TypeChecker.isInt(initInfo.cordY);
        TypeChecker.isEnumOf(initInfo.dir, Direction);
        TypeChecker.isBoolean(initInfo.isVisible);
        TypeChecker.isBoolean(initInfo.isModerator);
        TypeChecker.isEnumOf(initInfo.shirtColor, ShirtColor);
        TypeChecker.isString(initInfo.displayName);
        if (initInfo.businessCard.title !== undefined)
            TypeChecker.isString(initInfo.businessCard.title);
        if (initInfo.businessCard.surname !== undefined) 
            TypeChecker.isString(initInfo.businessCard.surname);
        if (initInfo.businessCard.job !== undefined) 
            TypeChecker.isString(initInfo.businessCard.job);
        if (initInfo.businessCard.company !== undefined)   
            TypeChecker.isString(initInfo.businessCard.company);
        if (initInfo.businessCard.email !== undefined)  
            TypeChecker.isString(initInfo.businessCard.email);

        this.ownBusinessCard = new BusinessCardClient(
            initInfo.businessCard.id,
            initInfo.businessCard.username,
            initInfo.businessCard.forename,
            initInfo.businessCard.title,
            initInfo.businessCard.surname,
            initInfo.businessCard.job,
            initInfo.businessCard.company,
            initInfo.businessCard.email
        );
        var initPos = new PositionClient(initInfo.cordX, initInfo.cordY);

        this.displayName = initInfo.displayName;

        this.ownParticipant = new ParticipantClient(
            initInfo.id,
            this.displayName,
            initPos,
            initInfo.dir,
            initInfo.isVisible,
            initInfo.isModerator,
            initInfo.shirtColor
        );

        this.currentRoom.enterParticipant(this.ownParticipant);
        this.initGameView();
    }

    /**
     * Third message from Server, gives you information of starting room
     * 
     * @param {number} roomId room ID
     * @param {String} roomName room name
     * @param {TypeOfRoom} typeOfRoom type of room
     * @param {Object} assetPaths asset paths
     * @param {Object[]} listOfMapElementsData list of map elements
     * @param {Object[]} listOfGameObjectsData list of game objects
     * @param {Object} npcData NPC
     * @param {Object} doorData door
     * @param {number} width room width
     * @param {number} length room length
     * @param {number[][]} occupationMap occupation map
     */
    handleFromServerUpdateRoom = function (roomId, roomName, typeOfRoom, assetPaths, listOfMapElementsData, listOfGameObjectsData, npcData, doorData, width, length, occupationMap) {

        TypeChecker.isInt(roomId);
        TypeChecker.isString(roomName);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);
        TypeChecker.isInstanceOf(assetPaths, Object);
        TypeChecker.isInstanceOf(listOfMapElementsData, Array);
        listOfMapElementsData.forEach(mapElement => {
            TypeChecker.isInstanceOf(mapElement, Object);
            TypeChecker.isInt(mapElement.id);
            TypeChecker.isEnumOf(mapElement.type, GameObjectType);
            TypeChecker.isString(mapElement.name);
            TypeChecker.isInt(mapElement.width);
            TypeChecker.isInt(mapElement.length);
            TypeChecker.isInt(mapElement.cordX);
            TypeChecker.isInt(mapElement.cordY);
            TypeChecker.isBoolean(mapElement.isClickable);
            TypeChecker.isBoolean(mapElement.isIFrameObject);

        });
        TypeChecker.isInstanceOf(listOfGameObjectsData, Array);
        listOfGameObjectsData.forEach(gameObject => {
            TypeChecker.isInstanceOf(gameObject, Object);
            TypeChecker.isInt(gameObject.id);
            TypeChecker.isEnumOf(gameObject.type, GameObjectType);
            TypeChecker.isString(gameObject.name);
            TypeChecker.isInt(gameObject.width);
            TypeChecker.isInt(gameObject.length);
            TypeChecker.isInt(gameObject.cordX);
            TypeChecker.isInt(gameObject.cordY);
            TypeChecker.isBoolean(gameObject.isClickable);
            TypeChecker.isBoolean(gameObject.isIFrameObject);
        });
        TypeChecker.isInstanceOf(npcData, Array);
        npcData.forEach(npc => {
            TypeChecker.isInstanceOf(npc, Object);
            TypeChecker.isInt(npc.id);
            TypeChecker.isString(npc.name);
            TypeChecker.isInt(npc.cordX);
            TypeChecker.isInt(npc.cordY);
            TypeChecker.isEnumOf(npc.direction, Direction);
            TypeChecker.isEnumOf(npc.shirtColor, ShirtColor);
        });
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(occupationMap, Array);
        occupationMap.forEach(line => {
            TypeChecker.isInstanceOf(line, Array);
            line.forEach(element => {
                TypeChecker.isInt(element);
            });
        });

        //tranform MapElements to GameObjectClients
        var listOfMapElements = [];
        listOfMapElementsData.forEach(mapElement => {
            listOfMapElements.push(new GameObjectClient(mapElement.id, mapElement.type, mapElement.name, mapElement.width, mapElement.length,
                new PositionClient(mapElement.cordX, mapElement.cordY), mapElement.isClickable, mapElement.isIFrameObject, mapElement.story))
            if (mapElement.isClickable && (mapElement.width > 1 || mapElement.length > 1)) {
                this.addDummyClickersTo(listOfMapElements, mapElement.id, mapElement.isIFrameObject, mapElement.story, mapElement.cordX, mapElement.cordY, mapElement.width, mapElement.length);
            }
        });

        //transform GameObjects to GameObjectClients
        var listOfGameObjects = [];
        listOfGameObjectsData.forEach(element => {
            listOfGameObjects.push(new GameObjectClient(element.id, element.type, element.name, element.width, element.length,
                new PositionClient(element.cordX, element.cordY), element.isClickable, element.isIFrameObject, element.story));
            if (element.isClickable && (element.width > 1 || element.length > 1)) {
                this.addDummyClickersTo(listOfGameObjects, element.id, element.isIFrameObject, element.story, element.cordX, element.cordY, element.width, element.length);
            }
        });

        //transform NPCs to NPCClients
        var listOfNPCs = [];
        npcData.forEach(npc => {
            listOfNPCs.push(new NPCClient(npc.id, npc.name, new PositionClient(npc.cordX, npc.cordY), npc.direction, npc.shirtColor));
        });

        //transform Doors to DoorClients
        var listOfDoors = [];
        doorData.forEach(door => {
            listOfDoors.push(new DoorClient(door.id, door.typeOfDoor, door.name, new PositionClient(door.cordX, door.cordY), door.targetRoomId));
        });

        //First room? 
        if (!this.currentRoom) {
            this.currentRoom = new RoomClient(roomId, roomName, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap);

        //If not, only swap the room
        } else {
            this.currentRoom.swapRoom(roomId, roomName, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap);
            this.currentRoom.enterParticipant(this.ownParticipant);
            this.switchRoomGameView();
        }
    }

    /**
     * updates own avatar position
     * 
     * @param {Object} posInfo position information
     */
    handleFromServerUpdatePosition = function (posInfo) {

        TypeChecker.isInstanceOf(posInfo, Object);
        TypeChecker.isInt(posInfo.cordX);
        TypeChecker.isInt(posInfo.cordY);
        TypeChecker.isEnumOf(posInfo.dir, Direction);

        var posUpdate = new PositionClient(posInfo.cordX, posInfo.cordY);
        var dirUpdate = posInfo.dir;

        this.ownParticipant.setPosition(posUpdate);
        this.ownParticipant.setDirection(dirUpdate);
        this.gameView.updateOwnAvatarPosition(posUpdate);
        this.gameView.updateOwnAvatarDirection(dirUpdate);
    }

    /**
     * Starts movement of other participant
     * 
     * @param {String} ppantID participant ID
     * @param {Direction} direction avatar direction
     * @param {number} newCordX x coordinate
     * @param {number} newCordY y coordinate
     */
    handleFromServerStartMovementOther = function (ppantID, direction, newCordX, newCordY) {

        TypeChecker.isString(ppantID);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isInt(newCordX);
        TypeChecker.isInt(newCordY);

        let newPos = new PositionClient(newCordX, newCordY);

        this.gameView.updateAnotherAvatarDirection(ppantID, direction);
        this.gameView.updateAnotherAvatarPosition(ppantID, newPos);
        this.gameView.updateAnotherAvatarWalking(ppantID, true);

    }

    /**
     * Stops movement of other participant.
     * 
     * @param {String} ppantID participant ID
     */
    handleFromServerStopMovementOther = function (ppantID) {
        TypeChecker.isString(ppantID);

        this.gameView.updateAnotherAvatarWalking(ppantID, false);
    }

    /**
     * receives lecture informations from server from server
     * 
     * @param {Object} lecture lecture
     * @param {boolean} hasToken true if has token, otherwise false
     * @param {Object[]} letureChat lecture chat
     * @param {boolean} isOrator true if is orator of this lecture, otherwise false
     * @param {boolean} isModerator true if is moderator of the conference, otherwise false
     * @param {number} serverTime current server time
     */
    handleFromServerLectureEntered = function (lecture, hasToken, lectureChat, isOrator, isModerator, serverTime) {
        TypeChecker.isInstanceOf(lecture, Object);
        TypeChecker.isString(lecture.id);
        TypeChecker.isString(lecture.title);
        TypeChecker.isString(lecture.videoId);
        TypeChecker.isNumber(lecture.duration);
        TypeChecker.isString(lecture.remarks);
        TypeChecker.isString(lecture.oratorName);
        /* TypeChecker.isDate(lecture.startingTime); */
        TypeChecker.isInt(lecture.maxParticipants);
        TypeChecker.isBoolean(hasToken);
        TypeChecker.isInstanceOf(lectureChat, Array);
        lectureChat.forEach(msg => {
            TypeChecker.isInstanceOf(msg, Object);
            TypeChecker.isString(msg.senderID);
            TypeChecker.isString(message.username);
            TypeChecker.isInt(message.messageID);
            /* TypeChecker.isDate(message.timestamp); */
        });
        TypeChecker.isBoolean(isModerator);
        TypeChecker.isNumber(serverTime);

        var offset = new Date().getTime() - serverTime;
        this.gameView.updateCurrentLecture(lecture, hasToken, lectureChat, isOrator, isModerator, offset);
    }

    /**
     * receives lecture full information from server
     * 
     * @param {String} lectureId lecture ID
     */
    handleFromServerLectureFull = function (lectureId) {
        TypeChecker.isString(lectureId);
        this.gameView.updateCurrentLectures(lectureId);
    }

    /**
     * receives info that a participant has entered the room
     * 
     * @param {Object} initInfo initial participant info
     */
    handleFromServerRoomEnteredByParticipant = function (initInfo) {

        TypeChecker.isInstanceOf(initInfo, Object);
        TypeChecker.isString(initInfo.id);
        TypeChecker.isString(initInfo.displayName);
        TypeChecker.isInt(initInfo.cordX);
        TypeChecker.isInt(initInfo.cordY);
        TypeChecker.isEnumOf(initInfo.dir, Direction);
        TypeChecker.isBoolean(initInfo.isVisible);
        TypeChecker.isBoolean(initInfo.isModerator);
        TypeChecker.isEnumOf(initInfo.shirtColor, ShirtColor);

        var initPos = new PositionClient(initInfo.cordX, initInfo.cordY);
        var participant = new ParticipantClient(initInfo.id, initInfo.displayName, initPos, initInfo.dir, initInfo.isVisible, initInfo.isModerator, initInfo.shirtColor);
        this.currentRoom.enterParticipant(participant);
        this.gameView.initAnotherAvatarViews(participant);
    }

    /**
     * Removes disconnected Player from Model and View
     * 
     * @param {String} ppantId participant ID
     */
    handleFromServerRemovePlayer = function (ppantId) {
        TypeChecker.isString(ppantId);
        this.currentRoom.exitParticipant(ppantId);
        this.gameView.removeAnotherAvatarViews(ppantId);
    }

    /**
     * get the current lectures from the server to display in the UI for selection
     * 
     * @param {Object[]} lectures current lectures
     */
    handleFromServerCurrentLectures = function (lectures) {
        this.gameView.initCurrentLectures(lectures);
    }

    /**
     * receives video URL from server
     * 
     * @param {String} videoUrl 
     */
    handleFromServerVideoUrl = function (videoUrl) {
        TypeChecker.isString(videoUrl);
        this.gameView.drawVideo(videoUrl);
    }

    /**
     * get the schedule from the server to display in the UI for selection
     * 
     * @param {Object[]} lectures all lectures with the schedule
     * @param {number} serverTime current server time
     */
    handleFromServerCurrentSchedule = function (lectures, serverTime) {
        var offset = new Date().getTime() - serverTime;
        this.gameView.initCurrentSchedule(lectures, offset);
    }

    /**
     * Is called after server send the answer of avatarclick
     * 
     * @param {Object} businessCardObject business card
     * @param {number} rank rank
     * @param {boolean} isModerator true if moderator, otherwise false
     */
    handleFromServerBusinessCard = function (businessCardObject, rank, isModerator) {

        let businessCard = new BusinessCardClient(businessCardObject.id, businessCardObject.username,
            businessCardObject.forename, businessCardObject.title, businessCardObject.surname,
            businessCardObject.job, businessCardObject.company, businessCardObject.email);

        //check if ppant is a friend or not
        if (businessCard.getEmail() === undefined) {
            this.gameView.initBusinessCardView(businessCard, false, rank, isModerator);
        } else {
            //rank is undefined because it is not drawn on friendBusinessCards
            this.gameView.initBusinessCardView(businessCard, true, rank, isModerator);
        }
    }

    /**
     * Server sends friends that can be invited to a group chat
     * 
     * @param {?Object} friendListData friend list data
     * @param {String} groupName chat group name
     * @param {?number} limit group chat limit
     * @param {?String} chatId group chat ID
     */
    handleFromServerInviteFriends = function (friendListData, groupName, limit, chatId) {
        if (friendListData) {
            var friendList = [];
            friendListData.forEach(data => {
                friendList.push(new BusinessCardClient(data.friendId, data.username, data.forename, data.title, data.surname, data.job, data.company, data.email));
            });
        } else {
            var friendList = undefined;
        }

        TypeChecker.isString(groupName);

        if (limit)
            TypeChecker.isInt(limit)
        if (chatId)
            TypeChecker.isString(chatId);

        this.gameView.initInviteFriendsView(friendList, groupName, limit, chatId);
    }

    /**
     * Is called after server send the answer of friendlistclick
     * 
     * @param {Object} friendListData friend list
     */
    handleFromServerFriendList = function (friendListData) {
        var friendList = [];
        friendListData.forEach(data => {
            friendList.push(new BusinessCardClient(data.friendId, data.username, data.forename, data.title, data.surname, data.job, data.company, data.email));
        });
        this.gameView.initFriendListView(friendList);
    }

    /**
     * Is called after server send the answer of friendrequestlistclick
     * 
     * @param {Object} friendRequestListData friend request list
     */
    handleFromServerFriendRequestList = function (friendRequestListData) {
        var friendRequestList = [];
        friendRequestListData.forEach(data => {
            friendRequestList.push(new BusinessCardClient(data.friendId, data.username, data.forename, data.title, data.surname, data.job, data.company, data.email));
        });

        this.gameView.initFriendRequestListView(friendRequestList);
    }

    /**
     * Is called after new friend request is confirmed from server
     * 
     * @param {Object} data business card of the requester
     * @param {String} chatId chat ID with the requester
     */
    handleFromServerNewFriendRequest = function (data, chatId) {
        var friendRequest = new BusinessCardClient(data.friendId, data.username, data.forename, data.title, data.surname, data.job, data.company, data.email);
        this.gameView.addFriendRequest(friendRequest);
        this.gameView.updateChatThread(chatId, false, true);
        this.gameView.drawNewFriendRequest(data.username);
    }

    /**
     * Is called after accepted friend request is confirmed from server
     * 
     * @param {Object} data friend business card
     * @param {String} chatId chat ID with this friend
     */
    handleFromServerAcceptedFriendRequest = function (data, chatId) {
        var friend = new BusinessCardClient(data.friendId, data.username, data.forename, data.title, data.surname, data.job, data.company, data.email);
        this.gameView.addFriend(friend);
        this.gameView.updateChatThread(chatId, true, false);
        this.gameView.drawNewFriend(data.username);
    }

    /**
     * Is called after rejected friend request is confirmed from server
     * 
     * @param {String} chatId chat ID with this participant
     */
    handleFromServerRejectedFriendRequest = function (chatId) {
        TypeChecker.isString(chatId);
        this.gameView.updateChatThread(chatId, false, false);
    }

    /**
     * Is called to remove a friend request from the request list, e.g: When that ppant deleted his acc
     * 
     * @param {String} ppantId ppant Id
     */
    handleFromServerRemoveFriendRequest = function (ppantId) {
        TypeChecker.isString(ppantId);
        this.gameView.updateFriendRequestListView(ppantId, false);
    }

    /**
     * Is called after removing friend is confirmed from server to update friend list
     * 
     * @param {String} friendId old friend ID
     */
    handleFromServerRemovedFriendUpdateFriendList = function (friendId) {
        TypeChecker.isString(friendId);
        this.gameView.removeFriend(friendId);
    }

    /**
     * Is called after removing friend is confirmed from server to update one to one chat with that ppant
     * 
     * @param {String} chatId chat ID with this participant
     */
    handleFromServerRemovedFriendUpdateChatThread = function (chatId) {
        TypeChecker.isString(chatId);
        this.gameView.updateChatThread(chatId, false, false);
    }

    /**
     * Is called after server sends the answer of ranklistclick
     * 
     * @param {Object} rankList rank list
     * @param {Boolean} emptyRankList if rank list should be emptied
     */
    handleFromServerRankList = function (rankList, emptyRankList) {
        this.gameView.initRankListView(rankList, this.ownBusinessCard.getUsername(), emptyRankList);
    }

    /**
     * Is called after server send the answer of group chat participant list click
     * 
     * @param {String} chatId chat id
     * @param {String[]} usernames list of usernames
     */
    handleFromServerChatParticipantList = function (chatId, usernames) {
        TypeChecker.isString(chatId);
        TypeChecker.isInstanceOf(usernames, Array);
        usernames.forEach(username => {
            TypeChecker.isString(username);
        })
        this.gameView.drawChatParticipantList(chatId, usernames);
    }

    /**
     * Receives from server to add participant to chat participant list
     * 
     * @param {String} chatId chat id
     * @param {String} username username
     */
    handleFromServerAddToChatParticipantList = function (chatId, username) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(username);
        this.gameView.addToChatParticipantList(chatId, username);
    }

    /**
     * Receives from server to remove participant from chat participant list
     * 
     * @param {String} chatId chat id
     * @param {String} username username
     */
    handleFromServerRemoveFromChatParticipantList = function (chatId, username) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(username);
        this.gameView.removeFromChatParticipantList(chatId, username);
    }

    /**
     * Receives from server to add participant to invite friends
     * 
     * @param {?Object} data participant's business card
     * @param {boolean} hasLeftChat true if participant has left the chat
     */
    handleFromServerAddToInviteFriends = function (data, hasLeftChat) {
        if (data) {
            var businessCard = new BusinessCardClient(data.friendId, data.username, data.forename, data.title, data.surname, data.job, data.company, data.email);
        } else
            var businessCard = undefined;

        TypeChecker.isBoolean(hasLeftChat);
        this.gameView.addToInviteFriends(businessCard, hasLeftChat);
    }

    /**
     * Receives from server to remove participant from invite friends
     * 
     * @param {?String} participantId participant ID
     * @param {boolean} isMemberOfChat true if participant is now member of chat
     */
    handleFromServerRemoveFromInviteFriends = function (participantId, isMemberOfChat) {
        if (participantId)
            TypeChecker.isString(participantId);

        TypeChecker.isBoolean(isMemberOfChat);
        this.gameView.removeFromInviteFriends(participantId, isMemberOfChat);
    }

    /**
     * Receives from server to add a new message to the allchat 
     * 
     * @param {Object} message allchat message
     */
    handleFromServerNewAllchatMessage = function (message) {
        this.gameView.appendAllchatMessage(message, this.ownBusinessCard.getUsername());
    }

    /**
     * Receives from server to add a new message to the lecture 
     * 
     * @param {Object} message lecture chat message
     */
    handleFromServerNewLectureChatMessage = function (message) {
        this.gameView.appendLectureChatMessage(message, this.ownBusinessCard.getUsername());
    }

    /**
     * Receives from server to update messages in the lecture 
     * 
     * @param {Object} messages lecture chat messages
     */
    handleFromServerUpdateLectureChat = function (messages) {
        this.gameView.updateLectureChat(messages, this.ownBusinessCard.getUsername());
    };

    /**
     * Receives from server to update participant's token
     * 
     * @param {boolean} hasToken true if has token, otherwise false
     */
    handleFromServerUpdateToken = function (hasToken) {
        TypeChecker.isBoolean(hasToken);
        this.gameView.updateLectureToken(hasToken);
    };

    /**
     * Receives from server to force close lecture
     */
    handleFromServerForceCloseLecture = function () {
        this.gameView.closeLectureView();
    };

    /**
     * Receives from server to update points
     * 
     * @param {number} points points
     * @param {?number} rank rank
     */
    handleFromServerUpdatePoints = function (points) {
        TypeChecker.isInt(points);
        this.gameView.updatePoints(points);
    }

    /**
     * Receives from server to update rank
     * 
     * @param {?number} rank rank
     */
    handleFromServerUpdateRank = function (rank) {
        if (rank) {
            TypeChecker.isInt(rank);
        }
        this.gameView.updateRank(rank);
    }

    /**
     * Called when a new room is entered.
     * 
     * @param {{senderId: String, timestamp: String, text: String}} messages allchat messages
     */
    handleFromServerInitAllchat = function (messages) {
        this.gameView.initAllchatView(this.currentRoom.getRoomName(), messages, this.ownBusinessCard.getUsername());
    }

    /**
     * Receives from server a new notification where a normal sized global chat view is needed
     * 
     * @param {String} messageHeader message header
     * @param {String[]} messageText message text
     */
    handleFromServerNewNotification = function (messageHeader, messageText) {
        TypeChecker.isString(messageHeader);
        if (messageText instanceof Array) {
            TypeChecker.isInstanceOf(messageText, Array);
            messageText.forEach(line => {
                TypeChecker.isString(line);
            });
        } else {
            TypeChecker.isString(messageText);
        }
        this.gameView.initGlobalChatView(messageHeader, messageText);
    }

    /**
     * Receives from server a new notification where a larger global chat view is needed
     * 
     * @param {String} messageHeader message header
     * @param {String[]} messageText message text
     */
    handleFromServerNewLargerNotification = function (messageHeader, messageText) {
        TypeChecker.isString(messageHeader);
        if (messageText instanceof Array) {
            TypeChecker.isInstanceOf(messageText, Array);
            messageText.forEach(line => {
                TypeChecker.isString(line);
            });
        } else {
            TypeChecker.isString(messageText);
        }
        this.gameView.initLargerGlobalChatView(messageHeader, messageText);
    }

    /**
     * Receives from server for a new global announcement
     * 
     * @param {String} moderatorUsername moderator username
     * @param {String} messageText message text
     */
    handleFromServerNewGlobalAnnouncement = function (moderatorUsername, messageText) {
        TypeChecker.isString(moderatorUsername);
        TypeChecker.isString(messageText);
        var timestamp = new DateParser().parseOnlyTime(new Date());
        var messageHeader = "On " + timestamp + " moderator " + moderatorUsername + " announced:";
        this.gameView.initGlobalChatView(messageHeader, messageText);
    }

    /**
     * Receives from server to hide avatar
     * 
     * @param {String} participantId participant ID
     */
    handleFromServerHideAvatar = function (participantId) {
        TypeChecker.isString(participantId);
        this.gameView.hideAvatar(participantId);
    }

    /**
     * Receives from server to show avatar
     * 
     * @param {String} participantId participant ID
     */
    handleFromServerShowAvatar = function (participantId) {
        TypeChecker.isString(participantId);
        this.gameView.showAvatar(participantId);
    }

    /**
     * Receives from server that client has been removed from the conference
     */
    handleFromServerRemoved = function () {
        $("#windowHTML").show();
        $('#viewBlocker').show();
    };

    /**
     * Receives from server after clicking achievements
     * 
     * @param {Object[]} achievements achievements
     */
    handleFromServerAchievements = function (achievements) {
        this.gameView.initCurrentAchievementsView(achievements);
    }

    /**
     * Receives from server after clicking a NPC
     * 
     * @param {String} name NPC name
     * @param {String[]} story NPC story
     * @param {number} npcId NPC id
     */
    handleFromServerShowNPCStory = function (name, story, npcId) {
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(story, Array);
        story.forEach(element => {
            TypeChecker.isString(element);
        })
        this.gameView.initNPCStoryView(name, story, npcId.toString());
    }

    /**
     * Receives from server on a new achievement
     * 
     * @param {Object} achievement achievement
     */
    handleFromServerNewAchievement = function (achievement) {
        this.gameView.handleNewAchievement(achievement);
    }

    /**
     * Receives from server after clicking jitsi meeting list
     * 
     * @param {Object[]} meetings jitsi meeting list
     */
    handleFromServerShowMeetingList = function (meetings) {
        this.gameView.initMeetingListView(meetings);
    };

    /**
     * Receives from server after clicking chat list
     * 
     * @param {Object[]} chats chat list
     */
    handleFromServerShowChatList = function (chats) {
        this.gameView.initChatListView(chats, this.ownBusinessCard.getUsername());
    };

    /**
     * Receives from server after clicking a chat in the chat list
     * 
     * @param {Object} chat chat
     */
    handleFromServerShowChatThread = function (chat) {
        this.gameView.initChatThreadView(chat, true, this.ownBusinessCard.getUsername());
    };

    /**
     * Receives from server that a new chat has been created
     * 
     * @param {Object} chat chat
     * @param {boolean} openNow true if chat thread should be opened now, otherwise false
     */
    handleFromServerNewChat = function (chat, openNow) {
        this.gameView.addNewChat(chat, openNow, this.ownBusinessCard.getUsername());
    };

    /**
     * Receives from server that a new meeting has been created
     * 
     * @param {Object} meeting meeting
     */
    handleFromServerNewMeeting = function (meeting) {
        TypeChecker.isInstanceOf(meeting, Object);
        TypeChecker.isString(meeting.id);
        TypeChecker.isString(meeting.domain);
        TypeChecker.isString(meeting.name);
        TypeChecker.isString(meeting.password);

        this.gameView.addNewMeeting(meeting);
    };

    /**
     * Receives chat meeting data from server
     * 
     * @param {Object} meeting meeting 
     */
    handleFromServerChatMeeting = function (meeting) {
        TypeChecker.isInstanceOf(meeting, Object);
        TypeChecker.isString(meeting.id);
        TypeChecker.isString(meeting.domain);
        TypeChecker.isString(meeting.name);
        TypeChecker.isString(meeting.password);

        this.handleFromViewJoinMeeting(meeting);
    }

    /**
     * Receives from server that user got a new meeting, view should draw notification
     * 
     * @param {String} meetingName meeting name
     * @param {String} meetingID meeting ID
     */
    handleFromServerGotNewMeeting = function (meetingName, meetingID) {
        TypeChecker.isString(meetingName);
        TypeChecker.isString(meetingID);

        this.gameView.drawNewMeeting(meetingName, meetingID);
    }

    /**
     * Receives from server that user got a new chat
     * 
     * @param {String} senderUsername chat sender username
     * @param {String} chatId chat ID
     */
    handleFromServerGotNewChat = function (senderUsername, chatId) {
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(chatId);

        this.gameView.drawNewChat(senderUsername, chatId);
    }

    /**
     * Receives from server that user is invited to a group chat
     * 
     * @param {String} groupName group chat name
     * @param {String} creatorUsername username of the user that invited this user
     * @param {String} chatId chat ID
     */
    handleFromServerGotNewGroupChat = function (groupName, creatorUsername, chatId) {
        TypeChecker.isString(groupName);
        TypeChecker.isString(creatorUsername);
        TypeChecker.isString(chatId);

        this.gameView.drawNewGroupChat(groupName, creatorUsername, chatId);
    }

    /**
     * Receives from server that user got a new message on an existing chat
     * 
     * @param {String} senderUsername message sender username
     * @param {String} chatId chat ID
     */
    handleFromServerGotNewChatMessage = function (senderUsername, chatId) {
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(chatId);
        this.gameView.drawNewMessage(senderUsername, chatId);
    }

    /**
     * Receives from server a new chat message is created
     * 
     * @param {String} chatId chat ID
     * @param {Object} message chat message
     */
    handleFromServerNewChatMessage = function (chatId, message) {
        this.gameView.addNewChatMessage(chatId, message);
    };

    /**
     * Receives from server that conference is already entered with the same account
     */
    handleFromServerGameEntered = function () {
        alert("You have entered the conference with the same account. Redirect to homepage...")
        var redirect = $('#nav_leave_button').attr('href');
        window.location.href = redirect;
    }

    /**
     * Receives from server that user tries to enter a door where a code is required
     * 
     * @param {String} doorId id of door user tried to enter
     */
    handleFromServerEnterCode = function (doorId) {
        TypeChecker.isString(doorId);
        this.gameView.initEnterCodeWindow(doorId);
    }

    /**
     * Receives from server that your own mod state changed
     * 
     * @param {boolean} modState true if you become a moderator, false otherwise
     */
    handleFromServerChangeYourModState = function (modState) {
        TypeChecker.isBoolean(modState);

        this.gameView.setOwnModState(modState);
        this.ownParticipant.setIsModerator(modState);
    }

    /**
     * Receives from server that an other ppants mod state changed
     * 
     * @param {boolean} modState true if the user becomes a moderator, false otherwise
     * @param {String} ppantID ID of that ppant
     */
    handleFromServerChangeOtherModState = function (modState, ppantID) {
        TypeChecker.isBoolean(modState);
        TypeChecker.isString(ppantID);

        let ppant = this.currentRoom.getParticipant(ppantID);
        if (ppant !== undefined) {
            ppant.setIsModerator(modState);
        }

        this.gameView.setOtherModState(modState, ppantID);
    }

    /**
     * Receives from server that your own shirt color changed
     * 
     * @param {ShirtColor} shirtColor new shirt color
     */
    handleFromServerChangeYourShirtColor = function (shirtColor) {
        TypeChecker.isEnumOf(shirtColor, ShirtColor);

        this.gameView.setOwnShirtColor(shirtColor);
        this.ownParticipant.setShirtColor(shirtColor);
    }

    /**
     * Receives from server that an other ppants shirt color changed
     * 
     * @param {ShirtColor} shirtColor new shirt color
     * @param {String} ppantID ID of that ppant
     */
    handleFromServerChangeOtherShirtColor = function (shirtColor, ppantID) {
        TypeChecker.isEnumOf(shirtColor, ShirtColor);
        TypeChecker.isString(ppantID);

        let ppant = this.currentRoom.getParticipant(ppantID);
        if (ppant !== undefined) {
            ppant.setShirtColor(shirtColor);
        }

        this.gameView.setOtherShirtColor(shirtColor, ppantID);
    }

    /**
     * Receives from server that you joined a group
     * 
     * @param {String} groupName name of joined group
     */
    handleFromServerJoinGroup = function (groupName) {
        TypeChecker.isString(groupName);

        this.gameView.addGroupName(groupName);
    }

    /**
     * Receives from server that you left a group
     * 
     */
    handleFromServerLeaveGroup = function () {
        this.gameView.removeGroupName();
    }

    /**
     * Receives from server that you left a chat
     * 
     * @param {String} chatID chatID of left chat
     */
    handleFromServerLeaveChat = function (chatID) {
        TypeChecker.isString(chatID);

        this.gameView.closeChatThreadView(chatID);
        this.gameView.removeChat(chatID);
    }

    /**
     * Receives from server after clicking an IFrameObject
     * 
     * @param {Object} iFrameData iFrame data object
     * @param {String} iFrameData.title title of iFrame
     * @param {String} iFrameData.url URL of iFrame
     * @param {number} iFrameData.width width of iframe in px
     * @param {number} iFrameData.height height of iframe in px
     * @param {number} gameObjectID GameObject id
     */
    handleFromServerShowExternalWebsite = function (iFrameData, gameObjectID) {
        TypeChecker.isInstanceOf(iFrameData, Object);
        TypeChecker.isString(iFrameData.title);
        TypeChecker.isInt(iFrameData.width);
        TypeChecker.isInt(iFrameData.height);
        TypeChecker.isString(iFrameData.url);
        TypeChecker.isInt(gameObjectID);
        this.gameView.initExternalWebsiteView(iFrameData, gameObjectID.toString());
    }

    /** 
     * Receives from server that you left a meeting
     * 
     * @param {String} meetingID meetingID of left meeting
     */
    handleFromServerLeaveMeeting = function (meetingID) {
        TypeChecker.isString(meetingID);

        this.gameView.removeMeeting(meetingID);
        this.gameView.closeVideoMeetingView(meetingID);
    }

    /*  */
    /*  HANDLE FROM VIEW  */
    /*  */

    /**
     * Sends to server on movement start
     * 
     * @param {Direction} direction movement direction 
     */
    sendToServerRequestMovStart(direction) {
        if (this.socketReady()) {
            TypeChecker.isEnumOf(direction, Direction);
            let currPos = this.gameView.getOwnAvatarView().getGridPosition();
            let currPosX = currPos.getCordX();
            let currPosY = currPos.getCordY();
            this.socket.emit('requestMovementStart', direction, currPosX, currPosY);
        }
    }

    /**
     * Sends to server on movement stop
     */
    sendToServerRequestMovStop() {
        if (this.socketReady()) {
            this.socket.emit('requestMovementStop');
        }
    }

    /**
     * Sends to server on allchat message input
     * 
     * @param {String} text allchat message text
     */
    sendToServerAllchatMessage(text) {
        if (this.socketReady() && this.socket.connected) {
            TypeChecker.isString(text);
            this.socket.emit('sendMessage', text);

            if (!(text.startsWith("\\") && this.ownParticipant.getIsModerator())) {
                this.gameView.showAllchatBox()
            } else if (text.startsWith("\\") && this.ownParticipant.getIsModerator()) {
                this.gameView.saveCommand(text);
            }
        }
        else {
            this.gameView.appendAllchatMessage(this.getSendMessageFailureText(), this.ownBusinessCard.getUsername())
        }            
    }

    /**
     * Sends to server on evaluation input
     * 
     * @param {String} input evaluation input
     */
    sendToServerEvalInput(input) {
        if (this.socketReady() && this.socket.connected) {
            TypeChecker.isString(input)
            this.socket.emit('evalServer', input);
        }
        else {
            this.gameView.appendAllchatMessage(this.getSendMessageFailureText(), this.ownBusinessCard.getUsername())
        }
    }

    /**
     * Sends to server on lecture chat message input
     * 
     * @param {String} text lecture message text
     */
    sendToServerLectureChatMessage(text) {

        if (this.socketReady() && this.socket.connected) {
            TypeChecker.isString(text)
            this.socket.emit('lectureMessage', text);
        }
        else {
            this.gameView.appendLectureChatMessage(this.getSendMessageFailureText(), this.ownBusinessCard.getUsername())
        }    
    }

    /**
     * Sends to server on entering new room
     * 
     * @param {number} targetRoomId target room ID
     */
    handleFromViewEnterNewRoom(targetRoomId) {
        TypeChecker.isInt(targetRoomId);

        if (this.socketReady()) {
            this.socket.emit('enterRoom', targetRoomId);
        }
    }

    /**
     * Sends to server on entering a lecture
     * 
     * @param {String} lectureId lecture ID
     */
    handleFromViewEnterLecture(lectureId) {
        TypeChecker.isString(lectureId);

        if (this.socketReady()) {
            this.socket.emit('enterLecture', lectureId);
        }
    }

    /**
     * Sends to server on leaving a lecture
     * 
     * @param {String} lectureId lecture ID
     */
    handleFromViewLectureLeft(lectureId) {
        TypeChecker.isString(lectureId);

        if (this.socketReady()) {
            this.socket.emit('leaveLecture', lectureId);
        }
    }

    /**
     * Gets video URL from server
     * 
     * @param {String} lectureId lecture ID
     */
    handleFromViewGetVideoUrl(lectureId) {
        TypeChecker.isString(lectureId);

        if (this.socketReady()) {
            this.socket.emit('getVideoUrl', lectureId);
        }
    }

    /**
     * Gets current lectures from server
     */
    handleFromViewGetCurrentLectures() {
        if (this.socketReady()) {
            this.socket.emit('getCurrentLectures');
        }
    }

    /**
     * Gets schedule from server
     */
    handleFromViewShowSchedule() {
        if (this.socketReady()) {
            this.socket.emit('getSchedule');
        }
    }

    /**
     * Gets achievement from server
     */
    handleFromViewShowAchievements() {
        if (this.socketReady()) {
            this.socket.emit('getAchievements');
        }
    }

    /**
     * Gets friend list from server
     */
    handleFromViewShowFriendList() {
        if (this.socketReady()) {
            this.socket.emit('getFriendList');
        }
    }

    /**
     * Gets friend list to be invited to a group chat from server
     * 
     * @param {String} groupName group chat name
     * @param {?String} chatId chat ID
     */
    handleFromViewShowInviteFriends(groupName, chatId) {
        TypeChecker.isString(groupName);

        if (chatId)
            TypeChecker.isString(chatId);

        if (this.socketReady()) {
            this.socket.emit('getInviteFriends', groupName, chatId);
        }
    }

    /**
     * Gets friend request list from server
     */
    handleFromViewShowFriendRequestList() {
        if (this.socketReady()) {
            this.socket.emit('getFriendRequestList');
        }
    }

    /**
     * Sends to server on sending friend request
     * 
     * @param {String} participantRecipientId request recipient ID
     * @param {String} chatId chat ID
     */
    handleFromViewNewFriendRequest(participantRecipientId, chatId) {
        TypeChecker.isString(participantRecipientId);
        TypeChecker.isString(chatId);

        if (this.socketReady()) {
            this.socket.emit('newFriendRequest', participantRecipientId, chatId);
        }
    }

    /**
     * Sends to server after friend request is accepted, and updates view directly
     * 
     * @param {BusinessCardClient} businessCard accepted business card
     */
    handleFromViewAcceptRequest(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCardClient);

        if (this.socketReady()) {
            var participantId = businessCard.getParticipantId();
            TypeChecker.isString(participantId);

            //Tells server to accept this request
            this.socket.emit('handleFriendRequest', participantId, true);
            this.gameView.updateFriendRequestListView(participantId, true);
            this.gameView.addFriend(businessCard);
        }
    }

    /**
     * Sends to server after friend request is declined and updates view directly
     * 
     * @param {String} participantId participant ID
     */
    handleFromViewRejectRequest(participantId) {
        TypeChecker.isString(participantId);

        if (this.socketReady()) {

            //Tells server to reject this request
            this.socket.emit('handleFriendRequest', participantId, false);
            this.gameView.updateFriendRequestListView(participantId, false);
        }
    }

    /**
     * Sends to server after removing friend from friend list and updates view directly
     * 
     * @param {String} friendId old friend ID
     */
    handleFromViewRemoveFriend(friendId) {
        TypeChecker.isString(friendId);

        if (this.socketReady()) {
            this.socket.emit('removeFriend', friendId);
            this.gameView.removeFriend(friendId);
        }
    }

    /**
     * Sends to server after leaving a chat and updates view directly
     * 
     * @param {String} chatId chat ID
     */
    handleFromViewLeaveChat(chatId) {
        TypeChecker.isString(chatId);

        if (this.socketReady()) {
            this.socket.emit('removeParticipantFromChat', chatId);
            this.gameView.removeChat(chatId);
        }
    }

    /**
     * Gets business card from server
     * 
     * @param {String} participantId participant ID
     */
    handleFromViewShowBusinessCard(participantId) {
        TypeChecker.isString(participantId);
        let ppant = this.currentRoom.getParticipant(participantId);
        if (ppant === undefined) {
            throw new Error('Ppant with ' + participantId + ' is not in room');
        }
        if (this.socketReady()) {
            //Emits target ID to server
            this.socket.emit('getBusinessCard', participantId);
        }
    }

    /**
     * Shows profile
     */
    handleFromViewShowProfile() {
        this.gameView.initProfileView(this.ownBusinessCard, this.ownParticipant.getIsModerator());
    }

    /**
     * Gets NPC story from server
     * 
     * @param {number} npcId NPC id
     */
    handleFromViewGetNPCStory(npcId) {        
        this.gameView.addNPCStoryWindow(npcId.toString())

        if (this.socketReady()) {
            this.socket.emit('getNPCStory', npcId);
        }
    }

    /**
     * called from View on IFrame Object click
     * 
     * @param {number} gameObjectID 
     */
    handleFromViewShowExternalWebsiteView(gameObjectID) {
        this.gameView.addExternalWebsiteWindow(gameObjectID.toString());

        if (this.socketReady()) {
            this.socket.emit('getExternalWebsiteData', gameObjectID);
        }
    }

    /**
     * Gets rank list from server
     */
    handleFromViewShowRankList() {
        if (this.socketReady()) {
            this.socket.emit('getRankList');
        }
    }

    /**
     * Gets more rank list data from server
     * 
     * @param {Number} currentRankListLength current rank list length on rank list board
     * @param {Number} lastRank last rank on rank list board
     * @param {Number} lastPoints last points on rank list board
     * @param {Number} lastPointsLength number of participants with last points
     */
    handleFromViewLoadMoreRankList(currentRanklistLength, lastRank, lastPoints, lastPointsLength) {
        if (this.socketReady()) {
            this.socket.emit('getMoreDataRankList', currentRanklistLength, lastRank, lastPoints, lastPointsLength);
        }
    }

    /**
     * Gets the list of chats the user is in - one-on-one and group - from the server. 
     */
    handleFromViewShowChatList() {
        if (this.socketReady()) {
            this.socket.emit('getChatList');
        }
    };

    /**
     * Gets the list of jitsi meetings the user is in from the server. 
     */
    handleFromViewShowMeetingList() {
        if (this.socketReady()) {
            this.socket.emit('getMeetingList');
        }
    };

    /**
     * Requests a personal one-on-one meeting with a moderator 
     */
    handleFromViewRequestModMeeting() {
        if (this.socketReady()) {
            this.socket.emit('requestModMeeting');
        }
    }

    /**
     * Calls the Jitsi-API to join a meeting
     * 
     * @param {Object} meeting joined meeting
     */
    handleFromViewJoinMeeting(meeting) {
        TypeChecker.isInstanceOf(meeting, Object);
        TypeChecker.isString(meeting.id);
        TypeChecker.isString(meeting.domain);
        TypeChecker.isString(meeting.name);
        TypeChecker.isString(meeting.password);

        this.gameView.initVideoMeetingView(meeting, this.displayName);
    }

    /**
     * Gets meeting domain from server
     * @param {String} chatId chat id
     */
    handleFromViewChatMeeting(chatId) {
        TypeChecker.isString(chatId);

        if (this.socketReady()) {
            this.socket.emit('getChatMeetingDomain', chatId);
        }
    }

    /**
     * Draws minimized meeting notif
     * 
     * @param {Object} meeting minimized meeting
     */
    handleFromViewAddMinimizedMeetingNotif(meeting) {
        TypeChecker.isInstanceOf(meeting, Object);
        TypeChecker.isString(meeting.id);
        TypeChecker.isString(meeting.domain);
        TypeChecker.isString(meeting.name);
        TypeChecker.isString(meeting.password);

        this.gameView.drawMinimizedMeetingNotif(meeting);
    }

    /**
     * Removes minimized meeting notif
     * 
     * @param {String} meetingId previous minimized meeting id
     */
     handleFromViewRemoveMinimizedMeetingNotif(meetingId) {
        TypeChecker.isString(meetingId);

        this.gameView.removeMinimizedMeetingNotif(meetingId);
    }

    /**
     * Removes message notif
     * 
     * @param {String} senderUsername message sender username
     * @param {String} chatId chat ID
     */
     handleFromViewRemoveNewMessageNotif(senderUsername, chatId) {
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(chatId);

        this.gameView.removeNewMessageNotif(senderUsername, chatId);
    }

    /**
     * Removes chat notif
     * 
     * @param {String} chatId chat ID
     */
     handleFromViewRemoveNewChatNotif(chatId) {
        TypeChecker.isString(chatId);

        this.gameView.removeNewChatNotif(chatId);
    }

    /**
     * removes group chat notif
     * 
     * @param {String} chatId chat ID
     */
     handleFromViewRemoveNewGroupChatNotif(chatId) {
        TypeChecker.isString(chatId);

        this.gameView.removeNewGroupChatNotif(chatId);
    }

    /**
     * removes meeting notif
     * 
     * @param {String} meetingID meeting ID
     */
    handleFromViewRemoveNewMeetingNotif(meetingID) {
        TypeChecker.isString(meetingID);

        this.gameView.removeNewMeetingNotif(meetingID);
    }

    /**
     * removes new friend request notif
     * 
     * @param {String} senderUsername requester username
     */
     handleFromViewRemoveNewFriendRequestNotif(senderUsername) {
        TypeChecker.isString(senderUsername);

        this.gameView.removeNewFriendRequestNotif(senderUsername);
    }

    /**
     * removes new friend notif
     * 
     * @param {String} friendUsername friend username
     */
     handleFromViewRemoveNewFriendNotif(friendUsername) {
        TypeChecker.isString(friendUsername);

        this.gameView.removeNewFriendNotif(friendUsername);
    }

    /**
     * Gets chat thread from server
     * 
     * @param {String} chatID chat ID
     */
    handleFromViewShowChatThread(chatID) {
        TypeChecker.isString(chatID);
        this.gameView.addChatThreadWindow(chatID)

        if (this.socketReady()) {
            this.socket.emit('getChatThread', chatID);
        }
    };

    /**
     * Gets group chat participant list from server
     * 
     * @param {String} chatId chat ID
     */
    handleFromViewShowChatParticipantList(chatId) {
        TypeChecker.isString(chatId);

        if (this.socketReady()) {
            this.socket.emit('getChatParticipantList', chatId);
        }
    }

    /**
     * Triggers the createNewChat event and emits the id of the other chat participant to the server.
     * 
     * @param {String} participantId participant ID
     */
    handleFromViewCreateNewChat(participantId) {
        TypeChecker.isString(participantId);

        if (this.socketReady()) {
            this.socket.emit('createNewChat', participantId);
        }
    }

    /**
     * Triggers the createNewGroupChat event and emits the group chat name, member list and chat ID to the server
     * 
     * @param {String} chatName group chat name
     * @param {String[]} participantIdList chat member ID list
     * @param {?String} chatId chat ID
     */
    handleFromViewCreateNewGroupChat(chatName, participantIdList, chatId) {
        TypeChecker.isString(chatName);
        TypeChecker.isInstanceOf(participantIdList, Array);
        participantIdList.forEach(ppantId => {
            TypeChecker.isString(ppantId);
        })
        if (chatId)
            TypeChecker.isString(chatId);

        if (this.socketReady()) {
            this.socket.emit('createNewGroupChat', chatName, participantIdList, chatId);
        }
    }

    /**
     * Sends to server on sending a new chat message
     * 
     * @param {String} chatId chat ID
     * @param {String} messageText message text
     */
    handleFromViewSendNewMessage(chatId, messageText) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(messageText);

        if (this.socketReady()) {
            this.socket.emit('newChatMessage', chatId, messageText);
        }
    }

    /**
     * Sends to server to clear interval
     */
    handleFromViewClearInterval() {
        if (this.socketReady()) {
            this.socket.emit('clearInterval');
        }
    }

    /**
     * Sends to server the entered code for door with id doorId
     * 
     * @param {String} doorId 
     * @param {String} enteredCode 
     */
    handleFromViewCodeEntered(doorId, enteredCode) {
        TypeChecker.isString(doorId);
        TypeChecker.isString(enteredCode);

        if (this.socketReady()) {
            this.socket.emit('codeEntered', doorId, enteredCode);
        }
    }

    /**
     * Sends to server request movement start on left arrow down and updates view directly
     */
    handleLeftArrowDown() {
        this.gameView.updateOwnAvatarDirection(Direction.UPLEFT);
        let currPos = this.gameView.getOwnAvatarView().getGridPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() - Settings.MOVEMENTSPEED_Y);
        if (!this.currentRoom.checkForCollision(newPos)) {
            this.ownParticipant.setPosition(newPos);
            this.gameView.updateOwnAvatarPosition(newPos);
            this.gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(Direction.UPLEFT);
    }

    /**
     * Sends to server request movement start on right arrow down and updates view directly
     */
    handleRightArrowDown() {
        this.gameView.updateOwnAvatarDirection(Direction.DOWNRIGHT);
        let currPos = this.gameView.getOwnAvatarView().getGridPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() + Settings.MOVEMENTSPEED_Y);
        if (!this.currentRoom.checkForCollision(newPos)) {
            this.ownParticipant.setPosition(newPos);
            this.gameView.updateOwnAvatarPosition(newPos);
            this.gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(Direction.DOWNRIGHT);
    }

    /**
     * Sends to server request movement start on up arrow down and updates view directly
     */
    handleUpArrowDown() {
        this.gameView.updateOwnAvatarDirection(Direction.UPRIGHT);
        let currPos = this.gameView.getOwnAvatarView().getGridPosition();
        let newPos = new PositionClient(currPos.getCordX() + Settings.MOVEMENTSPEED_X, currPos.getCordY());
        if (!this.currentRoom.checkForCollision(newPos)) {
            this.ownParticipant.setPosition(newPos);
            this.gameView.updateOwnAvatarPosition(newPos);
            this.gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(Direction.UPRIGHT);
    }

    /**
     * Sends to server request movement start on down arrow down and updates view directly
     */
    handleDownArrowDown() {
        this.gameView.updateOwnAvatarDirection(Direction.DOWNLEFT);
        let currPos = this.gameView.getOwnAvatarView().getGridPosition();
        let newPos = new PositionClient(currPos.getCordX() - Settings.MOVEMENTSPEED_X, currPos.getCordY());
        if (!this.currentRoom.checkForCollision(newPos)) {
            this.ownParticipant.setPosition(newPos);
            this.gameView.updateOwnAvatarPosition(newPos);
            this.gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(Direction.DOWNLEFT);
    }

    /**
     * Sends to server to request movement stop on arrow up and updates view directly
     */
    handleArrowUp() {
        this.gameView.updateOwnAvatarWalking(false);
        this.sendToServerRequestMovStop();
    }

    /**
     * Adds invisible, clickable dummy objects to map s.t.
     * larger clickable objects can be clicked everywhere
     * 
     * @param {GameObjectClient[]} listToAddTo dummy objects should
     *                                         be added to same list
     *                                         as parent object
     * @param {String} id same as parent object (to retrieve iFrame
     *                    data)
     * @param {Boolean} isIFrameObject same as parent object
     * @param {Int} cordX x cord of parent object
     * @param {Int} cordY y cord of parent object
     * @param {Int} width width of parent object
     * @param {Int} length length of parent object
     */
    addDummyClickersTo(listToAddTo, id, isIFrameObject, story, cordX, cordY, width, length) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < length; j++) {
                listToAddTo.push(
                    new GameObjectClient(
                        id, 
                        GameObjectType.BLANK,
                        "blank",
                        Settings.SMALL_OBJECT_WIDTH,
                        Settings.SMALL_OBJECT_LENGTH,
                        new PositionClient(cordX + i, cordY + j),
                        true,
                        isIFrameObject,
                        story
                    )
                )
            }
        }
    }
}