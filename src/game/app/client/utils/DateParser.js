/**
 * The Date Parser
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class DateParser {

    days;
    months;

    /**
     * The Date Parser
     */
    constructor(daysLanguageData, monthsLanguageData) {
        if (!!DateParser.instance) {
            return DateParser.instance;
        }

        DateParser.instance = this;

        this.days = [daysLanguageData.sunday, daysLanguageData.monday, daysLanguageData.tuesday, daysLanguageData.wednesday, 
            daysLanguageData.thursday, daysLanguageData.friday, daysLanguageData.saturday];
        this.months = [monthsLanguageData.january, monthsLanguageData.february, monthsLanguageData.march, monthsLanguageData.april, monthsLanguageData.may, 
            monthsLanguageData.june, monthsLanguageData.july, monthsLanguageData.august, monthsLanguageData.september, monthsLanguageData.october, 
            monthsLanguageData.november, monthsLanguageData.december]
    }

    /**
     * Parse date without seconds
     * 
     * @param {Date} date 
     * 
     * @return {String} parsed date
     */
    parse(date) { 
        var parsedDate = this.days[date.getDay()] + ", " + this.printTwoDigitsNumber(date.getDate()) + " "
            + this.months[date.getMonth()] + " " + date.getFullYear() + " " + this.parseOnlyTime(date);

        return parsedDate;
    }

    /**
     * Parse date with seconds
     * 
     * @param {Date} date 
     * 
     * @return {String} parsed date
     */
    parseWithSeconds(date) {
        var parsedDate = this.parse(date) + ":" + this.printTwoDigitsNumber(date.getSeconds());
        return parsedDate;
    }

    /**
     * Parse only time without seconds
     * 
     * @param {Date} date 
     * 
     * @return {String} parsed time
     */
    parseOnlyTime(date) {
        var parsedDate = this.printTwoDigitsNumber(date.getHours()) + ":" + this.printTwoDigitsNumber(date.getMinutes());
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