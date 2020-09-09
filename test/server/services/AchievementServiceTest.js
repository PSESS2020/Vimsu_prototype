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

var businessCard = new BusinessCard('1234', 'MaxMustermann', 'Mr', 'Mustermann', 'Max', 'Developer',
    'Google', 'test@test.de');
var position = new Position(1, 1, 1);
var friendList = new FriendList([]);
var receivedRequestList = new FriendList([]);
var sentRequestList = new FriendList([]);
var awardPoints = 20;
var chatList = [];
var achievements = []

function generateTasks() {
    var tasks = {};
    new TaskService().getAllTasks().forEach(x => {
        tasks[x.getTaskType()] = 0
    })
    return tasks;

}

describe('AchievementService achievement handling', function () {
    it('test getAllAchievements', function () {

        var testParticipant = new Participant('1234', '1a2b', businessCard, position, Direction.DOWNLEFT, friendList, receivedRequestList, sentRequestList, achievements, generateTasks(), false, awardPoints, chatList);
        testParticipant.addTask(new TaskService().getTaskByType(TypeOfTask.FOODCOURTVISIT));
        var achievements = achievementService.getAllAchievements(testParticipant);
        assert.equal(achievements.length, 10);
        expect(achievements[3]).to.eql(new Achievement(3, "Coffee Time", "coffee", "Visit food court room to gain this achievement.", 1, '#C9B037', 10, 1, TypeOfTask.FOODCOURTVISIT))
    });


    it('test computeAchievements', function () {
        var testParticipant = new Participant('1234', '1a2b', businessCard, position, Direction.DOWNLEFT, friendList, receivedRequestList, sentRequestList, achievements, generateTasks(), false, awardPoints, chatList);
        testParticipant.addTask(new TaskService().getTaskByType(TypeOfTask.FOODCOURTVISIT));
        expect(achievementService.computeAchievements(testParticipant)).to.eql([new Achievement(3, "Coffee Time", "coffee", "Visit food court room to gain this achievement.", 1, '#C9B037', 10, 1, TypeOfTask.FOODCOURTVISIT)])
    });

    it('test computeAchievements with at least one unlocked achievement', function () {
        var testParticipant = new Participant('1234', '1a2b', businessCard, position, Direction.DOWNLEFT, friendList, receivedRequestList, sentRequestList, achievements, generateTasks(), false, awardPoints, chatList);

        testParticipant.addTask(new TaskService().getTaskByType(TypeOfTask.RECEPTIONVISIT));
        var newAchievement = achievementService.computeAchievements(testParticipant);
        expect(newAchievement.length).to.eql(1);

        testParticipant.addTask(new TaskService().getTaskByType(TypeOfTask.FOODCOURTVISIT));
        newAchievement = achievementService.computeAchievements(testParticipant);
        expect(newAchievement.length).to.eql(1);
        expect(newAchievement[0]).to.eql(new Achievement(3, "Coffee Time", "coffee", "Visit food court room to gain this achievement.", 1, '#C9B037', 10, 1, TypeOfTask.FOODCOURTVISIT));
        expect(testParticipant.getAchievements()[2]).to.eql(newAchievement[0]);
    });

    it('test achievement by task', function () {
        var as = new AchievementService();
        var ad = as.getAchievementDefinition(TypeOfTask.RECEPTIONVISIT);
        expect(ad).to.eql(new AchievementDefinition(8, TypeOfTask.RECEPTIONVISIT, "Vimsu Associate", "user", "Visit reception room to gain this achievement.", [{ count: 1, color: '#C9B037', points: 10 }]));
    });
})

describe('AchievementService singleton', function () {
    it('test constructor', function () {
        var as1 = new AchievementService();
        var as2 = new AchievementService();

        expect(as1 == as2).to.eql(true);
    });

})