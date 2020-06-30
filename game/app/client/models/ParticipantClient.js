var PositionClient = require('./PositionClient.js')
var DirectionClient = require('./DirectionClient.js')
var TypeChecker = require('../../utils/TypeChecker.js')

module.exports = class ParticipantClient {
    
    #position;
    #direction;
    
    constructor(position, direction) 
    {
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, DirectionClient);

        this.#position = position;
        this.#direction = direction;
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
}