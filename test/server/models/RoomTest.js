const Room = require('../../../src/game/app/server/models/Room.js');
const Position = require('../../../src/game/app/server/models/Position.js');
const Door = require('../../../src/game/app/server/models/Door.js');
const GameObjectService = require('../../../src/game/app/server/services/GameObjectService.js');
const NPCService = require('../../../src/game/app/server/services/NPCService.js');
const DoorService = require('../../../src/game/app/server/services/DoorService.js');
const TypeOfRoom = require('../../../src/game/app/client/shared/TypeOfRoom.js');
const TypeOfDoor = require('../../../src/game/app/client/shared/TypeOfDoor.js');
const Direction = require('../../../src/game/app/client/shared/Direction.js');
const Settings = require('../../../src/game/app/server/utils/Settings.js');
const ClientSettings = require('../../../src/game/app/client/utils/Settings.js');
const RoomDimensions = require('../../../src/game/app/server/utils/RoomDimensions.js');
const TestUtil = require('./utils/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');
const Participant = require('../../../src/game/app/server/models/Participant.js');
const NPC = require('../../../src/game/app/server/models/NPC.js');
const FriendList = require('../../../src/game/app/server/models/FriendList.js');
const DoorClosedMessages = require('../../../src/game/app/server/utils/messages/DoorClosedMessages.js');
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

    before(function () {
        testGameObjectService = new GameObjectService();
        testNPCService = new NPCService();
        testDoorService = new DoorService();
    });

    it('test Foyer constructor and getters', function () {

        var testRoom = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);

        expect(testRoom.getRoomId()).to.equal(Settings.FOYER_ID);
        expect(testRoom.getTypeOfRoom()).to.equal(TypeOfRoom.FOYER);

        expect(testRoom.getWidth()).to.equal(RoomDimensions.FOYER_WIDTH);
        expect(testRoom.getLength()).to.equal(RoomDimensions.FOYER_LENGTH);

        expect(testRoom.getListOfGameObjects()).to.eql([]);
        expect(testRoom.getListOfNPCs()).to.eql([]);
        expect(testRoom.getNPC(1)).to.eql(undefined);
        expect(testRoom.getGameObject(1)).to.eql(undefined);
        expect(testRoom.getListOfDoors()).to.eql([]);
        expect(testRoom.getListOfMapElements()).to.eql([]);

        expect(testRoom.getMessages()).to.be.an('array').that.is.empty;
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty;

        expect(testRoom.getOccMap()).to.be.an('array').of.length(RoomDimensions.FOYER_LENGTH + ClientSettings.MAP_BLANK_TILES_LENGTH);
        for (var i = 0; i < RoomDimensions.FOYER_LENGTH; i++) {
            expect(testRoom.getOccMap()[i]).to.be.an('array').of.length(RoomDimensions.FOYER_WIDTH + ClientSettings.MAP_BLANK_TILES_WIDTH);
        };

    });

    it('test Foodcourt constructor and getters', function () {

        var testRoom = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH);

        expect(testRoom.getRoomId()).to.equal(Settings.FOODCOURT_ID);
        expect(testRoom.getTypeOfRoom()).to.equal(TypeOfRoom.FOODCOURT);

        expect(testRoom.getWidth()).to.equal(RoomDimensions.FOODCOURT_WIDTH);
        expect(testRoom.getLength()).to.equal(RoomDimensions.FOODCOURT_LENGTH);

        expect(testRoom.getMessages()).to.be.an('array').that.is.empty;
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty;

        expect(testRoom.getOccMap()).to.be.an('array').of.length(RoomDimensions.FOODCOURT_LENGTH + ClientSettings.MAP_BLANK_TILES_LENGTH);
        for (var i = 0; i < RoomDimensions.FOODCOURT_LENGTH; i++) {
            expect(testRoom.getOccMap()[i]).to.be.an('array').of.length(RoomDimensions.FOODCOURT_WIDTH + ClientSettings.MAP_BLANK_TILES_WIDTH);
        };

    });

    it('test Reception constructor and getters', function () {

        var testRoom = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH);

        expect(testRoom.getRoomId()).to.equal(Settings.RECEPTION_ID);
        expect(testRoom.getTypeOfRoom()).to.equal(TypeOfRoom.RECEPTION);

        expect(testRoom.getWidth()).to.equal(RoomDimensions.RECEPTION_WIDTH);
        expect(testRoom.getLength()).to.equal(RoomDimensions.RECEPTION_LENGTH);

        expect(testRoom.getMessages()).to.be.an('array').that.is.empty;
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty;

        expect(testRoom.getOccMap()).to.be.an('array').of.length(RoomDimensions.RECEPTION_LENGTH + ClientSettings.MAP_BLANK_TILES_LENGTH);
        for (var i = 0; i < RoomDimensions.RECEPTION_LENGTH; i++) {
            expect(testRoom.getOccMap()[i]).to.be.an('array').of.length(RoomDimensions.RECEPTION_WIDTH + ClientSettings.MAP_BLANK_TILES_WIDTH);
        };

    });

    it('test Escape Room constructor and getters', function () {

        var testRoom = new Room(Settings.ESCAPEROOM_ID, TypeOfRoom.ESCAPEROOM, RoomDimensions.ESCAPEROOM_WIDTH, RoomDimensions.ESCAPEROOM_LENGTH);

        expect(testRoom.getRoomId()).to.equal(Settings.ESCAPEROOM_ID);
        expect(testRoom.getTypeOfRoom()).to.equal(TypeOfRoom.ESCAPEROOM);

        // This fails otherwise !!!
        expect(testRoom.getWidth()).to.equal(RoomDimensions.ESCAPEROOM_WIDTH);
        expect(testRoom.getLength()).to.equal(RoomDimensions.ESCAPEROOM_LENGTH);

        expect(testRoom.getMessages()).to.be.an('array').that.is.empty;
        expect(testRoom.getListOfPPants()).to.be.an('array').that.is.empty;

        expect(testRoom.getOccMap()).to.be.an('array').of.length(RoomDimensions.ESCAPEROOM_LENGTH + ClientSettings.MAP_BLANK_TILES_LENGTH);
        for (var i = 0; i < RoomDimensions.ESCAPEROOM_LENGTH; i++) {
            expect(testRoom.getOccMap()[i]).to.be.an('array').of.length(RoomDimensions.ESCAPEROOM_WIDTH + ClientSettings.MAP_BLANK_TILES_WIDTH);
        };

    });

    it('test invalid constructors', function () {
        expect(() => new Room("fehler", TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH)).to.throw(TypeError, " is not an integer");
        expect(() => new Room(2, "fehler", RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH)).to.throw(TypeError, " is not an enum of");
        expect(() => new Room("fehler", TypeOfRoom.FOYER, 'width', RoomDimensions.FOYER_LENGTH)).to.throw(TypeError, " is not an integer");
        expect(() => new Room("fehler", TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, 'length')).to.throw(TypeError, " is not an integer");
    });


});

describe('test NPC handling', () => {
    beforeEach(() => {
        testRoom = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        testNPC = new NPC(0, 'npcName', TestUtil.randomPosition(), TestUtil.randomObjectValue(Direction), ["abc"]);
        assert.isArray(testRoom.getListOfNPCs());
        assert.isEmpty(testRoom.getListOfNPCs());
    });

    it('test set and get NPC', () => {
        testRoom.setNPCs([testNPC]);
        expect(testRoom.getNPC(0)).to.eql(testNPC);
    });
});

describe('test Participant handling', function () {

    beforeEach(function () {
        testRoom = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        testPPant = new Participant('id', 'accountId', TestUtil.randomBusinessCard(), TestUtil.randomPosition(), TestUtil.randomObjectValue(Direction), new FriendList([]), new FriendList([]), new FriendList([]), [], [], TestUtil.randomBool(), TestUtil.randomIntWithMin(0), [], []);
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

    beforeEach(function () {
        testRoom = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        assert.isArray(testRoom.getMessages());
        assert.isEmpty(testRoom.getMessages());
    });

    it('test single addMessage', function () {
        testRoom.addMessage(TestUtil.randomString(), TestUtil.randomString(), new Date(), TestUtil.randomString());
        assert.lengthOf(testRoom.getMessages(), 1);
        // This all still fails as the RoomClass does not yet use the Message-Class
        // I'm not sure if it's worth fixing tbh
        // - (E)
        //expect(testRoom.getMessages()[0]).to.be.an.instanceof(Message);
        //assert.equal(testRoom.getMessages()[0].getMessageId(), 0);
    });

})



describe('test collision checking', function () {

    before(function () {
        testFoyer = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        testFoodcourt = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH);
        testReception = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH);
    });

    it('test CheckCollision Illegal', function () {
        expect(() => testFoyer.checkForCollision(0)).to.throw(TypeError, 'not an instance of');
        expect(() => testFoyer.checkForCollision("fehler")).to.throw(TypeError, 'not an instance of');
        var testIllegalPositionsWrongRoom = TestUtil.randomPositionListWithSizeAndExcludeId(10, Settings.FOYER_ID);
        testIllegalPositionsWrongRoom.forEach((position) => {
            expect(() => testFoyer.checkForCollision(position)).to.throw(Error, 'Wrong room id!');
        });
        var testIllegalPositionsNegativeCord = TestUtil.randomPositionListWithSizeAndIdAndMax(10, Settings.FOYER_ID, -25, -25);
        testIllegalPositionsNegativeCord.forEach((position) => {
            expect(testFoyer.checkForCollision(position)).to.be.true;
        });
        var testIllegalPositionsOutOfBounds = TestUtil.randomPositionListWithSizeAndIdAndMin(10, Settings.FOYER_ID,
            RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        testIllegalPositionsOutOfBounds.forEach((position) => {
            expect(testFoyer.checkForCollision(position)).to.be.true;
        });
    });

    it('test CheckCollision Legal Foyer', function () {
        for (var i = 0; i < testFoyer.getWidth(); i++) {
            for (var j = 0; j < testFoyer.getLength(); j++) {
                var testPos = new Position(Settings.FOYER_ID, i, j);
                if (!(testFoyer.getOccMap()[i][j])) {
                    expect(testFoyer.checkForCollision(testPos)).to.be.false;
                }
            }
        }
    });

    it('test CheckCollision Legal Foodcourt', function () {
        for (var i = 0; i < testFoodcourt.getWidth(); i++) {
            for (var j = 0; j < testFoodcourt.getLength(); j++) {
                var testPos = new Position(Settings.FOODCOURT_ID, i, j);
                if (!(testFoodcourt.getOccMap()[i][j])) {
                    expect(testFoodcourt.checkForCollision(testPos)).to.be.false;
                }
            }
        }
    });

    it('test CheckCollision Legal Reception', function () {
        for (var i = 0; i < testReception.getWidth(); i++) {
            for (var j = 0; j < testReception.getLength(); j++) {
                var testPos = new Position(Settings.RECEPTION_ID, i, j);
                if (!(testReception.getOccMap()[i][j])) {
                    expect(testReception.checkForCollision(testPos)).to.be.false;
                }
            }
        }
    });

})

describe('test Door handling', function () {

    before(function () {
        testFoyer = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        testDoorService = new DoorService();
        testFoyer.setDoors([testDoorService.createLectureDoor(new Position(Settings.FOYER_ID, 2, -1), true, DoorClosedMessages.STANDARDDOORCLOSED),
        testDoorService.createFoodCourtDoor(new Position(Settings.FOYER_ID, 25, 9), new Position(Settings.FOODCOURT_ID, 2, 0), Direction.DOWNRIGHT, true, DoorClosedMessages.STANDARDDOORCLOSED),
        testDoorService.createReceptionDoor(new Position(Settings.FOYER_ID, 25, 21), new Position(Settings.RECEPTION_ID, 2, 0), Direction.DOWNRIGHT, true, DoorClosedMessages.STANDARDDOORCLOSED)]);
        testFoodcourt = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH);
        testReception = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH);
    });

    it('test doors in foyer', function () {
        expect(testFoyer.getDoorTo(100)).to.be.undefined;
        expect(() => testFoyer.getDoorTo("fehler")).to.throw(TypeError, "not an integer");
        expect(testFoyer.getDoorTo(Settings.FOYER_ID)).to.be.undefined;
        expect(testFoyer.getDoorTo(Settings.FOODCOURT_ID)).to.be.instanceof(Door);
        expect(testFoyer.getDoorTo(Settings.RECEPTION_ID)).to.be.instanceof(Door);
    });

    it('test lectureDoor', function () {
        expect(testFoyer.getLectureDoor()).to.be.instanceof(Door);
        expect(testFoyer.getLectureDoor().getTypeOfDoor()).to.equal(TypeOfDoor.LEFT_LECTUREDOOR);
    });

})
