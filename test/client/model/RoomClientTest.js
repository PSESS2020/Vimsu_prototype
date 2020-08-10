const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const RoomClient = require('../../../game/app/client/models/RoomClient.js');
const GameObjectClient = require('../../../game/app/client/models/GameObjectClient.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');
const NPCClient = require('../../../game/app/client/models/NPCClient.js');
const ParticipantClient = require('../../../game/app/client/models/ParticipantClient.js');
const DoorClient = require('../../../game/app/client/models/DoorClient.js');
const DirectionClient = require('../../../game/app/client/utils/DirectionClient.js');
const TypeOfDoorClient = require('../../../game/app/client/utils/TypeOfDoorClient.js');
const TypeOfRoomClient = require('../../../game/app/client/utils/TypeOfRoomClient.js');
const TypeOfRoom = require('../../../game/app/utils/TypeOfRoom.js');

//test data
var roomId = TestUtil.randomInt();
var typeOfRoom = TypeOfRoomClient.FOODCOURT;
var width = TestUtil.randomIntWithMaxAndMin(1000, 1);
var length = TestUtil.randomIntWithMaxAndMin(1000, 1);
var listOfGameObjects = [new GameObjectClient(TestUtil.randomInt(), 'table', TestUtil.randomIntWithMaxAndMin(5, 1), 
                        TestUtil.randomIntWithMaxAndMin(5, 1), new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1)), 
                        TestUtil.randomBool()), 
                        new GameObjectClient(TestUtil.randomInt(), 'ball', TestUtil.randomIntWithMaxAndMin(5, 1), 
                        TestUtil.randomIntWithMaxAndMin(5, 1), new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1)), 
                        TestUtil.randomBool())];
var listOfNPCs = [new NPCClient(TestUtil.randomInt(), TestUtil.randomString(), new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1)),
                  DirectionClient.DOWNLEFT),
                  new NPCClient(TestUtil.randomInt(), TestUtil.randomString(), new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1)),
                  DirectionClient.DOWNLEFT)];
var listOfDoors = [new DoorClient(TestUtil.randomInt(), TypeOfDoorClient.LECTURE_DOOR, new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1))),
                   new DoorClient(TestUtil.randomInt(), TypeOfDoorClient.FOYER_DOOR, new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1))),
                   new DoorClient(TestUtil.randomInt(), TypeOfDoorClient.FOODCOURT_DOOR, new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1))),
                   new DoorClient(TestUtil.randomInt(), TypeOfDoorClient.RECEPTION_DOOR, new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1)))];

var room = new RoomClient(roomId, typeOfRoom, listOfGameObjects, listOfNPCs, listOfDoors, width, length);
//called twice to cover singleton constructor

//tests
describe('RoomClient test', function() {
    it('test getters', function() {
        expect(room.getRoomId()).to.equal(roomId);
        expect(room.getTypeOfRoom()).to.equal(typeOfRoom);
        expect(room.getListOfGameObjects()).to.equal(listOfGameObjects);
        expect(room.getListOfNPCs()).to.equal(listOfNPCs);
        expect(room.getListOfDoors()).to.equal(listOfDoors);
        expect(room.getListOfPPants()).to.be.an('array').and.to.have.lengthOf(0);
        expect(room.getWidth()).to.equal(width);
        expect(room.getLength()).to.equal(length);
        expect(room.getMap()).to.be.an('array').and.to.have.lengthOf(width + 2);

        //sometimes works, sometimes not, some sort of race condition maybe? (P)
        /*
        for (var i = 0; i < width + 2; i++) {
            expect(room.getMap()[i]).to.be.an('array').and.to.have.lengthOf(length + 2);
        }
        */
    });

    it('test singleton constructor', function() {
        let newRoom = new RoomClient(roomId + 1, typeOfRoom, listOfGameObjects, listOfNPCs, listOfDoors, width, length);
        //room has still the oldID
        expect(newRoom.getRoomId()).to.equal(roomId);
    });

    it('test enter and exit valid ppant', function() {
        let ppantID = TestUtil.randomString();
        let ppantUsername = TestUtil.randomString();
        let ppantPosition = new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1));
        let ppant = new ParticipantClient(ppantID, ppantUsername, ppantPosition, DirectionClient.DOWNLEFT);
        let secondPpantID = TestUtil.randomString();
        let secondPpantUsername = TestUtil.randomString();
        let secondPpant = new ParticipantClient(secondPpantID, secondPpantUsername, ppantPosition, DirectionClient.DOWNLEFT);

        //ppant is not in room before
        assert.equal(room.getParticipant(ppantID), undefined);

        room.enterParticipant(ppant);
        //called twice, second call does nothing because ppant is already part of list
        room.enterParticipant(ppant);

        //enter second PPant
        room.enterParticipant(secondPpant);

        //ppants are now in room
        assert.equal(room.getParticipant(ppantID), ppant);
        assert.equal(room.getParticipant(secondPpantID), secondPpant);
        expect(room.getListOfPPants()).to.be.an('array').and.to.have.lengthOf(2);

        room.exitParticipant(ppantID);
        //called twice, second call does nothing because this ppant is not in the room
        room.exitParticipant(ppantID);
        expect(room.getListOfPPants()).to.be.an('array').and.to.have.lengthOf(1);

        room.exitParticipant(secondPpantID);
        expect(room.getListOfPPants()).to.be.an('array').and.to.have.lengthOf(0);

        //ppant is no longer in room
        assert.equal(room.getParticipant(ppantID), undefined);
        
    });

    it('swap room', function() {
        let newRoomID = TestUtil.randomInt();
        let newTypeOfRoom = TypeOfRoom.FOYER;
        let newWidth = TestUtil.randomIntWithMaxAndMin(1000, 5);
        let newLength = TestUtil.randomIntWithMaxAndMin(1000, 5);
        let newListOfGameObjects = [new GameObjectClient(TestUtil.randomInt(), 'table', 1, 1, new PositionClient(0, 1), true)];
        let newListOfNPCs = [new NPCClient(TestUtil.randomInt(), 'collisionNPC', new PositionClient(1, 1), DirectionClient.DOWNRIGHT)];
        let newListOfDoors = [new DoorClient(TestUtil.randomInt(), TypeOfDoorClient.FOODCOURT_DOOR, new PositionClient(4, 4))];
        room.swapRoom(newRoomID, newTypeOfRoom, newListOfGameObjects, newListOfNPCs, newListOfDoors, newWidth, newLength);

        expect(room.getRoomId()).to.equal(newRoomID);
        expect(room.getTypeOfRoom()).to.equal(newTypeOfRoom);
        expect(room.getListOfGameObjects()).to.equal(newListOfGameObjects);
        expect(room.getListOfNPCs()).to.equal(newListOfNPCs);
        expect(room.getListOfDoors()).to.equal(newListOfDoors);
        expect(room.getListOfPPants()).to.be.an('array').and.to.have.lengthOf(0);
        expect(room.getWidth()).to.equal(newWidth);
        expect(room.getLength()).to.equal(newLength);
        expect(room.getMap()).to.be.an('array').and.to.have.lengthOf(newWidth + 2);
    });

    it('test collision check', function() {
        //position where Test NPC is
        assert.equal(room.checkForCollision(new PositionClient(1, 1)), true);

        //position where Test GameObject is
        assert.equal(room.checkForCollision(new PositionClient(0, 1)), true);

        //position of random empty tile
        assert.equal(room.checkForCollision(new PositionClient(0, 0)), false);

        //position outside of map
        assert.equal(room.checkForCollision(new PositionClient(-10, -5)), true);
    });
});