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
        this.#port = portSend;
    }

    openSocketConnection() {
        if (port !== null && this.#socket === null) {
            this.#socket = io(`ws://localhost:${port}`); // TODO: set socket server
            this.#socket.on('connected', (socket) => {
                socket.on('handleFromServerRankings', handleFromServerRankings);
            });
        }
        else {
            // TODO: error state
        }
    }

    handleFromServerRankings({participantIds, scores}) {
        // TODO: handle
    }


}

