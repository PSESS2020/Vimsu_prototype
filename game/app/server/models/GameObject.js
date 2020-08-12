const TypeChecker = require('../../client/shared/TypeChecker.js');
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
    //isStatic;


    /**
     * Erstellt GameObject-Instanz
     * 
     * @author Philipp
     * 
     * @param {int} id 
     * @param {String} name 
     * @param {int} width 
     * @param {int} length 
     * @param {Position} position 
     * @param {boolean} isSolid 
     */
    constructor(id, name, width, length, position, isSolid) {

        TypeChecker.isInt(id);
        TypeChecker.isString(name);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isBoolean(isSolid);

        this.#id = id;
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
