const TypeChecker = require('../../client/shared/TypeChecker.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction')
const BusinessCard = require('../models/BusinessCard')
const Participant = require('../models/Participant')
const Settings = require('../../client/shared/Settings.js');
const ObjectId = require('mongodb').ObjectID;
const Account = require('../../../../website/models/Account')
const AccountService = require('../../../../website/services/AccountService');
const AchievementService = require('./AchievementService')
const Achievement = require('../models/Achievement.js');
const ChatService = require('./ChatService.js');
const FriendList = require('../models/FriendList.js');
const TaskService = require('./TaskService')

module.exports = class ParticipantService {
    static async createParticipant(account, conferenceId, vimsudb) {
        TypeChecker.isInstanceOf(account, Account);
        TypeChecker.isString(conferenceId);
        var accountId = account.getAccountID();
        console.log('test');

        return this.getParticipant(accountId, conferenceId, vimsudb).then(par => {
            var participant;

            if (par) {
                //Get Chats
                return ChatService.loadChatList(par.chatIDList, conferenceId, vimsudb).then(async chatList => {
                    console.log(chatList[0]);
                    let friendList = [];
                    let friendRequestListReceived = [];
                    let friendRequestListSent = [];

                    await par.friendIds.forEach(friendId => {
                        this.getBusinessCard(friendId, conferenceId, vimsudb).then(busCard => {
                            friendList.push(busCard);
                        }).catch(err => {
                            console.error(err)
                        });
                    });

                    await par.friendRequestIds.received.forEach(friendId => {
                        this.getBusinessCard(friendId, conferenceId, vimsudb).then(busCard => {
                            friendRequestListReceived.push(busCard);
                        }).catch(err => {
                            console.error(err)
                        });
                    });

                    await par.friendRequestIds.sent.forEach(friendId => {
                        this.getBusinessCard(friendId, conferenceId, vimsudb).then(busCard => {
                            friendRequestListSent.push(busCard);
                        }).catch(err => {
                            console.error(err)
                        });
                    });

                    var achievements = [];

                    /*par.achievements.forEach(ach => {
                        achievements.push(new Achievement(ach.id, ach.title, ach.icon,
                            ach.description, ach.currentLevel, ach.color,
                            ach.awardPoints, ach.maxLevel, ach.taskType))
                    })*/

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
                        new FriendList(par.participantId, friendList),
                        new FriendList(par.participantId, friendRequestListReceived),
                        new FriendList(par.participantId, friendRequestListSent),
                        [],
                        new TaskService().getAllTasks(),
                        par.isModerator,
                        par.points,
                        chatList);

                    let achievementService = new AchievementService();

                    var ppantAchievements = achievementService.getAllAchievements(participant);

                    par.achievements.forEach(achievement => {
                        let idx = ppantAchievements.findIndex(ach => ach.id === achievement.id);

                        if (idx > -1) {
                            achievements.push(new Achievement(achievement.id,
                                ppantAchievements[idx].title,
                                ppantAchievements[idx].icon,
                                ppantAchievements[idx].description,
                                achievement.currentLevel,
                                achievement.color,
                                ppantAchievements[idx].awardPoints,
                                ppantAchievements[idx].maxLevel,
                                ppantAchievements[idx].getTaskType()));
                        }
                    })

                    participant.setAchievements(achievements);

                    return Promise.all(ppantAchievements.map(async achievement => {
                        let index = participant.getAchievements().findIndex(ach => ach.id === achievement.id);

                        if (index < 0) {
                            participant.addAchievement(achievement);
                            var achievementData =
                                [{
                                    id: achievement.id,
                                    currentLevel: achievement.currentLevel,
                                    color: achievement.color,
                                }]
                            const res = await this.storeAchievements(participant.getId(), conferenceId, achievementData, vimsudb);
                        }
                    })).then(res => {
                        return participant;
                    })
                });
            }

            else {
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
                    chatIDList: []
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
                        new FriendList(par.participantId, []),
                        new FriendList(par.participantId, []),
                        new FriendList(par.participantId, []),
                        [],
                        new TaskService().getAllTasks(),
                        par.isModerator,
                        par.points,
                        []);

                    new AchievementService().computeAchievements(participant);

                    var achievementsData = [];
                    participant.getAchievements().forEach(ach => {
                        achievementsData.push(
                            {
                                id: ach.id,
                                currentLevel: ach.currentLevel,
                                color: ach.color,
                            },
                        )
                    })

                    return this.storeAchievements(par.participantId, conferenceId, achievementsData, vimsudb).then(res => {
                        console.log('all achievements stored');
                        return participant;
                    }).catch(err => {
                        console.error(err);
                    })
                })
            }
        }).catch(err => {
            console.error(err)
        })
    }

    static getParticipant(accountId, conferenceId, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(conferenceId);


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

    static getUsername(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);


        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { accountId: 1 }).then(par => {

            if (par) {
                return AccountService.getAccountUsername(par.accountId, vimsudb).then(username => {
                    return username;
                }).catch(err => {
                    console.error(err);
                })
            }
            else {
                console.log("participant with Id " + participantId + " is not found in collection participants_" + conferenceId);
                return false;
            }

        })
    }

    static getBusinessCard(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, "").then(par => {

            if (par) {
                return AccountService.getAccountById(par.accountId, vimsudb).then(account => {
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
                console.log("participant with participanntId " + participantId + " is not found in collection participants_" + conferenceId);
                return false;
            }

        })
    }

    static updateParticipantPosition(participantId, conferenceId, position, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(position, Position);

        var pos = {
            roomId: position.getRoomId(),
            cordX: position.getCordX(),
            cordY: position.getCordY()
        }


        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { 'position.roomId': pos.roomId, 'position.cordX': pos.cordX, 'position.cordY': pos.cordY }).then(res => {
            return true;
        })


    }

    static updateParticipantDirection(participantId, conferenceId, direction, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isEnumOf(direction, Direction);


        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { direction: direction }).then(res => {
            return true;
        })

    }

    static updateIsModerator(participantId, conferenceId, isModerator, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isBoolean(isModerator);

        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { isModerator: isModerator }).then(res => {
            return true;
        })

    }

    static getPoints(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { points: 1 }).then(par => {
            if (par) {
                return par.points;
            }
            else {
                console.log("participant not found");
                return false;
            }
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    static updatePoints(participantId, conferenceId, points, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(points)


        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId }, { points: points }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    static storeAchievements(participantId, conferenceId, achievementsData, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { achievements: { $each: achievementsData } }).then(res => {

            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    static deleteAchievement(participantId, conferenceId, achievementId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { achievements: { id: achievementId } }).then(res => {

            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    static updateAchievementLevel(participantId, conferenceId, achievementId, level, color, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(achievementId);
        TypeChecker.isInt(level);


        return vimsudb.updateOneToCollection("participants_" + conferenceId, { participantId: participantId, 'achievements.id': achievementId },
            { 'achievements.$.currentLevel': level, 'achievements.$.color': color }).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
    }

    static updateTaskCounts(participantId, conferenceId, taskCount, vimsudb) {
        TypeChecker.isString(participantId);
        
        return vimsudb.updateOneToCollection("particpants_" + conferenceId, { participantId: participantId }, { taskCount: taskCount }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    //Method to add a chatID in DB
    static addChatID(participantId, chatId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);


        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { chatIDList: chatId }).then(res => {

            return true;
        }).catch(err => {
            console.error(err);
            return false;
        });

    }

    static deleteAllParticipants(conferenceId, vimsudb) {
        return vimsudb.deleteAllFromCollection("participants_" + conferenceId).then(res => {
            console.log("all participants deleted");
        }).catch(err => {
            console.error(err);
        })
    }

    static deleteParticipant(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        return vimsudb.deleteOneFromCollection("participants_" + conferenceId, { participantId: participantId }).then(res => {
            console.log("participant with participantId " + participantId + " deleted");
        }).catch(err => {
            console.error(err);
        })

    }
} 