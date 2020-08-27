const AchievementService = require('../../../src/game/app/server/services/AchievementService.js');
const AchievementDefinition = require('../../../src/game/app/server/models/AchievementDefinition.js');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const Achievement = require('../../../src/game/app/server/models/Achievement.js');
const TypeOfTask = require('../../../src/game/app/server/utils/TypeOfTask.js');
const Participant = require('../../../src/game/app/server/models/Participant.js');
const BusinessCard = require('../../../src/game/app/server/models/BusinessCard.js');
const Direction = require('../../../src/game/app/client/shared/Direction.js');
const Position = require('../../../src/game/app/server/models/Position.js');
const FriendList = require('../../../src/game/app/server/models/FriendList.js');
const TaskService = require('../../../src/game/app/server/services/TaskService.js');


var achievementService = new AchievementService();
var achievementLectureQuestion = new AchievementDefinition(1, TypeOfTask.ASKQUESTIONINLECTURE, "Inquisitive", "question", "Ask questions in lectures to gain this achievement.", [
    { count: 5, color: '#D7D7D7', points: 15},
    { count: 10, color: '#C9B037', points: 15}
]);
var validId = 1;
var invalidId = 15;
var invalidDefinition = new AchievementDefinition(15, TypeOfTask.ASKQUESTIONINLECTURE, "Inquisitive", "question", "Ask questions in lectures to gain this achievement.", [
    { count: 0, color: '#D7D7D7', points: 20},
    { count: 10, color: '#C9B037', points: 405}
]);

var businessCard = new BusinessCard('1234', 'MaxMustermann', 'Mr', 'Mustermann', 'Max', 'Developer', 
'Google', 'test@test.de');
var position = new Position(1, 1, 1);
var friendList = new FriendList([]);
var receivedRequestList = new FriendList([]);
var sentRequestList = new FriendList([]);
var tasks = new TaskService().getAllTasks();
var awardPoints = 20;
var chatList = [];
var achievements = []

describe('AchievementService getter functions', function() {
    it('test getAllAchievementDefinitions', function() {
        let achievementDefinitions = achievementService.getAllAchievementDefinitions();
        var size = Object.keys(achievementDefinitions).length;
        expect(achievementDefinitions).to.be.an('object');
        assert.equal(size, 10);
        for (const [key, value] of Object.entries(achievementDefinitions)) {
            expect(value).to.be.instanceOf(AchievementDefinition);
        }
    })
})

describe('AchievementService achievement handling', function() {
    it('test getLevelFromDefinition', function() {
        var defintion = achievementService.getAllAchievementDefinitions()[TypeOfTask.FOODCOURTVISIT];
        var level = achievementService.getLevelFromDefinition(1, defintion.getLevels());
        expect(level).to.eql(1);
    });

    it('test getAllAchievements', function() {
        var testParticipant = new Participant('1234', '1a2b', businessCard, position, Direction.DOWNLEFT, friendList, receivedRequestList, sentRequestList, achievements, tasks, false, awardPoints, chatList);
        testParticipant.addTask(new TaskService().getTaskByType(TypeOfTask.FOODCOURTVISIT));
        var achievements = achievementService.getAllAchievements(testParticipant);
        assert.equal(achievements.length, Object.keys(new AchievementService().getAllAchievementDefinitions()).length);
        expect(achievements[3]).to.eql(new Achievement(3, "Coffee Time", "coffee", "Visit food court room to gain this achievement.",1, '#C9B037', 10, 1, TypeOfTask.FOODCOURTVISIT))
    });


    it('test computeAchievements', function() {
        var testParticipant = new Participant('1234', '1a2b', businessCard, position, Direction.DOWNLEFT, friendList, receivedRequestList, sentRequestList, achievements, tasks, false, awardPoints, chatList);
        testParticipant.addTask(new TaskService().getTaskByType(TypeOfTask.FOODCOURTVISIT));
        expect(achievementService.computeAchievements(testParticipant)).to.eql([new Achievement(3, "Coffee Time", "coffee", "Visit food court room to gain this achievement.",1, '#C9B037', 10, 1, TypeOfTask.FOODCOURTVISIT)])
    });

    it ('test computeAchievements with at least one unlocked achievement', function() {
        var testParticipant = new Participant('1234', '1a2b', businessCard, position, Direction.DOWNLEFT, friendList, receivedRequestList, sentRequestList, achievements, tasks, false, awardPoints, chatList);
        
        testParticipant.addTask(new TaskService().getTaskByType(TypeOfTask.RECEPTIONVISIT));
        achievementService.computeAchievements(testParticipant);
        testParticipant.addTask(new TaskService().getTaskByType(TypeOfTask.FOODCOURTVISIT));
        var newAchievement = achievementService.computeAchievements(testParticipant);
        expect(newAchievement[0]).to.eql(new Achievement(3, "Coffee Time", "coffee", "Visit food court room to gain this achievement.",1, '#C9B037', 10, 1, TypeOfTask.FOODCOURTVISIT));
        expect(testParticipant.getAllAchievements()[3]).to.eql(newAchievement);
    });
})