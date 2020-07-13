var Position = require('./Position.js')
var ParticipantController = require('../../server/controller/ParticipantController.js')
var TypeChecker = require('../../utils/TypeChecker.js')
const Settings = require('../../utils/Settings.js');
const Direction = require('../models/Direction')

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
     * @param {String} id 
     * @param {Position} position 
     * @param {Direction} direction 
     */
    constructor(id, position, direction)
    {
        TypeChecker.isString(id);
        //TypeChecker.isInstanceOf(participantController, ParticipantController);

        this.#id = id;
        //this.#participantController = participantController;

        if (!position || !direction)
        {
            this.#position = new Position(Settings.STARTROOM, Settings.STARTPOSITION_X, Settings.STARTPOSITION_Y);
            this.#direction = Settings.STARTDIRECTION;
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


