class StringParser {
    #string;

    constructor(string) {
        this.#string = string;
    }

    replaceSpaceWithUnderscore() {
        var string = this.#string.replace(/ /g, "_");
        return string;
    }
}