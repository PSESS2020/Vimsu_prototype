const GameObject = require('../../../game/app/server/models/GameObject.js');
const chai = require('chai');
const Position = require('../../../game/app/server/models/Position.js');
const assert = chai.assert;

//create example gameObject 
var id = 1;
var name = 'table';
var width = 2;
var length = 3;
var roomId = 5;
var cordX = 2;
var cordY = 4;
var position = new Position(roomId, cordX, cordY);
var isSolid = true;
var gameObject = new GameObject(id, name, width, length, position, isSolid);

describe('GameObjectTest getter functions', function() {
    it('test getId', function() {
        assert.equal(gameObject.getId(), id);
    });

    it('test getName', function() {
        assert.equal(gameObject.getName(), name);
    });

    it('test getWidth', function() {
        assert.equal(gameObject.getWidth(), width);
    });

    it('test getLength', function() {
        assert.equal(gameObject.getLength(), length);
    });

    it('test getPosition', function() {
        assert.equal(gameObject.getPosition(), position);
    });

    it('test getSolid', function() {
        assert.equal(gameObject.getSolid(), isSolid);
    });
});