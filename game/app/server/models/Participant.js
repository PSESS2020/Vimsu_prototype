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
    #receivedRequestList;
    #sentRequestList

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

        //TODO: Get FriendRequestList from FriendRequestListService (P)
        this.#receivedRequestList = new FriendList(this.#id, []);
        this.#sentRequestList = new FriendList(this.#id, []);

        
        //JUST FOR TESTING PURPOSES
        this.#friendList.addBusinessCard(new BusinessCard('22abc', 'MaxMusterFriend', 'Dr', 'Mustermann', 'Max', 'racer', 'Mercedes', 'max.mustermann@gmail.com'));
        this.#receivedRequestList.addBusinessCard(new BusinessCard('22abcd', 'MaxMusterFriendRequester', 'Dr', 'Mustermann', 'Hans', 'racer', 'Ferrari', 'hans.mustermann@gmail.com'));
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

    getReceivedRequestList() {
        return this.#receivedRequestList;
    }

    getSendRequestList() {
        return this.#sentRequestList;
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
     * Method called, when this ppant sends a friend request to ppant with this businessCard
     * @param {BusinessCard} businessCard 
     */
    addSentFriendRequest(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCard);
        let ppandId = businessCard.getParticipantId();
        if (!this.#sentRequestList.includes(ppantId) && !this.#friendList.includes(ppantId)) {
            this.#sentRequestList.addBusinessCard(businessCard);
        }
    }

    /**
     * Called when outgoing friend request to ppant with ppantId was accepted
     * @param {String} ppantId 
     */
    sentFriendRequestAccepted(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#sentRequestList.includes(ppantId)) {
            let busCard = this.#sentRequestList.getBusinessCard(ppantId);
            this.#friendList.addBusinessCard(busCard);
            this.#sentRequestList.removeBusinessCard(ppantId);
        }
    }

    /**
     * Called when outgoing friend request to ppant with ppantId was declined
     * @param {String} ppantId 
     */
    sentFriendRequestDeclined(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#sentRequestList.includes(ppantId)) {
            this.#sentRequestList.removeBusinessCard(ppantId);
        }
    }

    /**
     * Method called to add a FriendRequest
     * @param {BusinessCard} businessCard 
     */
    addFriendRequest(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCard);
        let ppantId = businessCard.getParticipantId();
        if (!this.#receivedRequestList.includes(ppantId) && !this.#friendList.includes(ppantId)) {
            this.#receivedRequestList.addBusinessCard(businessCard);
        }
    }

    /**
     * Accept FriendRequest from ppantId, if a request exists
     * @param {String} ppantId 
     */
    acceptFriendRequest(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#receivedRequestList.includes(ppantId)) {
            let busCard = this.#receivedRequestList.getBusinessCard(ppantId);
            this.#friendList.addBusinessCard(busCard);
            this.#receivedRequestList.removeBusinessCard(ppantId);
        }
    }

    /**
     * Declines FriendRequest from ppantId, if a request exists
     * @param {String} ppantId 
     */
    declineFriendRequest(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#receivedRequestList.includes(ppantId)) {
            this.#receivedRequestList.removeBusinessCard(ppantId);
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
