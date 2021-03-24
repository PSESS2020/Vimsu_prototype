const { expect } = require('chai');
const GameObjectService = require('../../../src/game/app/server/services/GameObjectService');
const GameObject = require('../../../src/game/app/server/models/GameObject');
const TestUtil = require('../models/utils/TestUtil');

var gameObjectService;
var roomId;
var width;
var length;
var cordX;
var cordY;
var solidity;
var clickable;

describe('GameObjectService test', function () {

    //test data
    beforeEach(function () {
        gameObjectService = new GameObjectService();
        roomId = TestUtil.randomIntWithMin(0);
        width = TestUtil.randomIntWithMin(1);
        length = TestUtil.randomIntWithMin(1);
        cordX = TestUtil.randomIntWithMin(0);
        cordY = TestUtil.randomIntWithMin(0);
        solidity = TestUtil.randomBool();
        clickable = TestUtil.randomBool();
        iFrameData = { url: TestUtil.randomString(), width: TestUtil.randomInt(), height: TestUtil.randomInt() };
    });

    it('test create default Tile', function () {
        let defaultTile = gameObjectService.createDefaultTile(roomId, cordX, cordY, solidity, clickable);

        expect(defaultTile).to.be.instanceOf(GameObject);
        expect(defaultTile.getPosition().getRoomId()).to.equal(roomId);
        expect(defaultTile.getPosition().getCordX()).to.equal(cordX);
        expect(defaultTile.getPosition().getCordY()).to.equal(cordY);
        expect(defaultTile.getSolid()).to.equal(solidity);
        expect(defaultTile.getClickable()).to.equal(clickable);
        expect(defaultTile.getId()).to.be.a('number');
    });

    it('test create default left Tile', function () {
        let defaultLeftTile = gameObjectService.createDefaultLeftTile(roomId, cordX, cordY, solidity, clickable);

        expect(defaultLeftTile).to.be.instanceOf(GameObject);
        expect(defaultLeftTile.getPosition().getRoomId()).to.equal(roomId);
        expect(defaultLeftTile.getPosition().getCordX()).to.equal(cordX);
        expect(defaultLeftTile.getPosition().getCordY()).to.equal(cordY);
        expect(defaultLeftTile.getSolid()).to.equal(solidity);
        expect(defaultLeftTile.getClickable()).to.equal(clickable);
        expect(defaultLeftTile.getId()).to.be.a('number');
    });

    it('test create default right Tile', function () {
        let defaultRightTile = gameObjectService.createDefaultRightTile(roomId, cordX, cordY, solidity, clickable);

        expect(defaultRightTile).to.be.instanceOf(GameObject);
        expect(defaultRightTile.getPosition().getRoomId()).to.equal(roomId);
        expect(defaultRightTile.getPosition().getCordX()).to.equal(cordX);
        expect(defaultRightTile.getPosition().getCordY()).to.equal(cordY);
        expect(defaultRightTile.getSolid()).to.equal(solidity);
        expect(defaultRightTile.getClickable()).to.equal(clickable);
        expect(defaultRightTile.getId()).to.be.a('number');
    });

    it('test create default left Wall', function () {
        let defaultLeftWall = gameObjectService.createDefaultLeftWall(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(defaultLeftWall).to.be.instanceOf(GameObject);
        expect(defaultLeftWall.getPosition().getRoomId()).to.equal(roomId);
        expect(defaultLeftWall.getWidth()).to.equal(width);
        expect(defaultLeftWall.getLength()).to.equal(length);
        expect(defaultLeftWall.getPosition().getCordX()).to.equal(cordX);
        expect(defaultLeftWall.getPosition().getCordY()).to.equal(cordY);
        expect(defaultLeftWall.getSolid()).to.equal(solidity);
        expect(defaultLeftWall.getClickable()).to.equal(clickable);
        expect(defaultLeftWall.getId()).to.be.a('number');
    });

    it('test create default right Wall', function () {
        let defaultRightWall = gameObjectService.createDefaultRightWall(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(defaultRightWall).to.be.instanceOf(GameObject);
        expect(defaultRightWall.getPosition().getRoomId()).to.equal(roomId);
        expect(defaultRightWall.getWidth()).to.equal(width);
        expect(defaultRightWall.getLength()).to.equal(length);
        expect(defaultRightWall.getPosition().getCordX()).to.equal(cordX);
        expect(defaultRightWall.getPosition().getCordY()).to.equal(cordY);
        expect(defaultRightWall.getSolid()).to.equal(solidity);
        expect(defaultRightWall.getClickable()).to.equal(clickable);
        expect(defaultRightWall.getId()).to.be.a('number');
    });

    it('test create Table', function () {
        let table = gameObjectService.createTable(roomId, cordX, cordY, solidity, clickable, iFrameData);

        expect(table).to.be.instanceOf(GameObject);
        expect(table.getPosition().getRoomId()).to.equal(roomId);
        expect(table.getPosition().getCordX()).to.equal(cordX);
        expect(table.getPosition().getCordY()).to.equal(cordY);
        expect(table.getSolid()).to.equal(solidity);
        expect(table.getClickable()).to.equal(clickable);
        expect(table.getIFrameData()).to.equal(iFrameData);
        expect(table.getId()).to.be.a('number');
    });

    it('test create Plant', function () {
        let plant = gameObjectService.createPlant(roomId, cordX, cordY, solidity, clickable);

        expect(plant).to.be.instanceOf(GameObject);
        expect(plant.getPosition().getRoomId()).to.equal(roomId);
        expect(plant.getPosition().getCordX()).to.equal(cordX);
        expect(plant.getPosition().getCordY()).to.equal(cordY);
        expect(plant.getSolid()).to.equal(solidity);
        expect(plant.getClickable()).to.equal(clickable);
        expect(plant.getId()).to.be.a('number');
    });

    it('test create left Sofa', function () {
        let leftSofa = gameObjectService.createLeftSofa(roomId, cordX, cordY, solidity, clickable);

        expect(leftSofa).to.be.instanceOf(GameObject);
        expect(leftSofa.getPosition().getRoomId()).to.equal(roomId);
        expect(leftSofa.getPosition().getCordX()).to.equal(cordX);
        expect(leftSofa.getPosition().getCordY()).to.equal(cordY);
        expect(leftSofa.getSolid()).to.equal(solidity);
        expect(leftSofa.getClickable()).to.equal(clickable);
        expect(leftSofa.getId()).to.be.a('number');
    });

    it('test create right Sofa', function () {
        let rightSofa = gameObjectService.createRightSofa(roomId, cordX, cordY, solidity, clickable);

        expect(rightSofa).to.be.instanceOf(GameObject);
        expect(rightSofa.getPosition().getRoomId()).to.equal(roomId);
        expect(rightSofa.getPosition().getCordX()).to.equal(cordX);
        expect(rightSofa.getPosition().getCordY()).to.equal(cordY);
        expect(rightSofa.getSolid()).to.equal(solidity);
        expect(rightSofa.getClickable()).to.equal(clickable);
        expect(rightSofa.getId()).to.be.a('number');
    });

    it('test create left Window Default', function () {
        let leftWindowDefault0 = gameObjectService.createLeftWindowDefault(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(leftWindowDefault0).to.be.instanceOf(GameObject);
        expect(leftWindowDefault0.getPosition().getRoomId()).to.equal(roomId);
        expect(leftWindowDefault0.getWidth()).to.equal(width);
        expect(leftWindowDefault0.getLength()).to.equal(length);
        expect(leftWindowDefault0.getPosition().getCordX()).to.equal(cordX);
        expect(leftWindowDefault0.getPosition().getCordY()).to.equal(cordY);
        expect(leftWindowDefault0.getSolid()).to.equal(solidity);
        expect(leftWindowDefault0.getClickable()).to.equal(clickable);
        expect(leftWindowDefault0.getId()).to.be.a('number');
    });

    it('test create right Window Default', function () {
        let rightWindowDefault0 = gameObjectService.createRightWindowDefault(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(rightWindowDefault0).to.be.instanceOf(GameObject);
        expect(rightWindowDefault0.getPosition().getRoomId()).to.equal(roomId);
        expect(rightWindowDefault0.getWidth()).to.equal(width);
        expect(rightWindowDefault0.getLength()).to.equal(length);
        expect(rightWindowDefault0.getPosition().getCordX()).to.equal(cordX);
        expect(rightWindowDefault0.getPosition().getCordY()).to.equal(cordY);
        expect(rightWindowDefault0.getSolid()).to.equal(solidity);
        expect(rightWindowDefault0.getClickable()).to.equal(clickable);
        expect(rightWindowDefault0.getId()).to.be.a('number');
    });

    it('test create right Wall Frame', function () {
        //test with length > 1 and width < 1
        width = TestUtil.randomIntWithMaxAndMin(1, 0);
        length = TestUtil.randomIntWithMaxAndMin(5, 2);
        let rightWallFrame = gameObjectService.createRightWallFrame(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(rightWallFrame).to.be.instanceOf(Array);
        expect(rightWallFrame[0].getPosition().getRoomId()).to.equal(roomId);
        expect(rightWallFrame[0].getWidth()).to.equal(width);
        expect(rightWallFrame[0].getLength()).to.equal(length);
        expect(rightWallFrame[0].getPosition().getCordX()).to.equal(cordX);
        expect(rightWallFrame[0].getPosition().getCordY()).to.equal(cordY);
        expect(rightWallFrame[0].getSolid()).to.equal(solidity);
        expect(rightWallFrame[0].getClickable()).to.equal(clickable);
        expect(rightWallFrame[0].getId()).to.be.a('number');

        //test with length < 1 and width > 1
        width = TestUtil.randomIntWithMaxAndMin(5, 2);
        length = TestUtil.randomIntWithMaxAndMin(1, 0);
        rightWallFrame = gameObjectService.createRightWallFrame(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(rightWallFrame).to.be.instanceOf(Array);
        expect(rightWallFrame[0].getPosition().getRoomId()).to.equal(roomId);
        expect(rightWallFrame[0].getWidth()).to.equal(width);
        expect(rightWallFrame[0].getLength()).to.equal(length);
        expect(rightWallFrame[0].getPosition().getCordX()).to.equal(cordX);
        expect(rightWallFrame[0].getPosition().getCordY()).to.equal(cordY);
        expect(rightWallFrame[0].getSolid()).to.equal(solidity);
        expect(rightWallFrame[0].getClickable()).to.equal(clickable);
        expect(rightWallFrame[0].getId()).to.be.a('number');

        //test with width < 1 and length < 1
        width = TestUtil.randomIntWithMaxAndMin(1, 0);
        length = TestUtil.randomIntWithMaxAndMin(1, 0);
        rightWallFrame = gameObjectService.createRightWallFrame(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(rightWallFrame).to.be.instanceOf(GameObject);
        expect(rightWallFrame.getPosition().getRoomId()).to.equal(roomId);
        expect(rightWallFrame.getWidth()).to.equal(width);
        expect(rightWallFrame.getLength()).to.equal(length);
        expect(rightWallFrame.getPosition().getCordX()).to.equal(cordX);
        expect(rightWallFrame.getPosition().getCordY()).to.equal(cordY);
        expect(rightWallFrame.getSolid()).to.equal(solidity);
        expect(rightWallFrame.getClickable()).to.equal(clickable);
        expect(rightWallFrame.getId()).to.be.a('number');
    });

    it('test create left Schedule', function () {
        //test with length > 1 and width < 1
        width = TestUtil.randomIntWithMaxAndMin(1, 0);
        length = TestUtil.randomIntWithMaxAndMin(5, 2);
        let leftSchedule = gameObjectService.createLeftSchedule(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(leftSchedule).to.be.instanceOf(Array);
        expect(leftSchedule[0].getPosition().getRoomId()).to.equal(roomId);
        expect(leftSchedule[0].getWidth()).to.equal(width);
        expect(leftSchedule[0].getLength()).to.equal(length);
        expect(leftSchedule[0].getPosition().getCordX()).to.equal(cordX);
        expect(leftSchedule[0].getPosition().getCordY()).to.equal(cordY);
        expect(leftSchedule[0].getSolid()).to.equal(solidity);
        expect(leftSchedule[0].getClickable()).to.equal(clickable);
        expect(leftSchedule[0].getId()).to.be.a('number');

        //test with length < 1 and width > 1
        width = TestUtil.randomIntWithMaxAndMin(5, 2);
        length = TestUtil.randomIntWithMaxAndMin(1, 0);
        leftSchedule = gameObjectService.createLeftSchedule(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(leftSchedule).to.be.instanceOf(Array);
        expect(leftSchedule[0].getPosition().getRoomId()).to.equal(roomId);
        expect(leftSchedule[0].getWidth()).to.equal(width);
        expect(leftSchedule[0].getLength()).to.equal(length);
        expect(leftSchedule[0].getPosition().getCordX()).to.equal(cordX);
        expect(leftSchedule[0].getPosition().getCordY()).to.equal(cordY);
        expect(leftSchedule[0].getSolid()).to.equal(solidity);
        expect(leftSchedule[0].getClickable()).to.equal(clickable);
        expect(leftSchedule[0].getId()).to.be.a('number');

        //test with width < 1 and length < 1
        width = TestUtil.randomIntWithMaxAndMin(1, 0);
        length = TestUtil.randomIntWithMaxAndMin(1, 0);
        leftSchedule = gameObjectService.createLeftSchedule(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(leftSchedule).to.be.instanceOf(GameObject);
        expect(leftSchedule.getPosition().getRoomId()).to.equal(roomId);
        expect(leftSchedule.getWidth()).to.equal(width);
        expect(leftSchedule.getLength()).to.equal(length);
        expect(leftSchedule.getPosition().getCordX()).to.equal(cordX);
        expect(leftSchedule.getPosition().getCordY()).to.equal(cordY);
        expect(leftSchedule.getSolid()).to.equal(solidity);
        expect(leftSchedule.getClickable()).to.equal(clickable);
        expect(leftSchedule.getId()).to.be.a('number');
    });

    it('test create left ConferenceLogo', function () {
        //test with length > 1 and width < 1
        width = TestUtil.randomIntWithMaxAndMin(1, 0);
        length = TestUtil.randomIntWithMaxAndMin(5, 2);
        let leftConferenceLogo = gameObjectService.createLeftConferenceLogo(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(leftConferenceLogo).to.be.instanceOf(Array);
        expect(leftConferenceLogo[0].getPosition().getRoomId()).to.equal(roomId);
        expect(leftConferenceLogo[0].getWidth()).to.equal(width);
        expect(leftConferenceLogo[0].getLength()).to.equal(length);
        expect(leftConferenceLogo[0].getPosition().getCordX()).to.equal(cordX);
        expect(leftConferenceLogo[0].getPosition().getCordY()).to.equal(cordY);
        expect(leftConferenceLogo[0].getSolid()).to.equal(solidity);
        expect(leftConferenceLogo[0].getClickable()).to.equal(clickable);
        expect(leftConferenceLogo[0].getId()).to.be.a('number');

        //test with length < 1 and width > 1
        width = TestUtil.randomIntWithMaxAndMin(5, 2);
        length = TestUtil.randomIntWithMaxAndMin(1, 0);
        leftConferenceLogo = gameObjectService.createLeftConferenceLogo(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(leftConferenceLogo).to.be.instanceOf(Array);
        expect(leftConferenceLogo[0].getPosition().getRoomId()).to.equal(roomId);
        expect(leftConferenceLogo[0].getWidth()).to.equal(width);
        expect(leftConferenceLogo[0].getLength()).to.equal(length);
        expect(leftConferenceLogo[0].getPosition().getCordX()).to.equal(cordX);
        expect(leftConferenceLogo[0].getPosition().getCordY()).to.equal(cordY);
        expect(leftConferenceLogo[0].getSolid()).to.equal(solidity);
        expect(leftConferenceLogo[0].getClickable()).to.equal(clickable);
        expect(leftConferenceLogo[0].getId()).to.be.a('number');

        //test with width < 1 and length < 1
        width = TestUtil.randomIntWithMaxAndMin(1, 0);
        length = TestUtil.randomIntWithMaxAndMin(1, 0);
        leftConferenceLogo = gameObjectService.createLeftConferenceLogo(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(leftConferenceLogo).to.be.instanceOf(GameObject);
        expect(leftConferenceLogo.getPosition().getRoomId()).to.equal(roomId);
        expect(leftConferenceLogo.getWidth()).to.equal(width);
        expect(leftConferenceLogo.getLength()).to.equal(length);
        expect(leftConferenceLogo.getPosition().getCordX()).to.equal(cordX);
        expect(leftConferenceLogo.getPosition().getCordY()).to.equal(cordY);
        expect(leftConferenceLogo.getSolid()).to.equal(solidity);
        expect(leftConferenceLogo.getClickable()).to.equal(clickable);
        expect(leftConferenceLogo.getId()).to.be.a('number');
    });

    it('test create leftChair', function () {
        let leftChair = gameObjectService.createLeftChair(roomId, cordX, cordY, solidity, clickable);

        expect(leftChair).to.be.instanceOf(GameObject);
        expect(leftChair.getPosition().getRoomId()).to.equal(roomId);
        expect(leftChair.getPosition().getCordX()).to.equal(cordX);
        expect(leftChair.getPosition().getCordY()).to.equal(cordY);
        expect(leftChair.getSolid()).to.equal(solidity);
        expect(leftChair.getClickable()).to.equal(clickable);
        expect(leftChair.getId()).to.be.a('number');
    });

    it('test create leftChairBack', function () {
        let leftChairBack = gameObjectService.createLeftChairBack(roomId, cordX, cordY, solidity, clickable);

        expect(leftChairBack).to.be.instanceOf(GameObject);
        expect(leftChairBack.getPosition().getRoomId()).to.equal(roomId);
        expect(leftChairBack.getPosition().getCordX()).to.equal(cordX);
        expect(leftChairBack.getPosition().getCordY()).to.equal(cordY);
        expect(leftChairBack.getSolid()).to.equal(solidity);
        expect(leftChairBack.getClickable()).to.equal(clickable);
        expect(leftChairBack.getId()).to.be.a('number');
    });

    it('test create rightChair', function () {
        let rightChair = gameObjectService.createRightChair(roomId, cordX, cordY, solidity, clickable);

        expect(rightChair).to.be.instanceOf(GameObject);
        expect(rightChair.getPosition().getRoomId()).to.equal(roomId);
        expect(rightChair.getPosition().getCordX()).to.equal(cordX);
        expect(rightChair.getPosition().getCordY()).to.equal(cordY);
        expect(rightChair.getSolid()).to.equal(solidity);
        expect(rightChair.getClickable()).to.equal(clickable);
        expect(rightChair.getId()).to.be.a('number');
    });

    it('test create rightChairBack', function () {
        let rightChairBack = gameObjectService.createRightChairBack(roomId, cordX, cordY, solidity, clickable);

        expect(rightChairBack).to.be.instanceOf(GameObject);
        expect(rightChairBack.getPosition().getRoomId()).to.equal(roomId);
        expect(rightChairBack.getPosition().getCordX()).to.equal(cordX);
        expect(rightChairBack.getPosition().getCordY()).to.equal(cordY);
        expect(rightChairBack.getSolid()).to.equal(solidity);
        expect(rightChairBack.getClickable()).to.equal(clickable);
        expect(rightChairBack.getId()).to.be.a('number');
    });

    it('test create smallDinnerTable', function () {
        let smallDinnerTable = gameObjectService.createSmallDinnerTable(roomId, cordX, cordY, solidity, clickable);

        expect(smallDinnerTable).to.be.instanceOf(GameObject);
        expect(smallDinnerTable.getPosition().getRoomId()).to.equal(roomId);
        expect(smallDinnerTable.getPosition().getCordX()).to.equal(cordX);
        expect(smallDinnerTable.getPosition().getCordY()).to.equal(cordY);
        expect(smallDinnerTable.getSolid()).to.equal(solidity);
        expect(smallDinnerTable.getClickable()).to.equal(clickable);
        expect(smallDinnerTable.getId()).to.be.a('number');
    });

    it('test create rightDinnerTable', function () {
        let rightDinnerTable = gameObjectService.createRightDinnerTable(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(rightDinnerTable).to.be.instanceOf(GameObject);
        expect(rightDinnerTable.getPosition().getRoomId()).to.equal(roomId);
        expect(rightDinnerTable.getWidth()).to.equal(width);
        expect(rightDinnerTable.getLength()).to.equal(length);
        expect(rightDinnerTable.getPosition().getCordX()).to.equal(cordX);
        expect(rightDinnerTable.getPosition().getCordY()).to.equal(cordY);
        expect(rightDinnerTable.getSolid()).to.equal(solidity);
        expect(rightDinnerTable.getClickable()).to.equal(clickable);
        expect(rightDinnerTable.getId()).to.be.a('number');
    });

    it('test create canteenCounter', function () {
        let canteenCounter = gameObjectService.createCanteenCounter(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(canteenCounter).to.be.instanceOf(GameObject);
        expect(canteenCounter.getPosition().getRoomId()).to.equal(roomId);
        expect(canteenCounter.getWidth()).to.equal(width);
        expect(canteenCounter.getLength()).to.equal(length);
        expect(canteenCounter.getPosition().getCordX()).to.equal(cordX);
        expect(canteenCounter.getPosition().getCordY()).to.equal(cordY);
        expect(canteenCounter.getSolid()).to.equal(solidity);
        expect(canteenCounter.getClickable()).to.equal(clickable);
        expect(canteenCounter.getId()).to.be.a('number');
    });

    it('test create drinkingMachine', function () {
        let drinkingMachine = gameObjectService.createDrinkingMachine(roomId, width, length, cordX, cordY, solidity, clickable);

        expect(drinkingMachine).to.be.instanceOf(GameObject);
        expect(drinkingMachine.getPosition().getRoomId()).to.equal(roomId);
        expect(drinkingMachine.getWidth()).to.equal(width);
        expect(drinkingMachine.getLength()).to.equal(length);
        expect(drinkingMachine.getPosition().getCordX()).to.equal(cordX);
        expect(drinkingMachine.getPosition().getCordY()).to.equal(cordY);
        expect(drinkingMachine.getSolid()).to.equal(solidity);
        expect(drinkingMachine.getClickable()).to.equal(clickable);
        expect(drinkingMachine.getId()).to.be.a('number');
    });
});