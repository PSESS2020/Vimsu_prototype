const chai = require('chai');
chai.use(require('chai-datetime'));
const assert = chai.assert;
const expect = chai.expect;

const Chat = require('../../../game/app/server/models/Chat.js');
const GroupChat = require('../../../game/app/server/models/GroupChat.js');
const Message = require('../../../game/app/server/models/Message.js');

const GroupChatTestData = require('./TestData/GroupChatTestData.js');
const MessageTestData = require('./TestData/MessageTestData.js');


//Test Data Messages
var oldMessage = new Message(MessageTestData.messageId,
                         MessageTestData.senderId,
                         MessageTestData.senerUsername,
                         new Date(),
                         MessageTestData.messageTest
                         );
var newMessage1 = new Message(MessageTestData.alt_messageId,
                          MessageTestData.alt_senderId,
                          MessageTestData.alt_senderUsername,
                          new Date(),
                          MessageTestData.alt_messageText
                          );
var newMessage2 = new Message(MessageTestData.messageId,
                          MessageTestData.senderId,
                            MessageTestData.senerUsername,
                            new Date(),
                            MessageTestData.alt_messageText
                            );
//Test Data Participants
var newParticipant1 = GroupChatTestData.chatPartnerID;

//Test Data Chatnames
var newChatname1 = GroupChatTestData.alt_chatName;

//Test Data GroupChat
var chatId = GroupChatTestData.chatId;
var ownerId = GroupChatTestData.ownerId;
var chatName = GroupChatTestData.chatName;
var maxParticipants = GroupChatTestData.maxParticipants;
var maxNumMessages = GroupChatTestData.maxNumMessages;

//Not set in the constructor of group chat because on update this lists get also udated.
//Seems like the reference still exists when passing to group chat instance.
var messageList = [ oldMessage ];
var participantList = [ ownerId ];

var groupChat = new GroupChat(chatId, ownerId, chatName, [ ownerId ], [ oldMessage ], maxParticipants, maxNumMessages);

//Results
var chatName_result = groupChat.getChatName();
var ownerId_result = groupChat.getOwnerId();

var messageList_result = groupChat.getMessageList();
var participantList_result = groupChat.getParticipantList();


describe('GroupChat Testing', function() {

    describe('GroupChat getter functions', function() {
        it('Test getChatName()', function() {
            expect(chatName_result).to.be.a('string').and.equal(chatName);
        })

        it('Test getOwnerId()', function() {
            expect(ownerId_result).to.be.a('string').and.equal(ownerId);
        })

    })

    describe('GroupChat setter functions', function() {
        it('Test setChatName()', function() {
            //before
            expect(chatName_result).to.be.a('string').and.equal(chatName);

            groupChat.setChatName(newChatname1);

            //after
            expect(groupChat.getChatName()).to.be.a('string').and.equal(newChatname1);
        })

    })

    describe('GroupChat chat functions', function() {
        it('Test add old Message', function() {
            //Status of message list before addig message
            expect(messageList_result).to.have.members(messageList).and.to.have.lengthOf(1);

            groupChat.addMessage( oldMessage );

            //Status of message list after adding message
            expect(messageList_result).to.have.members(messageList).and.to.have.lengthOf(1);
        })

        it('Test add new message', function() {
            //Status of message list before addig message
            expect(messageList_result).to.have.members(messageList).and.to.have.lengthOf(1);

            groupChat.addMessage( newMessage1 );

            //Status of message list after adding message
            expect(messageList_result).to.have.members( [newMessage1, oldMessage] ).and.to.have.lengthOf(2);
        })

        it('Test split on max messages', function() {
            //Status of message list before addig message
            expect(messageList_result).to.have.members( [newMessage1, oldMessage] ).and.to.have.lengthOf(2);

            groupChat.addMessage( newMessage2 );

            //Status of message list after adding message
            expect(messageList_result).to.have.members( [newMessage2] ).and.to.have.lengthOf(1);
        })

        it('Test remove stranger from chat', function() {
            //Status of participant List before removing stranger
            expect(participantList_result).to.have.members(participantList).and.to.have.lengthOf(1);
            
            groupChat.removeParticipant( newParticipant1 );

            //Status of participant List after removing stranger
            expect(participantList_result).to.have.members(participantList).and.to.have.lengthOf(1);
        })

        it('Test remove owner from chat', function() {
            //Status of participant List before removing creator
            expect(participantList_result).to.have.members(participantList).and.to.have.lengthOf(1);

            groupChat.removeParticipant(ownerId);
            
            //Status of participant List after removing creator
            expect(participantList_result).to.have.members([]).and.to.have.lengthOf(0);
        })

        /*it('Test remove chatpartner from chat', function() {
            //Status of participant List before removing chatpartner
            expect(participantList_result).to.have.members([chatPartnerID]).and.to.have.lengthOf(1);

            oneToOneChat.removeParticipant(chatPartnerID);

            //Status of participant List after removing chatpartner
            expect(participantList_result).to.have.members([]).and.to.have.lengthOf(0);
        })*/
        
    })
})