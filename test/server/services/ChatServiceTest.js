const chai = require('chai');
const expect = chai.expect;

const ChatService = require('../../../src/game/app/server/services/ChatService.js');
const OneToOneChat = require('../../../src/game/app/server/models/OneToOneChat.js');
const Chat = require('../../../src/game/app/server/models/Chat.js');
const GroupChat = require('../../../src/game/app/server/models/GroupChat.js');
const LectureChat = require('../../../src/game/app/server/models/LectureChat.js');
const Message = require('../../../src/game/app/server/models/Message.js');

const OneToOneChatTestData = require('../models/TestData/OneToOneChatTestData.js');
const GroupChatTestData = require('../models/TestData/GroupChatTestData.js');
const ChatTestData = require('../models/TestData/ChatTestData.js');
const MessageTestData = require('../models/TestData/MessageTestData.js');
const Settings = require('../../../src/game/app/server/utils/Settings.js');
const ServiceTestData = require('./TestData/ServiceTestData.js');

const db = require('../../../src/config/db');
const database = new db();

//Test Data OneToOneChat
var chatId = OneToOneChatTestData.chatId;
var maxNumMessages_ONE = Settings.MAXNUMMESSAGES_ONETOONECHAT;
var conferenceId = ServiceTestData.conferenceId_1;
var conferenceId_2 = ServiceTestData.conferenceId_2;

var creatorID = OneToOneChatTestData.creatorID;
var creatorUsername = OneToOneChatTestData.creatorUsername;
var creatorMessageText = MessageTestData.messageText;

var chatPartnerID = OneToOneChatTestData.chatPartnerID; 
var chatPartnerUsername = OneToOneChatTestData.chatPartnerUsername;
var chatPartnerMessageText = MessageTestData.alt_messageText;

var messageList_ONE = [];
var participantList_ONE = [creatorID, chatPartnerID];

//var oneToOneChat = new OneToOneChat(chatId, creatorID, chatPartnerID, [ ], maxNumMessages_ONE, creatorUsername, chatPartnerUsername);

//Test Data GroupChat Participants
var newParticipant1_Id = GroupChatTestData.chatPartnerID;
var newParticipant1_Username =  MessageTestData.alt_senderUsername;
var newParticipant1_messageText = MessageTestData.alt_messageText;
var newParticipant2_Id = GroupChatTestData.alt_chatPartnerID;
var newParticipant2_Username = MessageTestData.alt_alt_senderUsername;
var newParticipant2_MessageText = MessageTestData.alt_alt_messageText;

//Test Data GroupChat
var chatId = GroupChatTestData.chatId;
var ownerId = GroupChatTestData.ownerId;
var chatName = GroupChatTestData.chatName;
var chatName2 = GroupChatTestData.alt_chatName;
var maxParticipants = Settings.MAXGROUPPARTICIPANTS;
var maxNumMessages_GROUP = Settings.MAXNUMMESSAGES_GROUPCHAT;

var ownerUsername = MessageTestData.senderUsername;
var ownerMessageText = MessageTestData.messageText;

var messageList_GROUP = [];
var participantList_GROUP = [ownerId, newParticipant1_Id];



const newOneToOneChat = async () => {
    return ChatService.newOneToOneChat(creatorID, chatPartnerID, creatorUsername, chatPartnerUsername, conferenceId, database).then(chat => {
    
        return chat;

        }).catch(err => {
            console.error(err);
        });
}

const newGroupChat = async () => {
    return ChatService.newGroupChat(ownerId, [ownerId, newParticipant1_Id], chatName, conferenceId, database).then(chat => {
        
        return chat;

    }).catch(err => {
        console.error(err);
})
}

const newGroupChat2 = async () => {
    return ChatService.newGroupChat(newParticipant2_Id, [newParticipant2_Id, newParticipant1_Id], chatName2, conferenceId, database).then(chat => {
        
        return chat;

    }).catch(err => {
        console.error(err);
})
}

describe('ChatService Testing', function() {
    /*newOneToOneChat().then(result => {
        newOneToOneChat_result = result;
    });*/
    var globalResults;
    
    /*//Gets the chat of the chat creator in the globalResults
    var getChatOfCreator = (chatCreator, chatPartner) => {
        globalResults.forEach(chat => {
            if(chat instanceof GroupChat && chat.getOwnerId() === chatCreator) {
                return chat;
            } else if(chat instanceof OneToOneChat && chat.getOtherUserId(chatPartner) === chatCreator) {
                return chat;
            }
        })
    }*/

    before(async () => {
    await database.connectDB();
    //vimsudb = await database.getDB();
    var newOneToOneChat_result = await newOneToOneChat(); 
    var newGroupChat_result = await newGroupChat();
    var newGroupChat2_result = await newGroupChat2();
    var results = [newOneToOneChat_result, newGroupChat_result, newGroupChat2_result];

        Promise.all(results).then(() => {
           //this.results = results;
            globalResults = results;
        }).catch(err => {
            console.error(err);
        })
    })

it('Test newOneToOneChat()', () => {
    
        //Results new OneToOneChat
        var creatorUsername_result = globalResults[0].getOtherUsername(chatPartnerUsername);
        var chatPartnerUsername_result = globalResults[0].getOtherUsername(creatorUsername);

        var creatorID_result = globalResults[0].getOtherUserId(chatPartnerID);
        var chatPartnerID_result = globalResults[0].getOtherUserId(creatorID);
        var maxNumMessages_ONE_result = globalResults[0].getMaxNumMessages();

        var messageList_ONE_result = globalResults[0].getMessageList();
        var participantList_ONE_result = globalResults[0].getParticipantList();
        
        var newOneToOneChat_result = globalResults[0];

            expect(newOneToOneChat_result).to.be.instanceOf(OneToOneChat);

            expect(creatorUsername_result).to.be.a('string').and.equal(creatorUsername);
                
            expect(chatPartnerUsername_result).to.be.a('string').and.equal(chatPartnerUsername);

            expect(creatorID_result).to.be.a('string').and.equal(creatorID);
            
            expect(chatPartnerID_result).to.be.a('string').and.equal(chatPartnerID);

            expect(maxNumMessages_ONE_result).to.be.a('number').and.equal(maxNumMessages_ONE);
            expect(maxNumMessages_ONE_result % 1).to.equal(0);
            
            expect(messageList_ONE_result).to.have.members([]).and.to.have.lengthOf(0);

            expect(participantList_ONE_result).to.have.members(participantList_ONE).and.to.have.lengthOf(2);

})
    it('Test existsOneToOneChat() with valid chat', async () => {
        await ChatService.existsOneToOneChat(creatorID, chatPartnerID, conferenceId, database).then(chat => {
            expect(chat).to.be.instanceOf(Object).and.to.have.property('chatId');
            expect(chat.memberId).to.be.an('array').and.to.have.members(participantList_ONE).and.to.have.lengthOf(2);
            expect(chat.messageList).to.be.an('array').and.to.have.members([]).and.to.have.lengthOf(0);
            expect(chat.username1).to.be.a('string').and.to.equal(creatorUsername);
            expect(chat.username2).to.be.a('string').and.to.equal(chatPartnerUsername);
        })
    })

    it('Test existsOneToOneChat() with invalid chat', async () => {
       await ChatService.existsOneToOneChat(ownerId, chatPartnerID, conferenceId, database).then(chat => {
            expect(chat).to.be.false.and.not.to.be.eql(globalResults[0]);
        }).catch(err => {
            console.log(err);
        })
    })


it('Test newGroupChat()', function() {

        var groupChat = new GroupChat(chatId, ownerId, chatName, [ ownerId ], [  ], maxParticipants, maxNumMessages_GROUP);

        //Results
        var ownerId_result = globalResults[1].getOwnerId();
        var chatName_result = globalResults[1].getChatName();
        var maxNumMessages_GROUP_result = globalResults[1].getMaxNumMessages();
        //var maxParticipants_result = chat.getMaxNumParticipants();

        var messageList_GROUP_result = globalResults[1].getMessageList();
        var participantList_GROUP_result = globalResults[1].getParticipantList();

            expect(globalResults[1]).to.be.instanceOf(GroupChat);
            expect(ownerId_result).to.be.a('string').and.equal(ownerId);
                
            expect(chatName_result).to.be.a('string').and.equal(chatName);

            expect(maxNumMessages_GROUP_result).to.be.a('number').and.equal(maxNumMessages_GROUP);
            expect(maxNumMessages_GROUP_result % 1).to.equal(0);
            
            expect(messageList_GROUP_result).to.have.members([]).and.to.have.lengthOf(0);

            expect(participantList_GROUP_result).to.have.members(participantList_GROUP).and.to.have.lengthOf(2);

})


describe('Load new chat function testing', () => {
    
    it('Test load valid just created OneToOneChat', async () => {
        var newOneToOneChat_result = globalResults[0];

        await ChatService.loadChat(newOneToOneChat_result.getId(), conferenceId, database).then(chat => {
            
            expect(chat).to.be.instanceOf(OneToOneChat).and.to.be.eql(newOneToOneChat_result);
        
        }).catch(err => {
            console.error(err);
        })
    })

    it('Test load valid just created GroupChat', async () => {
        var newGroupChat_result = globalResults[1];

        await ChatService.loadChat(newGroupChat_result.getId(), conferenceId, database).then(chat => {

            expect(chat).to.be.instanceOf(GroupChat).and.to.be.eql(newGroupChat_result);

        }).catch(err => {
            console.error(err);
        })
    })

    it('Test load invalid Chat', async() => {
        var newOneToOneChat_result = globalResults[0];

        await ChatService.loadChat(newOneToOneChat_result.getId() + '1', conferenceId, database).then(chat => {

            expect(chat).to.be.false.and.not.to.eql(newOneToOneChat_result);

        }).catch(err => {
            console.error(err);
        })

    })

/* The following tests do all depend on the result of the previous test. */
describe('Create message in chat function testing', () => {
    
    it('Test create new OneToOneChat message from chat owner', async () => {
        var newOneToOneChat_result = globalResults[0];
        var msg = await ChatService.createChatMessage(newOneToOneChat_result.getId(), 
                                            creatorID, 
                                            creatorUsername, 
                                            creatorMessageText, 
                                            conferenceId, 
                                            database);
            expect(msg).to.be.instanceOf(Message);
            expect(msg.getMessageId()).to.be.a('string');
            expect(msg.getSenderId()).to.be.a('string').and.to.equal(creatorID);
            expect(msg.getUsername()).to.be.a('string').and.to.equal(creatorUsername);
            expect(msg.getTimestamp()).to.be.a('date');
            expect(msg.getMessageText()).to.be.a('string').and.to.equal(creatorMessageText);
    })

    it('Test create new OneToOneChat message from chatpartner', async () => {
        var newOneToOneChat_result = globalResults[0];
        var msg = await ChatService.createChatMessage(newOneToOneChat_result.getId(), 
                                            chatPartnerID, 
                                            chatPartnerUsername, 
                                            chatPartnerMessageText, 
                                            conferenceId, 
                                            database);
            expect(msg).to.be.instanceOf(Message);
            expect(msg.getMessageId()).to.be.a('string');
            expect(msg.getSenderId()).to.be.a('string').and.to.equal(chatPartnerID);
            expect(msg.getUsername()).to.be.a('string').and.to.equal(chatPartnerUsername);
            expect(msg.getTimestamp()).to.be.a('date');
            expect(msg.getMessageText()).to.be.a('string').and.to.equal(chatPartnerMessageText);
    })

    it('Test create new GroupChat message from chat owner', async () => {
        var newGroupChat_result = globalResults[1];

        var msg = await ChatService.createChatMessage(newGroupChat_result.getId(),
                                            ownerId, 
                                            ownerUsername, 
                                            ownerMessageText, 
                                            conferenceId, 
                                            database);
            expect(msg).to.be.instanceOf(Message);
            expect(msg.getMessageId()).to.be.a('string');
            expect(msg.getSenderId()).to.be.a('string').and.to.equal(ownerId);
            expect(msg.getUsername()).to.be.a('string').and.to.equal(ownerUsername);
            expect(msg.getTimestamp()).to.be.a('date');
            expect(msg.getMessageText()).to.be.a('string').and.to.equal(ownerMessageText);
        
    })

    it('Test create new GroupChat message from chatpartner', async () => {
        var newGroupChat_result = globalResults[1];

        var msg = await ChatService.createChatMessage(newGroupChat_result.getId(),
                                            newParticipant1_Id, 
                                            newParticipant1_Username, 
                                            newParticipant1_messageText, 
                                            conferenceId, 
                                            database);
            expect(msg).to.be.instanceOf(Message);
            expect(msg.getMessageId()).to.be.a('string');
            expect(msg.getSenderId()).to.be.a('string').and.to.equal(newParticipant1_Id);
            expect(msg.getUsername()).to.be.a('string').and.to.equal(newParticipant1_Username);
            expect(msg.getTimestamp()).to.be.a('date');
            expect(msg.getMessageText()).to.be.a('string').and.to.equal(newParticipant1_messageText);
        
    })

    it('Test load valid OneToOneChat with modified message list', async () => {
        var newOneToOneChat_result = globalResults[0];
        
        var chat = await ChatService.loadChat(newOneToOneChat_result.getId(), conferenceId, database);
           
        //Results OneToOneChat
        var chatId_result = chat.getId();
        var creatorUsername_result = chat.getOtherUsername(chatPartnerUsername);
        var chatPartnerUsername_result = chat.getOtherUsername(creatorUsername);
    
        var creatorID_result = chat.getOtherUserId(chatPartnerID);
        var chatPartnerID_result = chat.getOtherUserId(creatorID);
        var maxNumMessages_ONE_result = chat.getMaxNumMessages();
    
        var messageList_ONE_result = chat.getMessageList();
        var participantList_ONE_result = chat.getParticipantList();
    
        expect(chat).to.be.instanceOf(OneToOneChat);
        expect(chat).to.be.eql(newOneToOneChat_result);
        
        expect(chatId_result).to.be.a('string').and.to.be.equal(newOneToOneChat_result.getId());
        expect(creatorUsername_result).to.be.a('string').and.equal(creatorUsername);
        expect(chatPartnerUsername_result).to.be.a('string').and.equal(chatPartnerUsername);
        expect(creatorID_result).to.be.a('string').and.equal(creatorID);
        expect(chatPartnerID_result).to.be.a('string').and.equal(chatPartnerID);
        expect(maxNumMessages_ONE_result).to.be.a('number').and.to.equal(maxNumMessages_ONE);
        expect(maxNumMessages_ONE_result % 1).to.equal(0);

        expect(messageList_ONE_result).to.have.lengthOf(2);
        
        messageList_ONE_result.forEach(msg => {
            expect(msg).to.be.instanceOf(Message);
        })
        expect(participantList_ONE_result).to.have.members(participantList_ONE).and.to.have.lengthOf(2);
    
    })

    it('Test load valid GroupChat with modified message list', async () => {
        var newGroupChat_result = globalResults[1];
        
        var chat = await ChatService.loadChat(newGroupChat_result.getId(), conferenceId, database);

        //Results GroupChat
        var chatId_result = chat.getId();
        var chatName_result = chat.getChatName();
        var ownerId_result = chat.getOwnerId();
        var maxNumMessages_GROUP_result = chat.getMaxNumMessages();
    
        var messageList_GROUP_result = chat.getMessageList();
        var participantList_GROUP_result = chat.getParticipantList();
    
        expect(chat).to.be.instanceOf(GroupChat);
        expect(chat).to.be.eql(newGroupChat_result);
        
        expect(chatId_result).to.be.a('string').and.to.be.equal(newGroupChat_result.getId());
        expect(ownerId_result).to.be.a('string').and.equal(ownerId);
        expect(chatName_result).to.be.a('string').and.equal(chatName);
        expect(maxNumMessages_GROUP_result).to.be.a('number').and.to.equal(maxNumMessages_GROUP);
        expect(maxNumMessages_GROUP_result % 1).to.equal(0);

        expect(messageList_GROUP_result).to.have.lengthOf(2);
        
        messageList_GROUP_result.forEach(msg => {
            expect(msg).to.be.instanceOf(Message);
        })
        expect(participantList_GROUP_result).to.have.members(participantList_GROUP).and.to.have.lengthOf(2);
    
    })
    
    describe('Store participant to chat function testing', () => {

        it('Test store new participant to new GroupChat', async () => {
            var newGroupChat_result = globalResults[1];
    
            var result = await ChatService.storeParticipant(newGroupChat_result.getId(), newParticipant2_Id, conferenceId, database);
    
            expect(result).to.be.a('boolean').and.to.be.true;
        })
    
        it('Test store new participant to invalid chat', async () => {
            var result = await ChatService.storeParticipant('42', newParticipant2_Id, conferenceId, database);
    
            expect(result).to.be.a('boolean').and.to.be.false;
        })

        describe('Load chat list function testing', () => {
            it('Test load chat list', async () => {
                var chatIDList = [];
                globalResults.forEach(chat => {
                    chatIDList.push(chat.getId());
                })

                var chats = await ChatService.loadChatList(chatIDList, conferenceId, database);

                expect(chats).to.be.an('array').and.to.have.lengthOf(globalResults.length);
                chats.forEach(chat => {
                    expect(chat).to.be.instanceOf(Chat);
                    chat.getMessageList().forEach(msg => {
                        expect(msg).to.be.instanceOf(Message);
                    })
                    chat.getParticipantList().forEach(ppant => {
                        expect(ppant).to.be.a('string');
                    })
                })
            })

            it('Test load invalid chat list', async () => {
                var chatIDList = ['0','-126', '.,*+'];

                return await ChatService.loadChatList(chatIDList, conferenceId, database).then(result => {

                }).catch(err => {
                    expect(err).to.be.instanceOf(TypeError);
                    expect(err.message).to.equal("Cannot read property 'messageList' of null");
                })

            })
        })
        
        describe('Remove participant from chat function testing', () => {
    
            it('Test remove valid chat creator from OneToOneChat', async () => {
                var newOneToOneChat_result = globalResults[0];
                var chatId_result = newOneToOneChat_result.getId();
    
                var result = await ChatService.removeParticipant(chatId_result, creatorID, conferenceId, database);
    
                expect(result).to.be.a('boolean').and.to.be.true;
               
            })
    
            //It could be solved with setTimeout but in a real case scenario it is also possible that
            //the deleted data gets queried immediately (N)
            it('Test validate test: remove valid chat creator from OneToOneChat', async () => {
                var newOneToOneChat_result = globalResults[0];
                var chatId_result = newOneToOneChat_result.getId();
                
                var chat = await ChatService.loadChat(chatId_result, conferenceId, database);
    
                expect(chat.getParticipantList()).to.have.members([chatPartnerID]).and.to.have.lengthOf(1);
            })
    
        
            it('Test remove valid chat partner from OneToOneChat', async () => {
                var newOneToOneChat_result = globalResults[0];
                var chatId_result = newOneToOneChat_result.getId();
    
                var result = await ChatService.removeParticipant(chatId_result, chatPartnerID, conferenceId, database);
    
                expect(result).to.be.a('boolean').and.to.be.true;
    
            })
    
            it('Test OneToOneChat with no members gets deleted', async () => {
                var newOneToOneChat_result = globalResults[0];
    
                var result = await ChatService.loadChat(newOneToOneChat_result.getId(), conferenceId, database);
                    
                expect(result).to.be.a('boolean').and.to.be.false;

                globalResults.splice(0, 1);

                expect(globalResults).to.be.an('array').and.to.have.lengthOf(2);
            })
    
            it('Test remove valid chat owner from GroupChat', async () => {
                var newGroupChat_result = globalResults[0];
                var chatId_result = newGroupChat_result.getId();
                
                var result = await ChatService.removeParticipant(chatId_result, ownerId, conferenceId, database);
            
                expect(result).to.be.a('boolean').and.to.be.true;
                
                var chat = await ChatService.loadChat(chatId_result, conferenceId, database);
    
                expect(chat.getParticipantList()).to.have.members([newParticipant1_Id, newParticipant2_Id]).and.to.have.lengthOf(2);
            })
        
            it('Test remove invalid participant from Chat', async () => {
                var newGroupChat_result = globalResults[0];
                var chatId_result = newGroupChat_result.getId();
                
                var result = await ChatService.removeParticipant(chatId_result, '0', conferenceId, database);
    
                expect(result).to.be.a('boolean').and.to.be.false;
    
                var chat = await ChatService.loadChat(chatId_result, conferenceId, database);
    
                expect(chat.getParticipantList()).to.have.members([newParticipant1_Id, newParticipant2_Id]).and.to.have.lengthOf(2);
            })
    
            
        })

        describe('Remove chat from database function testing', () => {
            
            it('Test remove group chat from database', async () => {
                var newGroupChat2_result = globalResults[1];
                var newGroupChat2_Id_result = newGroupChat2_result.getId();
                var chatId_results_before = [];
                var chatId_results_after = [];

                 globalResults.forEach(chat => {
                     var chatId = chat.getId();
                     if(chatId === newGroupChat2_Id_result) {
                        chatId_results_before.push(chatId);

                     } else {
                        chatId_results_before.push(chatId);
                        chatId_results_after.push(chatId);
                     }
                 })

                var chats_before = await ChatService.loadChatList(chatId_results_before, conferenceId, database);

                expect(chats_before).to.be.an('array').and.to.have.lengthOf(2);

                var result =  await ChatService.removeChat(newParticipant2_Id, newGroupChat2_Id_result, conferenceId, database);

                expect(result).to.be.true;

                var chats_after = await ChatService.loadChatList(chatId_results_after, conferenceId, database);

                expect(chats_after).to.be.an('array').and.to.have.lengthOf(1);

            })

            it('Test remove invalid chat from database', async () => {
                var result = await ChatService.removeChat(",.-+*", ",.-+*", conferenceId, database);

                expect(result).to.be.a('boolean').and.to.be.false;

            })

        })

        describe('Remove all chats from database function testing', () => {

            it('Test remove all chats from collection', async () => {
                var result = await ChatService.removeAllChats(conferenceId, database);

                expect(result).to.be.true;

                var chats_test_1_count = await database.getCollectionDocCount("chats_" + conferenceId);
                expect(chats_test_1_count).to.equal(0);
            })

            it('Test remove all chats from invalid database', async () => {
                let error = null;
                try {
                    await ChatService.removeAllChats(conferenceId, 12345);
                } catch(err) {
                    error = err;
                }
                expect(error).to.be.instanceOf(TypeError);
                expect(error.message).to.equal("vimsudb.deleteAllFromCollection is not a function");

            })
        })
    
    })

})





    after(async () => {
        //ChatService.removeAllChats(conferenceId, database);
    })

})

})

