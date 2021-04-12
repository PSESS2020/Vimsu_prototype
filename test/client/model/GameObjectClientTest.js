const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const GameObjectClient = require('../../../src/game/app/client/models/GameObjectClient.js');
const PositionClient = require('../../../src/game/app/client/models/PositionClient.js');
const GameObjectType = require('../../../src/game/app/client/shared/GameObjectType.js');

var id;
var gameObjectType;
var name;
var width;
var length;
var position;
var isClickable;
var isIFrameObject;

describe('GameObjectClient test', function () {

    //test data
    beforeEach(function () {
        id = TestUtil.randomInt();
        gameObjectType = GameObjectType.TABLE;
        name = TestUtil.randomString();
        width = TestUtil.randomInt();
        length = TestUtil.randomInt();
        position = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());
        isClickable = TestUtil.randomBool();
        isIFrameObject = TestUtil.randomBool();
    });

    it('test constructor and getters', function () {
        let gameObject = new GameObjectClient(id, gameObjectType, name, width, length, position, isClickable, isIFrameObject);

        assert.equal(id, gameObject.getId());
        assert.equal(gameObjectType, gameObject.getGameObjectType());
        assert.equal(name, gameObject.getName());
        assert.equal(width, gameObject.getWidth());
        assert.equal(length, gameObject.getLength());
        assert.equal(position, gameObject.getPosition());
        assert.equal(isClickable, gameObject.getIsClickable());
        assert.equal(isIFrameObject, gameObject.getIsIFrameObject());
    });

    it('test constructor invalid input', function () {
        expect(() => new GameObjectClient('id', gameObjectType, name, width, length, position, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, 'gameObjectType', name, width, length, position, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, 42, width, length, position, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, 'width', length, position, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, width, 'length', position, isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, width, length, 'position', isClickable)).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, width, length, position, 'isClickable')).to.throw(TypeError);
        expect(() => new GameObjectClient(id, gameObjectType, name, width, length, position, isClickable, 'isIFrameObject')).to.throw(TypeError);
    });
})