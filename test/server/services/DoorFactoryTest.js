const { expect } = require('chai');
const DoorFactory = require('../../../src/game/app/server/models/factories/DoorFactory');
const Door = require('../../../src/game/app/server/models/mapobjects/Door');
const Position = require('../../../src/game/app/server/models/Position.js');
const TestUtil = require('../models/utils/TestUtil');
const Direction = require('../../../src/game/app/client/shared/Direction');


describe('DoorService test', function () {
    it('test create LectureDoor', function () {
        let doorService = new DoorFactory();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let mapPosition = new Position(roomId, cordX, cordY);
        let isOpen = TestUtil.randomBool();
        let closedMessage = { header: TestUtil.randomString(), body: TestUtil.randomString() };
        let lectureDoor = doorService.createLectureDoor(mapPosition, isOpen, closedMessage);

        let expectedEnterPositions = [];
        let lastEnterPosition;
        for (var i = mapPosition.getCordX() - 2; i <= mapPosition.getCordX() + 2; i++) {
            for (var j = mapPosition.getCordY() + 1; j <= mapPosition.getCordY() + 3; j++) {
                lastEnterPosition = new Position(roomId, i, j);
                expectedEnterPositions.push(new Position(roomId, i, j));
            }
        }

        expect(lectureDoor).to.be.instanceOf(Door);
        expect(lectureDoor.getMapPosition()).to.equal(mapPosition);
        expect(lectureDoor.getTargetPosition()).to.equal(undefined);
        expect(lectureDoor.getDirection()).to.equal(undefined);
        expect(lectureDoor.getEnterPositions()).to.eql(expectedEnterPositions);
        expect(lectureDoor.isValidEnterPosition(lastEnterPosition)).to.be.true;
        expect(lectureDoor.hasCodeToOpen()).to.be.false;
    });

    it('test create FoyerDoor', function () {
        let doorService = new DoorFactory();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let mapPosition = new Position(roomId, cordX, cordY);
        let targetPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let direction = Direction.DOWNRIGHT;
        let isOpen = TestUtil.randomBool();
        let closedMessage = { header: TestUtil.randomString(), body: TestUtil.randomString() };
        let foyerDoor = doorService.createFoyerDoor(mapPosition, targetPosition, direction, isOpen, closedMessage);

        let expectedEnterPositions = [];
        let lastEnterPosition;
        for (var i = mapPosition.getCordX() - 2; i <= mapPosition.getCordX() + 2; i++) {
            for (var j = mapPosition.getCordY() + 1; j <= mapPosition.getCordY() + 3; j++) {
                lastEnterPosition = new Position(roomId, i, j);
                expectedEnterPositions.push(new Position(roomId, i, j));
            }
        }

        expect(foyerDoor).to.be.instanceOf(Door);
        expect(foyerDoor.getMapPosition()).to.equal(mapPosition);
        expect(foyerDoor.getTargetPosition()).to.equal(targetPosition);
        expect(foyerDoor.getDirection()).to.equal(direction);
        expect(foyerDoor.getEnterPositions()).to.eql(expectedEnterPositions);
        expect(foyerDoor.isValidEnterPosition(lastEnterPosition)).to.be.true;
        expect(foyerDoor.hasCodeToOpen()).to.be.false;
    });

    it('test create FoodCourtDoor', function () {
        let doorService = new DoorFactory();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let mapPosition = new Position(roomId, cordX, cordY);
        let targetPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let direction = Direction.DOWNRIGHT;
        let isOpen = TestUtil.randomBool();
        let closedMessage = { header: TestUtil.randomString(), body: TestUtil.randomString() };
        let foodCourtDoor = doorService.createFoodCourtDoor(mapPosition, targetPosition, direction, isOpen, closedMessage);

        let expectedEnterPositions = [];
        let lastEnterPosition;
        for (var i = mapPosition.getCordX() - 3; i <= mapPosition.getCordX() - 1; i++) {
            for (var j = mapPosition.getCordY() - 2; j <= mapPosition.getCordY() + 2; j++) {
                lastEnterPosition = new Position(roomId, i, j);
                expectedEnterPositions.push(new Position(roomId, i, j));
            }
        }

        expect(foodCourtDoor).to.be.instanceOf(Door);
        expect(foodCourtDoor.getMapPosition()).to.equal(mapPosition);
        expect(foodCourtDoor.getTargetPosition()).to.equal(targetPosition);
        expect(foodCourtDoor.getDirection()).to.equal(direction);
        expect(foodCourtDoor.getEnterPositions()).to.eql(expectedEnterPositions);
        expect(foodCourtDoor.isValidEnterPosition(lastEnterPosition)).to.be.true;
        expect(foodCourtDoor.hasCodeToOpen()).to.be.false;
    });

    it('test create ReceptionDoor', function () {
        let doorService = new DoorFactory();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let mapPosition = new Position(roomId, cordX, cordY);
        let targetPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let direction = Direction.DOWNRIGHT;
        let isOpen = TestUtil.randomBool();
        let closedMessage = { header: TestUtil.randomString(), body: TestUtil.randomString() };
        let receptionDoor = doorService.createReceptionDoor(mapPosition, targetPosition, direction, isOpen, closedMessage);

        let expectedEnterPositions = [];
        let lastEnterPosition;
        for (var i = mapPosition.getCordX() - 3; i <= mapPosition.getCordX() - 1; i++) {
            for (var j = mapPosition.getCordY() - 2; j <= mapPosition.getCordY() + 2; j++) {
                lastEnterPosition = new Position(roomId, i, j);
                expectedEnterPositions.push(new Position(roomId, i, j));
            }
        }

        expect(receptionDoor).to.be.instanceOf(Door);
        expect(receptionDoor.getMapPosition()).to.equal(mapPosition);
        expect(receptionDoor.getTargetPosition()).to.equal(targetPosition);
        expect(receptionDoor.getDirection()).to.equal(direction);
        expect(receptionDoor.getEnterPositions()).to.eql(expectedEnterPositions);
        expect(receptionDoor.isValidEnterPosition(lastEnterPosition)).to.be.true;
        expect(receptionDoor.hasCodeToOpen()).to.be.false;
    });

    it('test create EscapeRoomDoor', function () {
        let doorService = new DoorFactory();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let mapPosition = new Position(roomId, cordX, cordY);
        let targetPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let direction = Direction.DOWNRIGHT;
        let isOpen = TestUtil.randomBool();
        let closedMessage = { header: TestUtil.randomString(), body: TestUtil.randomString() };
        let codeToOpen = TestUtil.randomString();
        let escapeRoomDoor = doorService.createEscapeRoomDoor(mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen);

        let expectedEnterPositions = [];
        let lastEnterPosition;
        for (var i = mapPosition.getCordX() - 3; i <= mapPosition.getCordX() - 1; i++) {
            for (var j = mapPosition.getCordY() - 2; j <= mapPosition.getCordY() + 2; j++) {
                lastEnterPosition = new Position(roomId, i, j);
                expectedEnterPositions.push(new Position(roomId, i, j));
            }
        }

        expect(escapeRoomDoor).to.be.instanceOf(Door);
        expect(escapeRoomDoor.getMapPosition()).to.equal(mapPosition);
        expect(escapeRoomDoor.getTargetPosition()).to.equal(targetPosition);
        expect(escapeRoomDoor.getDirection()).to.equal(direction);
        expect(escapeRoomDoor.getEnterPositions()).to.eql(expectedEnterPositions);
        expect(escapeRoomDoor.isValidEnterPosition(lastEnterPosition)).to.be.true;
        expect(escapeRoomDoor.hasCodeToOpen()).to.be.true;
        expect(escapeRoomDoor.getCodeToOpen()).to.equal(codeToOpen);
    });

});