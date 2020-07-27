//TODO: Vielleicht alle Events in einer Utildatei? Müssen Server und Client gleichermaßen bekannt sein.



/* ******************************************************************************* */
/* NOTE PLEASE READ *** NOTE PLEASE READ *** NOTE PLEASE READ *** NOTE PLEASE READ */
/* ******************************************************************************* */
/*                                                                                 */
/* As development moves on, this class will need to be massively rewritten in order
 * to be compatible with the other parts of the software.
 * 
 * Stuff that will be altered in the following steps:
 *
 *   (i) Every constant will be moved into a shared /utils/Settings.js file (name
 *       not final). DONE
 *
 *  (ii) This class will set up the game in the final product. The idea here being
 *       that the index.js will call a method setUpGame() from this class.
 *       The CC will then
 *          (a) open a socket-Connection, inform the server about a new ppant
 *              entering and request an up-to-date game-state
 *          (b) use that game-state to properly initialize the client-side models
 *          (c) create the gameView-instance, hand her the models and command her
 *              to draw the game.
 *
 * (iii) The index.js file thus needs to wait for this class to finalize setting 
 *       up the game.
 *
 *  (iv) This also means that the constructor will no longer take any arguments 
 *       and will not set the currentRoom-field. All of this will be created/set
 *       only once the necessary information has been supplied from the server.
 *
 * - (E) */




//const Settings = require('../../utils/Settings')

class ClientController {

    #port; // Does this class even need this? - (E)
    socket;
    #gameView;
    #currentRoom;
    #participantId;
    #ownParticipant;
    #roomClient;
    #ownBusinessCard;

    /**
     * creates an instance of ClientController only if there is not an instance already.
     * Otherwise the existing instance will be returned.
     * 
     * @author Laura, Eric
     * 
     * @param {GameView} gameView 
     * @param {ParticipantClient} participant
     * @param {currentRoom} currentRoom
     * @param {WebSocket} socket
     * @param {number} port
     */


    constructor(/*, participantId*/) { //TODO: instanciate ParticipantClient
        if (!!ClientController.instance) {
            return ClientController.instance;
        }

        ClientController.instance = this;

        this.#gameView = new GameView(GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        //this.#participantId = participantId;
        
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
        
        var map = this.#currentRoom.getMap();
        var typeOfRoom = this.#currentRoom.getTypeOfRoom();
        
        if (map !== null && typeOfRoom === TypeOfRoomClient.FOYER) {
            this.#gameView.initFoyerView(map);
        } else if (map !== null && typeOfRoom === TypeOfRoomClient.FOODCOURT) {
            this.#gameView.initFoodCourtView(map);
        } else if (map !== null && typeOfRoom === TypeOfRoomClient.RECEPTION) {
            this.#gameView.initReceptionView(map);
        }

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

        var map = this.#currentRoom.getMap();
        var typeOfRoom = this.#currentRoom.getTypeOfRoom();
        
        if (map !== null && typeOfRoom === TypeOfRoomClient.FOYER) {
            this.#gameView.initFoyerView(map);
        } else if (map !== null && typeOfRoom === TypeOfRoomClient.FOODCOURT) {
            this.#gameView.initFoodCourtView(map);
        } else if (map !== null && typeOfRoom === TypeOfRoomClient.RECEPTION) {
            this.#gameView.initReceptionView(map);
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
            this.socket = io({transports: ['websocket'], upgrade: false});
            this.socket.on('connect', (socket) => {
                console.log("test connect");
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
        this.socket.on('New global message', this.handleFromServerNewGlobalMessage.bind(this));
        this.socket.on('remove yourself', this.handleFromServerRemoved.bind(this));
        this.socket.on('hideAvatar', this.handleFromServerHideAvatar.bind(this));
        this.socket.on('showAvatar', this.handleFromServerShowAvatar.bind(this));
        this.socket.on('achievements', this.handleFromServerAchievements.bind(this));
        this.socket.on('evalAnswer', function(data) {   //Displays evaluated input.
                console.log(data);
        });
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
        if(this.socketReady())
        this.socket.emit('requestGameStateUpdate');
    }

    sendToServerRequestMovStart(direction) {
        
        if(this.socketReady()) {
            TypeChecker.isEnumOf(direction, DirectionClient);
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
        if(this.socket.connected)
            this.socket.emit('sendMessage', this.#ownParticipant.getId(), text);
        else
            $('#allchatMessages').prepend($('<div>').text("Failed to send message. No connection to the server."));
    
        }

    sendToServerEvalInput(input) {

        this.socketReady;
        if(this.socket.connected)
            this.socket.emit('evalServer', input);
        else
            $('#allchatMessages').prepend($('<div>').text("Failed to send input. No connection to the server."));

    }

    sendToServerLectureChatMessage(text, lectureId) {
        this.socketReady;
        if(this.socket.connected)
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
    handleFromServerUpdateRoom(roomId, typeOfRoom, listOfGameObjectsData) {
        
        //transform GameObjects to GameObjectClients
        var listOfGameObjects = [];
        listOfGameObjectsData.forEach(element => {
            listOfGameObjects.push(new GameObjectClient(element.id, element.name, element.width, element.length,
                new PositionClient(element.cordX, element.cordY), element.isSolid));
        });

        //First room? 
        if(!this.#currentRoom) {
            this.#currentRoom = new RoomClient(roomId, typeOfRoom, listOfGameObjects);
            
        //If not, only swap the room
        } else {
            this.#currentRoom.swapRoom(roomId, typeOfRoom, listOfGameObjects);
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
        TypeChecker.isEnumOf(direction, DirectionClient);
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
    handleFromServerBusinessCard(businessCardObject) {
        let businessCard = new BusinessCardClient(businessCardObject.id, businessCardObject.username, 
            businessCardObject.title, businessCardObject.surname, businessCardObject.forename, 
            businessCardObject.job, businessCardObject.company, businessCardObject.email);
        
        //check if ppant is a friend or not
        if (businessCard.getEmail() === undefined) {
            this.#gameView.initBusinessCardView(businessCard, false);
        } else {
            this.#gameView.initBusinessCardView(businessCard, true);
        }
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

    handleFromServerRankList(rankList) {
        //remark own participant's ranking
        let idx = rankList.findIndex(ppant => ppant.participantId === this.#ownParticipant.getId());
        if (!idx < 0) {
            rankList[idx].self = true;
        }
        this.#gameView.initRankListView(rankList);
    }

    // Adds a new message to the all-chat
    handleFromServerNewAllchatMessage(message) {
        var msgText = "[" + message.timestamp + "] " + "(" + message.senderID + ") " + message.username + ": " + message.text;
        $('#allchatMessages').prepend($('<div>').text(msgText));
        $('#allchatMessages').scrollTop(0);
    }

    handleFromServerNewLectureChatMessage(message) {
        var messageHeader = message.username + ", " + message.timestamp + ":";
        var $newMessageHeader = $( "<div style='font-size: small;'></div>" );
        var $newMessageBody = $( "<div style='font-size: medium;'></div>" );
        $newMessageHeader.text(messageHeader);
        $newMessageBody.text(message.messageText);
        $('#lectureChatMessages').append($newMessageHeader);
        $('#lectureChatMessages').append($newMessageBody);
    }
    
    handleFromServerUpdateLectureChat(messages) {
        for(var i = 0; i < messages.length; i++) {
            var messageHeader = messages[i].username + ", " + messages[i].timestamp + ":";
            var $newMessageHeader = $( "<div style='font-size: small;'></div>" );
            var $newMessageBody = $( "<div style='font-size: medium;'></div>" );
            $newMessageHeader.text(messageHeader);
            $newMessageBody.text(messages[i].messageText);
            $('#lectureChatMessages').append($newMessageHeader);
            $('#lectureChatMessages').append($newMessageBody);
        }
    };
    
    
    // Called when a new room is entered.
    // The argument is an array of objects of the following structure:
    // { senderID: <String>, timestamp: <String>, text: <String> }
    handleFromServerInitAllchat(messages) {
        $('#allchatMessages').empty();
        messages.forEach( (message) => {
            $('#allchatMessages').prepend($('<div>').text("[" + message.timestamp + "] " + "(" + message.senderID + ") " + message.username + ": " + message.text));
        });
        $('#allchatMessages').scrollTop(0);
    }

    handleFromServerNewGlobalMessage(messageHeader, messageText) {
        this.#gameView.initGlobalChatView(messageHeader, messageText);
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

    /* #################################################### */    
    /* ################# HANDLE FROM VIEW ################# */
    /* #################################################### */

    handleFromViewEnterReception() {
        this.socketReady;
        this.socket.emit('enterRoom', this.#ownParticipant.getId(), TypeOfRoomClient.RECEPTION);
        //update currentRoom;
        //update View
    }

    handleFromViewEnterFoodCourt() {
        this.socketReady;
        this.socket.emit('enterRoom', this.#ownParticipant.getId(), TypeOfRoomClient.FOODCOURT);
        //update currentRoom;
        //update View
    }

    handleFromViewEnterFoyer() {
        this.socketReady;
        this.socket.emit('enterRoom', this.#ownParticipant.getId(), TypeOfRoomClient.FOYER);
        //update currentRoom;
        //update View
    }

    handleFromViewEnterLecture(lectureId) {
        this.socketReady;
        this.socket.emit('enterLecture', this.#ownParticipant.getId(), lectureId);
    }

    handleFromViewLectureLeft(lectureId) {
        this.socketReady;
        this.socket.emit('leaveLecture', this.#ownParticipant.getId(), lectureId);
    }

    /*Triggers the createNewChat event and emits the id of the participant that created the chat and 
    the id of the other chat participant to the server.*/
    handleFromViewCreateNewChat(participantId, isFriend) {
        //if isFriend is undefined, checking isFriend is necessary
        this.socketReady
        var creatorId = this.#ownParticipant.getId();
        this.socket.emit('createNewChat', {creatorId, participantId, isFriend})
    }

    handleFromViewCreateNewGroupChat(creatorId, participantIdList) {
        this.socketReady
        this.socket.emit('createNewGroupChat', {creatorId, participantIdList})
    }

    handleFromViewNewMessage(sendDateTime, chatId, messageText) {
        this.socketReady
        var senderId = this.participant.getId;
        this.socket.emit('newMessage', {sendDateTime, senderId, chatId, messageText});
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

    //called after click on friendrequestlist button
    handleFromViewShowFriendRequestList() {
        this.socketReady;
        this.socket.emit('getFriendRequestList', this.#ownParticipant.getId());
        
    }

    //called after 'Add Friend' Button
    handleFromViewNewFriendRequest(participantRepicientId) {
        this.socketReady;
        this.socket.emit('newFriendRequest', this.#ownParticipant.getId(), participantRepicientId);
    }

    //called when a friend request is accepted
    handleFromViewAcceptRequest(businessCard) {
        this.socketReady;

        var participantId = businessCard.participantId;
        console.log(participantId);
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

    handleFromServerAchievements(achievements) {
        this.#gameView.initCurrentAchievementsView(achievements);
    }

    handleFromViewShowRankList() {
        this.socket.emit('getRankList');
    }
   
    // Can we maybe merge these four functions into one?
    handleLeftArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.UPLEFT);
        //this.sendMovementToServer(DirectionClient.UPLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() - Settings.MOVEMENTSPEED_Y);
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(DirectionClient.UPLEFT);
    }

    handleRightArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.DOWNRIGHT);
        //this.sendMovementToServer(DirectionClient.DOWNRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() + Settings.MOVEMENTSPEED_Y);
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(DirectionClient.DOWNRIGHT);
    }

    handleUpArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.UPRIGHT);
        //this.sendMovementToServer(DirectionClient.UPRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX() + Settings.MOVEMENTSPEED_X, currPos.getCordY());
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(DirectionClient.UPRIGHT);
    }

    handleDownArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.DOWNLEFT);
        //this.sendMovementToServer(DirectionClient.DOWNLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX() - Settings.MOVEMENTSPEED_X, currPos.getCordY());
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
        this.sendToServerRequestMovStart(DirectionClient.DOWNLEFT);
    }

    handleArrowUp() {
        this.#gameView.updateOwnAvatarWalking(false);
        this.sendToServerRequestMovStop();
    } 
}
