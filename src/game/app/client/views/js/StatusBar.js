/**
 * The Status Bar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class StatusBar extends Views {

    connectionStatus;
    fps;

    /**
     * Creates an instance of StatusBar
     */
    constructor() {
        super();

        if (!!StatusBar.instance) {
            return StatusBar.instance;
        }

        StatusBar.instance = this;

        this.connectionStatus = ConnectionState.CONNECTED;
        $('#group').hide();
    }

    /**
     * draws game clock
     */
    drawClock = function () {
        $('#time').empty()
        let now = new DateParser(new Date()).parseWithSeconds();
        $('#time').text(now);
    }

    drawFPS = function() {
        $('#fps').empty();
        $('#fps').text('FPS: ' + this.fps + ', ');
        this.fps = 0;
    }

    /**
     * draws connection status
     */
    drawConnectionStatus = function () {
        if (this.connectionStatus === ConnectionState.DISCONNECTED) {
            $('#connectionStatus').empty();
            $('#connectionStatus').text(`Lost connection to the server.`);
            $('#connectionStatus').show();
        } else if (this.connectionStatus === ConnectionState.RECONNECTED) {
            $('#connectionStatus').empty();
            $('#connectionStatus').text("Reconnecting to the server...");
            $('#connectionStatus').show();
        }
    }

    /**
     * draws status bar every 1 seconds
     */
    draw() {
        this.drawClock();
        this.drawFPS();

        setInterval(() => {
            this.drawClock();
            this.drawFPS();
        }, 1000);
    }

    /**
     * Updates location
     * 
     * @param {String} location location
     */
    updateLocation(location) {
        TypeChecker.isString(location);
        $('#location').empty();
        $('#location').text("Location: " + location);
    }

    /**
     * Updates FPS
     */
    updateFPS() {
        this.fps++;
    }

    /**
     * Updates Ping
     * 
     * @param {number} ms ping in miliseconds
     */
    updatePing(ms) {
        $('#ping').empty();
        $('#ping').text('Ping: ' + ms + 'ms');
    }

    /**
     * Updates connection status
     * 
     * @param {ConnectionState} status connection status
     */
    updateConnectionStatus(status) {
        this.connectionStatus = status;

        if (status === ConnectionState.CONNECTED) {
            $('#connectionStatus').hide();
            $('#connectionStatus').empty();
        } else if (this.connectionStatus === ConnectionState.DISCONNECTED) {
            $('#connectionStatus').empty();
            $('#connectionStatus').text(`Lost connection to the server.`);
            $('#connectionStatus').show();
        } else if (this.connectionStatus === ConnectionState.RECONNECTED) {
            $('#connectionStatus').empty();
            $('#connectionStatus').text("Reconnecting to the server...");
            $('#connectionStatus').show();
        }
    }

    /**
     * Adds and updates group status 
     * 
     * @param {String} groupName group name
     */
    addGroupName(groupName) {
        TypeChecker.isString(groupName);
        $('#group').empty();
        $('#group').text("Group: " + groupName);
        $('#group').show();
    }

    /**
     * Removes group status from status bar
     */
    removeGroupName() {
        $('#group').empty();
        $('#group').hide();
    }
}