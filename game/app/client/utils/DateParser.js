class DateParser {

    #date;
    
    constructor(date) {
        TypeChecker.isDate(date);
        this.#date = date;
    }

    parse() {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        var parsedDate = days[this.#date.getDay()] + ", " + this.#printTwoDigitsNumber(this.#date.getDate()) + " "
            + months[this.#date.getMonth()] + " " + this.#date.getFullYear() + " " + this.parseOnlyTime();

        return parsedDate;
    }

    parseWithSeconds() {
        var parsedDate = this.parse() + ":" + this.#printTwoDigitsNumber(this.#date.getSeconds());
        return parsedDate;
    }

    parseOnlyTime() {
        var parsedDate = this.#printTwoDigitsNumber(this.#date.getHours()) + ":" + this.#printTwoDigitsNumber(this.#date.getMinutes());
        return parsedDate;
    }

    #printTwoDigitsNumber = function(number) {
        return (number < 10 ? '0' : '') + number;
    }
}