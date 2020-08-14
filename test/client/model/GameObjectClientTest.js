
const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const GameObjectClient = require('../../../game/app/client/models/GameObjectClient.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');
const GameObjectType = require('../../../game/app/client/shared/GameObjectType.js');

//test data
var id = TestUtil.randomInt();
var gameObjectType = GameObjectType.TABLE;
var name = TestUtil.randomString();
var width = TestUtil.randomInt();
var length = TestUtil.randomInt();
var position = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());
var isSolid = TestUtil.randomBool();
var isClickable = TestUtil.randomBool();

describe('GameObjectClient test', function() {
    it('test constructor and getters', function() {
        let gameObject = new GameObjectClient(id, gameObjectType, name, width, length, position, isSolid, isClickable);

        assert.equal(id, gameObject.getId());
        assert.equal(gameObjectType, gameObject.getGameObjectType());
        assert.equal(name, gameObject.getName());
        assert.equal(width, gameObject.getWidth());
        assert.equal(length, gameObject.getLength());
        assert.equal(position, gameObject.getPosition());
        assert.equal(isSolid, gameObject.getSolid());
        assert.equal(isClickable, gameObject.isClickable());
    });

    it('test constructor invalid input', function() {
        expect(() => new GameObjectClient('id', gameObjectType, name, width, length, position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, 'gameObjectType', name, width, length, position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, 42, width, length, position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, 'width', length, position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, width, 'length', position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, width, length, 'position', isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, width, length, position, 'isSolid', isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, width, length, position, isSolid, 'isClickable')).to.throw(TypeError);
    });
})