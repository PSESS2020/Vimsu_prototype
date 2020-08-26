const Position = require('./Position.js')
const TypeChecker = require('../../client/shared/TypeChecker.js');
const Direction = require('../../client/shared/Direction.js')
const BusinessCard = require('./BusinessCard.js')
const FriendList = require('./FriendList.js');
const Achievement = require('./Achievement.js');
const Chat = require('./Chat.js');
const Task = require('./Task.js');
const OneToOneChat = require('./OneToOneChat.js');
const TypeOfTask = require('../utils/TypeOfTask')

module.exports = class Participant {

    #id;
    #accountId;
    #businessCard;
    #position;
    #direction;
    #friendList;
    #receivedRequestList;
    #sentRequestList;
    #isMod;
    #taskTypeMapping;
    #achievements;
    #awardPoints;
    #chatList;
    #isVisible;

    /**
     * @constructor Creates a participant instance
     * 
     * @param {String} id participant ID
     * @param {String} accountId account ID
     * @param {BusinessCard} businessCard business card
     * @param {Position} position participant position
     * @param {Direction} direction avatar direction
     * @param {FriendList} friendList list of friends
     * @param {FriendList} receivedRequestList list of received friend requests
     * @param {FriendList} sentRequestList list of sent friend requests
     * @param {Achievement[]} achievements list of achievements
     * @param {Task[]} taskMapping list of tasks and its counts
     * @param {boolean} isMod moderator status
     * @param {number} awardPoints participant's points
     * @param {Chat[]} chatList list of chats
     */
    constructor(id, accountId, businessCard, position, direction, friendList, receivedRequestList, sentRequestList, achievements, taskMapping, isMod, awardPoints, chatList) {
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
        this.#isVisible = true;
    }

    /**
     * Gets participant ID
     * 
     * @return id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets participant's position
     * 
     * @return position
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Gets avatar's direction
     * 
     * @return direction
     */
    getDirection() {
        return this.#direction;
    }

    /**
     * Gets account ID
     * 
     * @return accountId
     */
    getAccountId() {
        return this.#accountId;
    }

    /**
     * Gets business card
     * 
     * @return businessCard
     */
    getBusinessCard() {
        return this.#businessCard;
    }

    /**
     * Gets list of friends
     * 
     * @return friendList
     */
    getFriendList() {
        return this.#friendList;
    }

    /**
     * Gets list of received friend requests
     * 
     * @return receivedRequestList
     */
    getReceivedRequestList() {
        return this.#receivedRequestList;
    }

    /**
     * Gets list of sent friend requests
     * 
     * @return sentRequestList
     */
    getSentRequestList() {
        return this.#sentRequestList;
    }

    /**
     * Gets list of achievements
     * 
     * @return achievements
     */
    getAchievements() {
        return this.#achievements;
    }

    /**
     * Gets avatar's visibility 
     * 
     * @return true if visible, otherwise false
     */
    getIsVisible() {
        return this.#isVisible;
    }

    /**
     * Gets moderator status
     * 
     * @return true if moderator, otherwise false
     */
    getIsModerator() {
        return this.#isMod;
    }

    /**
     * Gets chat list
     * 
     * @return chatList
     */
    getChatList() {
        return this.#chatList;
    }

    /**
     * Adds chat to the chat list
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
     * Sets avatar's position
     * 
     * @param {Position} position position
     */
    setPosition(position) {
        TypeChecker.isInstanceOf(position, Position);
        this.#position = position;
    }

    /**
     * Sets avatar's direction
     * 
     * @param {Direction} direction direction
     */
    setDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#direction = direction;
    }

    /**
     * Sets visibility
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
     * 
     * @param {?String} ppantId participant ID
     */
    hasFriend(ppantId) {
        if (ppantId) {
            TypeChecker.isString(ppantId);
            return this.#friendList.includes(ppantId) // TODO: method does more than the name says it does
        }
    }

    /**
     * Checks if participant has sent/received a friend request to/from a participant with ppantId
     * 
     * @param {?String} ppantId participant ID
     */
    hasSentFriendRequest(ppantId) {
        if (ppantId) {
            TypeChecker.isString(ppantId);

            return (this.#sentRequestList.includes(ppantId) || this.#receivedRequestList.includes(ppantId));
        }
    }

    /**
     * Removes chat from the chat list
     * 
     * @param {String} chatId chat ID
     */
    removeChat(chatId) {
        TypeChecker.isString(chatId);

        this.#chatList.forEach(chat => {
            if (chat.getId() === chatId) {
                chat.removeParticipant(this.#id);
                let index = this.#chatList.indexOf(chat);
                this.#chatList.splice(index, 1);
            }
        });
    }

    /**
     * Gets tasks and its count
     * 
     * @return taskTypeMapping
     */
    getTaskTypeMappingCounts() {
        return this.#taskTypeMapping;
    }

    /**
     * Gets a task based on the task type
     * @param {TypeOfTask} taskType task type
     * 
     * @return task
     */
    getTaskTypeMappingCount(taskType) {
        return this.#taskTypeMapping[taskType];
    }

    /**
     * Called if a task is fulfilled to increase the counter and the points
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
     * 
     * @param {number} awardPoints points
     */
    addAwardPoints(awardPoints) {
        TypeChecker.isInt(awardPoints);
        this.#awardPoints += awardPoints;
    }

    /**
     * Sets achievements
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
     * 
     * @return points
     */
    getAwardPoints() {
        return this.#awardPoints;
    }

    /**
     * Gets a chat from the chat list
     * 
     * @param {String} chatId chat ID
     * 
     * @return chat
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
     * 
     * @param {String} chatId chat ID
     * 
     * @return true if so, otherwise false
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
     * 
     * @param {Achievement} achievement achievement
     */
    addAchievement(achievement) {
        TypeChecker.isInstanceOf(achievement, Achievement);
        this.#achievements.push(achievement);
    }

    /**
     * Removes an achievement from the list of achievements
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
     * 
     * @param {String} chatPartnerID chat partner ID
     * 
     * @return true if so, otherwise false
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
