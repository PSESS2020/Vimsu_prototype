const { expect } = require('chai');
const DoorService = require('../../../game/app/server/services/DoorService.js');
const Door = require('../../../game/app/server/models/Door.js');
const Settings = require('../../../game/app/client/shared/Settings.js');
const TypeOfDoor = require('../../../game/app/client/shared/TypeOfDoor.js');


//Test data
var initDoorService = new DoorService();
//called twice to cover singleton constructor
var doorService = new DoorService();
var foyerID = Settings.FOYER_ID;
var foodCourtID = Settings.FOODCOURT_ID;
var receptionID = Settings.RECEPTION_ID;
var validDoorId = 1;
var invalidDoorId = 42;
var typeOfDoor = TypeOfDoor.FOODCOURT_DOOR;

describe('DoorServiceTest getter', function () {
    it('test getDoors Foyer', function() {
        let foyerDoors = doorService.getDoors(foyerID);
        expect(foyerDoors).to.be.an('array').and.to.have.lengthOf(3);
        foyerDoors.forEach(door => {
            expect(door).to.be.instanceOf(Door);
        });
    });

    it('test getDoors Reception', function() {
        let receptionDoors = doorService.getDoors(receptionID);
        expect(receptionDoors).to.be.an('array').and.to.have.lengthOf(1);
        receptionDoors.forEach(door => {
            expect(door).to.be.instanceOf(Door);
        });
    });

    it('test getDoors FoodCourt', function() {
        let foodCourtDoors = doorService.getDoors(foodCourtID);
        expect(foodCourtDoors).to.be.an('array').and.to.have.lengthOf(1);
        foodCourtDoors.forEach(door => {
            expect(door).to.be.instanceOf(Door);
        });
    });

    it('test getDoor valid', function() {
        expect(doorService.getDoor(validDoorId).getTypeOfDoor()).equal(typeOfDoor);
    });

    it('test getDoor invalid', function() {
        expect(() => doorService.getDoor(invalidDoorId)).to.throw(Error);
    });
});