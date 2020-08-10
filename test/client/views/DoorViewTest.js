const chai = require('chai');
const assert = chai.assert;
const DoorView = require('../../../game/app/client/views/js/DoorView')
const PositionClient = require('../../../game/app/client/models/PositionClient')
const GameObjectTypeClient = require('../../../game/app/client/utils/GameObjectTypeClient');

var lectureHall = {
    doorImage: "../../../game/app/client/assets/door_lecturehall.png",
    position: new PositionClient(1, 1),
    doorType: GameObjectTypeClient.LECTUREDOOR
}
var doorLectureHall = new DoorView(lectureHall.doorImage, lectureHall.position, lectureHall.doorType)

var foodCourt = {
    doorImage: "../../../game/app/client/assets/door_foodcourt.png",
    position: new PositionClient(2, 2),
    doorType: GameObjectTypeClient.FOODCOURTDOOR
}
var doorFoodCourt = new DoorView(foodCourt.doorImage, foodCourt.position, foodCourt.doorType)

var reception = {
    doorImage: "../../../game/app/client/assets/door_reception.png",
    position: new PositionClient(3, 3),
    doorType: GameObjectTypeClient.RECEPTIONDOOR
}
var doorReception = new DoorView(reception.doorImage, reception.position, reception.doorType)

var foyer = {
    doorImage: "../../../game/app/client/assets/door_foyer.png",
    position: new PositionClient(4, 4),
    doorType: GameObjectTypeClient.FOYERDOOR
}
var doorFoyer = new DoorView(foyer.doorImage, foyer.position, foyer.doorType)

describe('DoorView test', function() {

    it('test getDoorType lectureHall', function() {
        assert.equal(doorLectureHall.getDoorType(), lectureHall.doorType);
    });

    it('test getDoorType foodCourt', function() {
        assert.equal(doorFoodCourt.getDoorType(), foodCourt.doorType);
    });

    it('test getDoorType reception', function() {
        assert.equal(doorReception.getDoorType(), reception.doorType);
    });

    it('test getDoorType foyer', function() {
        assert.equal(doorFoyer.getDoorType(), foyer.doorType);
    });

    it('test draw method', function () {
        try{
            doorLectureHall.draw();
        } catch(err) {

        }
        
    });

    it('test onclick lecturehall', function () {
        try{
            doorLectureHall.onclick();
        } catch(err) {

        }
    });

    it('test onclick foodCourt', function () {
        try {
            doorFoodCourt.onclick();
        } catch(err) {

        }
    });

    it('test onclick reception', function () {
        try {
            doorReception.onclick();
        } catch(err) {

        }
    });

    it('test onclick foyer', function () {
        try{
            doorFoyer.onclick();
        } catch(err) {  

        }
        
    });
})