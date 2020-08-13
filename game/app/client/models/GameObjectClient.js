if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    GameObjectType = require('../shared/GameObjectType.js');
}

class GameObjectClient {

    #id;
    #name;
    //creationDate;
    #width;
    #length;
    //height;
    #position;
    #isSolid;
    //isStatic;
    #gameObjectType;

    /**
     * Erstellt GameObject-Instanz
     * 
     * @author Philipp
     * 
     * @param {int} id 
     * @param {GameObjectType} gameObjectType
     * @param {int} width 
     * @param {int} length 
     * @param {Position} position 
     * @param {boolean} isSolid 
     */
    constructor(id, gameObjectType, width, length, position, isSolid) {

        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isBoolean(isSolid);

        this.#id = id;
        this.#gameObjectType = gameObjectType;
        this.#width = width;
        this.#length = length;

        //Position der linken, unteren Objektecke
        this.#position = position;
        this.#isSolid = isSolid;
    }

    getId() {
        return this.#id;
    }

    getGameObjectType() {
        return this.#gameObjectType;
    }

    getWidth() {
        return this.#width;
    }

    getLength() {
        return this.#length;
    }

    getPosition() {
        return this.#position;
    }

    getSolid() {
        return this.#isSolid;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectClient;
}