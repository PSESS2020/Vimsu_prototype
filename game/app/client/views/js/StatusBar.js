class StatusBar extends Views {
    #timeLeft;
    #connectionStatus;

    //FPS vars
    #secondsPassed;
    #oldTimeStamp;
    #fps;

    constructor() {
        super();

        if (!!StatusBar.instance) {
            return StatusBar.instance;
        }

        StatusBar.instance = this;

        this.#connectionStatus = ConnectionState.CONNECTED;
    }

    #drawClock = function() {
        /* Draw game clock */
        $('#time').empty()
        let now = new DateParser(new Date()).parseWithSeconds();
        $('#time').text(now);
    }

    #drawConnectionStatus = function() {
        /* draw connection status */
        if (this.#connectionStatus === ConnectionState.DISCONNECTED) {

            if (this.#timeLeft < 0) {
                var redirect = $('#nav_leave_button').attr('href');
                window.location.href = redirect;
            } else {
                $('#connectionStatus').empty();
                $('#connectionStatus').text(`Lost connection to the server. Time left until leave: ${this.#timeLeft}s.`);
                $('#connectionStatus').show();
                this.#timeLeft--;
            }

        }
    }

    draw() {
        this.#drawClock();
        this.#drawConnectionStatus();

        setInterval(() => {

            this.#drawClock();
            this.#drawConnectionStatus();

        }, 1000);
    }

    /* not used
    // this returns the time till next interval. If late will drop calls.
    getNextCallTime() {
        var nextCallIn = (startTime + interval * (count + 1)) - performance.now();
        if (nextCallIn < -interval / 2) { // to late drop the call
            count = Math.floor((performance.now() - startTime) / interval) + 1;
            nextCallIn = (startTime + interval * count) - performance.now();
        }
        return nextCallIn;
    }*/

    updateLocation(location) {
        TypeChecker.isString(location);
        $('#location').empty();
        $('#location').text("Location: " + location);
    }

    updateFPS(timeStamp) {
        $('#fps').empty();

        // Calculate the number of seconds passed since the last frame
        this.#secondsPassed = (timeStamp - this.#oldTimeStamp) / 1000;
        this.#oldTimeStamp = timeStamp;

        // Calculate fps
        this.#fps = Math.round(1 / this.#secondsPassed);

        // Draw number to the screen
        $('#fps').text('FPS: ' + this.#fps + ', ');
    }

    updatePing(ms) {
        $('#ping').empty();
        $('#ping').text('Ping: ' + ms + 'ms');
    }

    updateConnectionStatus(status) {
        this.#connectionStatus = status;

        if (status === ConnectionState.CONNECTED) {
            $('#connectionStatus').empty();
        } else
            if (status === ConnectionState.DISCONNECTED) {
                this.#timeLeft = Settings.TIME_UNTIL_LEAVE;
            }
    }
}