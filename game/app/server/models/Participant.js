var Position = require('./Position.js')
var ParticipantController = require('../../server/controller/ParticipantController.js')
var TypeChecker = require('../../utils/TypeChecker.js')
const Settings = require('../../utils/Settings.js');
const Direction = require('../models/Direction.js')
const BusinessCard = require('./BusinessCard.js')
const FriendList = require('./FriendList.js');

module.exports = class Participant {

    #id;
    #position;
    #accountId;
    #direction;
    #businessCard;
    #friendList;
    #friendRequestList;

    /**
     * Erstellt Participant Instanz
     * 
     * @author Klaudia
     * 
     * @param {String} id 
     * @param {Position} position 
     * @param {Direction} direction 
     */
    constructor(id, accountId, businessCard, position, direction)
    {
        TypeChecker.isString(id);
        //TypeChecker.isString(accountId);
        //TypeChecker.isInstanceOf(businessCard, BusinessCard);
        //TypeChecker.isInstanceOf(participantController, ParticipantController);

        this.#id = id;
        this.#accountId = accountId;
        this.#businessCard = businessCard;
        //this.#participantController = participantController;

        /* 
        if (!position || !direction)
        {
            this.#position = new Position(Settings.STARTROOM, Settings.STARTPOSITION_X, Settings.STARTPOSITION_Y);
            this.#direction = Settings.STARTDIRECTION;
        }

        else 
        {
        */
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isEnumOf(direction, Direction);

        this.#position = position;
        this.#direction = direction;

        //TODO: Get FriendList from FriendListService (P)
        this.#friendList = new FriendList(this.#id, []);

        //TODO: Get FriendRequestList from FriendListService (P)
        this.#friendRequestList = new FriendList(this.#id, []);
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

    getFriendList() {
        return this.#friendList;
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

    /**
     * Method called to add a FriendRequest
     * @param {BusinessCard} businessCard 
     */
    addFriendRequest(businessCard) {
        TypeChecker.isInstanceOf(BusinessCard, businessCard);
        if (!this.#friendRequestList.includes(ppantId) && !this.#friendList.includes(ppantId)) {
            this.#friendRequestList.addBusinessCard(businessCard);
        }
    }

    /**
     * Accept FriendRequest from ppantId, if a request exists
     * @param {String} ppantId 
     */
    acceptFriendRequest(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#friendRequestList.includes(ppantId)) {
            let busCard = this.#friendRequestList.getBusinessCard(ppantId);
            this.#friendList.addBusinessCard(busCard);
            this.#friendRequestList.removeBusinessCard(ppantId);
        }
    }

    /**
     * Declines FriendRequest from ppantId, if a request exists
     * @param {String} ppantId 
     */
    declineFriendRequest(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#friendRequestList.includes(ppantId)) {
            this.#friendRequestList.removeBusinessCard(ppantId);
        }
    }

    /**
     * Removes ppant with ppantId from FriendList, if he is part of it
     * @param {String} ppantId 
     */
    removeFriend(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#friendList.includes(ppantId)) {
            this.#friendList.removeBusinessCard(ppantId);
        }
    }
}


