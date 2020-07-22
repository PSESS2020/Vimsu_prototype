const TypeChecker = require('../../utils/TypeChecker.js');
const Position = require('../models/Position.js');
const BusinessCard = require('../models/BusinessCard')
const Participant = require('../models/Participant')
const Settings = require('../../utils/Settings.js');
const ObjectId = require('mongodb').ObjectID;
const Account = require('../../../../website/models/Account')
const dbconf = require('../../../../config/dbconf');

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

        return getDB().then(res => {
            return this.getParticipant(account.getAccountID(), conferenceId).then(par => {
                var participant;

                if(par) {
                    var participantId = par.participantId;
                    var pos = {
                        roomId: par.position.roomId,
                        cordX: par.position.cordX,
                        cordY: par.position.cordY
                    }
                    var direction = par.direction;
                    var friendList = par.friendId;
                    var sentRequestList = par.friendRequestId.sent;
                    var receivedRequestList = par.friendRequestId.received;
                    participant = new Participant(participantId, accountId, new BusinessCard(participantId, account.getUsername(), 
                    account.getTitle(), account.getSurname(), account.getForename(), account.getJob(), account.getCompany(), 
                    account.getEmail()), new Position(pos.roomId, pos.cordX, pos.cordY), direction, friendList, sentRequestList, receivedRequestList);
                } 
                else {
                    var participantId = new ObjectId().toString();
                    participant = new Participant(participantId, "", "");
                        
                    var par = {
                        participantId: participantId,
                        accountId: accountId,
                        position: {
                            roomId: Settings.STARTROOM,
                            cordX: Settings.STARTPOSITION_X,
                            cordY: Settings.STARTPOSITION_Y
                        },
                        direction: Settings.STARTDIRECTION,
                        friendId: [],
                        friendRequestId: {
                            sent: [],
                            received: []
                        },
                        /*visitedLectureId: [],*/
                    }

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
} 