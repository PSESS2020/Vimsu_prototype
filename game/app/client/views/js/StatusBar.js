class StatusBar extends Views{
    #timeLeft;
    #connectionStatus;

    constructor(){
        super();
        
        this.#connectionStatus = ConnectionState.CONNECTED;
    }
    drawClock() {
        /* Draw game clock */
        $('#time').empty()
        let now = new DateParser(new Date()).parseWithSeconds();
        $('#time').text(now);
    }

    drawConnectionStatus() {
        /* draw connection status */
        if (this.#connectionStatus === ConnectionState.DISCONNECTED) {

            if (this.#timeLeft < 0) {
                var redirect = $('nav_leave_button').attr('href');
                window.location.href = redirect;
            } else {
                $('#connectionStatus').empty();
                $('#connectionStatus').text(`Lost connection to the server. Time left until leave: ${this.#timeLeft}s.`);
                this.#timeLeft--;
            }

        } 
    }

    draw() {
        this.drawClock();
        this.drawConnectionStatus();

        var interval = setInterval( () => {
            
            this.drawClock();
            this.drawConnectionStatus();
            
        }, 1000);
    }
     // this returns the time till next interval. If late will drop calls.
   getNextCallTime() {
    var nextCallIn = (startTime + interval * (count + 1)) - performance.now();
    if (nextCallIn < -interval / 2) { // to late drop the call
      count = Math.floor((performance.now() - startTime) / interval) + 1;
      nextCallIn = (startTime + interval * count) - performance.now();
    }
    return nextCallIn;
  }

    updateLocation(location) {
        TypeChecker.isString(location);
        $('#location').empty();
        $('#location').text("Location: " + location);
    }

    updateConnectionStatus(status) {
        this.#connectionStatus = status;
        
        if (status === ConnectionState.CONNECTED){
            $('#connectionStatus').empty();
        } else 
            if (status === ConnectionState.DISCONNECTED) {
            this.#timeLeft = Settings.TIME_UNTIL_LEAVE;
        }
    }
}