const TypeChecker = require('../../client/shared/TypeChecker.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction');
const BusinessCard = require('../models/BusinessCard');
const Participant = require('../models/Participant');
const Settings = require('../utils/Settings.js');
const ObjectId = require('mongodb').ObjectID;
const Account = require('../../../../website/models/Account');
const AccountService = require('../../../../website/services/AccountService');
const AchievementService = require('./AchievementService');
const ChatService = require('./ChatService.js');
const MeetingService = require('./MeetingService.js');
const FriendList = require('../models/FriendList.js');
const TaskService = require('./TaskService');
const Task = require('../models/Task');
const db = require('../../../../config/db');
const TypeOfTask = require('../utils/TypeOfTask');

/**
 * The Participant Service
 * @module ParticipantService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class ParticipantService {

    /**
     * @static creates a participant instance with this account. If a participant with this account ID
     * doesn't exist in the database, stores this participant data in the database. otherwise fetches 
     * the participant data from the database.
     * @method module:ParticipantService#createParticipant
     * 
     * @param {Account} account participant's account
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Participant} participant instance
     */
    static async createParticipant(account, conferenceId, vimsudb) {
        TypeChecker.isInstanceOf(account, Account);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        var accountId = account.getAccountID();

        return this.#getParticipant(accountId, conferenceId, vimsudb).then(par => {
            var participant;

            if (par) {
                //Get Chats
                return ChatService.loadChatList(par.chatIDList, conferenceId, vimsudb).then(async chatList => {
                    let friendList = [];
                    let friendRequestListReceived = [];
                    let friendRequestListSent = [];

                    let meetingList = await MeetingService.loadMeetingList(par.meetingIDList, conferenceId, vimsudb);

                    await par.friendIds.forEach(friendId => {
                        this.getBusinessCard(friendId, conferenceId, vimsudb).then(busCard => {
                            friendList.push(busCard);
                        })
                    });

                    await par.friendRequestIds.received.forEach(friendId => {
                        this.getBusinessCard(friendId, conferenceId, vimsudb).then(busCard => {
                            friendRequestListReceived.push(busCard);
                        })
                    });

                    await par.friendRequestIds.sent.forEach(friendId => {
                        this.getBusinessCard(friendId, conferenceId, vimsudb).then(busCard => {
                            friendRequestListSent.push(busCard);
                        })
                    });


                    var achievements = [];


                    participant = new Participant(par.participantId,
                        accountId,
                        new BusinessCard(par.participantId,
                            account.getUsername(),
                            account.getTitle(),
                            account.getSurname(),
                            account.getForename(),
                            account.getJob(),
                            account.getCompany(),
                            account.getEmail()),
                        new Position(par.position.roomId,
                            par.position.cordX,
                            par.position.cordY),
                        par.direction,
                        new FriendList(friendList),
                        new FriendList(friendRequestListReceived),
                        new FriendList(friendRequestListSent),
                        [],
                        par.taskCount,
                        par.isModerator,
                        par.points,
                        chatList,
                        meetingList);

                    let achievementService = new AchievementService();

                    var ppantAchievements = achievementService.getAllAchievements(participant);

                    par.achievements.forEach(achievement => {
                        let idx = ppantAchievements.findIndex(ach => ach.getId() === achievement.id);

                        if (idx > -1) {
                            var taskType = ppantAchievements[idx].getTaskType();
                            var achievementDefinition = achievementService.getAchievementDefinition(taskType);
                            var ach = achievementDefinition.computeAchievement(achievement.currentLevel);
                            achievements.push(ach);
                        }
                    })

                    participant.setAchievements(achievements);

                    return Promise.all(ppantAchievements.map(async achievement => {
                        let index = participant.getAchievements().findIndex(ach => ach.getId() === achievement.getId());
                        if (index < 0) {
                            participant.addAchievement(achievement);
                            var achievementData =
                                [{
                                    id: achievement.getId(),
                                    currentLevel: achievement.getCurrentLevel(),
                                }]
                            const res = await this.#storeAchievements(participant.getId(), conferenceId, achievementData, vimsudb);
                        }
                    })).then(res => {
                        return participant;
                    })
                });
            }

            else {
                var emptyTaskCount = {};
                new TaskService().getAllTasks().forEach(x => {
                    emptyTaskCount[x.getTaskType()] = 0;
                })

                var par = {
                    participantId: new ObjectId().toString(),
                    accountId: accountId,
                    position: {
                        roomId: Settings.STARTROOM_ID,
                        cordX: Settings.STARTPOSITION_X,
                        cordY: Settings.STARTPOSITION_Y
                    },
                    direction: Settings.STARTDIRECTION,
                    friendIds: [],
                    friendRequestIds: {
                        sent: [],
                        received: []
                    },
                    achievements: [],
                    isModerator: false,
                    points: 0,
                    chatIDList: [],
                    meetingIDList: [],
                    taskCount: emptyTaskCount
                }

                //Write new ppant in DB

                return vimsudb.insertOneToCollection("participants_" + conferenceId, par).then(res => {

                    participant = new Participant(par.participantId,
                        accountId,
                        new BusinessCard(par.participantId,
                            account.getUsername(),
                            account.getTitle(),
                            account.getSurname(),
                            account.getForename(),
                            account.getJob(),
                            account.getCompany(),
                            account.getEmail()),
                        new Position(par.position.roomId,
                            par.position.cordX,
                            par.position.cordY),
                        par.direction,
                        new FriendList([]),
                        new FriendList([]),
                        new FriendList([]),
                        [],
                        par.taskCount,
                        par.isModerator,
                        par.points,
                        [], // ChatList
                        []);// MeetingList

                    new AchievementService().computeAchievements(participant);

                    var achievementsData = [];
                    participant.getAchievements().forEach(ach => {
                        achievementsData.push(
                            {
                                id: ach.getId(),
                                currentLevel: ach.getCurrentLevel(),
                            },
                        )
                    })

                    return this.#storeAchievements(par.participantId, conferenceId, achievementsData, vimsudb).then(res => {
                        return participant;
                    })
                })
            }
        })
    }

    /**
     * @static @private Gets participant with this account from the database
     * @method module:ParticipantService#getParticipant
     * 
     * @param {String} accountId account ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if participant is found, otherwise false
     */
    static #getParticipant = function (accountId, conferenceId, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { accountId: accountId }, "").then(par => {
            if (par) {
                return par;
            }
            else {
                console.log("participant with accountId " + accountId + " is not found in collection participants_" + conferenceId);
                return false;
            }
        })
    }

    /**
     * @static Gets participant's username from the database
     * @method module:ParticipantService#getUsername
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {String} username
     */
    static getUsername(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { accountId: 1 }).then(par => {
            if (par) {
                return AccountService.getAccountUsername(par.accountId, '', vimsudb).then(username => {
                    return username;
                })
            }
            else {
                console.log("participant with Id " + participantId + " is not found in collection participants_" + conferenceId);
                return false;
            }

        })
    }

    /**
     * @static Gets participant's account from the database and creates a business card instance with 
     * the data
     * @method module:ParticipantService#getBusinessCard
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {BusinessCard | boolean} business card if participant is found, otherwise false
     */
    static getBusinessCard(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, "").then(par => {
            if (par) {
                return AccountService.getAccountById(par.accountId, '', vimsudb).then(account => {
                    return new BusinessCard(par.participantId,
                        account.username,
                        account.title,
                        account.surname,
                        account.forename,
                        account.job,
                        account.company,
                        account.email);
                });
            }
            else {
                console.log("participant with participantId " + participantId + " is not found in collection participants_" + conferenceId);
                return false;
            }
        })
    }

    /**
     * @static Updates participant's position in the database
     * @method module:ParticipantService#updateParticipantPosition
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {Position} position participant's position
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if updated successfully
     */
    static updateParticipantPosition(participantId, conferenceId, position, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isInstanceOf(vimsudb, db);

        var pos = {
            roomId: position.getRoomId(),
            cordX: position.getCordX(),
            cordY: position.getCordY()
        }

        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { 'position.roomId': pos.roomId, 'position.cordX': pos.cordX, 'position.cordY': pos.cordY }).then(res => {
            return true;
        })
    }

    /**
     * @static Updates participant's direction in the database
     * @method module:ParticipantService#updateParticipantDirection
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {Direction} direction avatar's direction
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if updated successfully
     */
    static updateParticipantDirection(participantId, conferenceId, direction, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { direction: direction }).then(res => {
            return true;
        })
    }

    /**
     * @static Gets participant's points from the database
     * @method module:ParticipantService#getPoints
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {number | boolean} points if participant is found, otherwise false
     */
    static getPoints(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { points: 1 }).then(par => {
            if (par) {
                return par.points;
            }
            else {
                console.log("participant not found");
                return false;
            }
        })
    }

    /**
     * @static Updates participant's points in the database
     * @method module:ParticipantService#updatePoints
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {number} points new points
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if updated successfully, otherwise false
     */
    static updatePoints(participantId, conferenceId, points, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(points);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { points: points }).then(res => {
            return true;
        })

    }

    /**
     * @static Stores achievements in the database
     * @method module:ParticipantService#storeAchievements
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {{id: number, currentLevel: number}} achievementsData achievements
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if achievements stored successfully, otherwise false
     */
    static #storeAchievements = function (participantId, conferenceId, achievementsData, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(achievementsData, Array);
        achievementsData.forEach(element => {
            TypeChecker.isInstanceOf(element, Object);
            TypeChecker.isInt(element.id);
            TypeChecker.isInt(element.currentLevel);
        });
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { achievements: { $each: achievementsData } }).then(res => {
            return res;
        })
    }

    /**
     * @static Deletes an achievement from the database
     * @method module:ParticipantService#deleteAchievement
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {number} achievementId achievement ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if deleted successfully, otherwise false
     */
    static deleteAchievement(participantId, conferenceId, achievementId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(achievementId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { achievements: { id: achievementId } }).then(res => {
            return res;
        })
    }

    /**
     * @static Gets all achievements from the database
     * @method module:ParticipantService#getAchievements
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Object} achievements
     */
    static getAchievements(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { achievements: 1 }).then(par => {
            if (par) {
                return par.achievements;
            }
            else {
                console.log("participant not found");
                return false;
            }
        })
    }

    /**
     * @static Updates level of an achievement
     * @method module:ParticipantService#updateAchievementLevel
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {number} achievementId achievement ID
     * @param {number} level achievement's level
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if updated successfully, otherwise false
     */
    static updateAchievementLevel(participantId, conferenceId, achievementId, level, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(achievementId);
        TypeChecker.isInt(level);
        TypeChecker.isInstanceOf(vimsudb, db);


        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId, 'achievements.id': achievementId },
            { 'achievements.$.currentLevel': level }).then(res => {
                return true;
            })
    }

    /**
     * @static Updates all task counts in the database
     * @method module:ParticipantService#updateTaskCounts
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {Task[]} taskCount task counts
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if updated successfully, otherwise false
     */
    static updateTaskCounts(participantId, conferenceId, taskCount, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { taskCount: taskCount }).then(res => {
            return true;
        })
    }

    /**
     * @static Gets task count based on the task type
     * @method module:ParticipantService#getTaskCount
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {TypeOfTask} taskType task type
     * @param {db} vimsudb db instance
     * 
     * @return {Object | boolean} task count if participant is found, otherwise false
     */
    static getTaskCount(participantId, conferenceId, taskType, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { taskCount: 1 }).then(par => {
            if (par) {
                return par.taskCount[taskType];
            }
            else {
                console.log("participant not found");
                return false;
            }
        })
    }

    /**
     * @static Updates a task count in the database
     * @method module:ParticipantService#updateTaskCount
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {TypeOfTask} taskType task type
     * @param {number} count task count
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if updated successfully, otherwise false
     */
    static updateTaskCount(participantId, conferenceId, taskType, count, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        TypeChecker.isInt(count);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { ['taskCount.' + taskType]: count }).then(res => {
            return true;
        })
    }

    /**
     * @static Adds chat ID into the chat list in the database
     * @method module:ParticipantService#addChatID
     * 
     * @param {String} participantId participant ID
     * @param {String} chatId chat ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if stored successfully, otherwise false
     */
    static addChatID(participantId, chatId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { chatIDList: chatId }).then(res => {
            return res;
        })
    }

    /**
     * @static Deletes all participants from the database
     * @method module:ParticipantService#deleteAllParticipants
     * 
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     */
    static deleteAllParticipants(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteAllFromCollection("participants_" + conferenceId).then(res => {
            console.log("all participants deleted");
            return res;
        })
    }

    /**
     * @static Deletes a participant from the database
     * @method module:ParticipantService#deleteParticipant
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     */
    static deleteParticipant(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteOneFromCollection("participants_" + conferenceId, { participantId: participantId }).then(res => {
            console.log("participant with participantId " + participantId + " deleted");
            return res;
        })
    }

    /**
     * @static Changes the moderator state of this participant to the passed modState
     * @method module:ParticipantService#changeModState
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {boolean} modState moderator state
     * @param {db} vimsudb db instance
     * 
     *  @return {boolean} true if updated successfully, otherwise false
     */
    static changeModState(participantId, conferenceId, modState, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isBoolean(modState);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { isModerator: modState }).then(res => {
            return true;
        })
    }
}