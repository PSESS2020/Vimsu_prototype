//TODO: Vielleicht alle Events in einer Utildatei? Müssen Server und Client gleichermaßen bekannt sein.

/* For quicker changing of the movement-rate. 
 * - (E) */
const movementX = 4,
      movementY = 2; // this should always movementX / 2

class ClientController {

    #port; // Does this class even need this? - (E)
    socket;
    gameView;
    #currentRoom;
    #participantId;

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


    constructor(gameView, participantId) { //TODO: instanciate ParticipantClient
        if (!!ClientController.instance) {
            return ClientController.instance;
        }

        ClientController.instance = this;

        this.gameView = gameView;
        this.#participantId = participantId;
        
        //TODO: add Participant List from Server
        this.#currentRoom = new RoomClient(1, "FOYER", []);

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

    setCurrentRoom(currentRoom) {
        this.#currentRoom = currentRoom;
    }

    setParticipantId(id) {
        this.#participantId = id;
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
        this.socket.on('currentGameStateYourID', this.handleFromServerUpdateID);
        this.socket.on('currentGameStateYourPosition', this.handleFromServerUpdatePosition.bind(this)); // The bind(this) fixes scoping-issues
        this.socket.on('roomEnteredByParticipant', this.handleFromServerRoomEnteredByParticipant.bind(this));
        this.socket.on('collisionDetetcionAnswer', this.handleFromServerCollisionDetectionAnswer);         
    }
    

    /* #################################################### */    
    /* ################## SEND TO SERVER ################## */
    /* #################################################### */

    //asks the server for an update of the current game state
    requestGameStateUpdate() {
        this.socketReady;
        this.socket.emit('requestGameStateUpdate');
    }

    sendMovementToServer(direction) {
        this.socketReady;
        // add type-Checking for direction
        // this.#socket.emit('movement', direction);
    }


    /* #################################################### */    
    /* ############### RECEIVE FROM SERVER ################ */
    /* #################################################### */
    
    handleFromServerUpdateID(id) {
        console.log("test update id");
        // Throws the error that this is not a function?
        //this.setParticipantId(id);
    }

    handleFromServerUpdatePosition(posInfo) {
        console.log("test update pos");
        var posUpdate = new PositionClient(posInfo.cordX, posInfo.cordY);
        /* This will not work and throws error
         * Uncaught TypeError: Cannot read property updateOwnAvatarPosition of undefined 
        this.gameView.updateOwnAvatarPosition(posUpdate);

        // This is probably overkill, but better safe than sorry
        switch(posInfo.dir) {
            case DirectionClient.UPRIGHT:
                this.gameView.updateOwnAvatarDirection(DirectionClient.UPRIGHT);
                break;
            case DirectionClient.DOWNRIGHT:
                this.gameView.updateOwnAvatarDirection(DirectionClient.DOWNRIGHT);
                break;
            case DirectionClient.UPLEFT:
                this.gameView.updateOwnAvatarDirection(DirectionClient.UPLEFT);
                break;
            case DirectionClient.DOWNLEFT:
                this.gameView.updateOwnAvatarDirection(DirectionClient.DOWNLEFT);
                break;
        }
        */
        console.log("test finish update pos");
    }
 
    /* COMMENT TODO
     * - (E) */ 
    handleFromServerRoomEnteredByParticipant(initInfo) {
        console.log("test enter new ppant");
        //var entrancePosition = this.#currentRoom; //TODO .getEntrancePosition
        //var entranceDirection = this.#currentRoom;//TODO .getEntranceDirection
        var initPos = new PositionClient(initInfo.cordX, initInfo.cordY);
        var participant = new ParticipantClient(initInfo.id, initPos, initInfo.dir);

        // Here we get another error (which we always get on handling the private fields 
        // in these methods
        // Uncaught TypeError: Cannot read private member #currentRoom from an object whose class did not declare it
        // this.#currentRoom.enterParticipant(participant);
        // the following line throws the same error as in the above method
        this.gameView.initAnotherAvatarViews(participant);

    }
    
    // Wird das noch gebraucht, wenn die collisionDetection nur client-seitig existiert? (E)
    handleFromServerCollisionDetectionAnswer(isOccupied) {
        if (isOccupied) {
            //TODO: Bewegung wird nicht zugelassen
        } else {
            //TODO: Avatar wird bewegt
        }
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

   

    handleLeftArrowDown() {
        this.gameView.updateOwnAvatarDirection(DirectionClient.UPLEFT);
        this.sendMovementToServer(DirectionClient.UPLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() - 1);
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
    }

    handleRightArrowDown() {
        this.gameView.updateOwnAvatarDirection(DirectionClient.DOWNRIGHT);
        this.sendMovementToServer(DirectionClient.DOWNRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX(), currPos.getCordY() + 1);
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
    }

    handleUpArrowDown() {
        this.gameView.updateOwnAvatarDirection(DirectionClient.UPRIGHT);
        this.sendMovementToServer(DirectionClient.UPRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX() + 1, currPos.getCordY());
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
    }

    handleDownArrowDown() {
        this.gameView.updateOwnAvatarDirection(DirectionClient.DOWNLEFT);
        this.sendMovementToServer(DirectionClient.DOWNLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        let newPos = new PositionClient(currPos.getCordX() - 1, currPos.getCordY());
        if (!this.#currentRoom.checkForCollision(newPos)) {
            this.#gameView.updateOwnAvatarPosition(newPos);
            this.#gameView.updateOwnAvatarWalking(true);
        }
    }

    handleArrowUp() {
        this.gameView.updateOwnAvatarWalking(false);
    }
    

   
}

