const MessageTestData = require('./MessageTestData.js');
const Message = require('../../../../game/app/server/models/Message.js');

module.exports = Object.freeze
({
    chatId: "1",
    creatorID: "1",
    chatPartnerID: "2",
    maxNumMessages: 2,
    creatorUsername: "Hans",
    chatPartnerUsername: "Peter",
    alt_chatId: "144",
    alt_creatorID: "322",
    alt_chatPartnerID: "99",
    alt_maxNumMessages: 3,
    alt_creatorUsername: "JÜrgen",
    alt_chatPartnerUsername: "Klemens",

    oldMessage: new Message(MessageTestData.messageId,
                            MessageTestData.senderId,
                            MessageTestData.senerUsername,
                            new Date(),
                            MessageTestData.messageTest
                            ),

    newMessage1: new Message(MessageTestData.alt_messageId,
                             MessageTestData.alt_senderId,
                             MessageTestData.alt_senderUsername,
                             new Date(),
                             MessageTestData.alt_messageText
                             ),

    newMessage2: new Message(MessageTestData.messageId,
                             MessageTestData.senderId,
                             MessageTestData.senerUsername,
                             new Date(),
                             MessageTestData.alt_messageText
                             ),
})