const Participant = require('../../../src/game/app/server/models/mapobjects/Participant.js');
const chai = require('chai');
const Direction = require('../../../src/game/app/client/shared/Direction.js');
const BusinessCard = require('../../../src/game/app/server/models/BusinessCard.js');
const FriendList = require('../../../src/game/app/server/models/FriendList.js');
const TaskService = require('../../../src/game/app/server/services/TaskService.js');
const Achievement = require('../../../src/game/app/server/models/Achievement.js');
const TypeOfTask = require('../../../src/game/app/server/utils/TypeOfTask.js');
const Chat = require('../../../src/game/app/server/models/Chat.js');
const Meeting = require('../../../src/game/app/server/models/Meeting.js');
const OneToOneChat = require('../../../src/game/app/server/models/OneToOneChat.js');
const Task = require('../../../src/game/app/server/models/Task.js');
const assert = chai.assert;
const expect = chai.expect;
const TestUtil = require('./utils/TestUtil.js');
const ShirtColor = require('../../../src/game/app/client/shared/ShirtColor.js');
const Settings = require('../../../src/game/app/server/utils/' + process.env.SETTINGS_FILENAME);

var id;
var accountId;
var businessCard;
var position;
var direction;
var friendList;
var receivedRequestList;
var sentRequestList;
var achievements;
var taskMapping = {};
var isMod;
var awardPoints;
var chatList;
var ppant;

describe('Participant test', function () {

    //test data
    beforeEach(function () {
        id = TestUtil.randomString();
        accountId = TestUtil.randomString();
        businessCard = new BusinessCard(id, 'username', 'forename', 'title', 'surname', 'job', 'company', 'email');
        position = TestUtil.randomPosition();
        direction = TestUtil.randomObjectValue(Direction);
        friendList = new FriendList([new BusinessCard(id + 'friend', 'friend', 'forename', 'title', 'surname', 'job', 'company', 'friendEmail')]);
        receivedRequestList = new FriendList([new BusinessCard(id + 'friendRequester', 'friendRequester', 'forename', 'title', 'surname', 'job', 'company', 'friendRequesterEmail')]);
        sentRequestList = new FriendList([new BusinessCard(id + 'friendTarget', 'friendTarget', 'forename', 'title', 'surname', 'job', 'company', 'friendTargetEmail')]);
        achievements = [];
        new TaskService().getAllTasks().forEach(x => {
            taskMapping[x.getTaskType()] = 0;
        });
        isMod = TestUtil.randomBool();
        awardPoints = TestUtil.randomInt();
        chatList = [new Chat(TestUtil.randomString(), [], [], TestUtil.randomIntWithMin(1))];
        meetingList = [new Meeting(TestUtil.randomString(), TestUtil.randomString(), [], TestUtil.randomString())]
        ppant = new Participant(id, accountId, businessCard, position, direction, friendList, receivedRequestList,
            sentRequestList, achievements, taskMapping, isMod, awardPoints, chatList, meetingList);
    });

    it('test getters', function () {
        assert.equal(ppant.getId(), id);
        assert.equal(ppant.getPosition(), position);
        assert.equal(ppant.getDirection(), direction);
        assert.equal(ppant.getAccountId(), accountId);
        assert.equal(ppant.getBusinessCard(), businessCard);
        assert.equal(ppant.getFriendList(), friendList);
        assert.equal(ppant.getReceivedRequestList(), receivedRequestList);
        assert.equal(ppant.getSentRequestList(), sentRequestList);
        assert.equal(ppant.getAchievements(), achievements);
        assert.equal(ppant.getIsModerator(), isMod);
        assert.equal(ppant.getChatList(), chatList);
        assert.equal(ppant.getAwardPoints(), awardPoints);
        assert.equal(ppant.getIsVisible(), true);
        assert.equal(ppant.getTaskTypeMappingCounts(), taskMapping);
        assert.equal(ppant.getShirtColor(), Settings.DEFAULT_SHIRTCOLOR_PPANT);
    });

    it('test adding, removing and updating a chat', function () {

        let newChat = new Chat('chatId', [], [], TestUtil.randomIntWithMin(1));
        let oldChatListLength = ppant.getChatList().length;

        //chat is not part of chatList at this point
        assert.equal(ppant.getChat(newChat.getId()), undefined);
        assert.equal(ppant.isMemberOfChat(newChat.getId()), false);

        //add chat to chat list
        ppant.addChat(newChat);

        //chat is now part of chatList 
        assert.equal(ppant.getChat(newChat.getId()), newChat);
        expect(ppant.getChatList()).to.be.an('array').and.to.have.lengthOf(oldChatListLength + 1);
        assert.equal(ppant.isMemberOfChat(newChat.getId()), true);

        //add chat again shouldn't increase chatList length
        ppant.addChat(newChat);
        expect(ppant.getChatList()).to.be.an('array').and.to.have.lengthOf(oldChatListLength + 1);
        assert.equal(ppant.isMemberOfChat(newChat.getId()), true);

        //update chat
        let updatedChat = new Chat('chatId', ['1'], [], TestUtil.randomIntWithMin(1));
        ppant.updateChat(updatedChat);
        expect(ppant.getChat('chatId')).not.to.equal(newChat);
        expect(ppant.getChat('chatId')).to.equal(updatedChat);

        //remove chat now
        ppant.removeChat(newChat.getId());

        assert.equal(ppant.getChat(newChat.getId()), undefined);
        expect(ppant.getChatList()).to.be.an('array').and.to.have.lengthOf(oldChatListLength);
        assert.equal(ppant.isMemberOfChat(newChat.getId()), false);
    });

    it('test adding a 1:1 chat and hasChatWith', function () {
        assert.equal(ppant.hasChatWith('chatPartnerID'), false);

        //create 1:1 chat and add it to list
        let newOneToOneChat = new OneToOneChat('chatID', id, 'chatPartnerID', [], TestUtil.randomIntWithMin(1), businessCard.getUsername(), 'chatPartnerUsername');
        ppant.addChat(newOneToOneChat);

        assert.equal(ppant.hasChatWith('chatPartnerID'), true);
    });

    it('test set position', function () {
        let newPosition = TestUtil.randomPosition();
        ppant.setPosition(newPosition);
        assert.equal(ppant.getPosition(), newPosition);
    });

    it('test setDirection', function () {
        let newDirection = TestUtil.randomObjectValue(Direction);
        while (newDirection === direction) {
            newDirection = TestUtil.randomObjectValue(Direction);
        }

        ppant.setDirection(newDirection);
        assert.equal(ppant.getDirection(), newDirection);
    });

    it('test setIsVisible', function () {
        let newVisibility = !ppant.getIsVisible();
        ppant.setIsVisible(newVisibility);
        assert.equal(ppant.getIsVisible(), newVisibility);
    })

    it('test setIsModerator', function () {
        let newIsMod = !ppant.getIsModerator();
        ppant.setIsModerator(newIsMod);
        assert.equal(ppant.getIsModerator(), newIsMod);
    })

    it('test setShirtColor', function () {
        let newShirtColor = ShirtColor.RED;
        ppant.setShirtColor(newShirtColor);
        assert.equal(ppant.getShirtColor(), newShirtColor);
    })

    it('test set achievements', function () {
        let exampleAch = [new Achievement(55, 'achievement', 'icon', 'description', 1, 'color', 4444, 3, TypeOfTask.FOODCOURTVISIT, 1)];
        assert.equal(ppant.getAchievements(), achievements);

        ppant.setAchievements(exampleAch);
        assert.equal(ppant.getAchievements(), exampleAch);
    });

    it('test add SentFriendRequest and accept it', function () {
        let oldLength = ppant.getSentRequestList().getAllBusinessCards().length;

        //add new friendRequest
        let busCard = new BusinessCard('4', 'friendReceiver', 'Max', 'Dr', 'Mustermann', 'job', 'company', 'email');
        ppant.addSentFriendRequest(busCard);

        assert.equal(ppant.getSentRequestList().getAllBusinessCards().length, oldLength + 1);
        assert.equal(ppant.getSentRequestList().includes('4'), true);

        //add friendRequest again, no change in behaviour
        ppant.addSentFriendRequest(busCard);
        assert.equal(ppant.getSentRequestList().getAllBusinessCards().length, oldLength + 1);
        assert.equal(ppant.getSentRequestList().includes('4'), true);

        //accept friendRequest
        ppant.sentFriendRequestAccepted('4');
        assert.equal(ppant.hasSentFriendRequest('4'), false);
        assert.equal(ppant.getFriendList().includes('4'), true);

        //accept it again, no change in behaviour
        ppant.sentFriendRequestAccepted('4');
        assert.equal(ppant.hasSentFriendRequest('4'), false);
        assert.equal(ppant.getFriendList().includes('4'), true);

    });

    it('test add SentFriendRequest and decline it', function () {
        let oldLength = ppant.getSentRequestList().getAllBusinessCards().length;

        //add new friendRequest
        let busCard = new BusinessCard('4', 'friendReceiver', 'Max', 'Dr', 'Mustermann', 'job', 'company', 'email');
        ppant.addSentFriendRequest(busCard);

        assert.equal(ppant.getSentRequestList().getAllBusinessCards().length, oldLength + 1);
        assert.equal(ppant.getSentRequestList().includes('4'), true);
        assert.equal(ppant.hasSentFriendRequest('4'), true);

        //decline friendRequest
        ppant.sentFriendRequestDeclined('4');
        assert.equal(ppant.hasSentFriendRequest('4'), false);
        assert.equal(ppant.getFriendList().includes('4'), false);

        //decline it again, no change in behaviour
        ppant.sentFriendRequestDeclined('4');
        assert.equal(ppant.hasSentFriendRequest('4'), false);
        assert.equal(ppant.getFriendList().includes('4'), false);

    });

    it('test add ReceivedFriendRequest and accept it', function () {
        let oldLength = ppant.getReceivedRequestList().getAllBusinessCards().length;

        //add new friendRequest
        let busCard = new BusinessCard('44', 'testUser', 'Max', 'Dr', 'Mustermann', 'job', 'company', 'email');
        ppant.addFriendRequest(busCard);

        assert.equal(ppant.getReceivedRequestList().includes('44'), true);
        assert.equal(ppant.getReceivedRequestList().getAllBusinessCards().length, oldLength + 1);

        //add it again, no change in behaviour
        ppant.addFriendRequest(busCard);

        assert.equal(ppant.getReceivedRequestList().includes('44'), true);
        assert.equal(ppant.getReceivedRequestList().getAllBusinessCards().length, oldLength + 1);

        //accept friendRequest
        ppant.acceptFriendRequest('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);
        assert.equal(ppant.getFriendList().includes('44'), true);
        assert.equal(ppant.hasFriend('44'), true);

        //accept it again, no change in behaviour
        ppant.acceptFriendRequest('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);
        assert.equal(ppant.getFriendList().includes('44'), true);
    });

    it('test add ReceivedFriendRequest and decline it', function () {
        let oldLength = ppant.getReceivedRequestList().getAllBusinessCards().length;

        //add new friendRequest
        let busCard = new BusinessCard('44', 'testUser', 'Max', 'Dr', 'Mustermann', 'job', 'company', 'email');
        ppant.addFriendRequest(busCard);

        assert.equal(ppant.getReceivedRequestList().includes('44'), true);
        assert.equal(ppant.getReceivedRequestList().getAllBusinessCards().length, oldLength + 1);

        //decline friendRequest
        ppant.declineFriendRequest('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);
        assert.equal(ppant.getFriendList().includes('44'), false);

        //decline it again, no change in behaviour
        ppant.declineFriendRequest('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);
        assert.equal(ppant.getFriendList().includes('44'), false);
    });

    it('test remove friend', function () {
        //add new friendRequest and accept it 
        let busCard = new BusinessCard('44', 'testUser', 'Max', 'Dr', 'Mustermann', 'job', 'company', 'email');
        ppant.addFriendRequest(busCard);
        ppant.acceptFriendRequest('44');

        //remove it 
        ppant.removeFriend('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);

        //remove it again, no change in behaviour
        ppant.removeFriend('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);
    });

    it('test hasFriend undefined', function () {
        assert.equal(ppant.hasFriend(undefined), undefined);
    });

    it('test hasSentFriendRequest undefined', function () {
        assert.equal(ppant.hasSentFriendRequest(undefined), undefined);
    });

    it('test addTask', function () {

        let task = new Task(1, TypeOfTask.ASKQUESTIONINLECTURE, 2);

        //taskMappingCount before
        assert.equal(ppant.getTaskTypeMappingCount(TypeOfTask.ASKQUESTIONINLECTURE), 0);


        ppant.addTask(task);

        //taskMapping Count and points after adding task
        assert.equal(ppant.getAwardPoints(), awardPoints + 2);
        assert.equal(ppant.getTaskTypeMappingCount(TypeOfTask.ASKQUESTIONINLECTURE), 1);
    });

    it('test addPoints', function () {
        let points = ppant.getAwardPoints();
        ppant.addAwardPoints(42);
        assert.equal(ppant.getAwardPoints(), points + 42);
    });

    it('test add Achievement and remove Achievement', function () {
        //add it
        let ach = new Achievement(333, 't', 'i', 'd', 3, 'c', 3, 3, TypeOfTask.ASKQUESTIONINLECTURE, 5);
        let lengthBefore = ppant.getAchievements().length;
        ppant.addAchievement(ach);
        assert.equal(ppant.getAchievements().length, lengthBefore + 1);

        //remove it
        ppant.removeAchievement(333);
        assert.equal(ppant.getAchievements().length, lengthBefore);
    });

    it('test remove achievement that is not in list', function () {
        assert.throws(() => ppant.removeAchievement(333), Error, '333 not found in list of achievements');
    });
});