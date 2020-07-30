const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const OneToOneChat = require('../models/OneToOneChat');
const LectureChat = require('../models/LectureChat');
//const Allchat = require('../models/Allchat');
const GroupChat = require('../models/GroupChat');
//const GlobalChat = require('../models/GlobalChat');
const ObjectId = require('mongodb').ObjectID;
const ParticipantService = require('../services/ParticipantService');
const Settings = require('../../utils/Settings.js');

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

    //tested
    static newOneToOneChat(ownerId, chatPartnerId, ownerUsername, chatPartnerUsername, conferenceId) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(chatPartnerId);

        return getDB().then(res => {

            var chat = {
                chatId: new ObjectId().toString(),
                memberId: [ownerId, chatPartnerId],
                messageList: [],
                username1: ownerUsername,
                username2: chatPartnerUsername
            }

            return vimsudb.insertOneToCollection("chats_" + conferenceId, chat).then(res => {

                console.log("oneToOne chat saved");
                return new OneToOneChat(chat.chatId, 
                                        chat.memberId[0], 
                                        chat.memberId[1], 
                                        chat.messageList, 
                                        Settings.MAXNUMMESSAGES_ONETOONECHAT,
                                        chat.username1,
                                        chat.username2);
            
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }

    //tested
    static newGroupChat(ownerId, memberIds, groupName, conferenceId) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(groupName);
        TypeChecker.isInstanceOf(memberIds, Array);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            
            var chat = {
                chatId: new ObjectId().toString(),
                ownerId: ownerId,
                name: groupName,
                memberId: memberIds,
                messageList: [],
            }

            return vimsudb.insertOneToCollection("chats_" + conferenceId, chat).then(res => {

                console.log("group chat saved");
                return new GroupChat(chat.chatId, 
                                    chat.ownerId, 
                                    chat.name, 
                                    chat.memberId, 
                                    chat.messageList, 
                                    Settings.MAXGROUPPARTICIPANTS,
                                    Settings.MAXNUMMESSAGES_GROUPCHAT);

            }).catch(err => {
                console.error(err)
            });
       
        }).catch(err => {
            console.error(err)
        });
    }

    
    static existsOneToOneChat(ownerId, chatPartnerId, conferenceId) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(chatPartnerId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("chats_" + conferenceId , {memberId: ownerId, memberId: chatPartnerId}, "").then(chat => {
                if (chat) {
                    return chat;
                }
                else {
                    console.log("oneToOneChat not found between " + ownerId + " and " + chatPartnerId + " in collection chats_" + conferenceId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    //tested
    //loads all chats of the specified participant
    static loadChatList(chatIDList, conferenceId) {
        TypeChecker.isInstanceOf(chatIDList, Array);
        chatIDList.forEach(id => {
            TypeChecker.isString(id);
        });

        let chats = [];

        return getDB().then(res => {
            chatIDList.forEach(chatId => {
                vimsudb.findOneInCollection("chats_" + conferenceId,  {chatId: chatId}).then(chat => {
                    //create Message instances
                    var messages = [];
                    chat.messageList.forEach(message => {
                        messages.push(new Message(message.msgId, message.senderId, message.timestamp, message.msgText));
                    });
                    if (chat.hasOwnProperty('ownerId')) {
                        chats.push(new GroupChat(chat.chatId, 
                                                chat.ownerId, 
                                                chat.name, 
                                                chat.memberId, 
                                                messages, 
                                                Settings.MAXGROUPPARTICIPANTS, 
                                                Settings.MAXNUMMESSAGES_GROUPCHAT));
                    } else {
                        chats.push(new OneToOneChat(chat.chatId, 
                                                    chat.memberId[0], 
                                                    chat.memberId[1], 
                                                    messages, 
                                                    Settings.MAXNUMMESSAGES_ONETOONECHAT,
                                                    chat.username1,
                                                    chat.username2));
                    }
            
                }).catch(err => {
                    console.error(err)

                });
            
            });
            return chats;
        }).catch(err => {
            console.error(err)
        });

    }

    //tested
    static storeParticipant(chatId, ownerId, participantId) {
        TypeChecker.isString(chatId);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("chats_" + ownerId, {chatId: chatId}, {memberId: participantId}).then(res => {
                
                return true;

            }).catch(err => {
                console.error(err);
                return false;
            })
        }).catch(err => {
            console.error(err);
        })
    }

    //tested
    static removeChat(chatId, participantId, conferenceId) {
        TypeChecker.isString(chatId);

        return getDB().then(res => {
            return vimsudb.deleteFromArrayInCollection("chats_" + conferenceId, {chatId: chatId}, {memberId: participantId}).then(res => {
                return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {chatIDList: chatId}).then(res => {
                    return vimsudb.findOneInCollection("chats_" + conferenceId, {chatId: chatId}, {memberId: 1}).then(chat => {
                        if(chat) {
                            if(chat.memberId.length < 1) {
                                return vimsudb.deleteOneFromCollection("chats_" + conferenceId, {chatId: chatId}).then(res => {
                                    return true;
                                }).catch(err => {
                                    console.error(err);
                                    return false;
                                })
                            }
                        } else {
                            console.log("no chat found with " + chatId);
                            return false;
                        }
                    }).catch(err => {
                        console.error(err);
                        return false;
                    })
                }).catch(err => {
                    console.error(err);
                    return false;
                })
            }).catch(err => {
                console.error(err);
                return false;
            })
        }).catch(err => {
            console.error(err);
        })

    }
   
    static createChatMessage(chatId, senderId, msgText, conferenceId) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(msgText);

        return getDB().then(res => {

            let message = {
                msgId: new ObjectId().toString(),
                senderId: senderId,
                timestamp: new Date(),
                msgText: msgText,
            }

            return vimsudb.insertToArrayInCollection("chats_" + conferenceId, {chatId: chatId}, {messageList: message}).then(res => {

                console.log("chat message saved");
                return new Message(message.magId,
                                   message.senderId,
                                   message.timestamp,
                                   message.msgText);

            }).catch(err => {
                console.error(err)
            });

        }).catch(err => {
            console.error(err)
        });


    }
    /*
    static newLectureChat(lectureId) {
        TypeChecker.isString(lectureId);

        return getDB().then(res => {
            
            //var lectureChat = new LectureChat(lectureId, "", "", "", "");
            
            var chat = {
                lectureId: lectureId,
                participantList: [],
                messageList: [],
                moderatorList: [],
                blackList: [],
            }

            return vimsudb.insertOneToCollection("lecture_chats" , chat).then(res => {

                console.log("lecture chat saved");
                //return lectureChat;

            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err);
        });


    }

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

            return vimsudb.insertOneToCollection("room_chats" , chat).then(res => {

                console.log("allchat saved");
                //return allChat;

            }).catch(err => {
                console.error(err)
            });
        
        }).catch(err => {
            console.error(err)
        });

    }

    static updateSentRequest(chatId, ownerId, newValue) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(ownerId);
        TypeChecker.isInt(newValue);

        if(newValue >= 0 && newValue <= 2) {
            return getDB().then(res => {
                vimsudb.updateOneToCollection("chats_" + ownerId, {chatId: chatId}, {sentRequest: newValue})
            }).catch(err => {
                console.error(err)
            });
        } else {
            console.log("sent request value must be an integer between 0 and 2")
            return false;
        }
    }

    static newGlobalChat(confId, participantList) {
        TypeChecker.isString(confId);
        
        return getDB().then(res => {
            
            var chatId = new ObjectId().toString();
            //var globalChat = new GlobalChat(chatId, confId, listOfParticipants, []);
            
            var chat = {
                chatId: chatId,
                roomId: roomId,
                name: "",
                participantList: participantList,
                messageList: [],
            }

            return vimsudb.insertOneToCollection("global_chats" , chat).then(res => {
                console.log("global chat saved");
                //return globalChat;
            
            }).catch(err => {
                console.error(err)
            });
        
        }).catch(err => {
            console.error(err)
        });

    }

    static loadLectureChat(lectureId) {
        TypeChecker.isString(lectureId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("lecture_chats", {lectureId: lectureId}, "").then(chat => {
                if (chat) {
                   
                    /*let lectureChat = new LectureChat(lectureId, 
                                            chat.participantList, 
                                            chat.messageList, 
                                            chat.moderatorList, 
                                            chat.blackList);
                                            
                    return chats;
                }
                else {
                    console.log("lectureChat not found between in collection lecture_chats for lecture" + lectureId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    /*static loadAllChat(roomId) {
        TypeChecker.isString(lectureId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("room_chats", {roomId: roomId}, "").then(allChat => {
                if (allChat) {
                    return allChat;
                }
                else {
                    console.log("allChat not found between in collection room_chats for room" + roomId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }

    static loadChatParticipants(participantId, chatId) {
        TypeChecker.isString(chatId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("chats_" + participantId, {chatId: chatId}, {participantList: 1}).then(chat => {
                var participantList = chat.participantList;
                if (participantList && participantList.length >= 0) {

                    console.log(participantList);
                    return participantList;
                }
                else {
                    console.log("participant list could not been found for participant with chat id: " + chatId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })

    } 

    static loadChatMessages(participantId, chatId) {
        TypeChecker.isString(chatId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("chats_" + participantId, {chatId: chatId}, {messageList: 1}).then(chat => {
                var messageList = chat.messageList;

                if (messageList && messageList.length >= 0) {

                    console.log(messageList);
                    return messageList;
                }
                else {
                    console.log("participant list could not been found for participant with chat id: " + chatId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })

    }

    //tested
    static storeParticipants(chatId, ownerId, participantIds) {
        TypeChecker.isString(chatId);
        TypeChecker.isInstanceOf(participantIds, Array);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("chats_" + ownerId, {chatId: chatId}, {participantList: {$each: participantIds}}).then(res => {
                
                return true;

            }).catch(err => {
                console.error(err);
                return false;
            })
        }).catch(err => {
            console.error(err);
        })

    }

    static storeModerators(chatId, ownerId, participantIds) {
        TypeChecker.isString(chatId);
        TypeChecker.isInstanceOf(participantIds, Array);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("chats_" + ownerId, {chatId: chatId}, {moderatorList: {$each: participantIds}}).then(res => {
                
                return true;

            }).catch(err => {
                console.error(err);
                return false;
            })
        }).catch(err => {
            console.error(err);
        })

    }

    static storeBannedParticipants(chatId, ownerId, participantIds) {
        TypeChecker.isString(chatId);
        TypeChecker.isInstanceOf(participantIds, Array);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("chats_" + ownerId, {chatId: chatId}, {blackList: {$each: participantIds}}).then(res => {
                
                return true;

            }).catch(err => {
                console.error(err);
                return false;
            })
        }).catch(err => {
            console.error(err);
        })

    }

    

    static storeParticipantMStatus(msgId, participantId, status) {
        TypeChecker.isString(msgId);
    



    }
    */
}
