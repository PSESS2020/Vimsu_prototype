const Position = require('./Position.js')
const TypeChecker = require('../../client/shared/TypeChecker.js');
const Direction = require('../../client/shared/Direction.js')
const BusinessCard = require('./BusinessCard.js')
const FriendList = require('./FriendList.js');
const Achievement = require('./Achievement.js');
const Chat = require('./Chat.js');
const Task = require('./Task.js');
const OneToOneChat = require('./OneToOneChat.js');
const TypeOfTask = require('../utils/TypeOfTask');
const ShirtColor = require('../../client/shared/ShirtColor.js');
const Settings = require('../utils/Settings.js');
const Meeting = require('./Meeting.js');

/**
 * The Participant Model
 * @module Participant
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Participant {

    #id;
    #accountId;
    #businessCard;
    #position;
    #direction;
    #friendList;
    #receivedRequestList;
    #meetingList
    #sentRequestList;
    #isMod;
    #taskTypeMapping;
    #achievements;
    #awardPoints;
    #chatList;
    #isVisible;
    #shirtColor;

    /**
     * Creates a participant instance
     * @constructor module:Participant
     * 
     * @param {String} id participant ID
     * @param {String} accountId account ID
     * @param {BusinessCard} businessCard business card
     * @param {Position} position participant position
     * @param {Direction} direction avatar direction
     * @param {FriendList} friendList list of friends
     * @param {FriendList} receivedRequestList list of received friend requests
     * @param {FriendList} sentRequestList list of sent friend requests
     * @param {Meeting[]} meetingList List of jitsi meetings
     * @param {Achievement[]} achievements list of achievements
     * @param {Task[]} taskMapping list of tasks and its counts
     * @param {boolean} isMod moderator status
     * @param {number} awardPoints participant's points
     * @param {Chat[]} chatList list of chats
     */
    constructor(id, accountId, businessCard, position, direction, friendList, receivedRequestList, sentRequestList, achievements, taskMapping, isMod, awardPoints, chatList, meetingList) {
        //Typechecking

        TypeChecker.isString(id);
        TypeChecker.isString(accountId);
        TypeChecker.isInstanceOf(businessCard, BusinessCard);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isInstanceOf(friendList, FriendList);
        TypeChecker.isInstanceOf(receivedRequestList, FriendList);
        TypeChecker.isInstanceOf(sentRequestList, FriendList);
        if (achievements) {
            TypeChecker.isInstanceOf(achievements, Array);
            achievements.forEach(achievement => {
                TypeChecker.isInstanceOf(achievement, Achievement);
            });
        }
        TypeChecker.isBoolean(isMod);
        TypeChecker.isInt(awardPoints);
        TypeChecker.isInstanceOf(chatList, Array);
        chatList.forEach(chat => {
            TypeChecker.isInstanceOf(chat, Chat);
        });
        TypeChecker.isInstanceOf(meetingList, Array);
        meetingList.forEach(meeting => {
            TypeChecker.isInstanceOf(meeting, Meeting);
        })

        this.#id = id;
        this.#accountId = accountId;
        this.#businessCard = businessCard;
        this.#position = position;
        this.#direction = direction;
        this.#friendList = friendList;
        this.#receivedRequestList = receivedRequestList;
        this.#sentRequestList = sentRequestList;
        this.#taskTypeMapping = taskMapping;
        this.#achievements = achievements;
        this.#isMod = isMod;
        this.#awardPoints = awardPoints;
        this.#chatList = chatList;
        this.#meetingList = meetingList;
        this.#isVisible = true;
        this.#shirtColor = Settings.DEFAULT_SHIRTCOLOR_PPANT;
    }

    /**
     * Gets participant ID
     * @method module:Participant#getId
     * 
     * @return {String} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets participant's position
     * @method module:Participant#getPosition
     * 
     * @return {Position} position
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Gets avatar's direction
     * @method module:Participant#getDirection
     * 
     * @return {String} direction
     */
    getDirection() {
        return this.#direction;
    }

    /**
     * Gets account ID
     * @method module:Participant#getAccountId
     * 
     * @return {String} accountId
     */
    getAccountId() {
        return this.#accountId;
    }

    /**
     * Gets business card
     * @method module:Participant#getBusinessCard
     * 
     * @return {BusinessCard} businessCard
     */
    getBusinessCard() {
        return this.#businessCard;
    }

    /**
     * Gets list of friends
     * @method module:Participant#getFriendList
     * 
     * @return {FriendList} friendList
     */
    getFriendList() {
        return this.#friendList;
    }

    /**
     * Gets list of received friend requests
     * @method module:Participant#getReceivedRequestList
     * 
     * @return {FriendList} receivedRequestList
     */
    getReceivedRequestList() {
        return this.#receivedRequestList;
    }

    /**
     * Gets list of sent friend requests
     * @method module:Participant#getSentRequestList
     * 
     * @return {FriendList} sentRequestList
     */
    getSentRequestList() {
        return this.#sentRequestList;
    }

    /**
     * Gets list of achievements
     * @method module:Participant#getAchievements
     * 
     * @return {Achievement[]} achievements
     */
    getAchievements() {
        return this.#achievements;
    }

    /**
     * Gets avatar's visibility 
     * @method module:Participant#getIsVisible
     * 
     * @return {boolean} true if visible, otherwise false
     */
    getIsVisible() {
        return this.#isVisible;
    }

    /**
     * Gets moderator status
     * @method module:Participant#getIsModerator
     * 
     * @return {boolean} true if moderator, otherwise false
     */
    getIsModerator() {
        return this.#isMod;
    }

    /**
     * Gets avatar shirt color
     * @method module:Participant#getShirtColor
     * 
     * @return {ShirtColor} shirt color
     */
    getShirtColor() {
        return this.#shirtColor;
    }

    /**
     * Sets avatar shirt color
     * @method module:Participant#setShirtColor
     * 
     * @param {ShirtColor} shirtColor new shirt color
     */
    setShirtColor(shirtColor) {
        TypeChecker.isEnumOf(shirtColor, ShirtColor);

        this.#shirtColor = shirtColor;
    }

    /**
     * Sets moderator status
     * @method module:Participant#setIsModerator
     * 
     * @param {boolean} isMod moderator status
     */
    setIsModerator(isMod) {
        TypeChecker.isBoolean(isMod);
        this.#isMod = isMod;
    }

    /**
     * Gets chat list
     * @method module:Participant#getChatList
     * 
     * @return {Chat[]} chatList
     */
    getChatList() {
        return this.#chatList;
    }

    /**
     * Gets meeting list
     * @method module:Participant#getMeetingList
     * 
     * @return {Meeting[]} meetingList
     */
    getMeetingList() {
        return this.#meetingList;
    }

    /**
     * Adds chat to the chat list
     * @method module:Participant#addChat
     * 
     * @param {Chat} chat chat instance
     */
    addChat(chat) {
        TypeChecker.isInstanceOf(chat, Chat);
        if (!this.#chatList.includes(chat)) {
            this.#chatList.push(chat);
        }
    }

    /**
     * Adds Meeting instance to the meeting list.
     * @method module:Participant#joinMeeting
     * 
     * @param {Meeting} meeting 
     */
    joinMeeting(meeting) {
        TypeChecker.isInstanceOf(meeting, Meeting);
        if (!this.#meetingList.includes(meeting)) {
            this.#meetingList.push(meeting);
        }
    }

    /**
     * Removes Meeting instance from the meeting list.
     * @method module:Participant#leaveMeeting
     * 
     * @param {String} meetingId
     */
    leaveMeeting(meetingId) {
        TypeChecker.isString(meetingId);

        this.#meetingList.forEach((meeting, index) => {
            if (meeting.getId() === meetingId) {
                meeting.removeMember(this.#id);
                this.#meetingList.splice(index, 1);
            }
        })

    }

    /**
     * Sets avatar's position
     * @method module:Participant#setPosition
     * 
     * @param {Position} position position
     */
    setPosition(position) {
        TypeChecker.isInstanceOf(position, Position);
        this.#position = position;
    }

    /**
     * Sets avatar's direction
     * @method module:Participant#setDirection
     * 
     * @param {Direction} direction direction
     */
    setDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#direction = direction;
    }

    /**
     * Sets visibility
     * @method module:Participant#setIsVisible
     * 
     * @param {boolean} isVisible visibility
     */
    setIsVisible(isVisible) {
        TypeChecker.isBoolean(isVisible);
        this.#isVisible = isVisible;
    }

    /**
     * Adds ppant to list of sent friend request.
     * Method called, when this ppant sends a friend request to ppant with this businessCard
     * @method module:Participant#addSentFriendRequest
     * 
     * @param {BusinessCard} businessCard business card
     */
    addSentFriendRequest(businessCard) {
        TypeChecker.isInstanceOf(businessCard, BusinessCard);
        let ppantId = businessCard.getParticipantId();
        if (!this.#sentRequestList.includes(ppantId) && !this.#friendList.includes(ppantId)) {
            this.#sentRequestList.addBusinessCard(businessCard);
        }
    }

    /**
     * Called when the outgoing friend request to ppant with ppantId was accepted
     * @method module:Participant#sentFriendRequestAccepted
     * 
     * @param {String} ppantId participant ID
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
     * @method module:Participant#sentFriendRequestDeclined
     * 
     * @param {String} ppantId participant ID
     */
    sentFriendRequestDeclined(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#sentRequestList.includes(ppantId)) {
            this.#sentRequestList.removeBusinessCard(ppantId);
        }
    }

    /**
     * Adds a friend request to the received friend request list
     * @method module:Participant#addFriendRequest
     * 
     * @param {BusinessCard} businessCard business card
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
     * @method module:Participant#acceptFriendRequest
     * 
     * @param {String} ppantId participant ID
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
     * @method module:Participant#declineFriendRequest
     * 
     * @param {String} ppantId participant ID
     */
    declineFriendRequest(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#receivedRequestList.includes(ppantId)) {
            this.#receivedRequestList.removeBusinessCard(ppantId);
        }
    }

    /**
     * Removes ppant with ppantId from FriendList, if he is part of it
     * @method module:Participant#removeFriend
     * 
     * @param {String} ppantId participant ID
     */
    removeFriend(ppantId) {
        TypeChecker.isString(ppantId);
        if (this.#friendList.includes(ppantId)) {
            this.#friendList.removeBusinessCard(ppantId);
        }
    }

    /**
     * Checks if participant has a friend with a participant with ppantId
     * @method module:Participant#hasFriend
     * 
     * @param {String} ppantId participant ID
     * @return {boolean} true if participant has friend with passed id, false otherwise
     */
    hasFriend(ppantId) {
        if (ppantId) {
            TypeChecker.isString(ppantId);
            return this.#friendList.includes(ppantId) // TODO: method does more than the name says it does
        }
    }

    /**
     * Checks if participant has sent/received a friend request to/from a participant with ppantId
     * @method module:Participant#hasSentFriendRequest
     * 
     * @param {String} ppantId participant ID
     * @return {boolean} true if the participant has sent a friend request to the participant with the passed id, false otherwise
     */
    hasSentFriendRequest(ppantId) {
        if (ppantId) {
            TypeChecker.isString(ppantId);

            return (this.#sentRequestList.includes(ppantId) || this.#receivedRequestList.includes(ppantId));
        }
    }

    /**
     * Removes chat from the chat list
     * @method module:Participant#removeChat
     * 
     * @param {String} chatId chat ID
     */
    removeChat(chatId) {
        TypeChecker.isString(chatId);

        this.#chatList.forEach((chat, index) => {
            if (chat.getId() === chatId) {
                chat.removeParticipant(this.#id);
                this.#chatList.splice(index, 1);
            }
        });
    }

    /**
     * Updates an existing chat with updatedChat
     * @method module:Participant#updateeChat
     * 
     * @param {String} updatedChat updated Chat
     */
    updateChat(updatedChat) {
        TypeChecker.isInstanceOf(updatedChat, Chat);

        this.#chatList.forEach((chat, index) => {
            if (chat.getId() === updatedChat.getId()) {
                this.#chatList[index] = updatedChat;
            }
        });
    }

    /**
     * Gets tasks and its count
     * @method module:Participant#getTaskTypeMappingCounts
     * 
     * @return {Task[]} taskTypeMapping
     */
    getTaskTypeMappingCounts() {
        return this.#taskTypeMapping;
    }

    /**
     * Gets a task based on the task type
     * @method module:Participant#getTaskTypeMappinCount
     * @param {TypeOfTask} taskType task type
     * 
     * @return {Task} task
     */
    getTaskTypeMappingCount(taskType) {
        return this.#taskTypeMapping[taskType];
    }

    /**
     * Called if a task is fulfilled to increase the counter and the points
     * @method module:Participant#addTask
     * 
     * @param {Task} task task instance
     */
    addTask(task) {
        TypeChecker.isInstanceOf(task, Task);

        // increase the task counter and assign award points accordingly
        this.#taskTypeMapping[task.getTaskType()] = this.#taskTypeMapping[task.getTaskType()] + 1;
        this.addAwardPoints(task.getAwardPoints());
    }

    /**
     * Adds points of participant
     * @method module:Participant#addAwardPoints
     * 
     * @param {number} awardPoints points
     */
    addAwardPoints(awardPoints) {
        TypeChecker.isInt(awardPoints);
        this.#awardPoints += awardPoints;
    }

    /**
     * Sets achievements
     * @method module:Participant#setAchievements
     * 
     * @param {Achievement[]} achievements achievements
     */
    setAchievements(achievements) {
        TypeChecker.isInstanceOf(achievements, Array);
        achievements.forEach(achievement => {
            TypeChecker.isInstanceOf(achievement, Achievement);
        })

        this.#achievements = achievements;
    }

    /**
     * Gets participant's points
     * @method module:Participant#getAwardPoints
     * 
     * @return {number} points
     */
    getAwardPoints() {
        return this.#awardPoints;
    }

    /**
     * Gets a chat from the chat list
     * @method module:Participant#getChat
     * 
     * @param {String} chatId chat ID
     * 
     * @return {Chat} chat
     */
    getChat(chatId) {
        TypeChecker.isString(chatId);

        for (var i = 0; i < this.#chatList.length; i++) {
            if (this.#chatList[i].getId() == chatId) {
                return this.#chatList[i];
            }
        }
    };

    /**
     * Checks if participant is member of chat with this chatId
     * @method module:Participant#isMemberOfChat
     * 
     * @param {String} chatId chat ID
     * 
     * @return {boolean} true if so, otherwise false
     */
    isMemberOfChat(chatId) {
        TypeChecker.isString(chatId);

        for (var i = 0; i < this.#chatList.length; i++) {
            if (this.#chatList[i].getId() == chatId) {
                return true;
            }
        }
        return false;
    };

    /**
     * Adds an achievement to the list of achievements
     * @method module:Participant#addAchievement
     * 
     * @param {Achievement} achievement achievement
     */
    addAchievement(achievement) {
        TypeChecker.isInstanceOf(achievement, Achievement);
        this.#achievements.push(achievement);
    }

    /**
     * Removes an achievement from the list of achievements
     * @method module:Participant#removeAchievement
     * 
     * @param {number} achievementId achievement ID
     */
    removeAchievement(achievementId) {
        TypeChecker.isInt(achievementId);

        let index = this.#achievements.findIndex(ach => ach.getId() === achievementId);

        if (index < 0) {
            throw new Error(achievementId + " not found in list of achievements")
        }

        this.#achievements.splice(index, 1);
    }

    /**
     * Check if this ppant has a 1:1 chat with chatPartnerID
     * @method module:Participant#hasChatWith
     * 
     * @param {String} chatPartnerID chat partner ID
     * 
     * @return {boolean} true if so, otherwise false
     */
    hasChatWith(chatPartnerID) {
        TypeChecker.isString(chatPartnerID);
        //check each chat
        for (var i = 0; i < this.#chatList.length; i++) {
            //check if chat is 1:1
            let chat = this.#chatList[i];
            if (chat instanceof OneToOneChat) {
                //check if chatPartner is inclucded
                if (chat.getParticipantList()[0] === chatPartnerID || chat.getParticipantList()[1] === chatPartnerID) {
                    return true;
                }
            }
        }
        return false;
    }
}
