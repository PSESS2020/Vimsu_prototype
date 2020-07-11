var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('../models/Position.js');
var Participant = require('../models/Participant')

const dbconf = require('../../config/dbconf');

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
            return this.getParticipantId(accountId, conferenceId).then(par => {
                var participant;

                if(par) {
                    participant = new Participant(par.participantId, new Position(1, 0, 0), Direction.DOWNRIGHT);
                } 
                else {
                    var participantId = new ObjectId();
                    participant = new Participant(participantId, new Position(1, 0, 0), Direction.DOWNRIGHT);
                        
                    var par = {
                        participantId: participantId,
                        accountId: accountId,
                        points: 0, 
                        visitedLectureId: [],
                        achievement: [],
                        friendId: [],
                        friendRequestId: [],
                        chatId: [],
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

    static getParticipantId(accountId, conferenceId) {
        return getDB().then(res => {
            return vimsudb.findOneInCollection("participants_" + conferenceId, {accountId: new ObjectId(accountId)}, {participantId: 1}).then(par => {
                if (par) {
                    return par;
                }
                else {
                    console.log("participant not found");
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }

    /*static getRoomId(accountId) {

    }

    static updateParticipantPosition(participantId, position) {

        TypeChecker.isInstanceOf(position, Position);
    }*/
} 