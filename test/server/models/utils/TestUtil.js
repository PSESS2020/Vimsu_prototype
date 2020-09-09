const Position = require('../../../../src/game/app/server/models/Position.js');
const BusinessCard = require('../../../../src/game/app/server/models/BusinessCard.js');
const FriendList = require('../../../../src/game/app/server/models/FriendList.js');
const Achievement = require('../../../../src/game/app/server/models/Achievement.js');
const Message = require('../../../../src/game/app/server/models/Message.js');
const Task = require('../../../../src/game/app/server/models/Task.js');
const Chat = require('../../../../src/game/app/server/models/Chat.js');
const Room = require('../../../../src/game/app/server/models/Room.js');
const Lecture = require('../../../../src/game/app/server/models/Lecture.js');
const LectureChat = require('../../../../src/game/app/server/models/LectureChat.js');
const GameObject = require('../../../../src/game/app/server/models/GameObject.js');
const NPC = require('../../../../src/game/app/server/models/NPC.js');
const Door = require('../../../../src/game/app/server/models/Door.js');
const Direction = require('../../../../src/game/app/client/shared/Direction.js');
const TypeOfTask = require('../../../../src/game/app/server/utils/TypeOfTask.js');
const TypeOfRoom = require('../../../../src/game/app/client/shared/TypeOfRoom.js');
const TypeOfDoor = require('../../../../src/game/app/client/shared/TypeOfDoor.js');
const TypeOfGameObject = require('../../../../src/game/app/client/shared/GameObjectType.js');
const Participant = require('../../../../src/game/app/server/models/Participant.js');
const Weekdays = require('../../../server/models/TestData/Weekdays.js');

class TestUtil {

    static randomInt() {
        return Math.floor((Math.random() * 1000000) - 500000);
    };

    static randomIntWithMax(max) {
        return Math.floor(Math.random() * max);
    };

    static randomIntWithMin(min) {
        return (Math.floor(Math.random() * 1000000)) + min;
    };

    static randomIntWithMaxAndMin(max, min) {
        return (Math.floor(Math.random() * max) + min);
    };

    static randomString() {
        return Math.floor((Math.random() * 10000000)).toString(36);
    };

    static randomRGB() {
        var value = 0;
        for (var i = 0; i < 5; i++) {
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
        return (Math.floor(Math.random() * 2) === 1 ? true : false);
    };

    static randomTimeStamp() {
        var randomHours = Math.floor(Math.random() * 24);
        var randomMinutes = Math.floor(Math.random() * 60);
        return (this.randomObjectValue(Weekdays) + ", " + (randomHours < 10 ? "0" : "") + randomHours.toString()
            + ":" + (randomMinutes < 10 ? "0" : "") + randomMinutes.toString());
    };

    static randomPosition() {
        return (new Position(this.randomInt(), this.randomInt(), this.randomInt()));
    };

    static randomPositionWithIdAndMax(id, maxX, maxY) {
        return (new Position(id, this.randomIntWithMax(maxX), this.randomIntWithMax(maxY)));
    };

    static randomPositionWithIdAndMin(id, minX, minY) {
        return (new Position(id, this.randomIntWithMin(minX), this.randomIntWithMin(minY)));
    };

    static randomPositionExcludeId(id) {
        return (new Position(this.randomIntWithMin(++id), this.randomInt(), this.randomInt()));
    };

    static randomParticipant() {
        return (new Participant(this.randomString(), this.randomString(), this.randomBusinessCard(),
            this.randomPosition(), this.randomObjectValue(Direction), this.randomFriendList(),
            this.randomFriendList(), this.randomFriendList(), this.randomAchievementList(),
            this.randomTaskList(), this.randomBool(), this.randomIntWithMax(1024), /* causes stack-overflow this.randomChatList()*/[]));
    };
    
    static randomParticipantInRoom(id, width, length) {
        return (new Participant(this.randomString(), this.randomString(), this.randomBusinessCard(),
                    this.randomPositionWithIdAndMax(id, width, length), this.randomObjectValue(Direction), this.randomFriendList(),
                    this.randomFriendList(), this.randomFriendList(), this.randomAchievementList(),
                    this.randomTaskList(), this.randomBool(), this.randomIntWithMax(1024), /* causes stack-overflow this.randomChatList()*/ []));
    };
    

    static randomMessage() {
        return (new Message(this.randomString(), this.randomString(), this.randomString(), this.randomTimeStamp(), this.randomString()));
    };

    static randomBusinessCard() {
        return (new BusinessCard(this.randomString(), this.randomString(), this.randomString(), this.randomString(),
            this.randomString(), this.randomString(), this.randomString(), this.randomString()));
    };

    static randomAchievement() {
        var randomLevel = this.randomIntWithMax(10);
        var randomMaxLevel = this.randomIntWithMaxAndMin(10, randomLevel);
        return (new Achievement(this.randomInt(), this.randomString(), this.randomString(), this.randomString(), 
                   randomLevel, this.randomRGB(), this.randomIntWithMax(1024), randomMaxLevel, this.randomObjectValue(TypeOfTask)));
    };

    static randomTask() {
        return (new Task(this.randomInt(), this.randomObjectValue(TypeOfTask), this.randomIntWithMax(1024)));
    };

    static randomChat() {
        return (new Chat(this.randomString(), this.randomParticipantList(), this.randomMessageList(), 100));
    };

    static randomGameObject() {
        retun (new GameObject(this.randomInt(), this.randomObjectValue(TypeOfGameObject),
                    this.randomString(), this.randomInt(), this.randomInt(), this.randomPosition(),
                    this.randomBool(), this.randomBool()));
    };
    
    static randomGameObjectInRoom(id, width, length) {
        var pos = this.randomPositionWithIdAndMax(id, width, length);
        return (new GameObject(this.randomInt(), this.randomObjectValue(TypeOfGameObject),
                    this.randomString(), this.randomIntWithMax(width - pos.getCordX() - 1),
                    this.randomIntWithMax(length - pos.getCordY() - 1),
                    pos, this.randomBool(), this.randomBool()))
    };
    
    static randomNPC() {
        return (new NPC(this.randomInt(), this.randomString(), this.randomPosition(), this.randomObjectValue(Direction), this.randomStringList()));
    };
    
    static randomNPCInRoom(id, width, length) {
        return (new NPC(this.randomInt(), this.randomString(), this.randomPositionWithIdAndMax(id, width, length), this.randomObjectValue(Direction), this.randomStringList()));
    };
    
    static randomDoor() {
        return (new Door(this.randomInt(), this.randomObjectValue(TypeOfDoor), this.randomString(),
                    this.randomPosition(), this.randomPositionList(), this.randomPosition(), 
                    this.randomObjectValue(Direction)));  
    };
    
    static randomDoorInRoom(id, width, length) {
        return (new Door(this.randomInt(), this.randomObjectValue(TypeOfDoor), this.randomString(),
                    this.randomPositionWithIdAndMax(id, width, length),
                    this.randomPositionListWithIdAndMax(id, width, length),
                    this.randomPositionExcludeId(id), this.randomObjectValue(Direction)));
    };
    
    static randomEmptyRoom() {
        return (new Room(this.randomInt(), this.randomObjectValue(TypeOfRoom), this.randomIntWithMax(256), this.randomIntWithMax(256)));
    };
    
    static randomFilledRoom() {
        var room = this.randomEmptyRoom();
        room.setMapElements(this.randomGameObjectListInRoom(room));
        room.setGameObjects(this.randomGameObjectListInRoom(room));
        room.setNPCs(this.randomNPCListInRoom(room));
        room.setDoors(this.randomDoorListInRoom(room));
        room.buildOccMap();
        return room;
    };
    
    static randomFilledRoomWithPPantsAndMessages() {
        var room = this.randomFilledRoom();
        this.randomParticipantListInRoom(room).forEach( (ppant) => {
            room.enterParticipant(ppant);
        });
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
            var randomPPant = this.drawRandomPPantFrom(room);
            room.addMessage(randomPPant.getId(), randomPPant.getBusinessCard().getUsername(),
                        new Date(), this.randomString());
        }
        return room;
    };
    
    static randomLecture() {
        return(new Lecture(this.randomString(), this.randomString(), this.randomString(),
                    this.randomInt(), this.randomString(), new Date(), this.randomString(),
                    this.randomString(), this.randomIntWithMax(1024)));
    };
    
    static randomLectureFilledWithPPantsAndMessages() {
        var lecture = this.randomLecture();
        var ppants = this.randomParticipantListWithSize(~~(lecture.getMaxParticipants() / 2));
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < ppants.length; i++){
            lecture.enter(ppants[i].getId(), ppants[i].getBusinessCard().getUsername());
        }
        for (var i = 0; i < amount; i++) {
            var randomPPant = ppants[Math.floor(Math.random() * ppants.length)];
            var date = new Date();
            lecture.getLectureChat().appendMessage({senderID: randomPPant.getId(), username: randomPPant.getBusinessCard().getUsername(),
                        messageID: i, timestamp: date});
        }
        return lecture;
    };
    
    static randomFriendList() {
        return (new FriendList(this.randomBusinessCardList()));
    };

    static randomPositionList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
            listToReturn.push(this.randomPosition());
        }
        return listToReturn;
    };

    static randomLectureList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomLecture()); 
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
    
    static randomParticipantListWithSize(size) {
        var listToReturn = [];
        for (var i = 0; i < size; i++) {
           listToReturn.push(this.randomParticipant()); 
        }
        return listToReturn;
    };
    
    static randomParticipantListInRoom(room) {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomParticipantInRoom(room.getRoomId(), room.getWidth(), room.getLength())); 
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
    
    static randomGameObjectList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomGameObject()); 
        }
        return listToReturn;
    };
    
    static randomGameObjectListInRoom(room) {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomGameObjectInRoom(room.getRoomId(), room.getWidth(), room.getLength())); 
        }
        return listToReturn;
    };
    
    static randomNPCList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomNPC()); 
        }
        return listToReturn;
    };
    
    static randomNPCListInRoom(room) {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomNPCInRoom(room.getRoomId(), room.getWidth(), room.getLength())); 
        }
        return listToReturn;
    };
    
    static randomDoorList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomDoor()); 
        }
        return listToReturn;
    };
    
    static randomDoorListInRoom(room) {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomDoorInRoom(room.getRoomId(), room.getWidth(), room.getLength())); 
        }
        return listToReturn;
    };
    
    static randomStringList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomString()); 
        }
        return listToReturn;
    };
    
    static randomPositionListWithIdAndMax(id, maxX, maxY) {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 256) + 1;
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomPositionWithIdAndMax(id, maxX, maxY)); 
        }
        return listToReturn;
    };

    static randomPositionListWithSizeAndIdAndMax(size, id, maxX, maxY) {
        var listToReturn = [];
        for (var i = 0; i < size; i++) {
            listToReturn.push(this.randomPositionWithIdAndMax(id, maxX, maxY));
        }
        return listToReturn;
    };

    static randomPositionListWithSizeAndIdAndMin(size, id, minX, minY) {
        var listToReturn = [];
        for (var i = 0; i < size; i++) {
            listToReturn.push(this.randomPositionWithIdAndMin(id, minX, minY));
        }
        return listToReturn;
    };

    static randomPositionListWithSizeAndExcludeId(size, id) {
        var listToReturn = [];
        for (var i = 0; i < size; i++) {
            listToReturn.push(this.randomPositionExcludeId(id));
        }
        return listToReturn;
    };

    static randomObjectValue(object) {
        return Object.values(object)[Math.floor(Math.random() * Object.values(object).length)];
    };
    
    static drawRandomPPantFrom(room) {
        var randomIndex = this.randomIntWithMax(room.getListOfPPants().length);
        return room.getListOfPPants()[randomIndex];
    };
    
    static drawRandomPPantFromLecture(lecture) {
        var randomIndex = this.randomIntWithMax(lecture.getActiveParticipants().length);
        return lecture.getActiveParticipants()[randomIndex];
    };
    
}

module.exports = TestUtil
