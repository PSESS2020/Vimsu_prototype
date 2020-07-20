const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');
const Chat = require('../models/Chat');
const OneToOneChat = require('../models/OneToOneChat');
const LectureChat = require('../models/LectureChat');
//const Allchat = require('../models/Allchat');
//const GroupChat = require('../models/GroupChat');
//const GlobalChat = require('../models/GlobalChat');
const AccountService = require('../../../../website/services/AccountService');
const ObjectId = require('mongodb').ObjectID;

var vimsudb;

async function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

module.exports = class Chatservice {
    /*
    static createAccount(username, title, surname, forename, job, company, email, password) {
        
        return getDB().then(res => {
    
            var accountId = new ObjectId().toString();
            var account = new Account(username, title, surname, forename, job, company, email);
            account.setAccountID(accountId);
                
            var acc = {
                accountId: accountId,
                username: username, 
                title: title,
                surname: surname,
                forename: forename,
                job: job,
                company: company,
                email: email,
                passwordHash: passwordHash.generate(password)
            }

            return vimsudb.insertOneToCollection("accounts", acc).then(res => {
                console.log("user saved")
                return account;
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }static createParticipant(accountId) {
        return getDB().then(res => {
            return this.getParticipant(accountId).then(par => {
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
                        visitedLectureId: [],
                        friendId: [],
                        friendRequestId: [],
                        chatId: [],
                    }

                    getDB().then(res => {
                        vimsudb.insertOneToCollection("participants_" , par);
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
    */
    static newLectureChat(lectureId) {
        TypeChecker.isString(lectureId);

        return getDB().then(res => {
            
            var chatId = new ObjectId().toString();
            //var lectureChat = new LectureChat(chatId, lectureId);
            
            var chat = {
                chatId: chatId,
                lectureId: lectureId,
                participantList: [],
                messageList: [],
                moderatorList: [],
                blackList: [],
            }

            return vimsudb.insertOneToCollection("chats" , chat).then(res => {

                console.log("lecture chat saved");
                //return lectureChat;

            }).catch(err => {
                console.error(err)
            });
        });


    }
/*
    static getLectureChat(lectureId) {
        return getDB().then(res => {
            return vimsudb.findOneInCollection("chats" , {lectureId: lectureId}, {participantId: 1, position: 1, direction: 1}).then(chat => {
                if (chat) {
                    return chat;
                }
                else {
                    console.log("oneToOneChat not found between " + participantId_A + participantId_B + " is collection chats" + participantId_A);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }
*/
    static newAllchatChat(roomId) {
        TypeChecker.isString(roomId);

        return getDB().then(res => {
            
            var chatId = new ObjectId().toString();
            //var allChat = new Allchat(chatId, roomId);
            
            var chat = {
                chatId: chatId,
                roomId: roomId,
                participantList: [],
                messageList: [],
                moderatorList: [],
                blackList: [],
            }

            return vimsudb.insertOneToCollection("chats" , chat).then(res => {

                console.log("allchat saved");
                //return allChat;

            }).catch(err => {
                console.error(err)
            });
        
        }).catch(err => {
            console.error(err)
        });

    }

    static newOneToOneChat(ownerId, memberId) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(memberId);

        return getDB().then(res => {
            vimsudb.deleteAllFromCollection("chats_" + ownerId);
            var chatId = new ObjectId().toString();
            //var oneToOneChat = new OneToOneChat(chatId, ownerId, );
            
            var chat = {
                _id: chatId,
                name: "",
                sentRequest: false,
                member: {ownerId: ownerId, memberId: memberId},
                messageList: [],
            }

            return vimsudb.insertOneToCollection("chats_" + ownerId , chat).then(res => {

                console.log("oneToOne chat saved");
                //return oneToOneChat;
            
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static newGroupChat(ownerId, memberIds) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(memberIds);

        return getDB().then(res => {
            
            var chatId = new ObjectId().toString();
            //var groupChat = new GroupChat(chatId, ownerId, memberIds);
            
            var chat = {
                chatId: chatId,
                roomId: roomId,
                name: "",
                participantList: [],
                messageList: [],
            }

            return vimsudb.insertOneToCollection("chats_" + ownerId , chat).then(res => {

                console.log("group chat saved");
                //return groupChat;

            }).catch(err => {
                console.error(err)
            });
       
        }).catch(err => {
            console.error(err)
        });

    }

    static newGlobalChat(confId, listOfParticipants) {
        TypeChecker.isString(confId);
        
        return getDB().then(res => {
            
            var chatId = new ObjectId().toString();
            //var globalChat = new GlobalChat(chatId, confId, listOfParticipants, []);
            
            var chat = {
                chatId: chatId,
                roomId: roomId,
                name: "",
                participantList: listOfParticipants,
                messageList: [],
            }

            return vimsudb.insertOneToCollection("chats" , chat).then(res => {
                console.log("global chat saved");
                //return globalChat;
            
            }).catch(err => {
                console.error(err)
            });
        
        }).catch(err => {
            console.error(err)
        });

    }

    static existsOneToOneChat(ownerId, memberId) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(memberId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("chats_" + ownerId , {member: {ownerId: ownerId, memberId: memberId}}, "").then(chat => {
                if (chat) {
                    return chat;
                }
                else {
                    console.log("oneToOneChat not found between " + ownerId + " and " + memberId + " in collection chats_" + ownerId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }

    //loads all chats of the specified participant
    static loadChatList(participantId) {
        TypeChecker.isString(participantId);

        return getDB().then(res => {
            return vimsudb.findAllInCollection("chats_" + participantId).then(chat => {
                if (chats) {
                    return chats;
                }
                else {
                    console.log("chat list could not been found for participant with id: " + participantId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })

    }

    static loadChatParticipants(chatId) {
        TypeChecker.isString(chatId);
    } 

    static loadChatMessages(chatId, num) {
        TypeChecker.isString(chatId);
    }

    static removeParticipant(chatId, participant) {
        TypeChecker.isString(chatId);
    }

    static storeParticipant(chatId, participant) {
        TypeChecker.isString(chatId);
    }

    static storeParticipants(chatId, participants) {
        TypeChecker.isString(chatId);
    }

    static storeChatmessage(chatId, msg) {
        TypeChecker.isString(chatId);
    }

    static storeParticipantMStatus(msgId, participant, status) {
        TypeChecker.isString(msgId);
    }
}