//const GameObjectClient = require('../models/GameObjectClient');

if (typeof module === 'object' && typeof exports === 'object') {
    GameView = require('../views/js/GameView')
}

class ClientController {

    #port;
    socket;
    #currentRoom;
    #participantId;
    #ownParticipant;
    #roomClient;
    #ownBusinessCard;

    #gameView;

    /**
     * creates an instance of ClientController only if there is not an instance already.
     * Otherwise the existing instance will be returned.
     * 
     * @param {GameView} gameView 
     * @param {ParticipantClient} participant
     * @param {currentRoom} currentRoom
     * @param {WebSocket} socket
     * @param {number} port
     */


    constructor() { //TODO: instanciate ParticipantClient
        if (!!ClientController.instance) {
            return ClientController.instance;
        }

        ClientController.instance = this;

        this.#gameView = new GameView();

        //TODO: add Participant List from Server
        console.log("fully init cc");
        return this;
    }

    getPort() {
        return this.#port;
    }

    setPort(port) {
        this.#port = port;
    }

    getSocket() {
        return this.socket;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    getCurrentRoom() {
        return this.#currentRoom;
    }

    getGameView() {
        return this.#gameView;
    }


    /* #################################################### */
    /* ###################### SOCKET ###################### */
    /* #################################################### */

    //checks if there is an existing socket. Throws an error if there is no socket.
    socketReady() {
        if (!this.socket) {
            //TODO: exception
        }
        return true;
    }

    /*Initializes the initial view for the player*/
    initGameView() {
        var assetPaths = this.#currentRoom.getAssetPaths();
        var map = this.#currentRoom.getMap();
        var objectMap = this.#currentRoom.getObjectMap();
        var typeOfRoom = this.#currentRoom.getTypeOfRoom();
        var listOfNPCs = this.#currentRoom.getListOfNPCs();

        if (map !== null) {
            this.#gameView.drawStatusBar();
            this.#gameView.initRoomView(assetPaths, map, objectMap, listOfNPCs, typeOfRoom);
        }

        this.#gameView.drawProfileBox(this.#ownParticipant.getUsername())
        this.#gameView.initOwnAvatarView(this.#ownParticipant, typeOfRoom);
        this.#gameView.initCanvasEvents();

        //this.#gameView.initOwnAvatarView(this.#ownParticipant);
        //TODO this.#gameView.initAnotherAvatarViews(participants);

        //Game View is now fully initialised
        this.#gameView.setGameViewInit(true);

    }

    switchRoomGameView() {

        //disables update of gameview
        this.#gameView.setGameViewInit(false);

        var assetPaths = this.#currentRoom.getAssetPaths();
        var map = this.#currentRoom.getMap();
        var objectMap = this.#currentRoom.getObjectMap();
        var typeOfRoom = this.#currentRoom.getTypeOfRoom();
        var listOfNPCs = this.#currentRoom.getListOfNPCs();

        if (map !== null) {
            this.#gameView.initRoomView(assetPaths, map, objectMap, listOfNPCs, typeOfRoom);
        }

        this.#gameView.resetAnotherAvatarViews();
        this.#gameView.updateOwnAvatarRoom(typeOfRoom);
        this.#gameView.initCanvasEvents();
        this.#gameView.setGameViewInit(true);

    }

    /*opens a new socket connection between the client and the server and initializes the events to be handled.
    Throws an error if there is already an existing socket */
    // We also need reconnection handling
    openSocketConnection() {
        if (this.#port && !this.socket) {

            /* WARNING: WEBSOCKETS ONLY CONFIGURATION*/
            /*
            *Arguments prevent initial http polling and start the websocket directly.
            *Without the arguments the client starts a http connection and upgrades later to websocket protocol.
            *This caused a disconnect from the server and therefore a server scrash. 
            */
            this.socket = io({
                transports: ['websocket'],
                upgrade: false,
                'reconnection': true,
                'reconnectionDelay': 0,
                'reconnectionAttempts': 120
            });
            this.socket.on('connect', (socket) => {
                this.#gameView.updateConnectionStatus(ConnectionState.CONNECTED);
                console.log("test connect");
            });

            this.socket.on('disconnect', () => {
                this.#gameView.updateConnectionStatus(ConnectionState.DISCONNECTED);
                this.socket.close();
            });

            this.setUpSocket();
            this.socket.emit('new participant');

        }
        else {
            // TODO: error state
        }
    }

    setUpSocket() {
        console.log("test set up socket");
        this.socket.on('initOwnParticipantState', this.handleFromServerInitOwnParticipant.bind(this));
        //this.socket.on('currentGameStateYourID', this.handleFromServerUpdateID.bind(this)); //First Message from server
        this.socket.on('currentGameStateYourRoom', this.handleFromServerUpdateRoom.bind(this));
        this.socket.on('currentGameStateYourPosition', this.handleFromServerUpdatePosition.bind(this)); //Called when server wants to update your position
        this.socket.on('roomEnteredByParticipant', this.handleFromServerRoomEnteredByParticipant.bind(this));
        //this.socket.on('collisionDetetcionAnswer', this.handleFromServerCollisionDetectionAnswer.bind(this));
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
        this.socket.on('updateLectureChat', this.handleFromServerUpdateLectureChat.bind(this));
        this.socket.on('update token', this.handleFromServerUpdateToken.bind(this));
        this.socket.on('force close lecture', this.handleFromServerForceCloseLecture.bind(this));
        this.socket.on('New global message', this.handleFromServerNewGlobalMessage.bind(this));
        this.socket.on('New global announcement', this.handleFromServerNewGlobalAnnouncement.bind(this));
        this.socket.on('remove yourself', this.handleFromServerRemoved.bind(this));
        this.socket.on('hideAvatar', this.handleFromServerHideAvatar.bind(this));
        this.socket.on('showAvatar', this.handleFromServerShowAvatar.bind(this));
        this.socket.on('achievements', this.handleFromServerAchievements.bind(this));
        this.socket.on('updateSuccessesBar', this.handleFromServerUpdateSuccessesBar.bind(this));
        this.socket.on('acceptedFriendRequest', this.handleFromServerAcceptedFriendRequest.bind(this));
        this.socket.on('rejectedFriendRequest', this.handleFromServerRejectedFriendRequest.bind(this));
        this.socket.on('removedFriend', this.handleFromServerRemovedFriend.bind(this));
        this.socket.on('showNPCStory', this.handleFromServerShowNPCStory.bind(this));
        this.socket.on('chatParticipantList', this.handleFromServerChatParticipantList.bind(this))
        this.socket.on('gameEntered', this.handleFromServerGameEntered.bind(this));
        this.socket.on('gotNewChat', this.handleFromServerGotNewChat.bind(this));
        this.socket.on('gotNewGroupChat', this.handleFromServerGotNewGroupChat.bind(this));
        this.socket.on('gotNewChatMessage', this.handleFromServerGotNewChatMessage.bind(this));
        this.socket.on('evalAnswer', function (data) {   //Displays evaluated input.
            console.log(data);
        });
        this.socket.on('newChat', this.handleFromServerNewChat.bind(this));
        this.socket.on('newAchievement', this.handleFromServerNewAchievement.bind(this));
        this.socket.on('newFriendRequestReceived', this.handleFromServerNewFriendRequest.bind(this));
        this.socket.on('chatList', this.handleFromServerShowChatList.bind(this));
        this.socket.on('chatThread', this.handleFromServerShowChatThread.bind(this));
        this.socket.on('newChatMessage', this.handleFromServerNewChatMessage.bind(this));
        this.socket.on('inviteFriends', this.handleFromServerInviteFriends.bind(this));
    }

    /* #################################################### */
    /* #################### EDIT VIEW ##################### */
    /* #################################################### */

    updateGame() {

        this.#gameView.update()
        this.#gameView.draw();
    }

    /* #################################################### */
    /* ################## SEND TO SERVER ################## */
    /* #################################################### */

    //asks the server for an update of the current game state
    requestGameStateUpdate() {
        if (this.socketReady())
            this.socket.emit('requestGameStateUpdate');
    }

    sendToServerRequestMovStart(direction) {

        if (this.socketReady()) {
            TypeChecker.isEnumOf(direction, Direction);
            let currPos = this.#gameView.getOwnAvatarView().getPosition();
            let currPosX = currPos.getCordX();
            let currPosY = currPos.getCordY();
            let participantId = this.#ownParticipant.getId();
            console.log("request mov start " + this.#ownParticipant.getId());
            this.socket.emit('requestMovementStart', participantId, direction, currPosX, currPosY);
        }
    }

    sendToServerRequestMovStop() {

        this.socketReady;
        let participantId = this.#ownParticipant.getId();

        this.socket.emit('requestMovementStop', participantId);

    }

    sendToServerAllchatMessage(text) {

        this.socketReady;
        if (this.socket.connected)
            this.socket.emit('sendMessage', this.#ownParticipant.getId(), text);
        else
            $('#allchatMessages').prepend($('<div>').text("Failed to send message. No connection to the server."));

    }

    sendToServerEvalInput(input) {

        this.socketReady;
        if (this.socket.connected)
            this.socket.emit('evalServer', input);
        else
            $('#allchatMessages').prepend($('<div>').text("Failed to send input. No connection to the server."));

    }

    sendToServerLectureChatMessage(text, lectureId) {
        this.socketReady;
        if (this.socket.connected)
            this.socket.emit('lectureMessage', this.#ownParticipant.getId(), this.#ownParticipant.getUsername(), text, lectureId);
        else
            $('#allchatMessages').prepend($('<div>').text("Failed to send message. No connection to the server."));

    }

    /* #################################################### */
    /* ############### RECEIVE FROM SERVER ################ */
    /* #################################################### */


    //Second message from server, gives you information of starting position, business card and participant id
    //After that, there is everything to init the game view
    handleFromServerInitOwnParticipant(initInfo) {
        var initPos = new PositionClient(initInfo.cordX, initInfo.cordY);

        this.#ownBusinessCard = new BusinessCardClient(
            initInfo.businessCard.id,
            initInfo.businessCard.username,
            initInfo.businessCard.title,
            initInfo.businessCard.surname,
            initInfo.businessCard.forename,
            initInfo.businessCard.job,
            initInfo.businessCard.company,
            initInfo.businessCard.email
        );

        this.#ownParticipant = new ParticipantClient(
            initInfo.id,
            this.#ownBusinessCard.getUsername(),
            initPos,
            initInfo.dir
        );
        this.#currentRoom.enterParticipant(this.#ownParticipant);
        this.initGameView();

    }
    /**
     * Not used.
     *  
     */
    //First Message from Server, gives you your ID
    /*handleFromServerUpdateID(id) {
        console.log("test update id");
        

        this.#participantId = id;
        console.log(this.#participantId);
    }*/

    //Third message from Server, gives you information of starting room
    handleFromServerUpdateRoom(roomId, typeOfRoom, assetPaths, listOfMapElementsData, listOfGameObjectsData, npcData, doorData, width, length) {

        //tranform MapElements to GameObjectClients
        var listOfMapElements = [];
        listOfMapElementsData.forEach(mapElement => {
            listOfMapElements.push(new GameObjectClient(mapElement.id, mapElement.type, mapElement.name, mapElement.width, mapElement.length,
                new PositionClient(mapElement.cordX, mapElement.cordY), mapElement.isSolid, false))
        });

        //transform GameObjects to GameObjectClients
        var listOfGameObjects = [];
        listOfGameObjectsData.forEach(element => {
            listOfGameObjects.push(new GameObjectClient(element.id, element.type, element.name, element.width, element.length,
                new PositionClient(element.cordX, element.cordY), element.isSolid, false));
        });

        //transform NPCs to NPCClients
        var listOfNPCs = [];
        npcData.forEach(npc => {
            console.log("npc: " + npc.cordX + " " +  npc.cordY)
            listOfNPCs.push(new NPCClient(npc.id, npc.name, new PositionClient(npc.cordX, npc.cordY), npc.direction));
        });

        //transform Doors to DoorClients
        var listOfDoors = [];
        doorData.forEach(door => {
            listOfDoors.push(new DoorClient(door.id, door.typeOfDoor, door.name, new PositionClient(door.cordX, door.cordY), true, door.targetRoomId));
        });

        //First room? 
        if (!this.#currentRoom) {
            this.#currentRoom = new RoomClient(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length);

            //If not, only swap the room
        } else {
            this.#currentRoom.swapRoom(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length);
            this.#currentRoom.enterParticipant(this.#ownParticipant);
            this.switchRoomGameView();
        }
    }

    //updates own avatar position
    handleFromServerUpdatePosition(posInfo) {
        var posUpdate = new PositionClient(posInfo.cordX, posInfo.cordY);
        var dirUpdate = posInfo.dir;

        this.#ownParticipant.setPosition(posUpdate);
        this.#ownParticipant.setDirection(dirUpdate);
        this.#gameView.updateOwnAvatarPosition(posUpdate);
        this.#gameView.updateOwnAvatarDirection(dirUpdate);

        console.log("test finish update pos");
    }

    //Server does collision testing, so this method is only called when movement from other user is legit (P)
    handleFromServerStartMovementOther(ppantID, direction, newCordX, newCordY) {

        TypeChecker.isString(ppantID);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isInt(newCordX);
        TypeChecker.isInt(newCordY);

        let newPos = new PositionClient(newCordX, newCordY);
        console.log("mov other: " + ppantID);

        this.#gameView.updateAnotherAvatarDirection(ppantID, direction);
        this.#gameView.updateAnotherAvatarPosition(ppantID, newPos);
        this.#gameView.updateAnotherAvatarWalking(ppantID, true);

    }

    handleFromServerStopMovementOther(ppantID) {
        // TODO:
        // Typechecking
        // comparing position with the one saved in the server

        this.#gameView.updateAnotherAvatarWalking(ppantID, false);
    }

    handleFromServerLectureEntered(lecture, hasToken, lectureChat) {
        this.#gameView.updateCurrentLecture(lecture, hasToken, lectureChat);
    }

    handleFromServerLectureFull(lectureId) {
        this.#gameView.updateCurrentLectures(lectureId);
    }

    /* TODO
     * Change argument from object into list (nicer to read)
     * - (E) */
    handleFromServerRoomEnteredByParticipant(initInfo) {

        console.log("test enter new ppant");
        //var entrancePosition = this.#currentRoom; //TODO .getEntrancePosition
        //var entranceDirection = this.#currentRoom;//TODO .getEntranceDirection

        var initPos = new PositionClient(initInfo.cordX, initInfo.cordY);
        console.log("init info id" + initInfo.id);
        var participant = new ParticipantClient(initInfo.id, initInfo.username, initPos, initInfo.dir);
        console.log(" get id " + participant.getId());
        this.#currentRoom.enterParticipant(participant);
        // the following line throws the same error as in the above method
        this.#gameView.initAnotherAvatarViews(participant, this.#currentRoom.getTypeOfRoom());
    }

    /*
    // Wird das noch gebraucht, wenn die collisionDetection nur client-seitig existiert? (E)
    handleFromServerCollisionDetectionAnswer(isOccupied) {
        if (isOccupied) {
            //TODO: Bewegung wird nicht zugelassen
        } else {
            //TODO: Avatar wird bewegt
        }
    }
    */

    // Removes disconnected Player from Model and View (P)
    handleFromServerRemovePlayer(ppantId) {
        //TypeChecker.isString(ppantId);

        this.#currentRoom.exitParticipant(ppantId);


        this.#gameView.removeAnotherAvatarViews(ppantId);

    }


    // get the current lectures from the server to display in the UI for selection
    handleFromServerCurrentLectures(lectures) {
        this.#gameView.initCurrentLectures(lectures);
    }

    handleFromServerCurrentSchedule(lectures) {
        this.#gameView.initCurrentSchedule(lectures);
    }

    //Is called after server send the answer of avatarclick
    handleFromServerBusinessCard(businessCardObject, rank) {
        let businessCard = new BusinessCardClient(businessCardObject.id, businessCardObject.username,
            businessCardObject.title, businessCardObject.surname, businessCardObject.forename,
            businessCardObject.job, businessCardObject.company, businessCardObject.email);

        //check if ppant is a friend or not
        if (businessCard.getEmail() === undefined) {
            this.#gameView.initBusinessCardView(businessCard, false, rank);
        } else {
            this.#gameView.initBusinessCardView(businessCard, true, rank);
        }
    }

    handleFromServerInviteFriends(friendListData, groupName, limit, chatId) {
        var friendList = [];
        friendListData.forEach(data => {
            friendList.push(new BusinessCardClient(data.friendId, data.username, data.title, data.surname, data.forename, data.job, data.company, data.email));
        });
        this.#gameView.initInviteFriendsView(friendList, groupName, limit, chatId);
    }

    //Is called after server send the answer of friendlistclick
    handleFromServerFriendList(friendListData) {
        var friendList = [];
        friendListData.forEach(data => {
            friendList.push(new BusinessCardClient(data.friendId, data.username, data.title, data.surname, data.forename, data.job, data.company, data.email));
        });
        this.#gameView.initFriendListView(friendList);
    }

    //Is called after server send the answer of friendrequestlistclick
    handleFromServerFriendRequestList(friendRequestListData) {
        var friendRequestList = [];
        friendRequestListData.forEach(data => {
            friendRequestList.push(new BusinessCardClient(data.friendId, data.username, data.title, data.surname, data.forename, data.job, data.company, data.email));
        });

        this.#gameView.initFriendRequestListView(friendRequestList);
    }

    handleFromServerNewFriendRequest(data, chatId) {
        var friendRequest = new BusinessCardClient(data.friendId, data.username, data.title, data.surname, data.forename, data.job, data.company, data.email);
        this.#gameView.addFriendRequest(friendRequest);
        this.#gameView.updateChatThread(chatId, false, true);
        this.#gameView.drawNewFriendRequest(data.username);
    }

    handleFromServerAcceptedFriendRequest(data, chatId) {
        var friend = new BusinessCardClient(data.friendId, data.username, data.title, data.surname, data.forename, data.job, data.company, data.email);
        this.#gameView.addFriend(friend);
        this.#gameView.updateChatThread(chatId, true, false);
        this.#gameView.drawNewFriend(data.username);
    }

    handleFromServerRejectedFriendRequest(chatId) {
        this.#gameView.updateChatThread(chatId, false, false);
    }

    handleFromServerRemovedFriend(friendId, chatId) {
        this.#gameView.removeFriend(friendId);
        this.#gameView.updateChatThread(chatId, false, false);
    }

    handleFromServerRankList(rankList) {
        //remark own participant's ranking
        let idx = rankList.findIndex(ppant => ppant.participantId === this.#ownParticipant.getId());
        if (idx > -1) {
            rankList[idx].self = true;
        }
        this.#gameView.initRankListView(rankList);
    }

    handleFromServerChatParticipantList(usernames) {
        this.#gameView.drawChatParticipantList(usernames);
    }

    // Adds a new message to the all-chat
    handleFromServerNewAllchatMessage(message) {
        var timestamp = new DateParser(new Date(message.timestamp)).parseOnlyTime();
        var msgText = "[" + timestamp + "] " + message.username + ": " + message.text;
        $('#allchatMessages').prepend($('<div>').text(msgText));
        $('#allchatMessages').scrollTop(0);
    }

    handleFromServerNewLectureChatMessage(message) {
        var timestamp = new DateParser(new Date(message.timestamp)).parseOnlyTime();
        var messageHeader = message.username + ", " + timestamp + ":";
        var $newMessageHeader = $("<div style='font-size: small;'></div>");
        var $newMessageBody = $("<div style='font-size: medium;'></div>");
        $newMessageHeader.text(messageHeader);
        $newMessageBody.text(message.messageText);
        $('#lectureChatMessages').append($newMessageHeader);
        $('#lectureChatMessages').append($newMessageBody);
    }

    handleFromServerUpdateLectureChat(messages) {
        console.log("update message test 0");
        this.#gameView.updateLectureChat(messages);
    };

    handleFromServerUpdateToken(hasToken) {
        this.#gameView.updateLectureToken(hasToken);
    };

    handleFromServerForceCloseLecture() {
        this.#gameView.closeLectureView();
    };

    handleFromServerUpdateSuccessesBar(points, rank) {
        if (points) {
            TypeChecker.isInt(points);
        }

        if (rank) {
            TypeChecker.isInt(rank);
        }

        this.#gameView.updateSuccessesBar(points, rank);
    }

    // Called when a new room is entered.
    // The argument is an array of objects of the following structure:
    // { senderID: <String>, timestamp: <String>, text: <String> }
    handleFromServerInitAllchat(messages) {
        $('#allchatMessages').empty();
        messages.forEach((message) => {
            var timestamp = new DateParser(new Date(message.timestamp)).parseOnlyTime();
            $('#allchatMessages').prepend($('<div>').text("[" + timestamp + "] " + message.username + ": " + message.text));
        });
        $('#allchatMessages').scrollTop(0);
    }

    handleFromServerNewGlobalMessage(messageHeader, messageText) {
        this.#gameView.initGlobalChatView(messageHeader, messageText);
    }

    handleFromServerNewGlobalAnnouncement(moderatorUsername, message) {
        var timestamp = new DateParser(new Date(message.timestamp)).parseOnlyTime();
        var messageHeader = "On " + timestamp + " moderator " + moderatorUsername + " announced:";
        this.#gameView.initGlobalChatView(messageHeader, message.text);
    }

    handleFromServerHideAvatar(participantId) {
        this.#gameView.hideAvatar(participantId);
    }

    handleFromServerShowAvatar(participantId) {
        this.#gameView.showAvatar(participantId);
    }

    handleFromServerRemoved() {
        $('#viewBlocker').show();
    };

    handleFromServerShowNPCStory(name, story) {
        this.#gameView.initNPCStoryView(name, story);
    }

    handleFromServerNewAchievement(achievement) {
        this.#gameView.handleNewAchievement(achievement);
    }

    handleFromServerShowChatList(chats) {
        this.#gameView.initChatListView(chats);
    };

    handleFromServerShowChatThread(chat) {
        //console.log(JSON.stringify(chat));
        this.#gameView.initChatThreadView(chat, true);
    };

    /* This function is called when another user creates a new chat
     * with out user in it, ONCE THE FIRST MESSAGE HAS BEEN POSTED 
     * INTO THAT CHAT (or if a friend request has been send).
     * - (E) */
    handleFromServerNewChat(chat, openNow) {
        this.#gameView.addNewChat(chat, openNow);
    };

    handleFromServerGotNewChat(senderUsername) {
        this.#gameView.drawNewChat(senderUsername);
    }

    handleFromServerGotNewGroupChat(groupName, creatorUsername) {
        this.#gameView.drawNewGroupChat(groupName, creatorUsername);
    }

    handleFromServerGotNewChatMessage(senderUsername) {
        this.#gameView.drawNewMessage(senderUsername);
    }

    //This function is called when a new chat message is created in either OneToOneChat or GroupChat.
    handleFromServerNewChatMessage(chatId, message) {
        this.#gameView.addNewChatMessage(chatId, message);
    };

    handleFromServerGameEntered() {
        alert("You have entered the conference with the same account. Redirect to homepage...")
        var redirect = $('#nav_leave_button').attr('href');
        window.location.href = redirect;
    }

    /* #################################################### */
    /* ################# HANDLE FROM VIEW ################# */
    /* #################################################### */

    handleFromViewEnterNewRoom(targetRoomId) {
        this.socketReady;
        this.socket.emit('enterRoom', this.#ownParticipant.getId(), targetRoomId);
    }

    handleFromViewEnterLecture(lectureId) {
        this.socketReady;
        this.socket.emit('enterLecture', this.#ownParticipant.getId(), lectureId);
    }

    handleFromViewLectureLeft(lectureId, lectureEnded) {
        this.socketReady;
        this.socket.emit('leaveLecture', this.#ownParticipant.getId(), lectureId, lectureEnded);
    }

    handleFromViewLectureDownload(lectureId) {
        this.socketReady
        this.socket.emit('lectureVideoDownload', lectureId);
    }

    handleFromViewGetCurrentLectures() {
        this.socketReady
        this.socket.emit('getCurrentLectures', this.#ownParticipant.getId());
    }

    handleFromViewShowSchedule() {
        this.socketReady
        this.socket.emit('getSchedule');
    }

    // called after clicking on achievement list
    handleFromViewShowAchievements() {
        this.socketReady
        this.socket.emit('getAchievements', this.#ownParticipant.getId());

    }

    //called after click on friendlist button
    handleFromViewShowFriendList() {
        this.socketReady;
        this.socket.emit('getFriendList', this.#ownParticipant.getId());
    }

    handleFromViewShowInviteFriends(groupName, chatId) {
        this.socketReady;
        this.socket.emit('getInviteFriends', this.#ownParticipant.getId(), groupName, chatId);
    }

    //called after click on friendrequestlist button
    handleFromViewShowFriendRequestList() {
        this.socketReady;
        this.socket.emit('getFriendRequestList', this.#ownParticipant.getId());

    }

    //called after 'Add Friend' Button
    handleFromViewNewFriendRequest(participantRepicientId, chatId) {
        this.socketReady;
        this.socket.emit('newFriendRequest', this.#ownParticipant.getId(), participantRepicientId, chatId);
    }

    //called when a friend request is accepted
    handleFromViewAcceptRequest(businessCard) {
        this.socketReady;

        var participantId = businessCard.participantId;
        TypeChecker.isString(participantId);

        //Tells server to accept this request
        this.socket.emit('handleFriendRequest', this.#ownParticipant.getId(), participantId, true);
        this.#gameView.updateFriendRequestListView(participantId, true);
        this.#gameView.addFriend(new BusinessCardClient(participantId, businessCard.username, businessCard.title,
            businessCard.surname, businessCard.forename, businessCard.job, businessCard.company, businessCard.email))
    }

    //called when a friend request is declined
    handleFromViewRejectRequest(participantId) {
        this.socketReady;

        //Tells server to reject this request
        this.socket.emit('handleFriendRequest', this.#ownParticipant.getId(), participantId, false);
        this.#gameView.updateFriendRequestListView(participantId, false);
    }

    //called when this participants removes another from his friendlist
    handleFromViewRemoveFriend(friendId) {
        this.socketReady;
        this.socket.emit('removeFriend', this.#ownParticipant.getId(), friendId);
        this.#gameView.removeFriend(friendId);
    }

    handleFromViewLeaveChat(chatId) {
        this.socketReady;
        this.socket.emit('removeParticipantFromChat', this.#ownParticipant.getId(), chatId);
        this.#gameView.removeChat(chatId);
    }

    handleFromViewShowBusinessCard(participantId) {
        let ppant = this.#currentRoom.getParticipant(participantId);
        if (ppant === undefined) {
            throw new Error('Ppant with ' + participantId + ' is not in room');
        }
        this.socketReady;
        //Emits to server own ID and target ID
        this.socket.emit('getBusinessCard', this.#ownParticipant.getId(), participantId);
    }

    handleFromViewShowProfile() {
        this.#gameView.initProfileView(this.#ownBusinessCard);
    }

    handleFromViewGetNPCStory(npcId) {
        this.socketReady;
        this.socket.emit('getNPCStory', this.#ownParticipant.getId(), npcId);
    }

    handleFromServerAchievements(achievements) {
        this.#gameView.initCurrentAchievementsView(achievements);
    }

    handleFromViewShowRankList() {
        this.socket.emit('getRankList');
    }

    /* Gets the list of chats the user is in - one-on-one and group - from the
     * server. The actual displaying is done in the method dealing with the 
     * response from the server.
     * - (E) */
    handleFromViewShowChatList() {
        let participantID = this.#ownParticipant.getId();
        this.socket.emit('getChatList', participantID, this.#ownBusinessCard.getUsername());
    };

    handleFromViewShowChatThread(chatID) {
        this.socket.emit('getChatThread', this.#ownParticipant.getId(), chatID);
    };

    handleFromViewShowChatParticipantList(chatId) {
        this.socket.emit('getChatParticipantList', this.#ownParticipant.getId(), chatId);
    }

    /*Triggers the createNewChat event and emits the id of the participant that created the chat and 
    the id of the other chat participant to the server.*/
    handleFromViewCreateNewChat(participantId, username) {
        //if isFriend is undefined, checking isFriend is necessary  
        //isFriend not necessary, because server knows all friendLists
        this.socketReady
        var creatorId = this.#ownParticipant.getId();
        this.socket.emit('createNewChat', creatorId, participantId, username);
    }

    handleFromViewCreateNewGroupChat(chatName, participantIdList, limit, chatId) {
        this.socketReady
        var creatorId = this.#ownParticipant.getId();
        this.socket.emit('createNewGroupChat', creatorId, chatName, participantIdList, limit, chatId);
    }

    handleFromViewSendNewMessage(chatId, messageText) {
        this.socketReady

        this.socket.emit('newChatMessage', this.#ownParticipant.getId(), this.#ownBusinessCard.getUsername(), chatId, messageText);
    }

    // Can we maybe merge these four functions into one?
    handleLeftArrowDown() {
        this.#gameView.updateOwnAvatarDirection(Direction.UPLEFT);
        //this.sendMovementToServer(Direction.UPLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() - Settings.MOVEMENTSPEED_Y);
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(Direction.UPLEFT);
    }

    handleRightArrowDown() {
        this.#gameView.updateOwnAvatarDirection(Direction.DOWNRIGHT);
        //this.sendMovementToServer(Direction.DOWNRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() + Settings.MOVEMENTSPEED_Y);
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(Direction.DOWNRIGHT);
    }

    handleUpArrowDown() {
        this.#gameView.updateOwnAvatarDirection(Direction.UPRIGHT);
        //this.sendMovementToServer(Direction.UPRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX() + Settings.MOVEMENTSPEED_X, currPos.getCordY());
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(Direction.UPRIGHT);
    }

    handleDownArrowDown() {
        this.#gameView.updateOwnAvatarDirection(Direction.DOWNLEFT);
        //this.sendMovementToServer(Direction.DOWNLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX() - Settings.MOVEMENTSPEED_X, currPos.getCordY());
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(Direction.DOWNLEFT);
    }

    handleArrowUp() {
        this.#gameView.updateOwnAvatarWalking(false);
        this.sendToServerRequestMovStop();
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ClientController;
}