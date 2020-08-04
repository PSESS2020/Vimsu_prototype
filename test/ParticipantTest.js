const Participant = require('../game/app/server/models/Participant.js');
const chai = require('chai');
const Position = require('../game/app/server/models/Position.js');
const Direction = require('../game/app/utils/Direction.js');
const BusinessCard = require('../game/app/server/models/BusinessCard.js');
const FriendList = require('../game/app/server/models/FriendList.js');
const TaskService = require('../game/app/server/services/TaskService.js');
const Achievement = require('../game/app/server/models/Achievement.js');
const TypeOfTask = require('../game/app/utils/TypeOfTask.js');
const Chat = require('../game/app/server/models/Chat.js');
const Message = require('../game/app/server/models/Message.js');
const OneToOneChat = require('../game/app/server/models/OneToOneChat.js');
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
var chat = new Chat('1', [id, '2'], [new Message('5', id, 'username', new Date(), 'hello')], 10);
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
});

describe('ParticipantTest friendListHandling', function() {
    //TODO
});

describe('ParticipantTest achievementHandling', function() {
    //TODO
});