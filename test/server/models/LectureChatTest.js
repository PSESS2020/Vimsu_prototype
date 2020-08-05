const LectureChat = require('../../../game/app/server/models/LectureChat.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

// example lecture chat
var lectureId = '1234';
var senderid1 = 'aaaa';
var senderid2 = 'bbbb';
var senderUsername1 = 'maxMustermann';
var senderUsername2 = 'elonMusk';
var timestamp1 = '<21:30>';
var timestamp2 = '<22:46>';
var messageText1 = 'Hallo!';
var messageText2 = 'Hi';
var message1 = {senderID: senderid1, username: senderUsername1, timestamp: timestamp1, messageText: messageText1};
var message2 = {senderID: senderid2, username: senderUsername2, timestamp: timestamp2, messageText: messageText2};
var messageList1 = [message1];
var messageList2 = [message1, message2];

var lectureChat = new LectureChat(lectureId);

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

