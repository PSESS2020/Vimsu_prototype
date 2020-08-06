const Room = require('../../../game/app/server/models/Room.js');
const Position = require('../../../game/app/server/models/Position.js');
const GameObjectService = require('../../../game/app/server/services/GameObjectService.js');
const NPCService = require('../../../game/app/server/services/NPCService.js');
const DoorService = require('../../../game/app/server/services/DoorService.js');
const TypeOfRoom = require('../../../game/app/utils/TypeOfRoom.js');
const Direction = require('../../../game/app/utils/Direction.js');
const Settings = require('../../../game/app/utils/Settings.js');
const RoomDimensions = require('../../../game/app/utils/RoomDimensions.js');
const TestUtil = require('./TestData/TestUtil.js')
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testGameObjectService;
var testNPCService;
var testDoorService;

describe('test Room Constructor and getters', function () {
    
    before( function () {
        testGameObjectService = new GameObjectService();
        testNPCService = new NPCService();
        testDoorService = new DoorService();
    });
    
    it('test Foyer constructor and getters', function () {
        
        var testRoom = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER);
        
        expect(testRoom.getRoomId()).to.equal(Settings.FOYER_ID);
        expect(testRoom.getTypeOfRoom()).to.equal(TypeOfRoom.FOYER);
        
        expect(testRoom.getWidth()).to.equal(RoomDimensions.FOYER_WIDTH);
        expect(testRoom.getLength()).to.equal(RoomDimensions.FOYER_LENGTH);
        
        expect(testRoom.getListOfGameObjects()).to.eql(testGameObjectService.getObjects(Settings.FOYER_ID));
        expect(testRoom.getListOfNPCs()).to.eql(testNPCService.getNPCs(Settings.FOYER_ID));
        expect(testRoom.getListOfDoors()).to.eql(testDoorService.getDoors(Settings.FOYER_ID));
        
        expect(testRoom.getMessages()).to.be.an('array').that.is.empty;
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty;  
        
        expect(testRoom.getOccMap()).to.be.an('array').of.length(RoomDimensions.FOYER_WIDTH);
        for (var i = 0; i < RoomDimensions.FOYER_WIDTH; i++) {
            expect(testRoom.getOccMap()[i]).to.be.an('array').of.length(RoomDimensions.FOYER_LENGTH);
        };
        
    });
    
    it('test Foodcourt constructor and getters', function() {
        
        var testRoom = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT);
        
        expect(testRoom.getRoomId()).to.equal(Settings.FOODCOURT_ID);
        expect(testRoom.getTypeOfRoom()).to.equal(TypeOfRoom.FOODCOURT);
        
        expect(testRoom.getWidth()).to.equal(RoomDimensions.FOODCOURT_WIDTH);
        expect(testRoom.getLength()).to.equal(RoomDimensions.FOODCOURT_LENGTH);
        
        expect(testRoom.getListOfGameObjects()).to.eql(testGameObjectService.getObjects(Settings.FOODCOURT_ID));
        expect(testRoom.getListOfNPCs()).to.eql(testNPCService.getNPCs(Settings.FOODCOURT_ID));
        expect(testRoom.getListOfDoors()).to.eql(testDoorService.getDoors(Settings.FOODCOURT_ID));
        
        expect(testRoom.getMessages()).to.be.an('array').that.is.empty;
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty;
          
        expect(testRoom.getOccMap()).to.be.an('array').of.length(RoomDimensions.FOODCOURT_WIDTH);
        for (var i = 0; i < RoomDimensions.FOODCOURT_WIDTH; i++) {
            expect(testRoom.getOccMap()[i]).to.be.an('array').of.length(RoomDimensions.FOODCOURT_LENGTH);
        };
        
    });
    
    it('test Reception constructor and getters', function () {
        
        var testRoom = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION);
        
        expect(testRoom.getRoomId()).to.equal(Settings.RECEPTION_ID);
        expect(testRoom.getTypeOfRoom()).to.equal(TypeOfRoom.RECEPTION);
        
        expect(testRoom.getWidth()).to.equal(RoomDimensions.RECEPTION_WIDTH);
        expect(testRoom.getLength()).to.equal(RoomDimensions.RECEPTION_LENGTH);
        
        expect(testRoom.getListOfGameObjects()).to.eql(testGameObjectService.getObjects(Settings.RECEPTION_ID));
        expect(testRoom.getListOfNPCs()).to.eql(testNPCService.getNPCs(Settings.RECEPTION_ID));
        expect(testRoom.getListOfDoors()).to.eql(testDoorService.getDoors(Settings.RECEPTION_ID));
        
        expect(testRoom.getMessages()).to.be.an('array').that.is.empty;
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty; 
         
        expect(testRoom.getOccMap()).to.be.an('array').of.length(RoomDimensions.RECEPTION_WIDTH);
        for (var i = 0; i < RoomDimensions.RECEPTION_WIDTH; i++) {
            expect(testRoom.getOccMap()[i]).to.be.an('array').of.length(RoomDimensions.RECEPTION_LENGTH);
        };
        
    });
    
    it('test invalid constructors', function () {
        expect(() => new Room("fehler", TypeOfRoom.FOYER)).to.throw(TypeError, " is not an integer");
        expect(() => new Room(2, "fehler")).to.throw(TypeError, " is not an enum of");
        expect(() => new Room(100, TypeOfRoom.FOYER)).to.throw(Error, " no objects in this ");
    });
    
});

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
    * check that getDoorTo(roomID) is of TypeOfDoor.ROOM_DOOR
    getLectureDoor
    * check that this throws error from not foyer
    * check that is right TypeOfDoor
})*/
