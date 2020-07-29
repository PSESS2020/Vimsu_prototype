const TypeChecker = require('../../utils/TypeChecker.js');
const Position = require('../models/Position.js');
const Direction = require('../../utils/Direction')
const BusinessCard = require('../models/BusinessCard')
const Participant = require('../models/Participant')
const Settings = require('../../utils/Settings.js');
const ObjectId = require('mongodb').ObjectID;
const Account = require('../../../../website/models/Account')
const dbconf = require('../../../../config/dbconf');
const AccountService = require('../../../../website/services/AccountService');
const AchievementService = require('./AchievementService')
const Achievement = require('../models/Achievement.js');
const ChatService = require('./ChatService.js');
const FriendList = require('../models/FriendList.js');
const TaskService = require('./TaskService')

var vimsudb;
function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

module.exports = class ParticipantService {
    static async createParticipant(account, conferenceId) {
        TypeChecker.isInstanceOf(account, Account);
        TypeChecker.isString(conferenceId);
        var accountId = account.getAccountID();
        console.log('test');

        return getDB().then(res => {
            return this.getParticipant(accountId, conferenceId).then(par => {
                var participant;

                if(par) {
                    //Get Chats
                    return ChatService.loadChatList(par.chatIDList, conferenceId).then(async chatList => {
                        console.log(chatList[0]);
                        let friendList = [];
                        let friendRequestListReceived = [];
                        let friendRequestListSent = [];

                        await par.friendIds.forEach(friendId => {
                            this.getBusinessCard(friendId, conferenceId).then(busCard => {
                                friendList.push(busCard);
                            }).catch(err => {
                                console.error(err)
                            });
                        });

                        await par.friendRequestIds.received.forEach(friendId => {
                            this.getBusinessCard(friendId, conferenceId).then(busCard => {
                                friendRequestListReceived.push(busCard);
                            }).catch(err => {
                                console.error(err)
                            });
                        });

                        await par.friendRequestIds.sent.forEach(friendId => {
                            this.getBusinessCard(friendId, conferenceId).then(busCard => {
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

                        participant = new Participant(par.participantId, accountId, new BusinessCard(par.participantId, account.getUsername(), 
                            account.getTitle(), account.getSurname(), account.getForename(), account.getJob(), account.getCompany(), 
                            account.getEmail()), new Position(par.position.roomId, par.position.cordX, par.position.cordY), par.direction, 
                            new FriendList(par.participantId, friendList), new FriendList(par.participantId, friendRequestListReceived), new FriendList(par.participantId, friendRequestListSent), 
                            [], new TaskService().getAllTasks(), par.isModerator, par.points, chatList);

                        let achievementService = new AchievementService();

                        var ppantAchievements = achievementService.getAllAchievements(participant);

                        par.achievements.forEach(achievement => {
                            let idx = ppantAchievements.findIndex(ach => ach.id === achievement.id);

                            if(idx > -1) {
                                achievements.push(new Achievement(achievement.id, ppantAchievements[idx].title, ppantAchievements[idx].icon,
                                    ppantAchievements[idx].description, achievement.currentLevel, achievement.color, ppantAchievements[idx].awardPoints,
                                    ppantAchievements[idx].maxLevel, ppantAchievements[idx].getTaskType()));
                            }
                        })

                        participant.setAchievements(achievements);

                        return Promise.all(ppantAchievements.map(async achievement => {
                            let index = participant.getAchievements().findIndex(ach => ach.id === achievement.id);

                            if(index < 0) {
                                participant.addAchievement(achievement);
                                var achievementData = 
                                [{
                                    id: achievement.id,
                                    currentLevel: achievement.currentLevel,
                                    color: achievement.color,
                                }] 
                                const res = await this.storeAchievements(participant.getId(), Settings.CONFERENCE_ID, achievementData);
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
                    return getDB().then(res => {
                        return vimsudb.insertOneToCollection("participants_" + conferenceId, par).then(res => {
                            participant = new Participant(par.participantId, accountId, new BusinessCard(par.participantId, account.getUsername(), 
                                account.getTitle(), account.getSurname(), account.getForename(), account.getJob(), account.getCompany(), 
                                account.getEmail()), new Position(par.position.roomId, par.position.cordX, par.position.cordY), par.direction, 
                                new FriendList(par.participantId, []), new FriendList(par.participantId, []), new FriendList(par.participantId, []), [], 
                                new TaskService().getAllTasks(), par.isModerator, par.points, []);
                        
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
                            
                            return this.storeAchievements(par.participantId, Settings.CONFERENCE_ID, achievementsData).then(res => {
                                console.log('all achievements stored');
                                return participant;
                            }).catch(err => {
                                console.error(err);
                            })
                        })
                    }).catch(err => {
                        console.error(err)
                    });
                } 
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getParticipant(accountId, conferenceId) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("participants_" + conferenceId, {accountId: accountId}, "").then(par => {
                if (par) {
                    return par;
                }
                else {
                    console.log("participant with accountId " + accountId + " is not found in collection participants_" + conferenceId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }

    static getUsername(participantId, conferenceId) {
        TypeChecker.isString(participantId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("participants_" + conferenceId, {participantId: participantId}, {accountId: 1}).then(par => {
                if (par) {
                    return AccountService.getAccountUsername(par.accountId).then(username => {
                        return username;
                    }).catch(err => {
                        console.error(err);
                    })
                }
                else {
                    console.log("participant with Id " + participantId + " is not found in collection participants_" + conferenceId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }

    static getBusinessCard(participantId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("participants_" + conferenceId, {participantId: participantId}, "").then(par => {
                if (par) {
                    return AccountService.getAccountById(par.accountId).then(account => {
                        return new BusinessCard(par.participantId, account.username, account.title, account.surname, account.forename, account.job, account.company, account.email);
                    });
                }
                else {
                    console.log("participant with participanntId " + participantId + " is not found in collection participants_" + conferenceId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }

    static updateParticipantPosition(participantId, conferenceId, position) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(position, Position);

        var pos = {
            roomId: position.getRoomId(),
            cordX: position.getCordX(),
            cordY: position.getCordY()
        }

        return getDB().then(res => {
            vimsudb.updateOneToCollection("participants_" + conferenceId, {participantId: participantId}, {'position.roomId': pos.roomId, 'position.cordX': pos.cordX, 'position.cordY': pos.cordY});
        }).catch(err => {
            console.error(err)
        });

    }

    static updateParticipantDirection(participantId, conferenceId, direction) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isEnumOf(direction, Direction);

        return getDB().then(res => {
            vimsudb.updateOneToCollection("participants_" + conferenceId, {participantId: participantId}, {direction: direction});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateIsModerator(participantId, conferenceId, isModerator) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isBoolean(isModerator);

        return getDB().then(res => {
            vimsudb.updateOneToCollection("participants_" + conferenceId, {participantId: participantId}, {isModerator: isModerator});
        }).catch(err => {
            console.error(err)
        });
    }

    static updatePoints(participantId, conferenceId, points) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(points)

        return getDB().then(res => {
            vimsudb.updateOneToCollection("participants_" + conferenceId, {participantId: participantId}, {points: points});
        }).catch(err => {
            console.error(err)
        });
    }

    static storeAchievements(participantId, conferenceId, achievementsData) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {achievements: { $each: achievementsData } } ).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static deleteAchievement(participantId, conferenceId, achievementId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {achievements: {id: achievementId}}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static updateAchievementLevel(participantId, conferenceId, achievementId, level, color) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(achievementId);
        TypeChecker.isInt(level);

        return getDB().then(res => {
            return vimsudb.updateOneToCollection("participants_" + conferenceId, {participantId: participantId, 'achievements.id': achievementId}, 
            {'achievements.$.currentLevel': level, 'achievements.$.color': color}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static addChatID(participantId, chatId, conferenceId) {

    }

    static removeChatID(participantId, chatId, conferenceId) {

    }
} 