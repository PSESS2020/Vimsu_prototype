const { expect } = require('chai');
const GameObjectService = require('../../../game/app/server/services/GameObjectService');
const GameObject = require('../../../game/app/server/models/GameObject');
const Settings = require('../../../game/app/utils/Settings');
const TestUtil = require('../models/utils/TestUtil');


describe('GameObjectService test', function () {
    it('test create Table', function() {
        let gameObjectService = new GameObjectService();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let solidity = TestUtil.randomBool();
        let table = gameObjectService.createTable(roomId, cordX, cordY, solidity);

        expect(table).to.be.instanceOf(GameObject);
        expect(table.getPosition().getRoomId()).to.equal(roomId);
        expect(table.getPosition().getCordX()).to.equal(cordX);
        expect(table.getPosition().getCordY()).to.equal(cordY);
        expect(table.getSolid()).to.equal(solidity);
        expect(table.getId()).to.be.a('number');
        expect(table.getWidth()).to.equal(Settings.SMALL_OBJECT_WIDTH);
        expect(table.getLength()).to.equal(Settings.SMALL_OBJECT_LENGTH);
    });

    it('test create ScheduleBoard', function() {
        let gameObjectService = new GameObjectService();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let solidity = TestUtil.randomBool();
        let width = 1;
        let length = 4;
        let scheduleBoard = gameObjectService.createLeftSchedule(roomId, width, length, cordX, cordY, solidity);
        
        expect(scheduleBoard).to.be.instanceOf(Array).to.have.lengthOf(4);
        expect(scheduleBoard[0].getPosition().getRoomId()).to.equal(roomId);
        expect(scheduleBoard[0].getPosition().getCordX()).to.equal(cordX);
        expect(scheduleBoard[0].getPosition().getCordY()).to.equal(cordY);
        expect(scheduleBoard[0].getSolid()).to.equal(solidity);
        expect(scheduleBoard[0].getId()).to.be.a('number');
    });  
});