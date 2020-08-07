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

const db = require('../../../config/db');
const { Server } = require('mongodb');
const database = new db();
database.connectDB().then(result => {

//Test Data OneToOneChat
var chatId = OneToOneChatTestData.chatId;
var creatorID = OneToOneChatTestData.creatorID;
var chatPartnerID = OneToOneChatTestData.chatPartnerID; 

var maxNumMessages_ONE = Settings.MAXNUMMESSAGES_ONETOONECHAT;
var creatorUsername = OneToOneChatTestData.creatorUsername;
var chatPartnerUsername = OneToOneChatTestData.chatPartnerUsername;
var conferenceId = 'test';

var messageList_ONE = [];
var participantList_ONE = [creatorID, chatPartnerID];

var newOneToOneChat = new OneToOneChat(chatId, creatorID, chatPartnerID, [ ], maxNumMessages_ONE, creatorUsername, chatPartnerUsername);

//Test Data GroupChat
var chatId = GroupChatTestData.chatId;
var ownerId = GroupChatTestData.ownerId;
var chatName = GroupChatTestData.chatName;
var maxParticipants = Settings.MAXGROUPPARTICIPANTS;
var maxNumMessages_GROUP = Settings.MAXNUMMESSAGES_GROUPCHAT;

var messageList_GROUP = [];
var participantList_GROUP = [creatorID, chatPartnerID];

//Test Data GroupChat Participants
var newParticipant1 = GroupChatTestData.chatPartnerID;

describe('ChatService Testing', function() {

ChatService.newOneToOneChat(creatorID, chatPartnerID, creatorUsername, chatPartnerUsername, conferenceId, database).then(chat => {
    //Results new OneToOneChat

    var creatorUsername_result = chat.getOtherUsername(chatPartnerUsername);
    var chatPartnerUsername_result = chat.getOtherUsername(creatorUsername);

    var creatorID_result = chat.getOtherUserId(chatPartnerID);
    var chatPartnerID_result = chat.getOtherUserId(creatorID);
    var maxNumMessages_ONE_result = chat.getMaxNumMessages();

    var messageList_ONE_result = chat.getMessageList();
    var participantList_ONE_result = chat.getParticipantList();

    it('Test newOneToOneChat()', function() {

            expect(creatorUsername_result).to.be.a('string').and.equal(creatorUsername);
            
            expect(chatPartnerUsername_result).to.be.a('string').and.equal(chatPartnerUsername);

            expect(creatorID_result).to.be.a('string').and.equal(creatorID);
           
            expect(chatPartnerID_result).to.be.a('string').and.equal(chatPartnerID);

            expect(maxNumMessages_ONE_result).to.be.a('number').and.equal(maxNumMessages_ONE);
            expect(maxNumMessages_ONE_result % 1).to.equal(0);
           
            expect(messageList_ONE_result).to.have.members([]).and.to.have.lengthOf(0);

            expect(participantList_ONE_result).to.have.members(participantList_ONE).and.to.have.lengthOf(2);

    })

}).catch(err => {
    console.error(err);
});

ChatService.newGroupChat(ownerId, [ownerId, newParticipant1], chatName, conferenceId, database).then(chat => {

var groupChat = new GroupChat(chatId, ownerId, chatName, [ ownerId ], [  ], maxParticipants, maxNumMessages_GROUP);

//Results
var ownerId_result = chat.getOwnerId();
var chatName_result = chat.getChatName();
var maxNumMessages_GROUP_result = chat.getMaxNumMessages();
//var maxParticipants_result = chat.getMaxNumParticipants();

var messageList_GROUP_result = chat.getMessageList();
var participantList_GROUP_result = chat.getParticipantList();

    it('Test newGroupChat()', function() {
        
            expect(ownerId_result).to.be.a('string').and.equal(ownerId);
            
            expect(chatName_result).to.be.a('string').and.equal(chatName);

            expect(maxNumMessages_GROUP_result).to.be.a('number').and.equal(maxNumMessages_GROUP);
            expect(maxNumMessages_GROUP_result % 1).to.equal(0);
           
            expect(messageList_GROUP_result).to.have.members([]).and.to.have.lengthOf(0);

            expect(participantList_GROUP_result).to.have.members(participantList_GROUP).and.to.have.lengthOf(2);

    })

}).catch(err => {
    console.log(err);
})

})


})

