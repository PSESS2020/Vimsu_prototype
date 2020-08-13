const TypeChecker = require('../../client/shared/TypeChecker.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const Position = require('./Position.js');

module.exports = class GameObject {

    #id;
    #name;
    //creationDate;
    #width;
    #length;
    //height;
    #position;
    #isSolid;
    #gameObjectType;
    //isStatic;


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
     */
    constructor(id, gameObjectType, name, width, length, position, isSolid) {

        TypeChecker.isInt(id);
        TypeChecker.isString(name);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isInt(gameObjectType);
        TypeChecker.isBoolean(isSolid);

        this.#id = id;
        this.#gameObjectType = gameObjectType;
        this.#name = name;
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

    /*
    getDistance(otherPosition) {
        TypeChecker.isInstanceOf(otherPosition, Position);


    }
    */
}
