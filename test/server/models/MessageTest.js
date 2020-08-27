const assert = require('chai').assert;
const Message = require('../../../src/game/app/server/models/Message.js');
const MessageTestData = require('./TestData/MessageTestData.js');


//Test Data
messageId = MessageTestData.messageId;
senderId = MessageTestData.senderId;
senderUsername  = MessageTestData.senderUsername;
timestamp = new Date();
messageText = MessageTestData.messageText;

message = new Message(messageId, senderId, senderUsername, timestamp, messageText);

//Results 
messageId_result = message.getMessageId();
senderId_result = message.getSenderId();
senderUsername_result = message.getUsername();
timestamp_result = message.getTimestamp();
messageText_result = message.getMessageText();

describe('Message Testing', function() {
    it('Test instance', function() {
        assert.instanceOf(message, Message);
    })
    describe('Message getter functions', function() {
        it('Test getMessageId()', function() {
            assert.equal(messageId_result, messageId);
            assert.typeOf(messageId_result, 'string');
            //assert.typeOf(messageId_result,'string');
        })
        it('Test getSenderId()', function() {
            assert.equal(senderId_result, senderId);
            assert.typeOf(senderId_result, 'string');
        })
        it('Test getUsername()', function() {
            assert.equal(senderUsername_result, senderUsername);
            assert.typeOf(senderUsername_result, 'string');
        })
        it('Test getTimestamp()', function() {
            assert.equal(timestamp_result, timestamp);
            assert.typeOf(timestamp_result, 'date');
            assert.equalDate(timestamp, timestamp_result);
        })
        it('Test getMessageText()', function() {
            assert.equal(messageText_result, messageText);
            assert.typeOf(messageText_result, 'string');
        })
    })

})