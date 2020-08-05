const chai = require('chai');
chai.use(require('chai-datetime'));
const assert = chai.assert;
const expect = chai.expect;

const Chat = require('../../../game/app/server/models/Chat.js');
const OneToOneChat = require('../../../game/app/server/models/OneToOneChat.js');
const Message = require('../../../game/app/server/models/Message.js');

const OneToOneChatTestData = require('./TestData/OneToOneChatTestData.js');
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
var newParticipant1 = OneToOneChatTestData.alt_chatPartnerID;

//Test Data OneToOneChat
var chatId = OneToOneChatTestData.chatId;
var creatorID = OneToOneChatTestData.creatorID;
var chatPartnerID = OneToOneChatTestData.chatPartnerID;
var maxNumMessages = OneToOneChatTestData.maxNumMessages;
var creatorUsername = OneToOneChatTestData.creatorUsername;
var chatPartnerUsername = OneToOneChatTestData.chatPartnerUsername;

var messageList = [ oldMessage ];
var participantList = [creatorID, chatPartnerID];

var oneToOneChat = new OneToOneChat(chatId, creatorID, chatPartnerID, [ oldMessage ], maxNumMessages, creatorUsername, chatPartnerUsername);

//Results
var creatorUsername_result = oneToOneChat.getOtherUsername(chatPartnerUsername);
var chatPartnerUsername_result = oneToOneChat.getOtherUsername(creatorUsername);
var creatorID_result = oneToOneChat.getOtherUserId(chatPartnerID);
var chatPartnerID_result = oneToOneChat.getOtherUserId(creatorID);

var messageList_result = oneToOneChat.getMessageList();
var participantList_result = oneToOneChat.getParticipantList();

describe('OneToOneChat Testing', function() {

    describe('OneToOneChat getter functions', function() {
        it('Test get creator username', function() {
            expect(creatorUsername_result).to.be.a('string').and.equal(creatorUsername);
        })

        it('Test get chatpartner username', function() {
            expect(chatPartnerUsername_result).to.be.a('string').and.equal(chatPartnerUsername);
        })

        it('Test get creator id', function() {
            expect(creatorID_result).to.be.a('string').and.equal(creatorID);
        })

        it('Test get chatpartner id', function() {
            expect(chatPartnerID_result).to.be.a('string').and.equal(chatPartnerID);
        })
    })

    describe('OneToOneChat chat functions', function() {
        it('Test add old Message', function() {
            //Status of message list before addig message
            expect(messageList_result).to.have.members(messageList).and.to.have.lengthOf(1);

            oneToOneChat.addMessage( oldMessage );

            //Status of message list after adding message
            expect(messageList_result).to.have.members(messageList).and.to.have.lengthOf(1);
        })

        it('Test add new message', function() {
            //Status of message list before addig message
            expect(messageList_result).to.have.members(messageList).and.to.have.lengthOf(1);

            oneToOneChat.addMessage( newMessage1 );

            //Status of message list after adding message
            expect(messageList_result).to.have.members( [newMessage1, oldMessage] ).and.to.have.lengthOf(2);
        })

        it('Test split on max messages', function() {
            //Status of message list before addig message
            expect(messageList_result).to.have.members( [newMessage1, oldMessage] ).and.to.have.lengthOf(2);

            oneToOneChat.addMessage( newMessage2 );

            //Status of message list after adding message
            expect(messageList_result).to.have.members( [newMessage2] ).and.to.have.lengthOf(1);
        })

        it('Test remove stranger from chat', function() {
            //Status of participant List before removing stranger
            expect(participantList_result).to.have.members(participantList).and.to.have.lengthOf(2);
            
            oneToOneChat.removeParticipant( newParticipant1 );

            //Status of participant List after removing stranger
            expect(participantList_result).to.have.members(participantList).and.to.have.lengthOf(2);
        })

        it('Test remove creator from chat', function() {
            //Status of participant List before removing creator
            expect(participantList_result).to.have.members(participantList);

            oneToOneChat.removeParticipant(creatorID);
            
            //Status of participant List after removing creator
            expect(participantList_result).to.have.members([chatPartnerID]).and.to.have.lengthOf(1);
        })

        it('Test remove chatpartner from chat', function() {
            //Status of participant List before removing chatpartner
            expect(participantList_result).to.have.members([chatPartnerID]).and.to.have.lengthOf(1);

            oneToOneChat.removeParticipant(chatPartnerID);

            //Status of participant List after removing chatpartner
            expect(participantList_result).to.have.members([]).and.to.have.lengthOf(0);
        })
        
    })
})