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
    #isClickable;

    /**
     * Erstellt GameObject-Instanz
     * 
     * @author Philipp
     * 
     * @param {int} id 
     * @param {GameObjectType} gameObjectType
     * @param {String} name
     * @param {int} width 
     * @param {int} length 
     * @param {Position} position 
     * @param {boolean} isSolid 
     * @param {boolean} isClickable
     */
    constructor(id, gameObjectType, name, width, length, position, isSolid, isClickable) {

        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isString(name);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isBoolean(isSolid);
        TypeChecker.isBoolean(isClickable);

        this.#id = id;
        this.#gameObjectType = gameObjectType;
        this.#name = name;
        this.#width = width;
        this.#length = length;

        //Position der linken, unteren Objektecke
        this.#position = position;
        this.#isSolid = isSolid;
        this.#isClickable = isClickable;
    }

    getId() {
        return this.#id;
    }

    getGameObjectType() {
        return this.#gameObjectType;
    }

    getName() {
        return this.#name;
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

    isClickable() {
        return this.#isClickable;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectClient;
}