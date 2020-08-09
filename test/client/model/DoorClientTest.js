const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const DoorClient = require('../../../game/app/client/models/DoorClient.js');
const TypeOfDoorClient = require('../../../game/app/client/utils/TypeOfDoorClient.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');

//test data
var id = TestUtil.randomInt();
var typeOfDoor = TypeOfDoorClient.FOODCOURT_DOOR;
var position = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());

describe('DoorClient test', function() {
    it('test constructor and getters', function() {
        let door = new DoorClient(id, typeOfDoor, position);

        assert.equal(id, door.getId());
        assert.equal(typeOfDoor, door.getTypeOfDoor());
        assert.equal(position, door.getMapPosition());
    });

    it('test constructor invalid input', function() {
        expect(() => new DoorClient('id', typeOfDoor, position)).to.throw(TypeError);
        expect(() => new DoorClient(id, 'typeOfDoor', position)).to.throw(TypeError);
        expect(() => new DoorClient(id, typeOfDoor, 'position')).to.throw(TypeError);
    });
})