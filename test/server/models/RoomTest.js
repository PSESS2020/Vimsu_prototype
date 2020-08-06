const Room = require('../../../game/app/server/models/Room.js');
const Position = require('../../../game/app/server/models/Position.js');
const TypeOfRoom = require('../../../game/app/utils/TypeOfRoom.js');
const Direction = require('../../../game/app/utils/Direction.js');
const RoomDimensions = require('../../../game/app/utils/RoomDimensions.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testID;

describe('test Room Constructor', function () {
    
    beforeEach( function () {
        testID = Math.floor(Math.random() * 100000);
    });
    
    it('test Foyer constructor', function () {
        var testRoom = new Room(testID, TypeOfRoom.FOYER);
        expect(testRoom.getRoomId()).to.equal(testID);
        expect(testRoom.getTypeOfRoom()).to.equal(TypeOfRoom.FOYER);
        expect(testRoom.getWidth()).to.equal(RoomDimensions.FOYERWIDTH);
        expect(testRoom.getLength()).to.equal(RoomDimensions.FOYERLENGTH);
        expect(testRoom.getMessages()).to.be.an('array').that.is.empty;
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty;  
        expect(testRoom.getOccMap()).to.be.an('array').of.length(RoomDimensions.FOYERWIDTH);
        for (var i = 0; i < RoomDimensions.FOYERWIDTH; i++) {
            expect(testRoom.getOccMap()[i]).to.be.an('array').of.length(RoomDimensions.FOYERLENGTH);
            
        };
    });
    
    it('test Foodcourt constructor', function() {
        var testRoom = new Room(testID, TypeOfRoom.FOODCOURT);
    });
    
    it('test Reception constructor', function () {
        var testRoom = new Room(testID, TypeOfRoom.RECEPTION);
    });
    
})

describe('test Room getter functions', function () {
    it('test getRoomID');
    it('test getTypeOfRoom');
    it('test getMessages');
    it('test getWidth');
    it('test getLength');
    it('test getListOfPPants');
    it('test getListOfGameObjects');
    it('test getListOfNPCs');
    it('test getListOfDoors');
    it('test getOccMap');
})
/*
describe('test Participant handling', function () {
    enterParticipant
    exitParticipant
    includesParticipant
    getParticipant
})

describe('test Message sending', function () {
    addMessage    
})

describe('test Collision Detection', function () {
    checkForCollision
})

describe('test Door handling', function () {
    getDoorTo
    getLectureDoor
})*/
