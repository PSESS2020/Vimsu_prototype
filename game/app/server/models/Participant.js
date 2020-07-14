var Position = require('./Position.js')
var ParticipantController = require('../../server/controller/ParticipantController.js')
var TypeChecker = require('../../utils/TypeChecker.js')
const Settings = require('../../utils/Settings.js');
const Direction = require('../models/Direction')
const BusinessCard = require('../models/BusinessCard')

module.exports = class Participant {

    #id;
    #position;
    #accountId;
    #direction;
    #businessCard;
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
        //TypeChecker.isString(accountId);
        //TypeChecker.isInstanceOf(businessCard, BusinessCard);
        //TypeChecker.isInstanceOf(participantController, ParticipantController);

        this.#id = id;
        //this.#accountId = accountId;
        //this.#businessCard = businessCard;
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

    getAccountId()
    {
        return this.#accountId;
    }

    getBusinessCard()
    {
        return this.#businessCard;
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


