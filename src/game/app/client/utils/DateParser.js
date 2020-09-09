/**
 * The Date Parser
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class DateParser {

    #date;

    /**
     * creates an instance of Date parser
     * 
     * @param {Date} date date
     */
    constructor(date) {
        TypeChecker.isDate(date);
        this.#date = date;
    }

    /**
     * Parse date without seconds
     * 
     * @return parsed date
     */
    parse() {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        var parsedDate = days[this.#date.getDay()] + ", " + this.#printTwoDigitsNumber(this.#date.getDate()) + " "
            + months[this.#date.getMonth()] + " " + this.#date.getFullYear() + " " + this.parseOnlyTime();

        return parsedDate;
    }

    /**
     * Parse date with seconds
     * 
     * @return parsed date
     */
    parseWithSeconds() {
        var parsedDate = this.parse() + ":" + this.#printTwoDigitsNumber(this.#date.getSeconds());
        return parsedDate;
    }

    /**
     * Parse only time without seconds
     * 
     * @return parsed time
     */
    parseOnlyTime() {
        var parsedDate = this.#printTwoDigitsNumber(this.#date.getHours()) + ":" + this.#printTwoDigitsNumber(this.#date.getMinutes());
        return parsedDate;
    }

    /**
     * @private adds 0 in front of the number if number is less than 10
     * @param {number} number number
     * 
     * @return two digits number
     */
    #printTwoDigitsNumber = function (number) {
        return (number < 10 ? '0' : '') + number;
    }
}