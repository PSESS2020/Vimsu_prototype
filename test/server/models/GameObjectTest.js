const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const GameObject = require('../../../src/game/app/server/models/mapobjects/GameObject.js');
const Position = require('../../../src/game/app/server/models/Position.js');
const GameObjectType = require('../../../src/game/app/client/shared/GameObjectType.js');

var id;
var gameObjectType;
var name;
var width;
var length;
var position;
var isSolid;
var isClickable;
var url;

describe('GameObject test', function () {

    //test data
    beforeEach(function () {
        id = TestUtil.randomInt();
        gameObjectType = GameObjectType.TABLE;
        name = TestUtil.randomString();
        width = TestUtil.randomInt();
        length = TestUtil.randomInt();
        position = new Position(TestUtil.randomInt(), TestUtil.randomInt(), TestUtil.randomInt());
        isSolid = TestUtil.randomBool();
        isClickable = TestUtil.randomBool();
        iFrameData = { title: TestUtil.randomString(), url: TestUtil.randomString(), width: TestUtil.randomInt(), height: TestUtil.randomInt() };
    });

    it('test constructor and getters', function () {
        let gameObject = new GameObject(id, gameObjectType, name, width, length, position, isSolid, isClickable, iFrameData);

        assert.equal(id, gameObject.getId());
        assert.equal(gameObjectType, gameObject.getGameObjectType());
        assert.equal(name, gameObject.getName());
        assert.equal(width, gameObject.getWidth());
        assert.equal(length, gameObject.getLength());
        assert.equal(position, gameObject.getPosition());
        assert.equal(isSolid, gameObject.getSolid());
        assert.equal(isClickable, gameObject.getClickable());
        assert.equal(iFrameData, gameObject.getIFrameData());
    });

    it('test constructor invalid input', function () {
        expect(() => new GameObject('id', gameObjectType, name, width, length, position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObject(id, 'gameObjectType', name, width, length, position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObject(id, gameObjectType, 42, width, length, position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObject(id, gameObjectType, name, 'width', length, position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObject(id, gameObjectType, name, width, 'length', position, isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObject(id, gameObjectType, name, width, length, 'position', isSolid, isClickable)).to.throw(TypeError);
        expect(() => new GameObject(id, gameObjectType, name, width, length, position, 'isSolid', isClickable)).to.throw(TypeError);
        expect(() => new GameObject(id, gameObjectType, name, width, length, position, isSolid, 'isClickable')).to.throw(TypeError);
        expect(() => new GameObject(id, gameObjectType, name, width, length, position, isSolid, isClickable, 42)).to.throw(TypeError);
        expect(() => new GameObject(id, gameObjectType, name, width, length, position, isSolid, isClickable, undefined)).to.not.throw(TypeError);
    });
})