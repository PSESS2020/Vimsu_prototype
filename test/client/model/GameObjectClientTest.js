
const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const GameObjectClient = require('../../../game/app/client/models/GameObjectClient.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');

//test data
var id = TestUtil.randomInt();
var name = TestUtil.randomString();
var width = TestUtil.randomInt();
var length = TestUtil.randomInt();
var position = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());
var isSolid = TestUtil.randomBool();

describe('GameObjectClient test', function() {
    it('test constructor and getters', function() {
        let gameObject = new GameObjectClient(id, name, width, length, position, isSolid);

        assert.equal(id, gameObject.getId());
        assert.equal(name, gameObject.getName());
        assert.equal(width, gameObject.getWidth());
        assert.equal(length, gameObject.getLength());
        assert.equal(position, gameObject.getPosition());
        assert.equal(isSolid, gameObject.getSolid());
    });

    it('test constructor invalid input', function() {
        expect(() => new GameObjectClient('id', name, width, length, position, isSolid)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, 42, width, length, position, isSolid)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, name, 'width', length, position, isSolid)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, name, width, 'length', position, isSolid)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, name, width, length, 'position', isSolid)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, name, width, length, position, 'isSolid')).to.throw(TypeError);
    });
})