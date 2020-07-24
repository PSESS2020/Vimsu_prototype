class StatusBar extends Views{

    constructor(){
        super();
    }

    drawClock() {
        $('#time').empty()
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var today = new Date();
        var day = days[today.getDay()];
        var date = today.getDate();
        var month = today.getMonth();
        var year = today.getFullYear();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        $('#time').append(`${day + ", " + (date<10?'0':'') + date + "/" + (month<10?'0':'') + month + "/" + year + " " + (h<10?'0':'') + h + ":" + (m<10?'0':'') + m + ":" + (s<10?'0':'') + s}`);
        var t = setTimeout(this.drawClock, 500);
    }

    updateLocation(location) {
        TypeChecker.isString(location);
        $('#location').empty();
        $('#location').append(`${"Location: " + location}`);
    }

}