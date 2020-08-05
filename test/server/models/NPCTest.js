const NPC = require('../../../game/app/server/models/NPC.js');
const chai = require('chai');
const Position = require('../../../game/app/server/models/Position.js');
const Direction = require('../../../game/app/utils/Direction.js');
const assert = chai.assert;

//create example NPC
var id = 1;
var name = 'NPC';
var roomId = 5;
var cordX = 2;
var cordY = 4;
var position = new Position(roomId, cordX, cordY);
var direction = Direction.DOWNLEFT;
var story = ['Hello'];
var npc = new NPC(id, name, position, direction, story);

describe('NPCTest getter functions', function() {
    it('test getId', function() {
        assert.equal(npc.getId(), id);
    });

    it('test getName', function() {
        assert.equal(npc.getName(), name);
    });

    it('test getPosition', function() {
        assert.equal(npc.getPosition(), position);
    });

    it('test getDirection', function() {
        assert.equal(npc.getDirection(), direction);
    });

    it('test getStory', function() {
        assert.equal(npc.getStory(), story);
    });
});
