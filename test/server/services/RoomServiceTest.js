const RoomService = require('../../../game/app/server/services/RoomService.js');
const Room = require('../../../game/app/server/models/Room.js');
const Position = require('../../../game/app/server/models/Position.js');
const TypeOfRoom = require('../../../game/app/client/shared/TypeOfRoom.js');
const Direction = require('../../../game/app/client/shared/Direction.js');
const Settings = require('../../../game/app/utils/Settings.js');
const RoomDimensions = require('../../../game/app/utils/RoomDimensions.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testRoomService;

describe('RoomService constructor test', function () {
    
    before( function () {
        testRoomService = new RoomService();
    });
    
    it('test singleton pattern', function () {
        expect(new RoomService()).to.be.equal(testRoomService);
        assert.equal((new RoomService()).getAllRooms(), testRoomService.getAllRooms());
    });
    
    it('test right amount of rooms init', function () {
        expect(testRoomService.getAllRooms()).to.be.an('array').of.length(3);
    });
    
});

describe('RoomService Room delivery test', function () {
    
    before( function () {
        testRoomService = new RoomService();
    });
    
    it('test right type of room delivered', function () {
        expect(() => testRoomService.getRoom("fehler")).to.throw(TypeError);
        expect(() => testRoomService.getRoom(100)).to.throw(Error, " is not in list of rooms");
        assert.equal(testRoomService.getRoom(Settings.FOYER_ID).getTypeOfRoom(), TypeOfRoom.FOYER);
        assert.equal(testRoomService.getRoom(Settings.FOODCOURT_ID).getTypeOfRoom(), TypeOfRoom.FOODCOURT);
        assert.equal(testRoomService.getRoom(Settings.RECEPTION_ID).getTypeOfRoom(), TypeOfRoom.RECEPTION);
    });
    
})
