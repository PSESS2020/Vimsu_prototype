const TypeChecker = require('../../client/shared/TypeChecker.js');
const Message = require('../models/Message');
const OneToOneChat = require('../models/OneToOneChat');
const GroupChat = require('../models/GroupChat');
const ObjectId = require('mongodb').ObjectID;
const Settings = require('../utils/Settings.js');
const db = require('../../../../config/db')

/**
 * The Chat Service
 * @module ChatService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class ChatService {

    /**
     * creates a new one to one chat instance and saves it in the database
     * @static @method module:ChatService#newOneToOneChat
     * 
     * @param {String} ownerId chat initializer ID
     * @param {String} chatPartnerId chat partner ID
     * @param {String} ownerUsername chat initializer username
     * @param {String} chatPartnerUsername chat partner username
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {OneToOneChat} OneToOneChat instance
     */
    static newOneToOneChat(ownerId, chatPartnerId, ownerUsername, chatPartnerUsername, conferenceId, vimsudb) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(chatPartnerId);
        TypeChecker.isString(chatPartnerUsername);
        TypeChecker.isString(ownerUsername);
        TypeChecker.isInstanceOf(vimsudb, db);

        var chat = {
            chatId: new ObjectId().toString(),
            memberId: [ownerId, chatPartnerId],
            messageList: [],
            username1: ownerUsername,
            username2: chatPartnerUsername
        }

        return vimsudb.insertOneToCollection("chats_" + conferenceId, chat).then(res => {

            console.log("1:1 chat saved");
            return new OneToOneChat(chat.chatId,
                chat.memberId[0],
                chat.memberId[1],
                chat.messageList,
                Settings.MAXNUMMESSAGES_ONETOONECHAT,
                chat.username1,
                chat.username2)

        })
    }

    /**
     * creates a new group chat instance and saves it in the database
     * @static @method module:ChatService#newGroupChat
     * 
     * @param {String} ownerId chat initializer ID
     * @param {String[]} memberIds array of group chat member ID
     * @param {String} groupName group chat name
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {GroupChat} GroupChat instance
     */
    static newGroupChat(ownerId, memberIds, groupName, conferenceId, vimsudb) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(groupName);
        TypeChecker.isInstanceOf(memberIds, Array);
        memberIds.forEach(id => {
            TypeChecker.isString(id);
        })
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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

        })
    }

    /**
     * checks if a one to one chat between 2 participants is already existed in the database
     * @static @method module:ChatService#existsOneToOneChat
     * 
     * @param {String} ownerId first participant ID
     * @param {String} chatPartnerId second participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Chat} chat data if existed, otherwise false
     */
    static existsOneToOneChat(ownerId, chatPartnerId, conferenceId, vimsudb) {
        TypeChecker.isString(ownerId);
        TypeChecker.isString(chatPartnerId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("chats_" + conferenceId, { ownerId: { $exists: false }, memberId: { $size: 2 }, memberId: { $all: [ownerId, chatPartnerId] } }, "").then(chat => {
            if (chat) {
                return chat;
            }
            else {
                console.log("oneToOneChat not found between " + ownerId + " and " + chatPartnerId + " in collection chats_" + conferenceId);
                return false;
            }
        })

    }

    /**
     * loads all chats of the specified participant from the database
     * @static @method module:ChatService#loadChatList
     * 
     * @param {String[]} chatIDList array of chat ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Chat[]} array of Chat instances
     */
    static loadChatList(chatIDList, conferenceId, vimsudb) {
        TypeChecker.isInstanceOf(chatIDList, Array);
        chatIDList.forEach(id => {
            TypeChecker.isString(id);
        });
        TypeChecker.isInstanceOf(vimsudb, db);

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
     * gets a chat with the specified chat ID from the database
     * @static @method module:ChatService#loadChat
     * 
     * @param {String} chatId chat ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Chat} Chat instance if found, otherwise false
     */
    static loadChat(chatId, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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
        })
    }

    /**
     * gets the member list from chat with chatId
     * @static @method module:ChatService#loadChat
     * 
     * @param {String} chatId chat ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Chat} Chat instance if found, otherwise false
     */
    static loadMemberList(chatId, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);
    
        return vimsudb.findOneInCollection("chats_" + conferenceId, { chatId: chatId }).then(chat => {
            if (chat) {
                return chat.memberId;
            } else {
                console.log("could not find chat with chatId" + chatId);
                return false;
            }
        })
    }

    /**
     * stores a participant in the chat member list in the database
     * @static @method module:ChatService#storeParticipant
     * 
     * @param {String} chatId chat ID
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if stored successfully, otherwise false
     */
    static storeParticipant(chatId, participantId, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(participantId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.insertToArrayInCollection("chats_" + conferenceId, { chatId: chatId }, { memberId: participantId }).then(res => {
            if (res) {
                return true;
            } else {
                return false;
            }
        })

    }

    /**
     * removes participant from a chat from the database
     * @static @method module:ChatService#removeParticipant
     * 
     * @param {String} chatId chat ID
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if successfully removed, otherwise false
     */
    static removeParticipant(chatId, participantId, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        //first, remove participant from chats collection
        return vimsudb.deleteFromArrayInCollection("chats_" + conferenceId, { chatId: chatId }, { memberId: participantId }).then(res => {
            var dbRes = res;

            //then, remove chat from chatIDList in participants collection
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { chatIDList: chatId }).then(res => {

                //checks if this chat still has a member
                return vimsudb.findOneInCollection("chats_" + conferenceId, { chatId: chatId }, { memberId: 1 }).then(chat => {
                    if (chat && dbRes) {
                        if (chat.memberId.length < 1) {

                            //chat doesn't have any member anymore, so delete the entry from chats collection
                            return vimsudb.deleteOneFromCollection("chats_" + conferenceId, { chatId: chatId }).then(res => {
                                return res;
                            })
                        }
                        return true;
                    } else {
                        console.log("no chat found with " + chatId);
                        return false;
                    }
                })
            })
        })
    }

    /**
     * creates a chat message
     * @static @method module:ChatService#createChatMessage
     * 
     * @param {String} chatId chat ID
     * @param {String} senderId sender ID
     * @param {String} senderUsername sender username
     * @param {String} msgText message
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Message} Message instance
     */
    static createChatMessage(chatId, senderId, senderUsername, msgText, conferenceId, vimsudb) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(senderId);
        TypeChecker.isString(senderUsername);
        TypeChecker.isString(msgText);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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
        })
    }

    /**
     * removes all chats from the database
     * @static static method
     * @method module:ChatService#removedAllChats
     * 
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if deleted successfully
     */
    static removeAllChats(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteAllFromCollection("chats_" + conferenceId).then(chatsRes => {
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {}, { chatIDList: { $exists: true } }).then(res => {
                if (chatsRes && res)
                    console.log("all chats deleted");
                return chatsRes;
            })
        })
    }

    /**
     * removes a chat from the database
     * @static @method module:ChatService#removeChat
     * 
     * @param {String} participantId participant ID
     * @param {String} chatId chat ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if deleted successfully
     */
    static removeChat(participantId, chatId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(chatId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteOneFromCollection("chats_" + conferenceId, { chatId: chatId }).then(chatRes => {
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { chatIDList: chatId }).then(res => {
                if (chatRes && res)
                    console.log("chat with chatId " + chatId + " deleted");
                return chatRes;
            })
        })
    }
}
