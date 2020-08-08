if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../utils/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    DirectionClient = require('../utils/DirectionClient.js');
}

class ParticipantClient {
    
    #id;
    #position;
    #direction;
    #username;

    /**
     * Erstellt ParticipantClient Instanz
     * 
     * @author Klaudia
     * 
     * @param {String} id
     * @param {String} username
     * @param {PositionClient} position
     * @param {DirectionClient} direction
     */
    constructor(id, username, position, direction) 
    {
        TypeChecker.isString(id);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, DirectionClient);
        TypeChecker.isString(username);

        this.#id = id;
        this.#position = position;
        this.#direction = direction;
        this.#username = username;
    }

    getId()
    {
        return this.#id;
    }

    getPosition() 
    {
        return this.#position;
    }

    setPosition(position) 
    {
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
    }

    getDirection() 
    {
        return this.#direction;
    }

    setDirection(direction) 
    {
        TypeChecker.isEnumOf(direction, DirectionClient);
        this.#direction = direction;
    }

    getUsername()
    {
        return this.#username;
    }
    
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ParticipantClient;
}
