const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const RoomClient = require('../../../src/game/app/client/models/RoomClient.js');
const GameObjectClient = require('../../../src/game/app/client/models/GameObjectClient.js');
const PositionClient = require('../../../src/game/app/client/models/PositionClient.js');
const NPCClient = require('../../../src/game/app/client/models/NPCClient.js');
const ParticipantClient = require('../../../src/game/app/client/models/ParticipantClient.js');
const DoorClient = require('../../../src/game/app/client/models/DoorClient.js');
const Direction = require('../../../src/game/app/client/shared/Direction.js');
const TypeOfDoor = require('../../../src/game/app/client/shared/TypeOfDoor.js');
const TypeOfRoom = require('../../../src/game/app/client/shared/TypeOfRoom.js');
const ShirtColor = require('../../../src/game/app/client/shared/ShirtColor.js');
const GameObjectType = require('../../../src/game/app/client/shared/GameObjectType.js');
const Settings = require('../../../src/game/app/server/utils/' + process.env.SETTINGS_FILENAME);
const SettingsClient = require('../../../src/game/app/client/utils/Settings.js');

// TODO
// Due to changes to the RoomClient class, this is now completely broken
// The four lists need to be changed into lists of data objects, as
// actual creation now gets handled inside of the RoomClient class

var roomId;
var typeOfRoom;
var assetPaths;
var listOfGameObjects;
var listOfMapElements;
var listOfNPCs;
var listOfDoors;
var width;
var length;
var occupationMap;

//tests
describe('RoomClient test', function() {
    beforeEach( function () {
        //test data
        roomId = TestUtil.randomInt();
        typeOfRoom = TypeOfRoom.FOODCOURT;
        assetPaths = {
            "tile_default": "../client/assets/tiles/tile_default.png",
            "leftwall_default": "../client/assets/walls/wall1.png",
            "rightwall_default": "../client/assets/walls/wall2.png",
            "leftfoyerdoor_default": "../client/assets/doors/door_foyer.png",
            "table_default": "../client/assets/tables/table.png"
        }
        listOfGameObjects = [new GameObjectClient(TestUtil.randomInt(), GameObjectType.TABLE, 'table', 1, 1, new PositionClient(1, 1), TestUtil.randomBool(), TestUtil.randomBool())];
        listOfMapElements = [new GameObjectClient(TestUtil.randomInt(), GameObjectType.TILE, 'tile', 1, 1, new PositionClient(0, 0), false, TestUtil.randomBool())];
        listOfNPCs = [new NPCClient(TestUtil.randomInt(), TestUtil.randomString(), new PositionClient(0, 0), Direction.DOWNLEFT, ShirtColor.BLUE)];
        listOfDoors = [new DoorClient(TestUtil.randomString(), TypeOfDoor.LEFT_DOOR, 'foyer_door', new PositionClient(1, 0), TestUtil.randomInt())];
        width = TestUtil.randomIntWithMaxAndMin(1000, 1);
        length = TestUtil.randomIntWithMaxAndMin(1000, 1);

        /**
         * does not match with positions of NPCs and GameObjects, only for constructor
         * collision is tested after swap room
         **/
        occupationMap = new Array(width);
        for (var i = 0; i < width; i++) {
            occupationMap[i] = new Array(length).fill(0);
        }
    });

    it('test constructor and getters', function() {
        let room = new RoomClient(assetPaths, { id: roomId, type: typeOfRoom, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap });

        expect(room.getRoomId()).to.equal(roomId);
        expect(room.getTypeOfRoom()).to.equal(typeOfRoom);
        expect(room.getListOfGameObjects()).to.equal(listOfGameObjects);
        expect(room.getListOfMapElements()).to.equal(listOfMapElements);
        expect(room.getAssetPaths()).to.equal(assetPaths);
        expect(room.getListOfNPCs()).to.equal(listOfNPCs);
        expect(room.getListOfDoors()).to.equal(listOfDoors);
        expect(room.getListOfPPants()).to.be.an('array').and.to.have.lengthOf(0);
        expect(room.getWidth()).to.equal(width);
        expect(room.getLength()).to.equal(length);
        expect(room.getMap()).to.be.an('array').and.to.have.lengthOf(length + SettingsClient.MAP_BLANK_TILES_LENGTH);
        expect(room.getObjectMap()).to.be.an('array').and.to.have.lengthOf(length + SettingsClient.MAP_BLANK_TILES_LENGTH);

        //test singleton constructor
        let newRoom = new RoomClient(roomId + 1, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap);
        //room has still the oldID
        expect(newRoom.getRoomId()).to.equal(roomId);
    });

    it('test enter and exit valid ppant', function() {
        let room = new RoomClient(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap);

        //first ppant
        let ppantID = TestUtil.randomString();
        let ppantUsername = TestUtil.randomString();
        let ppantPosition = new PositionClient(TestUtil.randomIntWithMaxAndMin(width, 1), TestUtil.randomIntWithMaxAndMin(length, 1));
        let isVisible = TestUtil.randomBool();
        let isModerator = TestUtil.randomBool();
        let ppant = new ParticipantClient(ppantID, ppantUsername, ppantPosition, Direction.DOWNLEFT, isVisible, isModerator, ShirtColor.BLUE);

        //second ppant
        let secondPpantID = TestUtil.randomString();
        let secondPpantUsername = TestUtil.randomString();
        let secondPpant = new ParticipantClient(secondPpantID, secondPpantUsername, ppantPosition, Direction.DOWNLEFT, isVisible, isModerator, ShirtColor.GREEN);

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

    it('swap room and check for collision', function() {
        let room = new RoomClient(roomId, typeOfRoom, assetPaths, listOfMapElements, listOfGameObjects, listOfNPCs, listOfDoors, width, length, occupationMap);

        let newRoomID = TestUtil.randomInt();
        let newTypeOfRoom = TypeOfRoom.FOYER;
        let newWidth = TestUtil.randomIntWithMaxAndMin(100, 5);
        let newLength = TestUtil.randomIntWithMaxAndMin(100, 5);

        //table with width 2 and length 1 at (0,1)
        let newListOfGameObjects = [new GameObjectClient(TestUtil.randomInt(), GameObjectType.TABLE, 'table', 2, 1, new PositionClient(0, 1), false, TestUtil.randomBool())];

        //npc at (1,1)
        let newListOfNPCs = [new NPCClient(TestUtil.randomInt(), 'collisionNPC', new PositionClient(1, 0), Direction.DOWNRIGHT, ShirtColor.RED)];

        let newListOfDoors = [new DoorClient(TestUtil.randomString(), TypeOfDoor.LEFT_DOOR, 'door', new PositionClient(4, 4), TestUtil.randomInt())];
        let newAssetPaths = {"tile_default": "../client/assets/tile_default.png"};
        let newListOfMapElements = [];
        
        //calculate occMap, normally happens in server, here just for testing purpose
        let newOccupationMap = new Array(newWidth);
        for (var i = 0; i < newWidth; i++) {
            newOccupationMap[i] = new Array(newLength).fill(0);
        }

        //table
        newOccupationMap[0][4] = 1;

        //npcs
        newOccupationMap[1][3] = 1;

        room.swapRoom(newRoomID, newTypeOfRoom, newAssetPaths, newListOfMapElements, newListOfGameObjects, newListOfNPCs, newListOfDoors, newWidth, newLength, newOccupationMap);

        expect(room.getRoomId()).to.equal(newRoomID);
        expect(room.getTypeOfRoom()).to.equal(newTypeOfRoom);
        expect(room.getListOfGameObjects()).to.equal(newListOfGameObjects);
        expect(room.getListOfNPCs()).to.equal(newListOfNPCs);
        expect(room.getListOfDoors()).to.equal(newListOfDoors);
        expect(room.getListOfPPants()).to.be.an('array').and.to.have.lengthOf(0);
        expect(room.getWidth()).to.equal(newWidth);
        expect(room.getLength()).to.equal(newLength);
        expect(room.getMap()).to.be.an('array').and.to.have.lengthOf(newLength + SettingsClient.MAP_BLANK_TILES_WIDTH);
        expect(room.getObjectMap()).to.be.an('array').and.to.have.lengthOf(newLength + SettingsClient.MAP_BLANK_TILES_LENGTH);
        expect(room.getAssetPaths()).to.equal(newAssetPaths);
        expect(room.getListOfMapElements()).to.equal(newListOfMapElements);

        //position where Test NPC is
        assert.equal(room.checkForCollision(new PositionClient(1, 0)), true);

        //position where Test GameObject is
        assert.equal(room.checkForCollision(new PositionClient(0, 1)), true);

        //position of random empty tile
        assert.equal(room.checkForCollision(new PositionClient(0, 0)), false);

        //position outside of map
        assert.equal(room.checkForCollision(new PositionClient(-10, -5)), true);
    });
});