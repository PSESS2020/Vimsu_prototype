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
 *       not final).
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




/* For quicker changing of the movement-rate. 
 * - (E) */
const movementX = 1,
      movementY = 1;

class ClientController {

    #port; // Does this class even need this? - (E)
    socket;
    #gameView;
    #currentRoom;
    #participantId;
    #ownParticipant;
    #roomClient;

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


    constructor(gameView/*, participantId*/) { //TODO: instanciate ParticipantClient
        if (!!ClientController.instance) {
            return ClientController.instance;
        }

        ClientController.instance = this;

        this.#gameView = gameView;
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


    /* #################################################### */    
    /* ###################### SOCKET ###################### */
    /* #################################################### */

    //checks if there is an existing socket. Throws an error if there is no socket.
    socketReady() {
        if (!this.socket) {
            //TODO: exception
        }
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
        
        this.#gameView.initOwnAvatarView(this.#ownParticipant);
        //TODO this.#gameView.initAnotherAvatarViews(participants);

        //Game View is now fully initialised
        this.#gameView.setGameViewInit(true);
    }

    /*opens a new socket connection between the client and the server and initializes the events to be handled.
    Throws an error if there is already an existing socket */
    // We also need reconnection handling
    openSocketConnection() {
        if (this.#port && !this.socket) {
            /* It seems you don't need to pass an argument here - socket.io figures it out by itself.
             * - (E) */
            this.socket = io();
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
        this.socket.on('currentGameStateYourID', this.handleFromServerUpdateID.bind(this)); //First Message from server
        this.socket.on('currentGameStateYourRoom', this.handleFromServerUpdateRoom.bind(this)); 
        this.socket.on('currentGameStateYourPosition', this.handleFromServerUpdatePosition.bind(this)); //Called when server wants to update your position
        this.socket.on('roomEnteredByParticipant', this.handleFromServerRoomEnteredByParticipant.bind(this));
        //this.socket.on('collisionDetetcionAnswer', this.handleFromServerCollisionDetectionAnswer.bind(this));
        this.socket.on('movementOfAnotherPPantStart', this.handleFromServerStartMovementOther.bind(this)); // onKeyDown, start recalculating position
        this.socket.on('movementOfAnotherPPantStop', this.handleFromServerStopMovementOther.bind(this));  // onKeyUp, check if position fits server 
        this.socket.on('remove player', this.handleFromServerRemovePlayer.bind(this)); // handles remove event
    }
    

    /* #################################################### */    
    /* ################## SEND TO SERVER ################## */
    /* #################################################### */

    //asks the server for an update of the current game state
    requestGameStateUpdate() {
        this.socketReady;
        this.socket.emit('requestGameStateUpdate');
    }

    sendToServerRequestMovStart(direction) {
        this.socketReady;
        TypeChecker.isEnumOf(direction, DirectionClient);
        var currPos = this.#gameView.getOwnAvatarView().getPosition();
        var currPosX = currPos.getCordX();
        var currPosY = currPos.getCordY();

        this.socket.emit('requestMovementStart', this.#participantId, direction, currPosX, currPosY);
    }

    sendToServerRequestMovStop() {
        this.socketReady;
        
        this.socket.emit('requestMovementStop', this.#participantId);
    }


    /* #################################################### */    
    /* ############### RECEIVE FROM SERVER ################ */
    /* #################################################### */
    
    //First Message from Server, gives you your ID
    handleFromServerUpdateID(id) {
        console.log("test update id");
        

        this.#participantId = id;
        console.log(this.#participantId);
    }

    //Second message from Server, gives you information of starting room
    handleFromServerUpdateRoom(roomId, typeOfRoom) {

        //First room? 
        if(!this.#currentRoom) {
            this.#currentRoom = new RoomClient(roomId, typeOfRoom);
        
        //If not, only swap the room
        } else {
            this.#currentRoom.swapRoom(roomId, typeOfRoom);
        }
    }

    //Third message from server, gives you information of starting position
    //After that, there is everything to init the game view
    handleFromServerUpdatePosition(posInfo) {
        var posUpdate = new PositionClient(posInfo.cordX, posInfo.cordY);
        var dirUpdate = posInfo.dir;

        //First Call to this method? If so, create own participant client model and init game view
        if (!this.#ownParticipant) {
            this.#ownParticipant = new ParticipantClient(this.#participantId, posUpdate, dirUpdate);
            this.initGameView();
        } else {
            this.#ownParticipant.setPosition(posUpdate);
            this.#ownParticipant.setDirection(dirUpdate);
            this.#gameView.updateOwnAvatarPosition(posUpdate);
            this.#gameView.updateOwnAvatarDirection(dirUpdate);
        }
        
        console.log("test finish update pos");
    }

    //Server does collision testing, so this method is only called when movement from other user is legit (P)
    handleFromServerStartMovementOther(ppantID, direction, newCordX, newCordY) {
        TypeChecker.isString(ppantID);
        TypeChecker.isEnumOf(direction, DirectionClient);
        TypeChecker.isInt(newCordX);
        TypeChecker.isInt(newCordY);

        let newPos = new PositionClient(newCordX, newCordY);
        this.#gameView.updateAnotherAvatarDirection(ppantID, direction);    
        this.#gameView.updateAnotherAvatarPosition(ppantID, newPos);
        this.#gameView.updateAnotherAvatarWalking(ppantID, true);  
        
        console.log(ppantID);
    }

    handleFromServerStopMovementOther(ppantID) {
        // TODO:
        // Typechecking
        // comparing position with the one saved in the server
        
        this.#gameView.updateAnotherAvatarWalking(ppantID, false);
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
        var participant = new ParticipantClient(initInfo.id, initPos, initInfo.dir);
        console.log(" get id " + participant.getId());
        this.#currentRoom.enterParticipant(participant);
        // the following line throws the same error as in the above method
        this.#gameView.initAnotherAvatarViews(participant);
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


    /* #################################################### */    
    /* ################# HANDLE FROM VIEW ################# */
    /* #################################################### */

    handleFromViewEnterDoor(doorId) {
        this.socketReady;
        this.socket.emit('enterDoor', doorId);
        //update currentRoom;
        //update View
    }

    /*Triggers the createNewChat event and emits the id of the participant that created the chat and 
    the id of the other chat participant to the server.*/
    handleFromViewCreateNewChat(creatorId, participantId) {
        this.socketReady
        this.socket.emit('createNewChat', {creatorId, participantId})
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
        this.socket.emit('getCurrentLectures');
    }

    handleFromViewNewFriendRequest(participantRepicientId) {
        this.socketReady
        var senderId = this.participant.getId;
        this.socket.emit('newFriendRequest', {senderId, participantRepicientId});
    }

    handleFromViewRespondFriendRequest(senderId) {
        this.socketReady
        var responderId = this.participant.getId;
        this.socket.emit('newFriendRequest', {senderId, responderId});
    }

   
    // Can we maybe merge these four functions into one?
    handleLeftArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.UPLEFT);
        //this.sendMovementToServer(DirectionClient.UPLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() - 1);
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
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() + 1);
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
        let newPos = new PositionClient(currPos.getCordX() + 1, currPos.getCordY());
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
        let newPos = new PositionClient(currPos.getCordX() - 1, currPos.getCordY());
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