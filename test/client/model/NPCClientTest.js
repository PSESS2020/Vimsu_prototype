const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const Direction = require('../../../src/game/app/client/shared/Direction.js');
const NPCClient = require('../../../src/game/app/client/models/NPCClient.js');
const PositionClient = require('../../../src/game/app/client/models/PositionClient.js');
const ShirtColor = require('../../../src/game/app/client/shared/ShirtColor.js');

//test data
var id = TestUtil.randomInt();
var cordX = TestUtil.randomIntWithMin(0);
var cordY = TestUtil.randomIntWithMin(0);
var position = new PositionClient(cordX, cordY);
var name = TestUtil.randomString();
var direction = Direction.DOWNLEFT;
var shirtColor = ShirtColor.BLUE;

describe('NPCClient test', function () {
    it('test constructor and getters', function () {
        let npc = new NPCClient({ id, name, cordX, cordY, direction, shirtColor });

        assert.equal(id, npc.getId());
        assert.equal(position, npc.getPosition());
        assert.equal(name, npc.getName());
        assert.equal(direction, npc.getDirection());
        assert.equal(shirtColor, npc.getShirtColor());
    });

    it('test constructor invalid input', function () {
        expect(() => new NPCClient({ id: 'fehler', name, cordX, cordY, direction, shirtColor })).to.throw(TypeError);
        expect(() => new NPCClient({ id, name: 42, cordX, cordY, direction, shirtColor })).to.throw(TypeError);
        expect(() => new NPCClient({ id, name, cordX: 'fehler', cordY,  direction, shirtColor })).to.throw(TypeError);
        expect(() => new NPCClient({ id, name, cordX, cordY: 'fehler',  direction, shirtColor })).to.throw(TypeError);
        expect(() => new NPCClient({ id, name, cordX, cordY, direction: 'fehler', shirtColor })).to.throw(TypeError);
        expect(() => new NPCClient({ id, name, cordX, cordY, direction, shirtColor: 'fehler' })).to.throw(TypeError);
    });
})

