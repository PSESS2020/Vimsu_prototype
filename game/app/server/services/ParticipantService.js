const TypeChecker = require('../../utils/TypeChecker.js');
const Position = require('../models/Position.js');
const Participant = require('../models/Participant')
const Settings = require('../../utils/Settings.js');
const ObjectId = require('mongodb').ObjectID;
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
    static createParticipant(accountId, conferenceId) {
        return getDB().then(res => {
            return this.getParticipant(accountId, conferenceId).then(par => {
                var participant;

                if(par) {
                    var participantId = par.participantId;
                    var pos = {
                        roomId: par.position.roomId,
                        cordX: par.position.cordX,
                        cordY: par.position.cordY
                    }
                    var direction = par.direction;
                    participant = new Participant(participantId, new Position(pos.roomId, pos.cordX, pos.cordY), direction);
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
                        /*visitedLectureId: [],
                        friendId: [],
                        friendRequestId: [],
                        chatId: [],*/
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
            return vimsudb.findOneInCollection("participants_" + conferenceId, {accountId: accountId}, {participantId: 1, position: 1, direction: 1}).then(par => {
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