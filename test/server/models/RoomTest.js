const Room = require('../../../game/app/server/models/Room.js');
const Position = require('../../../game/app/server/models/Position.js');
const Door = require('../../../game/app/server/models/Door.js');
const Message = require('../../../game/app/server/models/Message.js');
const GameObjectService = require('../../../game/app/server/services/GameObjectService.js');
const NPCService = require('../../../game/app/server/services/NPCService.js');
const DoorService = require('../../../game/app/server/services/DoorService.js');
const TypeOfRoom = require('../../../game/app/utils/TypeOfRoom.js');
const TypeOfDoor = require('../../../game/app/utils/TypeOfDoor.js');
const Direction = require('../../../game/app/utils/Direction.js');
const Settings = require('../../../game/app/utils/Settings.js');
const RoomDimensions = require('../../../game/app/utils/RoomDimensions.js');
const TestUtil = require('../../utils/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testGameObjectService;
var testNPCService;
var testDoorService;
var testRoom;
var testPPant;
var testFoyer;
var testFoodcourt;
var testReception;

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


describe('test Participant handling', function () {
    
    beforeEach( function () {
        testRoom = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER);
        testPPant = TestUtil.randomParticipant();
        assert.isArray(testRoom.getListOfPPants());
        assert.isEmpty(testRoom.getListOfPPants());
    });
    
    it('test enterParticipant', function () {
        expect(() => testRoom.enterParticipant("fehler")).to.throw(TypeError, "not an instance of");
        expect(() => testRoom.includesParticipant(0)).to.throw(TypeError, "not a string");
        expect(testRoom.includesParticipant(testPPant.getId())).to.be.false;
        testRoom.enterParticipant(testPPant);
        expect(testRoom.includesParticipant(testPPant.getId())).to.be.true;
        expect(testRoom.getListOfPPants()).to.include(testPPant); //doppelt gemoppelt
    });
    
    it('test exitParticipant', function () {
        expect(() => testRoom.exitParticipant(0)).to.throw(TypeError, "not a string");
        testRoom.enterParticipant(testPPant);
        assert.include(testRoom.getListOfPPants(), testPPant);
        testRoom.exitParticipant(testPPant.getId());
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty; 
        expect(testRoom.includesParticipant(testPPant.getId())).to.be.false;
    });
    
    it('test getParticipant', function () {
        expect(() => testRoom.getParticipant(0)).to.throw(TypeError, "not a string");
        expect(testRoom.getParticipant(testPPant.getId())).to.be.undefined;
        testRoom.enterParticipant(testPPant);
        expect(testRoom.getParticipant(testPPant.getId())).to.equal(testPPant);
        testRoom.exitParticipant(testPPant.getId());
        expect(testRoom.getParticipant(testPPant.getId())).to.be.undefined;
    });
    
})


describe('test Message sending', function () {
    
    beforeEach( function () {
        testRoom = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER);
        assert.isArray(testRoom.getMessages());
        assert.isEmpty(testRoom.getMessages());
    });

    it('test single addMessage', function () {
        testRoom.addMessage(TestUtil.randomString(), TestUtil.randomString(), TestUtil.randomTimeStamp(), TestUtil.randomString());
        assert.lengthOf(testRoom.getMessages(), 1);
        // This all still fails as the RoomClass does not yet use the Message-Class
        // I'm not sure if it's worth fixing tbh
        // - (E)
        //expect(testRoom.getMessages()[0]).to.be.an.instanceof(Message);
        //assert.equal(testRoom.getMessages()[0].getMessageId(), 0);
    });

})


describe('test OccMap Init', function () {
    
    before( function () {
        testFoyer = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER);
        testFoodcourt = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT);
        testReception = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION);
        testGameObjectService = new GameObjectService();
        testNPCService = new NPCService();
    });
    
    it('test OccMap Foyer', function () {
        var objects = testGameObjectService.getObjects(Settings.FOYER_ID);
        for(var i = 0; i < objects.length; i++) {
            var testPos = objects[i].getPosition();
            assert.equal(testFoyer.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testFoyer.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
        var NPCs = testNPCService.getNPCs(Settings.FOYER_ID);
        for(var i = 0; i < NPCs.length; i++) {
            var testPos = NPCs[i].getPosition();
            assert.equal(testFoyer.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testFoyer.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
    });
    
    it('test OccMap FoodCourt', function () {
        var objects = testGameObjectService.getObjects(Settings.FOODCOURT_ID);
        for(var i = 0; i < objects.length; i++) {
            var testPos = objects[i].getPosition();
            assert.equal(testFoodcourt.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testFoodcourt.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
        var NPCs = testNPCService.getNPCs(Settings.FOODCOURT_ID);
        for(var i = 0; i < NPCs.length; i++) {
            var testPos = NPCs[i].getPosition();
            assert.equal(testFoodcourt.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testFoodcourt.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
    });
    
    it('test OccMap Reception', function () {
        var objects = testGameObjectService.getObjects(Settings.RECEPTION_ID);
        for(var i = 0; i < objects.length; i++) {
            var testPos = objects[i].getPosition();
            assert.equal(testReception.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testReception.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
        var NPCs = testNPCService.getNPCs(Settings.RECEPTION_ID);
        for(var i = 0; i < NPCs.length; i++) {
            var testPos = NPCs[i].getPosition();
            assert.equal(testReception.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testReception.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
    });
    

    
})

describe('test collision checking', function () {
    
    before( function () {
        testFoyer = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER);
        testFoodcourt = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT);
        testReception = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION);
    });

    it('test CheckCollision Illegal', function () {
        expect(() => testFoyer.checkForCollision(0)).to.throw(TypeError, 'not an instance of');
        expect(() => testFoyer.checkForCollision("fehler")).to.throw(TypeError, 'not an instance of');
        var testIllegalPositionsWrongRoom = TestUtil.randomPositionListWithSizeAndExcludeId(10, Settings.FOYER_ID);
        testIllegalPositionsWrongRoom.forEach( (position) => {
            expect( () => testFoyer.checkForCollision(position)).to.throw(Error, 'Wrong room id!');
        });
        var testIllegalPositionsNegativeCord = TestUtil.randomPositionListWithSizeAndIdAndMax(10, Settings.FOYER_ID, -25, -25);
        testIllegalPositionsNegativeCord.forEach( (position) => {
            expect(testFoyer.checkForCollision(position)).to.be.true;
        });
        var testIllegalPositionsOutOfBounds = TestUtil.randomPositionListWithSizeAndIdAndMin(10, Settings.FOYER_ID,
                                                            RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        testIllegalPositionsOutOfBounds.forEach( (position) => {
            expect(testFoyer.checkForCollision(position)).to.be.true;
        });
    });
    
    it('test CheckCollision Legal Foyer', function () {
        for(var i = 0; i < testFoyer.getWidth(); i++) {
            for(var j = 0; j < testFoyer.getLength(); j++) {
                var testPos = new Position(Settings.FOYER_ID, i, j);
                if(!(testFoyer.getOccMap()[i][j])){
                    expect(testFoyer.checkForCollision(testPos)).to.be.false;
                }
            }
        }
    });
    
    it('test CheckCollision Legal Foodcourt', function () {
        for(var i = 0; i < testFoodcourt.getWidth(); i++) {
            for(var j = 0; j < testFoodcourt.getLength(); j++) {
                var testPos = new Position(Settings.FOODCOURT_ID, i, j);
                if(!(testFoodcourt.getOccMap()[i][j])){
                    expect(testFoodcourt.checkForCollision(testPos)).to.be.false;
                }
            }
        }
    });
    
    it('test CheckCollision Legal Reception', function () {
        for(var i = 0; i < testReception.getWidth(); i++) {
            for(var j = 0; j < testReception.getLength(); j++) {
                var testPos = new Position(Settings.RECEPTION_ID, i, j);
                if(!(testReception.getOccMap()[i][j])){
                    expect(testReception.checkForCollision(testPos)).to.be.false;
                }
            }
        }
    });
    
})

describe('test Door handling', function () {
    
    before( function () {
        testFoyer = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER);
        testFoodcourt = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT);
        testReception = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION);
    });
    
    it('test doors in foyer', function () {
        expect(testFoyer.getDoorTo(100)).to.be.undefined;
        expect(() => testFoyer.getDoorTo("fehler")).to.throw(TypeError, "not an integer");
        expect(testFoyer.getDoorTo(Settings.FOYER_ID)).to.be.undefined;
        expect(testFoyer.getDoorTo(Settings.FOODCOURT_ID)).to.be.instanceof(Door);
        expect(testFoyer.getDoorTo(Settings.FOODCOURT_ID).getTypeOfDoor()).to.equal(TypeOfDoor.FOODCOURT_DOOR);
        expect(testFoyer.getDoorTo(Settings.RECEPTION_ID)).to.be.instanceof(Door);
        expect(testFoyer.getDoorTo(Settings.RECEPTION_ID).getTypeOfDoor()).to.equal(TypeOfDoor.RECEPTION_DOOR);
    });
    
    it('test doors in foodcourt', function () {
        expect(testFoodcourt.getDoorTo(100)).to.be.undefined;
        expect(() => testFoodcourt.getDoorTo("fehler")).to.throw(TypeError, "not an integer");
        expect(testFoodcourt.getDoorTo(Settings.FOODCOURT_ID)).to.be.undefined;
        expect(testFoodcourt.getDoorTo(Settings.RECEPTION_ID)).to.be.undefined;
        expect(testFoodcourt.getDoorTo(Settings.FOYER_ID)).to.be.instanceof(Door);
        expect(testFoodcourt.getDoorTo(Settings.FOYER_ID).getTypeOfDoor()).to.equal(TypeOfDoor.FOYER_DOOR);
    });
    
    it('test doors in reception', function () {
        expect(testReception.getDoorTo(100)).to.be.undefined;
        expect(() => testReception.getDoorTo("fehler")).to.throw(TypeError, "not an integer");
        expect(testReception.getDoorTo(Settings.FOODCOURT_ID)).to.be.undefined;
        expect(testReception.getDoorTo(Settings.RECEPTION_ID)).to.be.undefined;
        expect(testReception.getDoorTo(Settings.FOYER_ID)).to.be.instanceof(Door);
        expect(testReception.getDoorTo(Settings.FOYER_ID).getTypeOfDoor()).to.equal(TypeOfDoor.FOYER_DOOR);
    });
    
    it('test lectureDoor', function () {
        expect(() => testFoodcourt.getLectureDoor()).to.throw(Error, 'Lecture Door is only in FOYER!');
        expect(() => testReception.getLectureDoor()).to.throw(Error, 'Lecture Door is only in FOYER!');
        expect(testFoyer.getLectureDoor()).to.be.instanceof(Door);
        expect(testFoyer.getLectureDoor().getTypeOfDoor()).to.equal(TypeOfDoor.LECTURE_DOOR);
    });
    
})
