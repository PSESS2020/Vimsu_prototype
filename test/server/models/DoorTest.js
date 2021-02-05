const Door = require('../../../src/game/app/server/models/Door.js');
const TypeOfDoor = require('../../../src/game/app/client/shared/TypeOfDoor.js');
const Direction = require('../../../src/game/app/client/shared/Direction.js');
const TestUtil = require('./utils/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');
const { Test } = require('mocha');
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
        testDoorId = TestUtil.randomString();
        testDoorType = TestUtil.randomObjectValue(TypeOfDoor);
        testDoorName = TestUtil.randomString();
        testMapPosition = TestUtil.randomPosition();
        testEnterPos = TestUtil.randomPosition();
        testEnterDirection = TestUtil.randomObjectValue(Direction);
        testEnterPositions = TestUtil.randomPositionList();
        testTargetPosition = TestUtil.randomPosition();
        testDirection = TestUtil.randomObjectValue(Direction);
        testIsOpen = TestUtil.randomBool();
        testClosedMessage = { header: TestUtil.randomString(), body: TestUtil.randomString() };

        testEnterPosition = {
            position: testEnterPos,
            direction: testEnterDirection
        }
    });

    it('test non-lecture Door constructor', function () {

        testDoorType = TypeOfDoor.LEFT_DOOR;

        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            undefined, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, undefined, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, undefined, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, undefined, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, undefined, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, undefined)).to.throw(TypeError);

        testDoorType = TypeOfDoor.RIGHT_DOOR;

        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            undefined, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, undefined, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, undefined, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, undefined, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, undefined, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, undefined)).to.throw(TypeError);
    });



    it('test LectureDoor constructor', function () {
        testDoorType = TypeOfDoor.LECTURE_DOOR;
        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            undefined, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, undefined, testTargetPosition, testDirection, testIsOpen, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, undefined, testDirection, testIsOpen, testClosedMessage)).not.to.throw();
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, undefined, testIsOpen, testClosedMessage)).not.to.throw();
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, undefined, testClosedMessage)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, undefined)).to.throw(TypeError);
    });

    it('test getters', function () {
        var testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage);
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
        assert.strictEqual(testDoor.getClosedMessage(), testClosedMessage);
    });

    it('test ValidEnterPosition check', function () {
        var testIllegalPositions = TestUtil.randomPositionList();
        var testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage);
        testIllegalPositions.forEach((position) => {
            expect(testDoor.isValidEnterPosition(position)).to.be.false;
        });
        testEnterPositions.forEach((position) => {
            expect(testDoor.isValidEnterPosition(position)).to.be.true;
        });
    });

    it('test ValidEnterPositionWithoutClick check', function () {
        var illegalPos = TestUtil.randomPosition();
        var illegalOldDir = TestUtil.randomObjectValue(Direction);
        var illegalNewDir = TestUtil.randomObjectValue(Direction);

        var testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition,
            testEnterPosition, testEnterPositions, testTargetPosition, testDirection, testIsOpen, testClosedMessage);
        expect(testDoor.isValidEnterPositionWithoutClick(illegalPos, illegalOldDir, illegalNewDir)).to.be.false;
        expect(testDoor.isValidEnterPositionWithoutClick(testEnterPosition.position, testEnterPosition.direction, testEnterPosition.direction)).to.be.true;
    });

    it('test isOpen, open and close Door', function () {
        let testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition, testEnterPosition, testEnterPositions, testTargetPosition, testDirection, true, testClosedMessage);

        let ppantID = TestUtil.randomString();

        //Door should be open by default for everyone
        expect(testDoor.isOpen()).to.be.true;
        expect(testDoor.isOpenFor(ppantID)).to.be.true;

        testDoor.closeDoor();

        //Door should be now closed for everyone
        expect(testDoor.isOpen()).to.be.false;
        expect(testDoor.isOpenFor(ppantID)).to.be.false;

        testDoor.openDoorFor(ppantID);

        //Door should be now open for ppant with ppantID
        expect(testDoor.isOpenFor(ppantID)).to.be.true;

        testDoor.closeDoorFor(ppantID);

        //Door should be now closed for ppant with ppantID
        expect(testDoor.isOpenFor(ppantID)).to.be.false;

        testDoor.openDoorFor(ppantID);

        //Door should be now open again for ppant with this ppantID
        expect(testDoor.isOpenFor(ppantID)).to.be.true;

        testDoor.openDoor();

        //Door should be now open for everyone
        expect(testDoor.isOpen()).to.be.true;
        expect(testDoor.isOpenFor(ppantID)).to.be.true;
    });

});


