const TypeChecker = require('../../client/shared/TypeChecker.js');
const BusinessCard = require("./BusinessCard.js");

/**
 * The Friend List Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class FriendList {

    #memberList;

    /**
     * @constructor Creates FriendList Instance
     * 
     * @param {BusinessCard[]} memberList 
     */
    constructor(memberList) {
        TypeChecker.isInstanceOf(memberList, Array);
        memberList.forEach(element => {
            TypeChecker.isInstanceOf(element, BusinessCard);
        });

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
     * 
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
     * 
     * @param {String} ppantID
     * 
     * @return true if found, otherwise false
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
     * 
     * @param {String} ppantID 
     * 
     * @return business card
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

    /**
     * Gets all business cards
     * 
     * @return Array of business cards
     */
    getAllBusinessCards() {
        return this.#memberList;
    }
}