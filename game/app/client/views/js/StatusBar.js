class StatusBar extends Views{

    constructor(){
        super();
    }

    drawClock() {
        $('#time').empty()
        var now = new DateParser(new Date()).parseWithSeconds();

        $('#time').text(now);
        setTimeout(this.drawClock, 500);
    }

    updateLocation(location) {
        TypeChecker.isString(location);
        $('#location').empty();
        $('#location').text("Location: " + location);
    }

}