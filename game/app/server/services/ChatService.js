const TypeChecker = require('../../client/shared/TypeChecker.js');
const Message = require('../models/Message');
const OneToOneChat = require('../models/OneToOneChat');
const GroupChat = require('../models/GroupChat');
const ObjectId = require('mongodb').ObjectID;
const Settings = require('../utils/Settings.js');
const db = require('../../../../config/db')

module.exports = class Chatservice {

    /**
     * 
     * @param {String} ownerId 
     * @param {String} chatPartnerId 
     * @param {String} ownerUsername 
     * @param {String} chatPartnerUsername 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static newOneToOneChat(ownerId, chatPartnerId, ownerUsername, chatPartnerUsername, conferenceId, vimsudb) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(chatPartnerId);
        TypeChecker.isString(chatPartnerUsername);
        TypeChecker.isString(ownerUsername);
        TypeChecker.isInstanceOf(vimsudb ,db);

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
                chat.username2)

        }).catch(err => {
            console.error(err);
        })

    }

    /**
     * 
     * @param {String} ownerId 
     * @param {String[]} memberIds 
     * @param {String} groupName 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static newGroupChat(ownerId, memberIds, groupName, conferenceId, vimsudb) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(groupName);
        TypeChecker.isInstanceOf(memberIds, Array);
        memberIds.forEach(id => {
            TypeChecker.isString(id);
        })
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

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
    }

    /**
     * 
     * @param {String} ownerId 
     * @param {String} chatPartnerId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static existsOneToOneChat(ownerId, chatPartnerId, conferenceId, vimsudb) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(chatPartnerId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.findOneInCollection("chats_" + conferenceId, { ownerId: { $exists: false }, memberId: { $size: 2 }, memberId: { $all: [ownerId, chatPartnerId] } }, "").then(chat => {
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

    }

    /**
     * loads all chats of the specified participant
     * 
     * @param {String[]} chatIDList 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static loadChatList(chatIDList, conferenceId, vimsudb) {
        TypeChecker.isInstanceOf(chatIDList, Array);
        chatIDList.forEach(id => {
            TypeChecker.isString(id);
        });
        TypeChecker.isInstanceOf(vimsudb ,db);

        let chats = [];
        return Promise.all(chatIDList.map(async chatId => {
            var chat = await vimsudb.findOneInCollection("chats_" + conferenceId, { chatId: chatId });
            var messages = [];
            if (chat.messageList.length > 0) {
                chat.messageList.forEach(message => {
                    messages.push(new Message(message.msgId, message.senderId, message.senderUsername, message.timestamp, message.msgText));
                });
            }
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
        })).then(res => {
            return chats;
        })
    }

    /**
     * 
     * @param {String} chatId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static loadChat(chatId, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.findOneInCollection("chats_" + conferenceId, { chatId: chatId }).then(chat => {
            let messages = [];
            let loadedChat;

            if (chat) {
                if (chat.messageList.length > 0) {
                    chat.messageList.forEach(message => {
                        messages.push(new Message(message.msgId, message.senderId, message.senderUsername, message.timestamp, message.msgText));
                    });
                }
                if (chat.hasOwnProperty('ownerId')) {
                    loadedChat = new GroupChat(chat.chatId,
                        chat.ownerId,
                        chat.name,
                        chat.memberId,
                        messages,
                        Settings.MAXGROUPPARTICIPANTS,
                        Settings.MAXNUMMESSAGES_GROUPCHAT);
                } else {
                    loadedChat = new OneToOneChat(chat.chatId,
                        chat.memberId[0],
                        chat.memberId[1],
                        messages,
                        Settings.MAXNUMMESSAGES_ONETOONECHAT,
                        chat.username1,
                        chat.username2);
                }

                return loadedChat;
            } else {
                console.log("could not find chat with chatId" + chatId);
                return false;
            }

        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * 
     * @param {String} chatId 
     * @param {String} participantId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static storeParticipant(chatId, participantId, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(participantId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.insertToArrayInCollection("chats_" + conferenceId, { chatId: chatId }, { memberId: participantId }).then(res => {
            if (res) {
                return true;

            } else {
                return false;
            }

        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    /**
     * 
     * @param {String} chatId 
     * @param {String} participantId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static removeParticipant(chatId, participantId, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);


        return vimsudb.deleteFromArrayInCollection("chats_" + conferenceId, { chatId: chatId }, { memberId: participantId }).then(res => {
            var dbRes = res;
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { chatIDList: chatId }).then(res => {
                return vimsudb.findOneInCollection("chats_" + conferenceId, { chatId: chatId }, { memberId: 1 }).then(chat => {
                    if (chat && dbRes) {
                        if (chat.memberId.length < 1) {
                            return vimsudb.deleteOneFromCollection("chats_" + conferenceId, { chatId: chatId }).then(res => {

                                return true;
                            }).catch(err => {
                                console.error(err);
                                return false;
                            })
                        }
                        return true;
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
    }

    /**
     * 
     * @param {String} chatId 
     * @param {String} senderId 
     * @param {String} senderUsername 
     * @param {String} msgText 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static createChatMessage(chatId, senderId, senderUsername, msgText, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(senderId);
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(msgText);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        let message = {
            msgId: new ObjectId().toString(),
            senderId: senderId,
            senderUsername: senderUsername,
            timestamp: new Date(),
            msgText: msgText,
        }

        return vimsudb.insertToArrayInCollection("chats_" + conferenceId, { chatId: chatId }, { messageList: message }).then(res => {
            console.log("chat message saved");
            return new Message(message.msgId,
                message.senderId,
                message.senderUsername,
                message.timestamp,
                message.msgText);

        }).catch(err => {
            console.error(err)
        });
    }

    /**
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static removeAllChats(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.deleteAllFromCollection("chats_" + conferenceId).then(chatsRes => {
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {}, { chatIDList: { $exists: true } }).then(res => {
                if (chatsRes)
                    console.log("all chats deleted");

                return chatsRes;
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * 
     * @param {String} participantId 
     * @param {String} chatId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static removeChat(participantId, chatId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.deleteOneFromCollection("chats_" + conferenceId, { chatId: chatId }).then(chatRes => {
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { chatIDList: chatId }).then(res => {
                if (chatRes)
                    console.log("chat with chatId " + chatId + " deleted");

                return chatRes;
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }
}
