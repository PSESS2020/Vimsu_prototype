//TODO: Vielleicht alle Events in einer Utildatei? Müssen Server und Client gleichermaßen bekannt sein.

/* For quicker changing of the movement-rate. 
 * - (E) */
const movementX = 4,
      movementY = 2; // this should always movementX / 2

class ClientController {

    #port; // Does this class even need this? - (E)
    #socket;
    #gameView;
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

        this.#gameView = gameView;
        this.#participantId = participantId; 

        return this;
    }


    getPort() {
        return this.#port;
    }
 
    setPort(port) {
        this.#port = port;
    }

    getSocket() {
        return this.#socket;
    }

    setSocket(socket) {
        this.#socket = socket;
    }

    setCurrentRoom(currentRoom) {
        this.#currentRoom = currentRoom;
    }

    getCurrentRoom() {
        return this.#currentRoom;
    }


    /* #################################################### */    
    /* ###################### SOCKET ###################### */
    /* #################################################### */

    //checks if there is an existing socket. Throws an error if there is no socket.
    socketReady() {
        if (!this.#socket) {
            //TODO: exception
        }
    }

    /*opens a new socket connection between the client and the server and initializes the events to be handled.
    Throws an error if there is already an existing socket */
    openSocketConnection() {
        if (this.#port && !this.#socket) {
            /* It seems you don't need to pass an argument here - socket.io figures it out by itself.
             * - (E) */
            this.#socket = io();
            this.#socket.emit('new participant'); // this should probably also pass like the name
            this.#socket.on('connect', (socket) => {
                console.log("test1");
                // Here, there needs to be something to make sure the ppantID of the CC is the same
                // as the one saved for this ppant on the server - (E)
                this.#socket.on('currentGameStateYourID', this.handleFromServerUpdateID);
                this.#socket.on('currentGameStateYourPosition', this.handleFromServerUpdatePosition);
                this.#socket.on('roomEnteredByParticipant', this.handleFromServerRoomEnteredByParticipant);
                this.#socket.on('collisionDetetcionAnswer', this.handleFromServerCollisionDetectionAnswer);
                //other events handled from the server
            });
        }
        else {
            // TODO: error state
        }
    }
    

    /* #################################################### */    
    /* ################## SEND TO SERVER ################## */
    /* #################################################### */

    //asks the server for an update of the current game state
    requestGameStateUpdate() {
        this.socketReady;
        this.#socket.emit('requestGameStateUpdate');
    }

    sendMovementToServer(direction) {
        this.socketReady;
        // add type-Checking for direction
        // this.#socket.emit('movement', direction);
    }


    /* #################################################### */    
    /* ############### RECEIVE FROM SERVER ################ */
    /* #################################################### */
    
    handleFromServerUpdateId(id) {
        console.log("test update id");
        // Doesn't actually do anything yet, until i figured how to set the ID from here
    }

    handleFromServerUpdatePosition(posInfo) {
        console.log("test update pos");
        var posUpdate = new Position(posInfo.cordX, posInfo.cordY);
        this.#gameView.updateOwnAvatarPosition(posUpdate);

        // This is probably overkill, but better safe than sorry
        switch(posInfo.dir) {
            case DirectionClient.UPRIGHT:
                this.#gameView.updateOwnAvatarDirection(DirectionClient.UPRIGHT);
                break;
            case DirectionClient.DOWNRIGHT:
                this.#gameView.updateOwnAvatarDirection(DirectionClient.DOWNRIGHT);
                break;
            case DirectionClient.UPLEFT:
                this.#gameView.updateOwnAvatarDirection(DirectionClient.UPLEFT);
                break;
            case DirectionClient.DOWNLEFT:
                this.#gameView.updateOwnAvatarDirection(DirectionClient.DOWNLEFT);
                break;
        }
        console.log("test finish update pos");
    }
 
    /* COMMENT TODO
     * - (E) */ 
    handleFromServerRoomEnteredByParticipant(initInfo) {
        console.log("test enter new ppant");
        //var entrancePosition = this.#currentRoom; //TODO .getEntrancePosition
        //var entranceDirection = this.#currentRoom;//TODO .getEntranceDirection
        var initPos = new PositionClient(initInfo.cordX, initInfo.cordY);
        participant = new ParticipantClient(initInfo.id, initPos, initInfo.dir);
        this.#currentRoom.enterParticipant(participant);
        this.#gameView.initAnotherAvatarViews(participant);

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
        this.#socket.emit('enterDoor', doorId);
        //update currentRoom;
        //update View
    }

    /*Triggers the createNewChat event and emits the id of the participant that created the chat and 
    the id of the other chat participant to the server.*/
    handleFromViewCreateNewChat(creatorId, participantId) {
        this.socketReady
        this.#socket.emit('createNewChat', {creatorId, participantId})
    }

    handleFromViewCreateNewGroupChat(creatorId, participantIdList) {
        this.socketReady
        this.#socket.emit('createNewGroupChat', {creatorId, participantIdList})
    }

    handleFromViewNewMessage(sendDateTime, chatId, messageText) {
        this.socketReady
        var senderId = this.participant.getId;
        this.#socket.emit('newMessage', {sendDateTime, senderId, chatId, messageText});
    }

    handleFromViewLectureDownload(lectureId) {
        this.socketReady
        this.#socket.emit('lectureVideoDownload', lectureId);
    }

    handleFromViewGetCurrentLectures() {
        this.socketReady
        this.#socket.emit('getCurrentLectures');
    }

    handleFromViewNewFriendRequest(participantRepicientId) {
        this.socketReady
        var senderId = this.participant.getId;
        this.#socket.emit('newFriendRequest', {senderId, participantRepicientId});
    }

    handleFromViewRespondFriendRequest(senderId) {
        this.socketReady
        var responderId = this.participant.getId;
        this.#socket.emit('newFriendRequest', {senderId, responderId});
    }

   

    handleLeftArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.UPLEFT);
        this.sendMovementToServer(DirectionClient.UPLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        this.#gameView.updateOwnAvatarPosition(new PositionClient(currPos.getCordX() - movementX, currPos.getCordY() - movementY));
        this.#gameView.updateOwnAvatarWalking(true);
    }

    handleRightArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.DOWNRIGHT);
        this.sendMovementToServer(DirectionClient.DOWNRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        this.#gameView.updateOwnAvatarPosition(new PositionClient(currPos.getCordX() + movementX, currPos.getCordY() + movementY));
        this.#gameView.updateOwnAvatarWalking(true);
    }

    handleUpArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.UPRIGHT);
        this.sendMovementToServer(DirectionClient.UPRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        this.#gameView.updateOwnAvatarPosition(new PositionClient(currPos.getCordX() + movementX, currPos.getCordY() - movementY));
        this.#gameView.updateOwnAvatarWalking(true);
    }

    handleDownArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.DOWNLEFT);
        this.sendMovementToServer(DirectionClient.DOWNLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        this.#gameView.updateOwnAvatarPosition(new PositionClient(currPos.getCordX() - movementX, currPos.getCordY() + movementY));
        this.#gameView.updateOwnAvatarWalking(true);
    }

    handleArrowUp() {
        this.#gameView.updateOwnAvatarWalking(false);
    }
    

   
}

