const { expect } = require('chai');
const GameObjectService = require('../../../game/app/server/services/GameObjectService');
const GameObject = require('../../../game/app/server/models/GameObject');
const Settings = require('../../../game/app/client/shared/Settings');
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
        expect(table.getWidth()).to.equal(Settings.TABLE_WIDTH);
        expect(table.getLength()).to.equal(Settings.TABLE_LENGTH);
    });

    it('test create ScheduleBoard', function() {
        let gameObjectService = new GameObjectService();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let solidity = TestUtil.randomBool();
        let width = TestUtil.randomIntWithMin(1);
        let length = TestUtil.randomIntWithMin(1);
        let scheduleBoard = gameObjectService.createSchedule(roomId, width, length, cordX, cordY, solidity);
        expect(scheduleBoard).to.be.instanceOf(GameObject);
        expect(scheduleBoard.getPosition().getRoomId()).to.equal(roomId);
        expect(scheduleBoard.getPosition().getCordX()).to.equal(cordX);
        expect(scheduleBoard.getPosition().getCordY()).to.equal(cordY);
        expect(scheduleBoard.getSolid()).to.equal(solidity);
        expect(scheduleBoard.getId()).to.be.a('number');
        expect(scheduleBoard.getWidth()).to.equal(width);
        expect(scheduleBoard.getLength()).to.equal(length);
    });  
});