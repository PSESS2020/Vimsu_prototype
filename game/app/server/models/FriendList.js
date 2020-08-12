const TypeChecker = require('../../client/shared/TypeChecker.js');
const BusinessCard = require("./BusinessCard.js");


module.exports = class FriendList {

    #ownerId;
    #memberList;

    /**
     * Creates FriendList Instance. Will be only called by FriendListService, which gets the member list from the DB
     * 
     * @author Philipp
     * 
     * @param {String} ownerId 
     * @param {Array of BusinessCard} memberList 
     */
    constructor(ownerId, memberList) {
        TypeChecker.isString(ownerId);
        TypeChecker.isInstanceOf(memberList, Array);
        memberList.forEach(element => {
            TypeChecker.isInstanceOf(element, BusinessCard);
        });

        this.#ownerId = ownerId;
        this.#memberList = memberList;
    }

    /**
     * Adds BusinessCard of other ppant to FriendList
     * 
     * @param {BusinessCard} businessCardOfOther 
     */
    addBusinessCard(businessCardOfOther) {
        TypeChecker.isInstanceOf(businessCardOfOther, BusinessCard);

        this.#memberList.push(businessCardOfOther);
    }

    /**
     * Removes BusinessCard of ppant with ppantID from FriendList, if the BusinessCard is part of it
     * @param {String} ppantID 
     */
    removeBusinessCard(ppantID) {
        TypeChecker.isString(ppantID);
        this.#memberList.forEach(card => {
            if (card.getParticipantId() === ppantID) {
                let index = this.#memberList.indexOf(card);
                this.#memberList.splice(index, 1);
            }
        });
    }

    /**
     * Checks if ppant with ppantID is part of the friendList
     * @param {String} ppantID
     */
    includes(ppantID) {
        TypeChecker.isString(ppantID);
        var isFriend = false;
        this.#memberList.forEach(card => {
            if (card.getParticipantId() === ppantID) {
                isFriend = true;
            }
        });
        return isFriend;
    }

    /**
     * Gives BusinessCard from ppant with ppantID, if he is part of the friendList
     * @param {String} ppantID 
     */
    getBusinessCard(ppantID) {
        TypeChecker.isString(ppantID);
        var ppantCard;
        this.#memberList.forEach(card => {
            if (card.getParticipantId() === ppantID) {
                ppantCard = card;
            }
        });
        return ppantCard;
    }

    getAllBusinessCards() {
        return this.#memberList;
    }
}