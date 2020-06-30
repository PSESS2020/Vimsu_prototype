class ClientController {
    constructor(gameView) {
        this.gameView = gameView;
    }

    getInstance() {

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

