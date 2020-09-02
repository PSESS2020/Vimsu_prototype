const chai = require('chai');
const assert = chai.assert;
const Achievement = require('../../../src/game/app/server/models/Achievement.js');
const AchievementDefinition = require('../../../src/game/app/server/models/AchievementDefinition.js');
const TypeOfTask = require('../../../src/game/app/server/utils/TypeOfTask.js');
const { expect } = require('chai');

//example achievement definition
var id = 1;
var taskType = TypeOfTask.CHEFCLICK;
var title = 'Gourmet';
var icon = 'cook';
var description = 'talk with the chef';
var levels = [
    { count: 5, color: '#D7D7D7', points: 200 },
    { count: 10, color: '#C9B037', points: 200 }
];

var achievementDefinition = new AchievementDefinition(id, taskType, title, icon, description, levels);
var achievement = new Achievement(id, title, icon, description, 1, '#D7D7D7', 200, 2, taskType, 1);

describe('AchievementDefinition getter funtions', function () {
    it('test getId', function () {
        assert.equal(achievementDefinition.getId(), id);
    })

    it('test getTaskType', function () {
        assert.equal(achievementDefinition.getTaskType(), taskType);
    })

    it('test getTitle', function () {
        assert.equal(achievementDefinition.getTitle(), title);
    })

    it('test getIcon', function () {
        assert.equal(achievementDefinition.getIcon(), icon);
    })

    it('test getDescription', function () {
        assert.equal(achievementDefinition.getDescription(), description);
    })

    it('test getLevels', function () {
        assert.equal(achievementDefinition.getLevels(), levels);
    })
})

describe('AchievementDefinition compute achievement function', function () {
    it('test computeAchievement', function () {
        expect(achievementDefinition.computeAchievement(1)).to.eql(achievement);
    })
})
