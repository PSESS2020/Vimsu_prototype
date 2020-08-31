const LectureChat = require('../../../src/game/app/server/models/LectureChat.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

// example lecture chat
var lectureId = '1234';
var senderid1 = 'aaaa';
var senderid2 = 'bbbb';
var senderUsername1 = 'maxMustermann';
var senderUsername2 = 'elonMusk';
var timestamp1 = new Date();
var timestamp2 = new Date();
var messageText1 = 'Hallo!';
var messageText2 = 'Hi';
var messageID1 = 1;
var messageID2 = 2;
var message1 = {senderID: senderid1, username: senderUsername1, timestamp: timestamp1, messageText: messageText1, messageID: messageID1};
var message2 = {senderID: senderid2, username: senderUsername2, timestamp: timestamp2, messageText: messageText2, messageID: messageID2};
var messageList1 = [message1];
var messageList2 = [message1, message2];

var lectureChat = new LectureChat();

describe('LectureChat getter functions', function() {
    it('test getMessages', function() {
        lectureChat.appendMessage(message1);
        expect(lectureChat.getMessages()).to.eql(messageList1);
    })
})

describe('LectureChat message handling', function() {
    it('test appendMessage', function() {
        lectureChat.appendMessage(message2);
        expect(lectureChat.getMessages()).to.eql(messageList2)
    })
})

