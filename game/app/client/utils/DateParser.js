class DateParser {

    #date;
    constructor(date) {
        TypeChecker.isDate(date);
        this.#date = date;
    }

    parse() {
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        var parsedDate = days[this.#date.getDay()] + ", " +(this.#date.getDate()<10?'0':'') + this.#date.getDate() + "/" 
        + (this.#date.getMonth()<10?'0':'') + this.#date.getMonth() + "/" + this.#date.getFullYear() 
        + " " + (this.#date.getHours()<10?'0':'') + this.#date.getHours() + 
        ":" + (this.#date.getMinutes()<10?'0':'') + this.#date.getMinutes();
        
        return parsedDate;
    }

    parseWithSeconds() {
        var parsedDate = this.parse() + ":" + (this.#date.getSeconds()<10?'0':'') + this.#date.getSeconds();
        return parsedDate;
    }
}