const { expect } = require('chai');
const DoorService = require('../../../game/app/server/services/DoorService');
const Door = require('../../../game/app/server/models/Door');
const Position = require('../../../game/app/server/models/Position.js');
const Settings = require('../../../game/app/client/shared/Settings');
const TestUtil = require('../models/utils/TestUtil');
const Direction = require('../../../game/app/client/shared/Direction');


describe('DoorService test', function () {
    it('test create LectureDoor', function() {
        let doorService = new DoorService();
        let mapPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let enterPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let enterPositions = [enterPosition];
        let lectureDoor = doorService.createLectureDoor(mapPosition, enterPositions);
        
        expect(lectureDoor).to.be.instanceOf(Door);
        expect(lectureDoor.getMapPosition()).to.equal(mapPosition);
        expect(lectureDoor.getTargetPosition()).to.equal(undefined);
        expect(lectureDoor.getDirection()).to.equal(undefined);
        expect(lectureDoor.getEnterPositions()).to.equal(enterPositions);
        expect(lectureDoor.isValidEnterPosition(enterPosition)).to.be.true;
    });

    it('test create FoyerDoor', function() {
        let doorService = new DoorService();
        let mapPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let enterPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let enterPositions = [enterPosition];
        let targetPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let direction = Direction.DOWNRIGHT;
        let foyerDoor = doorService.createFoyerDoor(mapPosition, enterPositions, targetPosition, direction);

        expect(foyerDoor).to.be.instanceOf(Door);
        expect(foyerDoor.getMapPosition()).to.equal(mapPosition);
        expect(foyerDoor.getTargetPosition()).to.equal(targetPosition);
        expect(foyerDoor.getDirection()).to.equal(direction);
        expect(foyerDoor.getEnterPositions()).to.equal(enterPositions);
        expect(foyerDoor.isValidEnterPosition(enterPosition)).to.be.true;
    });

    it('test create FoodCourtDoor', function() {
        let doorService = new DoorService();
        let mapPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let enterPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let enterPositions = [enterPosition];
        let targetPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let direction = Direction.DOWNRIGHT;
        let foodCourtDoor = doorService.createFoodCourtDoor(mapPosition, enterPositions, targetPosition, direction);

        expect(foodCourtDoor).to.be.instanceOf(Door);
        expect(foodCourtDoor.getMapPosition()).to.equal(mapPosition);
        expect(foodCourtDoor.getTargetPosition()).to.equal(targetPosition);
        expect(foodCourtDoor.getDirection()).to.equal(direction);
        expect(foodCourtDoor.getEnterPositions()).to.equal(enterPositions);
        expect(foodCourtDoor.isValidEnterPosition(enterPosition)).to.be.true;
    });

    it('test create ReceptionDoor', function() {
        let doorService = new DoorService();
        let mapPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let enterPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let enterPositions = [enterPosition];
        let targetPosition = new Position(TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0), TestUtil.randomIntWithMin(0));
        let direction = Direction.DOWNRIGHT;
        let receptionDoor = doorService.createReceptionDoor(mapPosition, enterPositions, targetPosition, direction);

        expect(receptionDoor).to.be.instanceOf(Door);
        expect(receptionDoor.getMapPosition()).to.equal(mapPosition);
        expect(receptionDoor.getTargetPosition()).to.equal(targetPosition);
        expect(receptionDoor.getDirection()).to.equal(direction);
        expect(receptionDoor.getEnterPositions()).to.equal(enterPositions);
        expect(receptionDoor.isValidEnterPosition(enterPosition)).to.be.true;
    });
});