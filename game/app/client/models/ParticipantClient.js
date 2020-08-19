if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    Direction = require('../shared/Direction.js');
}

class ParticipantClient {

    #id;
    #position;
    #direction;
    #username;
    #isVisible;
    #isModerator;

    /**
     * Erstellt ParticipantClient Instanz
     * 
     * @author Klaudia
     * 
     * @param {String} id
     * @param {String} username
     * @param {PositionClient} position
     * @param {Direction} direction
     * @param {boolean} isVisible
     * @param {boolean} isModerator
     */
    constructor(id, username, position, direction, isVisible, isModerator) {
        TypeChecker.isString(id);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isString(username);
        TypeChecker.isBoolean(isVisible);
        TypeChecker.isBoolean(isModerator);

        this.#id = id;
        this.#position = position;
        this.#direction = direction;
        this.#username = username;
        this.#isVisible = isVisible;
        this.#isModerator = isModerator;
    }

    getId() {
        return this.#id;
    }

    getPosition() {
        return this.#position;
    }

    getIsModerator() {
        return this.#isModerator;
    }

    setPosition(position) {
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
    }

    getDirection() {
        return this.#direction;
    }

    setDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#direction = direction;
    }

    getUsername() {
        return this.#username;
    }

    getIsVisible() {
        return this.#isVisible;
    }

    setisVisible(isVisible) {
        this.#isVisible = isVisible;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ParticipantClient;
}
