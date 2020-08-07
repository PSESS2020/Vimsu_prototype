const expect = require('chai').expect;

const ChatService = require('../../../game/app/server/services/ChatService.js');
const OneToOneChat = require('../../../game/app/server/models/OneToOneChat.js');
const GroupChat = require('../../../game/app/server/models/GroupChat.js');
const LectureChat = require('../../../game/app/server/models/LectureChat.js');
const Message = require('../../../game/app/server/models/Message.js');

const OneToOneChatTestData = require('../models/TestData/OneToOneChatTestData.js');
const GroupChatTestData = require('../models/TestData/GroupChatTestData.js');
const ChatTestData = require('../models/TestData/ChatTestData.js');
const MessageTestData = require('../models/TestData/MessageTestData.js');
const Settings = require('../../../game/app/utils/Settings.js');
const ServiceTestData = require('./TestData/ServiceTestData.js');

const db = require('../../../config/db');
const database = new db();

//Test Data OneToOneChat
var chatId = OneToOneChatTestData.chatId;
var creatorID = OneToOneChatTestData.creatorID;
var chatPartnerID = OneToOneChatTestData.chatPartnerID; 

var maxNumMessages_ONE = Settings.MAXNUMMESSAGES_ONETOONECHAT;
var creatorUsername = OneToOneChatTestData.creatorUsername;
var chatPartnerUsername = OneToOneChatTestData.chatPartnerUsername;
var conferenceId = ServiceTestData.conferenceId_1;

var messageList_ONE = [];
var participantList_ONE = [creatorID, chatPartnerID];

var oneToOneChat = new OneToOneChat(chatId, creatorID, chatPartnerID, [ ], maxNumMessages_ONE, creatorUsername, chatPartnerUsername);

//Test Data GroupChat Participants
var newParticipant1 = GroupChatTestData.chatPartnerID;

//Test Data GroupChat
var chatId = GroupChatTestData.chatId;
var ownerId = GroupChatTestData.ownerId;
var chatName = GroupChatTestData.chatName;
var maxParticipants = Settings.MAXGROUPPARTICIPANTS;
var maxNumMessages_GROUP = Settings.MAXNUMMESSAGES_GROUPCHAT;

var messageList_GROUP = [];
var participantList_GROUP = [ownerId, newParticipant1];



const newOneToOneChat = async () => {
    return ChatService.newOneToOneChat(creatorID, chatPartnerID, creatorUsername, chatPartnerUsername, conferenceId, database).then(chat => {
    
        return chat;

        }).catch(err => {
            console.error(err);
        });
}

const newGroupChat = async () => {
    return ChatService.newGroupChat(ownerId, [ownerId, newParticipant1], chatName, conferenceId, database).then(chat => {
        
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
    
    before(async () => {
    await database.connectDB();
    var newOneToOneChat_result = await newOneToOneChat(); 
    var newGroupChat_result = await newGroupChat();
    var results = [newOneToOneChat_result, newGroupChat_result];

        Promise.all(results).then(() => {
           //this.results = results;
            globalResults = results;
        }).catch(err => {
            console.error(err);
        })
    })

it('Test newOneToOneChat()', function() {
    
        //Results new OneToOneChat

        var creatorUsername_result = globalResults[0].getOtherUsername(chatPartnerUsername);
        var chatPartnerUsername_result = globalResults[0].getOtherUsername(creatorUsername);

        var creatorID_result = globalResults[0].getOtherUserId(chatPartnerID);
        var chatPartnerID_result = globalResults[0].getOtherUserId(creatorID);
        var maxNumMessages_ONE_result = globalResults[0].getMaxNumMessages();

        var messageList_ONE_result = globalResults[0].getMessageList();
        var participantList_ONE_result = globalResults[0].getParticipantList();
        //var superChat = chat;

            expect(globalResults[0]).to.be.instanceOf(OneToOneChat);

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

/*ChatService.loadChatList
ChatService.loadChat
ChatService.storeParticipant
ChatService.removeParticipant
ChatService.createChatMessage
ChatService.removeChat
ChatService.removeAllChats*/

})

