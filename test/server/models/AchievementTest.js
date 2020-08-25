const chai = require('chai');
const assert = chai.assert;
const Achievement = require('../../../game/app/server/models/Achievement.js');
const TypeOfTask = require('../../../game/app/server/utils/TypeOfTask.js');

//example achievement
var id = 1;
var title = 'Achievement collector';
var icon = 'star';
var description = 'collect all achievements';
var currentLevel = 1;
var color = '#C9B037';
var awardPoints = 10;
var maxLevel = 3;
var taskType = TypeOfTask.RECEPTIONVISIT;
var nextCount = 5;

achievement = new Achievement(id, title, icon, description, currentLevel, color, awardPoints, maxLevel, taskType, nextCount);

describe('Achievement getter functions', function() {
    it('test getId', function() {
        assert.equal(achievement.getId(), id);
    })  
    it('test getTitle', function() {
        assert.equal(achievement.getTitle(), title);
    })  
    it('test getIcon', function() {
        assert.equal(achievement.getIcon(), icon);
    })  
    it('test getDescription', function() {
        assert.equal(achievement.getDescription(), description);
    })  
    it('test getColor', function() {
        assert.equal(achievement.getColor(), color);
    })  
    it('test getTaskType', function() {
        assert.equal(achievement.getTaskType(), taskType);
    })  

    it('test getCurrentLevel', function() {
        assert.equal(achievement.getCurrentLevel(), currentLevel);
    })

    it('test getAwardPoints', function() {
        assert.equal(achievement.getAwardPoints(), awardPoints);
    })
    it('test getMaxLevel', function() {
        assert.equal(achievement.getMaxLevel(), maxLevel);
    })  
    it('test getNextCount', function() {
        assert.equal(achievement.getNextCount(), nextCount);
    })  
})

describe('Achievement setter functions', function() {
    it('test setCurrentLevel', function() {
        achievement.setCurrentLevel(2);
        assert.equal(achievement.getCurrentLevel(), 2);
    })

    it('test setColor', function() {
        achievement.setColor('#FFFFFF');
        assert.equal(achievement.getColor(), '#FFFFFF');
    })

    it('test setAwardPoints', function() {
        achievement.setAwardPoints(20);
        assert.equal(achievement.getAwardPoints(), 20);
    })

    it('test setNextCount', function() {
        achievement.setNextCount(10);
        assert.equal(achievement.getNextCount(), 10);
    })
})

describe('Achievement equals function', function() {
    it('test equals', function() {
        let achievementToCompare = new Achievement(2, 'Network Guru', 'icon', 'chat with different people', 2, '#FFFFFF', 20, 3, TypeOfTask.ASKQUESTIONINLECTURE, 3);
        assert.equal(achievement.equals(achievementToCompare), false);
        assert.equal(achievement.equals(achievement), true);
    })
})