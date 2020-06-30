class ClientController {

    #port;
    #socket;
    #gameView;

    /*creates an instance of ClientController only if there is not an instance already.
    Otherwise the existing instance will be returned.*/
    constructor(gameView) {
        if (!!ClientController.instance) {
            return ClientController.instance;
        }

        ClientController.instance = this;

        this.#gameView = gameView;
        

        return this;
    }


    getPort() {
        return this.#port;
    }
 
    setPort(port) {
        this.#port = port;
    }

    openSocketConnection() {
        if (this.#port && !this.#socket) {
            this.#socket = io(`ws://localhost:${this.#port}`); // TODO: set socket server
            this.#socket.on('connected', (socket) => {
                this.#socket.on('handleFromServerRankings', this.handleFromServerRankings);
                this.#socket.on('handleFromServerNewMessage', this.handleFromServerNewMessage)
            });
        }
        else {
            // TODO: error state
        }
    }

    handleFromServerRankings({participantIds, scores}) {
        // TODO: this.#gameView. update game model etc.
    }

    handleFromServerNewMessage({name, message}) {
        // TODO: ...
    }

    handleFromViewNewMessage(message) {
        if (!this.#socket) {
            // TODO: throw error
        }

        this.#socket.emit('handleFromViewNewMessage', { participantId: 12345, message: message }); // instantiate message and update view, get participant id
    }
}

