const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const DoorClient = require('../../../game/app/client/models/DoorClient.js');
const TypeOfDoor = require('../../../game/app/client/shared/TypeOfDoor.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');

//test data
var id = TestUtil.randomInt();
var typeOfDoor = TypeOfDoor.LEFT_DOOR;
var name = 'door';
var position = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());
var isClickable = TestUtil.randomBool();
var targetRoomID = TestUtil.randomInt();

describe('DoorClient test', function() {
    it('test constructor and getters', function() {
        let door = new DoorClient(id, typeOfDoor, name, position, isClickable, targetRoomID);

        assert.equal(id, door.getId());
        assert.equal(typeOfDoor, door.getTypeOfDoor());
        assert.equal(name, door.getName());
        assert.equal(position, door.getMapPosition());
        assert.equal(isClickable, door.isClickable());
        assert.equal(targetRoomID, door.getTargetRoomId());
    });

    it('test constructor with undefined targetRoomID', function() {
        let door = new DoorClient(id, typeOfDoor, name, position, isClickable, undefined);
        assert.equal(door.getTargetRoomId(), undefined);
    });

    it('test invalid input', function() {
        expect(() => new DoorClient('id', typeOfDoor, name, mapPosition, isClickable, targetRoomID));
        expect(() => new DoorClient(id, 'typeOfDoor', name, mapPosition, isClickable, targetRoomID));
        expect(() => new DoorClient(id, typeOfDoor, 42, mapPosition, isClickable, targetRoomID));
        expect(() => new DoorClient(id, typeOfDoor, name, mapPosition, 'isClickable', targetRoomID));
        expect(() => new DoorClient(id, typeOfDoor, name, mapPosition, isClickable, 'targetRoomID'));
    });
});