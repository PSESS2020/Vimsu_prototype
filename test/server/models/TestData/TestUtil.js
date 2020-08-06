const Position = require('../../../../game/app/server/models/Position.js');
const BusinessCard = require('../../../../game/app/server/models/BusinessCard.js');
const FriendList = require('../../../../game/app/server/models/FriendList.js');
const Achievement = require('../../../../game/app/server/models/Achievement.js');
const Message = require('../../../../game/app/server/models/Message.js');
const Task = require('../../../../game/app/server/models/Task.js');
const Chat = require('../../../../game/app/server/models/Chat.js');
const Direction = require('../../../../game/app/utils/Direction.js');
const TypeOfTask = require('../../../../game/app/utils/TypeOfTask.js');
const Participant = require('../../../../game/app/server/models/Participant.js');
const Weekdays = require('./Weekdays.js');

class TestUtil {
    
    static randomInt() {
        return Math.floor((Math.random() * 1000000) - 500000);
    };
    
    static randomString() {
        return Math.floor((Math.random() * 10000000)).toString(36);
    };
    
    static randomRGB() {
        var value = 0;
        for(var i = 0; i < 5; i++) {
            value += Math.floor(Math.random() * 16) * Math.pow(16, i);
        };
        return "#" + value.toString(16);
    };
    
    static randomAwardPoints() {
        return Math.floor(Math.random() * 1024);
    };
    
    static randomLevel() {
        return Math.floor(Math.random() * 16);
    };
    
    static randomBool() {
        return (Math.floor(Math.random() * 2)===1?true:false);
    };
    
    static randomTimeStamp() {
        var randomHours = Math.floor(Math.random() * 24);
        var randomMinutes = Math.floor(Math.random() * 60);
        return (this.randomObjectValue(Weekdays) + ", " + (randomHours<10?"0":"") + randomHours.toString()
                  + ":" + (randomMinutes<10?"0":"") + randomMinutes.toString());
    };

    static randomPosition() {
        return (new Position(this.randomInt(), this.randomInt(), this.randomInt()));
    };
    
    static randomParticipant() {
        return (new Participant(this.randomString(), this.randomString(), this.randomBusinessCard(),
                    this.randomPosition(), this.randomObjectValue(Direction), this.randomFriendList(),
                    this.randomFriendList(), this.randomFriendList(), this.randomAchievementList(),
                    this.randomTaskList(), this.randomBool(), this.randomAwardPoints(), /* causes stack-overflow this.randomChatList()*/ []));
    };
    
    static randomMessage() {
        return (new Message(this.randomString(), this.randomString(), this.randomString(), this.randomTimeStamp(), this.randomString()));
    };
    
    static randomBusinessCard() {
        return (new BusinessCard(this.randomString(), this.randomString(), this.randomString(), this.randomString(), 
                    this.randomString(), this.randomString(), this.randomString(), this.randomString()));
    };
    
    static randomAchievement() {
        var randomLevel = this.randomLevel();
        var randomMaxLevel = randomLevel + this.randomLevel();
        return (new Achievement(this.randomString(), this.randomString(), this.randomString(), this.randomString(), 
                   randomLevel, this.randomRGB(), this.randomAwardPoints(), randomMaxLevel, this.randomObjectValue(TypeOfTask)));
    };
    
    static randomTask() {
        return (new Task(this.randomInt(), this.randomObjectValue(TypeOfTask), this.randomAwardPoints()));
    };
    
    static randomChat() {
        return (new Chat(this.randomString(), this.randomParticipantList(), this.randomMessageList(), 100));
    };
    
    static randomFriendList() {
        return (new FriendList(this.randomString(), this.randomBusinessCardList()));
    };
    
    static randomPositionList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomPosition()); 
        }
        return listToReturn;
    };
    
    static randomParticipantList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomParticipant()); 
        }
        return listToReturn;
    };
    
    static randomBusinessCardList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomBusinessCard()); 
        }
        return listToReturn;
    };
    
    static randomAchievementList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomAchievement()); 
        }
        return listToReturn;
    };
    
    static randomTaskList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomTask()); 
        }
        return listToReturn;
    };
    
    static randomMessageList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomMessage()); 
        }
        return listToReturn;
    };
    
    static randomChatList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomChat()); 
        }
        return listToReturn;
    };

    static randomObjectValue(object) {
        return Object.values(object)[Math.floor(Math.random() * Object.values(object).length)];
    };
    
}

module.exports = TestUtil
