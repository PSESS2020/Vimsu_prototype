
const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const DirectionClient = require('../../../game/app/client/utils/DirectionClient.js');
const NPCClient = require('../../../game/app/client/models/NPCClient.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');

//test data
var id = TestUtil.randomInt();
var position = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());
var name = TestUtil.randomString();
var direction = DirectionClient.DOWNLEFT;

describe('NPCClient test', function() {
    it('test constructor and getters', function() {
        var npc = new NPCClient(id, name, position, direction);

        assert.equal(id, npc.getId());
        assert.equal(position, npc.getPosition());
        assert.equal(name, npc.getName());
        assert.equal(direction, npc.getDirection());
    });

    it('test constructor invalid input', function() {
        expect(() => new NPCClient('fehler', name, position, direction)).to.throw(TypeError);
        expect(() => new NPCClient(id, 42, position, direction)).to.throw(TypeError);
        expect(() => new NPCClient(id, name, 'fehler', direction)).to.throw(TypeError);
        expect(() => new NPCClient(id, name, position, 'fehler')).to.throw(TypeError);
    });
})

