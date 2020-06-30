class ClientController {

    #gameView;

    //creates an instance of ClientController only if there is not an instance already
    constructor(gameView) {
        if (!!ClientController.instance) {
            return ClientController.instance;
        }

        ClientController.instance = this;

        this.#gameView = gameView;

        return this;
    }


    getPortListen() {
        return this.portListen;
    }

    getPortSend() {
        return this.portSend;
    }

    setPortListen(portListen) {
        this.portListen = portListen;
    }

    setPortSend(portSend) {
        this.portSend = portSend;
    }
}

