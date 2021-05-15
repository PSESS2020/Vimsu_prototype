const TypeChecker = require('../../client/shared/TypeChecker.js');
const BusinessCard = require("./BusinessCard.js");

/**
 * The Friend List Model
 * @module FriendList
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class FriendList {

    #memberList;

    /**
     * Creates FriendList Instance
     * @constructor module:FriendList
     * 
     * @param {BusinessCard[]} memberList list of member businesscards
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
     * @method module:FriendList#addBusinessCard
     * 
     * @param {BusinessCard} businessCardOfOther businessCard of other ppant
     */
    addBusinessCard(businessCardOfOther) {
        TypeChecker.isInstanceOf(businessCardOfOther, BusinessCard);

        this.#memberList.push(businessCardOfOther);
    }

    /**
     * Removes BusinessCard of ppant with ppantID from FriendList, if the BusinessCard is part of it
     * @method module:FriendList#removeBusinessCard
     * 
     * @param {String} ppantID ppantID 
     */
    removeBusinessCard(ppantID) {
        TypeChecker.isString(ppantID);
        for (let index = 0; index < this.#memberList.length; index++) {
            const card = this.#memberList[index]
            if (card.getParticipantId() === ppantID) {
                this.#memberList.splice(index, 1);
                return;
            }
        }
    }

    /**
     * Checks if ppant with ppantID is part of the friendList
     * @method module:FriendList#includes
     * 
     * @param {String} ppantID ppantID
     * 
     * @return {boolean} true if found, otherwise false
     */
    includes(ppantID) {
        TypeChecker.isString(ppantID);

        for (let index = 0; index < this.#memberList.length; index++) {
            const card = this.#memberList[index]
            if (card.getParticipantId() === ppantID) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gives BusinessCard from ppant with ppantID, if he is part of the friendList
     * @method module:FriendList#getBusinessCard
     * 
     * @param {String} ppantID 
     * 
     * @return {BusinessCard} business card
     */
    getBusinessCard(ppantID) {
        TypeChecker.isString(ppantID);

        for (let index = 0; index < this.#memberList.length; index++) {
            const card = this.#memberList[index]
            if (card.getParticipantId() === ppantID) {
                return card;
            }
        }

        return undefined;
    }

    /**
     * Gets all business cards
     * @method module:FriendList#getAllBusinessCards
     * 
     * @return {BusinessCard[]} Array of business cards
     */
    getAllBusinessCards() {
        return this.#memberList;
    }
}