const Participant = require('../../../game/app/server/models/Participant.js');
const chai = require('chai');
const Position = require('../../../game/app/server/models/Position.js');
const Direction = require('../../../game/app/client/shared/Direction.js');
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
const expect = chai.expect;
const TestUtil = require('./utils/TestUtil.js');

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

describe('Participant test', function() {

    //test data
    beforeEach(function() {
        id = TestUtil.randomString();
        accountId = TestUtil.randomString();
        businessCard = new BusinessCard(id, 'username', 'title', 'surname', 'forename', 'job', 'company', 'email');
        position = TestUtil.randomPosition();
        direction = TestUtil.randomObjectValue(Direction);
        friendList = new FriendList(id, []);
        receivedRequestList = new FriendList(id, []);
        sentRequestList = new FriendList(id, []);
        achievements = [];
        new TaskService().getAllTasks().forEach(x => {
            taskMapping[x.getTaskType()] = 0;
        });
        isMod = TestUtil.randomBool();
        awardPoints = TestUtil.randomInt();
        chatList = [new Chat(TestUtil.randomString(), [], [], TestUtil.randomIntWithMin(1))];
        ppant = new Participant(id, accountId, businessCard, position, direction, friendList, receivedRequestList, 
                    sentRequestList, achievements, taskMapping, isMod, awardPoints, chatList);
    });

    it('test getters', function() {
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
    });

    it('test adding and removing a chat', function() {

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

        //remove chat now
        ppant.removeChat(newChat.getId());

        assert.equal(ppant.getChat(newChat.getId()), undefined);
        expect(ppant.getChatList()).to.be.an('array').and.to.have.lengthOf(oldChatListLength);
        assert.equal(ppant.isMemberOfChat(newChat.getId()), false);
    });
    
    it('test adding a 1:1 chat and hasChatWith', function() {
        assert.equal(ppant.hasChatWith('chatPartnerID'), false);

        //create 1:1 chat and add it to list
        let newOneToOneChat = new OneToOneChat('chatID', id, 'chatPartnerID', [], TestUtil.randomIntWithMin(1), businessCard.getUsername(), 'chatPartnerUsername');
        ppant.addChat(newOneToOneChat);

        assert.equal(ppant.hasChatWith('chatPartnerID'), true);
    });

    it('test set position', function() {
        let newPosition = TestUtil.randomPosition();
        ppant.setPosition(newPosition);
        assert.equal(ppant.getPosition(), newPosition);
    });

    it('test setDirection', function() {
        let newDirection = TestUtil.randomObjectValue(Direction);
        while (newDirection === direction) {
            newDirection = TestUtil.randomObjectValue(Direction);
        }

        ppant.setDirection(newDirection);
        assert.equal(ppant.getDirection(), newDirection);
    });

    it('test setIsVisible', function() {
        let newVisibility = !ppant.getIsVisible();
        ppant.setIsVisible(newVisibility);
        assert.equal(ppant.getIsVisible(), newVisibility);
    })

    it('test set achievements', function() {
        let exampleAch = [new Achievement(55, 'achievement', 'icon', 'description', 'currentLevel', 'color', 4444, 3, TypeOfTask.FOODCOURTVISIT)];
        assert.equal(ppant.getAchievements(), achievements);

        ppant.setAchievements(exampleAch);
        assert.equal(ppant.getAchievements(), exampleAch);
    });

    it('test add SentFriendRequest and accept it', function() {
        let oldLength = ppant.getSentRequestList().getAllBusinessCards().length;

        //add new friendRequest
        let busCard = new BusinessCard('4', 'friendReceiver', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
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

    it('test add SentFriendRequest and decline it', function() {
        let oldLength = ppant.getSentRequestList().getAllBusinessCards().length;

        //add new friendRequest
        let busCard = new BusinessCard('4', 'friendReceiver', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
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

    it('test add ReceivedFriendRequest and accept it', function() {
        let oldLength = ppant.getReceivedRequestList().getAllBusinessCards().length;

        //add new friendRequest
        let busCard = new BusinessCard('44', 'testUser', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
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

    it('test add ReceivedFriendRequest and decline it', function() {
        let oldLength = ppant.getReceivedRequestList().getAllBusinessCards().length;

        //add new friendRequest
        let busCard = new BusinessCard('44', 'testUser', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
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

    it('test remove friend', function() {
        //add new friendRequest and accept it 
        let busCard = new BusinessCard('44', 'testUser', 'Dr', 'Mustermann', 'Max', 'job', 'company', 'email');
        ppant.addFriendRequest(busCard);
        ppant.acceptFriendRequest('44');

        //remove it 
        ppant.removeFriend('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);

        //remove it again, no change in behaviour
        ppant.removeFriend('44');
        assert.equal(ppant.getReceivedRequestList().includes('44'), false);
    });

    it('test hasFriend undefined', function() {
        assert.equal(ppant.hasFriend(undefined), undefined);
    });

    it('test hasSentFriendRequest undefined', function() {
        assert.equal(ppant.hasSentFriendRequest(undefined), undefined);
    });    

    it('test addTask', function() {

        let task = new Task(1, TypeOfTask.ASKQUESTIONINLECTURE, 2);

        //taskMappingCount before
        assert.equal(ppant.getTaskTypeMappingCount(TypeOfTask.ASKQUESTIONINLECTURE), 0);


        ppant.addTask(task);

        //taskMapping Count and points after adding task
        assert.equal(ppant.getAwardPoints(), awardPoints + 2);
        assert.equal(ppant.getTaskTypeMappingCount(TypeOfTask.ASKQUESTIONINLECTURE), 1);
    });

    it('test addPoints', function() {
        let points = ppant.getAwardPoints();
        ppant.addAwardPoints(42);
        assert.equal(ppant.getAwardPoints(), points + 42);
    });
    
    it('test add Achievement and remove Achievement', function() {
        //add it
        let ach = new Achievement(333, 't', 'i', 'd', 'cl', 'c', 3, 3, TypeOfTask.ASKQUESTIONINLECTURE);
        let lengthBefore = ppant.getAchievements().length;
        ppant.addAchievement(ach);
        assert.equal(ppant.getAchievements().length, lengthBefore + 1);

        //remove it
        ppant.removeAchievement(333);
        assert.equal(ppant.getAchievements().length, lengthBefore);
    });

    it('test remove achievement that is not in list', function() {
        assert.throws(() => ppant.removeAchievement(333), Error, '333 not found in list of achievements');
    }); 
});