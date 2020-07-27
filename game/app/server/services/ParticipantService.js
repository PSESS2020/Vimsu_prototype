const TypeChecker = require('../../utils/TypeChecker.js');
const Position = require('../models/Position.js');
const BusinessCard = require('../models/BusinessCard')
const Participant = require('../models/Participant')
const Settings = require('../../utils/Settings.js');
const ObjectId = require('mongodb').ObjectID;
const Account = require('../../../../website/models/Account')
const dbconf = require('../../../../config/dbconf');
const AccountService = require('../../../../website/services/AccountService')

var vimsudb;
async function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

module.exports = class ParticipantService {
    static createParticipant(account, conferenceId) {
        TypeChecker.isInstanceOf(account, Account);
        TypeChecker.isString(conferenceId);
        var accountId = account.getAccountID();

        return getDB().then(res => {
            return this.getParticipant(accountId, conferenceId).then(par => {
                var participant;

                if(par) {
                    participant = new Participant(par.participantId, accountId, new BusinessCard(par.participantId, account.getUsername(), 
                        account.getTitle(), account.getSurname(), account.getForename(), account.getJob(), account.getCompany(), 
                        account.getEmail()), new Position(par.position.roomId, par.position.cordX, par.position.cordY), par.direction, 
                        par.points, par.friendId, par.friendRequestId.sent, par.friendRequestId.received, par.achievements, par.isModerator);
                } 
                else {
                    var par = {
                        participantId: new ObjectId().toString(),
                        accountId: accountId,
                        position: {
                            roomId: Settings.STARTROOM,
                            cordX: Settings.STARTPOSITION_X,
                            cordY: Settings.STARTPOSITION_Y
                        },
                        direction: Settings.STARTDIRECTION,
                        points: 0,
                        friendId: [],
                        friendRequestId: {
                            sent: [],
                            received: []
                        },
                        achievements: [],
                        isModerator: false,
                        /*visitedLectureId: [],*/
                    }

                    participant = new Participant(par.participantId, accountId, new BusinessCard(par.participantId, account.getUsername(), 
                        account.getTitle(), account.getSurname(), account.getForename(), account.getJob(), account.getCompany(), 
                        account.getEmail()), new Position(par.position.roomId, par.position.cordX, par.position.cordY), par.direction, 
                        par.points, par.friendId, par.friendRequestId.sent, par.friendRequestId.received, par.achievements, par.isModerator);

                    getDB().then(res => {
                        vimsudb.insertOneToCollection("participants_" + conferenceId, par);
                    }).catch(err => {
                        console.error(err)
                    });
                }

                return participant;
                
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

    static updateParticipantPosition(participantId, conferenceId, position) {
        TypeChecker.isString(participantId);
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

    static updateParticipantAwardPoints(participantId, conferenceId, awardPoints) {
        // TODO
    } 
} 