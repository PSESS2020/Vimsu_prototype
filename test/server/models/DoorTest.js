const Door = require('../../../src/game/app/server/models/Door.js');
const TypeOfDoor = require('../../../src/game/app/client/shared/TypeOfDoor.js');
const Position = require('../../../src/game/app/server/models/Position.js');
const Direction = require('../../../src/game/app/client/shared/Direction.js');
const TestUtil = require('./utils/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testDoorId;
var testDoorType;
var testDoorName;
var testMapPosition;
var testEnterPositions;
var testTargetPosition;
var testDirection;


describe('test Door class functionality', function () {


    beforeEach(function () {
        testDoorId = TestUtil.randomInt();
        testDoorType = TestUtil.randomObjectValue(TypeOfDoor);
        testDoorName = TestUtil.randomString();
        testMapPosition = TestUtil.randomPosition();
        testEnterPos = TestUtil.randomPosition();
        testEnterDirection = TestUtil.randomObjectValue(Direction);
        testEnterPositions = TestUtil.randomPositionList();
        testTargetPosition = TestUtil.randomPosition();
        testDirection = TestUtil.randomObjectValue(Direction);

        testEnterPosition = {
            position: testEnterPos,
            direction: testEnterDirection
        }
    });

    it('test non-lecture Door constructor', function () {

        testDoorType = TypeOfDoor.LEFT_DOOR;

        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            undefined, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, undefined, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, undefined, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, undefined)).to.throw(TypeError);

        testDoorType = TypeOfDoor.RIGHT_DOOR;

        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            undefined, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, undefined, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, undefined, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, undefined)).to.throw(TypeError);
    });



    it('test LectureDoor constructor', function () {
        testDoorType = TypeOfDoor.LECTURE_DOOR;
        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            undefined, testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, undefined, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, undefined, testDirection)).not.to.throw();
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, undefined)).not.to.throw();
    });

    it('test getters', function () {
        var testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection);
        assert.strictEqual(testDoor.getId(), testDoorId);
        assert.strictEqual(testDoor.getTypeOfDoor(), testDoorType);
        assert.strictEqual(testDoor.getName(), testDoorName);
        assert.strictEqual(testDoor.getStartingRoomId(), testMapPosition.getRoomId());
        assert.strictEqual(testDoor.getTargetRoomId(), testTargetPosition.getRoomId());
        assert.strictEqual(testDoor.getMapPosition(), testMapPosition);
        assert.strictEqual(testDoor.getTargetPosition(), testTargetPosition);
        assert.strictEqual(testDoor.getEnterPositionWithoutClick(), testEnterPosition);
        assert.strictEqual(testDoor.getEnterPositions(), testEnterPositions);
        assert.strictEqual(testDoor.getDirection(), testDirection);
    });

    it('test ValidEnterPosition check', function () {
        var testIllegalPositions = TestUtil.randomPositionList();
        var testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection);
        testIllegalPositions.forEach((position) => {
            expect(testDoor.isValidEnterPosition(position)).to.be.false;
        });
        testEnterPositions.forEach((position) => {
            expect(testDoor.isValidEnterPosition(position)).to.be.true;
        });
    });

    it('test ValidEnterPositionWithoutClick check', function () {
        var illegalPos = TestUtil.randomPosition();
        var illegalDir = TestUtil.randomObjectValue(Direction);

        var testIllegalPosition = {
            position: illegalPos,
            direction: illegalDir
        }

        var testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection);
        expect(testDoor.isValidEnterPositionWithoutClick(testIllegalPosition.position, testIllegalPosition.direction)).to.be.false;
        expect(testDoor.isValidEnterPositionWithoutClick(testEnterPosition.position, testEnterPosition.direction)).to.be.true;
    });

});


