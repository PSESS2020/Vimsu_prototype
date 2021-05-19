/**
 * The Date Parser
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class DateParser {

    date;

    /**
     * creates an instance of Date parser
     * 
     * @param {Date} date date
     */
    constructor(date) {
        TypeChecker.isDate(date);
        this.date = date;
    }

    /**
     * Parse date without seconds
     * 
     * @param {json} daysLanguageData language data for days
     * @param {json} monthsLanguageData language data for months
     * 
     * @return {String} parsed date
     */
    parse(daysLanguageData, monthsLanguageData) {
        var days = [daysLanguageData.sunday, daysLanguageData.monday, daysLanguageData.tuesday, daysLanguageData.wednesday, 
                    daysLanguageData.thursday, daysLanguageData.friday, daysLanguageData.saturday];
        var months = [monthsLanguageData.january, monthsLanguageData.february, monthsLanguageData.march, monthsLanguageData.april, monthsLanguageData.may, 
                    monthsLanguageData.june, monthsLanguageData.july, monthsLanguageData.august, monthsLanguageData.september, monthsLanguageData.october, 
                    monthsLanguageData.november, monthsLanguageData.december]

        var parsedDate = days[this.date.getDay()] + ", " + this.printTwoDigitsNumber(this.date.getDate()) + " "
            + months[this.date.getMonth()] + " " + this.date.getFullYear() + " " + this.parseOnlyTime();

        return parsedDate;
    }

    /**
     * Parse date with seconds
     * 
     * @param {json} daysLanguageData language data for days
     * @param {json} monthsLanguageData language data for months
     * 
     * @return {String} parsed date
     */
    parseWithSeconds(daysLanguageData, monthsLanguageData) {
        var parsedDate = this.parse(daysLanguageData, monthsLanguageData) + ":" + this.printTwoDigitsNumber(this.date.getSeconds());
        return parsedDate;
    }

    /**
     * Parse only time without seconds
     * 
     * @return {String} parsed time
     */
    parseOnlyTime() {
        var parsedDate = this.printTwoDigitsNumber(this.date.getHours()) + ":" + this.printTwoDigitsNumber(this.date.getMinutes());
        return parsedDate;
    }

    /**
     * adds 0 in front of the number if number is less than 10
     * @param {number} number number
     * 
     * @return {String} two digits number
     */
    printTwoDigitsNumber = function (number) {
        return (number < 10 ? '0' : '') + number;
    }
}