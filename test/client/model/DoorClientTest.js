const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const DoorClient = require('../../../game/app/client/models/DoorClient.js');
const TypeOfDoor = require('../../../game/app/client/shared/TypeOfDoor.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');

var id;
var typeOfDoor;
var name;
var position;
var targetRoomID;

describe('DoorClient test', function() {

    //test data
    beforeEach( function () {
        id = TestUtil.randomInt();
        typeOfDoor = TypeOfDoor.LEFT_DOOR;
        name = 'door';
        position = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());
        targetRoomID = TestUtil.randomInt();
    });

    it('test constructor and getters', function() {
        let door = new DoorClient(id, typeOfDoor, name, position, targetRoomID);

        assert.equal(id, door.getId());
        assert.equal(typeOfDoor, door.getTypeOfDoor());
        assert.equal(name, door.getName());
        assert.equal(position, door.getMapPosition());
        assert.equal(targetRoomID, door.getTargetRoomId());
    });

    it('test constructor with undefined targetRoomID', function() {
        let door = new DoorClient(id, typeOfDoor, name, position, undefined);
        assert.equal(door.getTargetRoomId(), undefined);
    });

    it('test invalid input', function() {
        expect(() => new DoorClient('id', typeOfDoor, name, mapPosition, argetRoomID));
        expect(() => new DoorClient(id, 'typeOfDoor', name, mapPosition, targetRoomID));
        expect(() => new DoorClient(id, typeOfDoor, 42, mapPosition, targetRoomID));
        expect(() => new DoorClient(id, typeOfDoor, name, 'mapPosition', targetRoomID));
        expect(() => new DoorClient(id, typeOfDoor, name, mapPosition,'targetRoomID'));
    });
});