const chai = require('chai');
chai.use(require('chai-datetime'));
const assert = chai.assert;
const expect = chai.expect;

const Message = require('../../../src/game/app/server/models/Message.js');
const Chat = require('../../../src/game/app/server/models/Chat.js');

const ChatTestData = require('./TestData/ChatTestData.js');
const MessageTestData = require('./TestData/MessageTestData.js');


//Test Data Messages
var oldMessageId = MessageTestData.messageId;
var oldMessage = new Message(MessageTestData.messageId,
    MessageTestData.senderId,
    MessageTestData.senderUsername,
    new Date(),
    MessageTestData.messageText
);
var newMessageId1 = MessageTestData.alt_messageId;
var newMessage1 = new Message(MessageTestData.alt_messageId,
    MessageTestData.alt_senderId,
    MessageTestData.alt_senderUsername,
    new Date(),
    MessageTestData.alt_messageText
);
var newMessageId2 = MessageTestData.alt_alt_messageId;
var newMessage2 = new Message(MessageTestData.alt_alt_messageId,
    MessageTestData.senderId,
    MessageTestData.senderUsername,
    new Date(),
    MessageTestData.alt_messageText
);

//Test Data Participants
var newParticipant1 = ChatTestData.chatPartnerID;
var newParticipant2 = ChatTestData.alt_chatPartnerID;

//Test Data Chat
var chatId = ChatTestData.chatId;
var ownerId = ChatTestData.ownerId;
var maxNumMessages = ChatTestData.maxNumMessages;
var newMaxNumMessages1 = ChatTestData.alt_maxNumMessages;

//Not set in the constructor of chat because on update this lists get also udated.
//Seems like the reference still exists when passing to chat instance.
var messageList = [oldMessage, newMessage1];
var participantList = [ownerId];

var chat = new Chat(chatId, [ownerId], [oldMessage, newMessage1], maxNumMessages);

//Results
var chatId_result = chat.getId();
var numParticipants_result = chat.getNumParticipants();
var maxNumMessages_result = chat.getMaxNumMessages();

var messageList_result = chat.getMessageList();
var participantList_result = chat.getParticipantList();

describe('Chat Testing', function () {

    describe('Chat getter functions', function () {
        it('Test getId()', function () {
            expect(chatId_result).to.be.a('string').and.equal(chatId);
        })

        it('Test getNumParticipants()', function () {
            expect(numParticipants_result).to.be.a('number').and.equal(participantList.length);
            expect(numParticipants_result % 1).to.equal(0);
        })

        it('Test getMessageList()', function () {
            expect(messageList_result).to.be.an('array').and.to.have.members(messageList);
        })

        it('Test getParticipantList', function () {
            expect(participantList_result).to.be.an('array').and.to.have.members(participantList);
        })

        it('Test getMaxNumMessages()', function () {
            expect(maxNumMessages_result).to.be.a('number').and.equal(maxNumMessages);
            expect(maxNumMessages_result % 1).to.equal(0);
        })

    })

    describe('Chat setter functions', function () {
        it('Test setMaxNumMessages()', function () {
            //before
            expect(maxNumMessages_result).to.be.a('number').and.equal(maxNumMessages);
            expect(maxNumMessages_result % 1).to.equal(0);

            chat.setMaxNumMessages(newMaxNumMessages1);

            //after
            expect(chat.getMaxNumMessages()).to.be.a('number').and.equal(newMaxNumMessages1);
            expect(chat.getMaxNumMessages() % 1).to.equal(0);
        })

    })

    describe('Chat functions', function () {
        describe('Chat messageList functions', function () {

            it('Test abstract addMessage', () => {
                expect(() => chat.addMessage()).to.throw(Error, 'addMessage() has to be implemented!');
            });

            it('Test remove old Message', function () {
                //Status of message list before removing message
                expect(messageList_result).to.be.an('array').and.to.have.members(messageList).and.to.have.lengthOf(2);

                chat.removeMessage(oldMessageId);

                //Status of message list after removing message
                expect(messageList_result).to.be.an('array').and.to.have.members([newMessage1]).and.to.have.lengthOf(1);
            })

            it('Test remove unknown message', function () {
                //Status of message list before removing message
                expect(messageList_result).to.be.an('array').and.to.have.members([newMessage1]).and.to.have.lengthOf(1);

                chat.removeMessage(newMessageId2);

                //Status of message list after removing message
                expect(messageList_result).to.be.an('array').and.to.have.members([newMessage1]).and.to.have.lengthOf(1);
            })

        })

        describe('Chat participantList functions', function () {
            it('Test remove unknown participant from chat', function () {
                //Status of participant List before removing stranger
                expect(participantList_result).to.be.an('array').and.to.have.members(participantList).and.to.have.lengthOf(1);

                chat.removeParticipant(newParticipant1);

                //Status of participant List after removing stranger
                expect(participantList_result).to.be.an('array').and.to.have.members(participantList).and.to.have.lengthOf(1);
            })

            it('Test remove owner from chat', function () {
                //Status of participant List before removing creator
                expect(participantList_result).to.be.an('array').and.to.have.members(participantList).and.to.have.lengthOf(1);
                expect(chat.includesChatMember(ownerId)).to.be.true;

                chat.removeParticipant(ownerId);

                //Status of participant List after removing creator
                expect(participantList_result).to.be.an('array').and.to.have.members([]).and.to.have.lengthOf(0);
                expect(chat.includesChatMember(ownerId)).to.be.false;
            })
        })

    })
})