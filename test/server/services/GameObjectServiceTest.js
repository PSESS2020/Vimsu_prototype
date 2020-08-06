const { expect } = require('chai');
const GameObjectService = require('../../../game/app/server/services/GameObjectService');
const Settings = require('../../../game/app/utils/Settings');
const GameObject = require('../../../game/app/server/models/GameObject');


//Test data
var initGameObjectService = new GameObjectService();
//Called twice to cover singleton constructor
var gameObjectService = new GameObjectService();
var foyerID = Settings.FOYER_ID;
var foodCourtID = Settings.FOODCOURT_ID;
var receptionID = Settings.RECEPTION_ID;
var invalidRoomID = 42;
var tableID = 1;
var tableName = 'table1';
var invalidObjectID = 42;

describe('GameObjectServiceTest getter', function () {
    it('test getObjects Foyer', function() {
        let foyerObjects = gameObjectService.getObjects(foyerID);
        expect(foyerObjects).to.be.an('array').and.to.have.lengthOf(5);
        foyerObjects.forEach(object => {
            expect(object).to.be.instanceOf(GameObject);
        });
    });

    it('test getObjects Reception', function() {
        let receptionObjects = gameObjectService.getObjects(receptionID);
        expect(receptionObjects).to.be.an('array').and.to.have.lengthOf(11);
        receptionObjects.forEach(object => {
            expect(object).to.be.instanceOf(GameObject);
        });
    });

    it('test getObjects FoodCourt', function() {
        let foodCourtObjects = gameObjectService.getObjects(foodCourtID);
        expect(foodCourtObjects).to.be.an('array').and.to.have.lengthOf(45);
        foodCourtObjects.forEach(object => {
            expect(object).to.be.instanceOf(GameObject);
        });
    });

    it('test getObjects invalid Room', function() {
        expect(() => gameObjectService.getObjects(invalidRoomID)).to.throw(Error);
    })

    it('test getObject table', function() {
        expect(gameObjectService.getObject(tableID).getName()).equal(tableName);
    });

    it('test getObject invalid Object', function() {
        expect(() => gameObjectService.getObject(invalidObjectID)).to.throw(Error);
    });
});