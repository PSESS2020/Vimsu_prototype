const Participant = require('../../../game/app/server/models/Participant.js');
const chai = require('chai');
const Position = require('../../../game/app/server/models/Position.js');
const Direction = require('../../../game/app/utils/Direction.js');
const BusinessCard = require('../../../game/app/server/models/BusinessCard.js');
const FriendList = require('../../../game/app/server/models/FriendList.js');
const TaskService = require('../../../game/app/server/services/TaskService.js');
const Achievement = require('../../../game/app/server/models/Achievement.js');
const TypeOfTask = require('../../../game/app/utils/TypeOfTask.js');
const Chat = require('../../../game/app/server/models/Chat.js');
const Message = require('../../../game/app/server/models/Message.js');
const OneToOneChat = require('../../../game/app/server/models/OneToOneChat.js');
const Task = require('../../../game/app/server/models/Task.js');
const MessageTestData = require('./TestData/MessageTestData.js');
const assert = chai.assert;

//create example participant
var id = '1';
var accountId = '1';
var businessCard = new BusinessCard(id, 'username', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
var position = new Position(1, 2, 3);
var direction = Direction.DOWNLEFT;
var friendList = new FriendList(id, [new BusinessCard('2', 'friend', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email')]);
var receivedRequestList = new FriendList(id, [new BusinessCard('3', 'friendRequester', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email')]);
var sentRequestList = new FriendList(id, [new BusinessCard('4', 'friendReceiver', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email')]);
var isMod = false;
var achievements = [new Achievement(1, 'Test', 'Icon', 'Description', 1, 'color', 1, 3, TypeOfTask.ASKQUESTIONINLECTURE)];
var taskService = new TaskService();
var tasks = taskService.getAllTasks();
var awardPoints = 10;
var chat = new Chat('1', [id, '2'], [new Message(MessageTestData.messageId, id, MessageTestData.senderUsername, new Date(), MessageTestData.messageText)], 10);
var chatList = [chat];
var ppant = new Participant(id, accountId, businessCard, position, direction, friendList, receivedRequestList, sentRequestList, achievements, tasks, isMod, awardPoints, chatList);

describe('ParticipantTest getter functions', function() {
    it('test getId', function() {
        assert.equal(ppant.getId(), id);
    });

    it('test getPosition', function() {
        assert.equal(ppant.getPosition(), position);
    });

    it('test getDirection', function() {
        assert.equal(ppant.getDirection(), direction);
    });

    it('test getAccountId', function() {
        assert.equal(ppant.getAccountId(), accountId);
    });

    it('test getBusinessCard', function() {
        assert.equal(ppant.getBusinessCard(), businessCard);
    });

    it('test getFriendList', function() {
        assert.equal(ppant.getFriendList(), friendList);
    });

    it('test getReceivedRequestList', function() {
        assert.equal(ppant.getReceivedRequestList(), receivedRequestList);
    });

    it('test getSentRequestList', function() {
        assert.equal(ppant.getSentRequestList(), sentRequestList);
    });

    it('test getAchievements', function() {
        assert.equal(ppant.getAchievements(), achievements);
    });

    it('test isModerator', function() {
        assert.equal(ppant.isModerator(), isMod);
    });

    it('test getChatList', function() {
        assert.equal(ppant.getChatList(), chatList);
    });

    it('test getTaskTypeMappingCounts', function() {
        let taskTypeMapping = ppant.getTaskTypeMappingCounts();
        tasks.forEach(task => {
            assert.equal(taskTypeMapping[task.getTaskType()], 0);
        });
    });

    it('test getAwardPoints', function() {
        assert.equal(ppant.getAwardPoints(), awardPoints);
    });

    it('test getChat existing chat', function() {
        assert.equal(ppant.getChat('1'), chat);
    });

    it('test getChat non existing chat', function() {
        assert.equal(ppant.getChat('2'), undefined);
    });
});

describe('ParticipantTest chatFunctions', function() {
    it('test adding a old chat', function() {
        //status of chat list before adding chat
        assert.equal(ppant.getChatList().length, 1);
        assert.equal(ppant.getChat('1'), chat);
        ppant.addChat(chat);
        //status of chat list after adding chat
        assert.equal(ppant.getChat('1'), chat);
        assert.equal(ppant.getChatList().length, 1);
    });

    it('test adding a new chat', function() {
        //status of chat list before adding chat
        assert.equal(ppant.getChat('2'), undefined);
        assert.equal(ppant.getChatList().length, 1);
        let chat2 = new Chat('2', [id, '3'], [new Message('7', id, 'username', new Date(), 'hello')], 10);
        ppant.addChat(chat2);
        //status of chat list after adding chat
        assert.equal(ppant.getChat('2'), chat2);
        assert.equal(ppant.getChatList().length, 2);
    });

    it('test isMemberOfChat', function() {
        assert.equal(ppant.isMemberOfChat('1'), true);
        assert.equal(ppant.isMemberOfChat('2'), true);
        assert.equal(ppant.isMemberOfChat('3'), false);
    });

    it('test hasChatWith', function() {
        let oneToOneChat = new OneToOneChat('4', id, '42', [], 10, 'username', 'chatPartner');
        ppant.addChat(oneToOneChat);
        assert.equal(ppant.hasChatWith('42'), true);
        assert.equal(ppant.hasChatWith('21'), false);
    });

    it('test removeChat', function() {
        assert.equal(ppant.getChat('1'), chat);
        ppant.removeChat('1');
        assert.equal(ppant.getChat('1'), undefined);
    });
});

describe('ParticipantTest setter', function() {
    it('test setPosition', function() {
        assert.equal(ppant.getPosition(), position);
        let newPosition = new Position(42, 42, 42);
        ppant.setPosition(newPosition);
        assert.equal(ppant.getPosition(), newPosition);
    });

    it('test setDirection', function() {
        assert.equal(ppant.getDirection(), direction);
        let newDirection = Direction.DOWNRIGHT;
        ppant.setDirection(newDirection);
        assert.equal(ppant.getDirection(), newDirection);
    });

    it('test setAchievements', function() {
        let exampleAch = [new Achievement(55, 'achievement', 'icon', 'description', 'currentLevel', 'color', 4444, 3, TypeOfTask.FOODCOURTVISIT)];
        assert.equal(ppant.getAchievements(), achievements);

        ppant.setAchievements(exampleAch);
        assert.equal(ppant.getAchievements(), exampleAch);
    });

});

describe('ParticipantTest friendListHandling', function() {
    it('test add old SentFriendRequest', function() {
        assert.equal(ppant.getSentRequestList(), sentRequestList);
        assert.equal(ppant.getSentRequestList().getAllBusinessCards().length, 1);
        let busCard = new BusinessCard('4', 'friendReceiver', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
        ppant.addSentFriendRequest(busCard);
        assert.equal(ppant.getSentRequestList(), sentRequestList);
        assert.equal(ppant.getSentRequestList().getAllBusinessCards().length, 1);
        assert.equal(ppant.getSentRequestList().includes('4'), true);
    });

    it('test add new SentFriendRequest', function() {
        assert.equal(ppant.getSentRequestList().includes('42'), false);
        assert.equal(ppant.getSentRequestList().getAllBusinessCards().length, 1);
        let busCard = new BusinessCard('42', 'testUser', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
        ppant.addSentFriendRequest(busCard);
        assert.equal(ppant.getSentRequestList().includes('42'), true);
        assert.equal(ppant.getSentRequestList().getAllBusinessCards().length, 2);
    });

    it('test accept sentFriendRequest that is in list', function() {
        assert.equal(ppant.hasSentFriendRequest('4'), true);
        assert.equal(ppant.getFriendList().includes('4'), false);
        ppant.sentFriendRequestAccepted('4');
        assert.equal(ppant.hasSentFriendRequest('4'), false);
        assert.equal(ppant.getFriendList().includes('4'), true);
    });

    it('test accept sentFriendRequest that is not in list', function() {
        assert.equal(ppant.hasSentFriendRequest('4555'), false);
        assert.equal(ppant.getFriendList().includes('4555'), false);
        ppant.sentFriendRequestAccepted('4555');
        assert.equal(ppant.hasSentFriendRequest('4555'), false);
        assert.equal(ppant.getFriendList().includes('4555'), false);
    });

    it('test decline sentFriendRequest that is in list', function() {
        assert.equal(ppant.hasSentFriendRequest('42'), true);
        assert.equal(ppant.getFriendList().includes('42'), false);
        ppant.sentFriendRequestDeclined('42');
        assert.equal(ppant.hasSentFriendRequest('42'), false);
        assert.equal(ppant.getFriendList().includes('42'), false);
    });

    it('test decline sentFriendRequest that is not in list', function() {
        assert.equal(ppant.hasSentFriendRequest('4255'), false);
        assert.equal(ppant.getFriendList().includes('4255'), false);
        ppant.sentFriendRequestDeclined('4255');
        assert.equal(ppant.hasSentFriendRequest('4255'), false);
        assert.equal(ppant.getFriendList().includes('4255'), false);
    });

    it('test add new friendRequest', function() {
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);
        assert.equal(ppant.getReceivedRequestList().getAllBusinessCards().length, 1);
        let busCard = new BusinessCard('44', 'testUser', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
        ppant.addFriendRequest(busCard);
        assert.equal(ppant.getReceivedRequestList().includes('44'), true);
        assert.equal(ppant.getReceivedRequestList().getAllBusinessCards().length, 2);
    });

    it('test add old friendRequest', function() {
        assert.equal(ppant.getReceivedRequestList().includes('44'), true);
        assert.equal(ppant.getReceivedRequestList().getAllBusinessCards().length, 2);
        let busCard = new BusinessCard('44', 'testUser', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
        ppant.addFriendRequest(busCard);
        assert.equal(ppant.getReceivedRequestList().includes('44'), true);
        assert.equal(ppant.getReceivedRequestList().getAllBusinessCards().length, 2);
    });

    it('test accept friendRequest that is in list', function() {
        assert.equal(ppant.getReceivedRequestList().includes('3'), true);
        assert.equal(ppant.getFriendList().includes('3'), false);
        ppant.acceptFriendRequest('3');
        assert.equal(ppant.getReceivedRequestList().includes('3'), false);
        assert.equal(ppant.getFriendList().includes('3'), true);
    });

    it('test accept friendRequest that is not in list', function() {
        assert.equal(ppant.getReceivedRequestList().includes('355'), false);
        assert.equal(ppant.getFriendList().includes('355'), false);
        ppant.acceptFriendRequest('355');
        assert.equal(ppant.getReceivedRequestList().includes('355'), false);
        assert.equal(ppant.getFriendList().includes('355'), false);
    });

    it('test decline friendRequest that is in list', function() {
        assert.equal(ppant.getReceivedRequestList().includes('44'), true);
        assert.equal(ppant.getFriendList().includes('44'), false);
        ppant.declineFriendRequest('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);
        assert.equal(ppant.getFriendList().includes('44'), false);
    });

    it('test decline friendRequest that is not in list', function() {
        assert.equal(ppant.getReceivedRequestList().includes('4455'), false);
        assert.equal(ppant.getFriendList().includes('4455'), false);
        ppant.declineFriendRequest('4455');
        assert.equal(ppant.getReceivedRequestList().includes('4455'), false);
        assert.equal(ppant.getFriendList().includes('4455'), false);
    });

    it('test remove friend that is in list', function() {
        assert.equal(ppant.hasFriend('2'), true);
        ppant.removeFriend('2');
        assert.equal(ppant.hasFriend('2'), false);
    });

    it('test remove friend that is not in list', function() {
        assert.equal(ppant.hasFriend('2'), false);
        ppant.removeFriend('2');
        assert.equal(ppant.hasFriend('2'), false);
    });

    it('test hasFriend undefined', function() {
        assert.equal(ppant.hasFriend(undefined), undefined);
    });

    it('test hasSentFriendRequest undefined', function() {
        assert.equal(ppant.hasSentFriendRequest(undefined), undefined);
    });    
});

describe('ParticipantTest achievementHandling', function() {
    it('test addTask', function() {
        let taskTypeMappingBefore = ppant.getTaskTypeMappingCounts();
        let task = new Task(1, TypeOfTask.ASKQUESTIONINLECTURE, 2);
        let points = ppant.getAwardPoints();

        assert.equal(taskTypeMappingBefore[task.getTaskType()], 0);

        ppant.addTask(task);
        let taskTypeMappingAfter = ppant.getTaskTypeMappingCounts();
        assert.equal(ppant.getAwardPoints(), points + 2);
        assert.equal(taskTypeMappingAfter[task.getTaskType()], 1);
    });

    it('test addPoints', function() {
        let points = ppant.getAwardPoints();
        ppant.addAwardPoints(42);
        assert.equal(ppant.getAwardPoints(), points + 42);
    });

    it('test addAchievement', function() {
        let ach = new Achievement(333, 't', 'i', 'd', 'cl', 'c', 3, 3, TypeOfTask.ASKQUESTIONINLECTURE);
        let lengthBefore = ppant.getAchievements().length;
        ppant.addAchievement(ach);
        assert.equal(ppant.getAchievements().length, lengthBefore + 1);
    });

    it('test removeAchievement', function() {
        let lengthBefore = ppant.getAchievements().length;
        ppant.removeAchievement(333);
        assert.equal(ppant.getAchievements().length, lengthBefore - 1);
    });

    it('test remove achievement that is not in list', function() {
        let lengthBefore = ppant.getAchievements().length;
        assert.throws(() => ppant.removeAchievement(333), Error, '333 not found in list of achievements');
    });
});