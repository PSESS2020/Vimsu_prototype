var Position = require('./Position.js')
var Direction = require('./Direction.js')
var ParticipantController = require('../../server/controller/ParticipantController.js')
var TypeChecker = require('../../client/utils/TypeChecker.js')

module.exports = class Participant {

    #id;
    #position;
    #direction;
    #participantController;

    /**
     * Erstellt Participant Instanz
     * 
     * @author Klaudia
     * 
     * @param {int} id 
     * @param {Position} position 
     * @param {Direction} direction 
     * @param {ParticipantController} participantController 
     */
    constructor(id, position, direction, participantController)
    {
        TypeChecker.isInt(id);
        TypeChecker.isInstanceOf(participantController, ParticipantController);

        this.#id = id;
        this.#participantController = participantController;

        if (!position || !direction)
        {
            this.#position = new Position(1, 1, 1);
            this.#direction = Direction.DOWNRIGHT;
        }

        else 
        {
            TypeChecker.isInstanceOf(position, Position);
            TypeChecker.isEnumOf(direction, Direction);

            this.#position = position;
            this.#direction = direction;
        }
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
        TypeChecker.isInstanceOf(position, Position);
        this.#position = position;
    }

    getDirection() {
        return this.#direction;
    }

    setDirection(direction) 
    {
        TypeChecker.isEnumOf(direction, Direction);
        this.#direction = direction;
    }

    getParticipantController() 
    {
        return this.#participantController;
    }
}


