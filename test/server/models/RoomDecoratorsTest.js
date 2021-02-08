const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const RoomDecorator = require('../../../src/game/app/server/models/RoomDecorator.js');
const FoyerRoomDecorator = require('../../../src/game/app/server/models/FoyerRoomDecorator.js');
const ReceptionRoomDecorator = require('../../../src/game/app/server/models/ReceptionRoomDecorator.js');
const FoodcourtRoomDecorator = require('../../../src/game/app/server/models/FoodcourtRoomDecorator.js');
const GameObject = require('../../../src/game/app/server/models/GameObject');
const Room = require('../../../src/game/app/server/models/Room.js');
const Door = require('../../../src/game/app/server/models/Door');
const NPC = require('../../../src/game/app/server/models/NPC');

const TypeOfRoom = require('../../../src/game/app/client/shared/TypeOfRoom.js');

const Settings = require('../../../src/game/app/server/utils/Settings.js');
const RoomDimensions = require('../../../src/game/app/server/utils/RoomDimensions.js');

foyerAssetPaths = {
    "tile_default": "client/assets/tiles/tile_default.png",
    "leftwall_default": "client/assets/walls/wall1.png",
    "rightwall_default": "client/assets/walls/wall2.png",
    "leftlecturedoor_default": "client/assets/doors/door_lecturehall.png",
    "rightfoodcourtdoor_default": "client/assets/doors/door_foodcourt.png",
    "rightreceptiondoor_default": "client/assets/doors/door_reception.png",
    "leftschedule_default0": "client/assets/walls/schedule1.png",
    "leftschedule_default1": "client/assets/walls/schedule2.png",
    "leftschedule_default2": "client/assets/walls/schedule3.png",
    "leftwindow_default0": "client/assets/windows/left_small_window_default0.png",
    "rightwindow_default0": "client/assets/windows/right_small_window_default0.png",
    "leftconferencelogo_default0": "client/assets/logos/conferencelogo1.png",
    "leftconferencelogo_default1": "client/assets/logos/conferencelogo2.png",
    "leftconferencelogo_default2": "client/assets/logos/conferencelogo3.png",
    "leftconferencelogo_default3": "client/assets/logos/conferencelogo4.png",
    "leftconferencelogo_default4": "client/assets/logos/conferencelogo5.png",
    "rightwallframe_default0": "client/assets/frames/wallframe1.png",
    "rightwallframe_default1": "client/assets/frames/wallframe2.png",
    "rightwallframe_default2": "client/assets/frames/wallframe3.png",
    "leftsofa_default": "client/assets/chairs/sofa_left.png",
    "rightsofa_default": "client/assets/chairs/sofa_right.png",
    "plant_default": "client/assets/plants/plant.png",
}

foodcourtAssetPaths = {
    "tile_default": "client/assets/tiles/tile_default.png",
    "leftwall_default": "client/assets/walls/wall1.png",
    "rightwall_default": "client/assets/walls/wall2.png",
    "leftfoyerdoor_default": "client/assets/doors/door_foyer.png",
    "rightreceptiondoor_default": "client/assets/doors/door_reception.png",                 /* Needed because Escape Room Door currently uses this asset */
    "rightwindow_default0": "client/assets/windows/right_small_window_default0.png",
    "leftconferencelogo_default0": "client/assets/logos/conferencelogo1.png",
    "leftconferencelogo_default1": "client/assets/logos/conferencelogo2.png",
    "leftconferencelogo_default2": "client/assets/logos/conferencelogo3.png",
    "leftconferencelogo_default3": "client/assets/logos/conferencelogo4.png",
    "leftconferencelogo_default4": "client/assets/logos/conferencelogo5.png",
    "righttable_default": "client/assets/tables/dinnerTableRight.png",
    "leftchair_default": "client/assets/chairs/chair_left.png",
    "rightchair_default": "client/assets/chairs/chair_right.png",
    "leftchairback_default": "client/assets/chairs/chair_left_back.png",
    "rightchairback_default": "client/assets/chairs/chair_right_back.png",
    "smalldinnertable_default": "client/assets/tables/smallDinnerTable.png",
    "canteencounter_default": "client/assets/other/canteenCounter.png",
    "drinks_default": "client/assets/other/Drinks.png",
    "koeriWurst_bothSides": "client/assets/food/koeriWurscht_bothSides.png",
    "koeriWurst_upperSide": "client/assets/food/koeriWurscht_upperSide.png",
    "koeriWurst_lowerSide": "client/assets/food/koeriWurscht_lowerSide.png",
    "tea_default": "client/assets/food/tea.png",
}

receptionAssetPaths = {
    "tile_default": "client/assets/tiles/tile_default.png",
    "leftwall_default": "client/assets/walls/wall1.png",
    "rightwall_default": "client/assets/walls/wall2.png",
    "leftfoyerdoor_default": "client/assets/doors/door_foyer.png",
    "rightwindow_default0": "client/assets/windows/right_small_window_default0.png",
    "leftconferencelogo_default0": "client/assets/logos/conferencelogo1.png",
    "leftconferencelogo_default1": "client/assets/logos/conferencelogo2.png",
    "leftconferencelogo_default2": "client/assets/logos/conferencelogo3.png",
    "leftconferencelogo_default3": "client/assets/logos/conferencelogo4.png",
    "leftconferencelogo_default4": "client/assets/logos/conferencelogo5.png",
    "plant_default": "client/assets/plants/plant.png",
    "receptionCounterFrontPart_default": "client/assets/other/ReceptionCounterFrontPart.png",
    "receptionCounterLeftPart_default": "client/assets/other/ReceptionCounterBackPartLeft.png",
    "receptionCounterRightPart_default": "client/assets/other/ReceptionCounterBackPartRight.png",
}

var testRoomFoyer;
var testRoomReception;
var testRoomFoodcourt;

var testRoomFoyerDecorator;
var testRoomFoodcourtDecorator;
var testRoomReceptionDecorator;

describe('RoomDecorators Testing', () => {

    it('Test abstract RoomDecorator class', () => {
        expect(() => new RoomDecorator()).to.throw(Error, "Cannot construct abstract RoomDecorator instances directly");
    });

    it('Test FoyerRoomDecorator constructor and getters', () => {
        var testRoom = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        var testRoomDecorator = new FoyerRoomDecorator(testRoom);
        testRoomDecorator.getRoom().getListOfGameObjects().forEach(gameObject => {
            expect(gameObject).to.be.instanceOf(GameObject);
        });
        testRoomDecorator.getRoom().getListOfNPCs().forEach(npc => {
            expect(npc).to.be.instanceOf(NPC);
        });
        testRoomDecorator.getRoom().getListOfDoors().forEach(door => {
            expect(door).to.be.instanceOf(Door);
        });
        testRoomDecorator.getRoom().getListOfMapElements().forEach(mapElement => {
            expect(mapElement).to.be.instanceOf(GameObject);
        });

        expect(testRoomDecorator.getRoom()).to.be.eql(testRoom);
        expect(testRoomDecorator.getAssetPaths()).to.be.eql(foyerAssetPaths);
    });

    it('Test FoodcourtRoomDecorator', () => {
        var testRoom = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH);
        var testRoomDecorator = new FoodcourtRoomDecorator(testRoom);
        testRoomDecorator.getRoom().getListOfGameObjects().forEach(gameObject => {
            expect(gameObject).to.be.instanceOf(GameObject);
        });
        testRoomDecorator.getRoom().getListOfNPCs().forEach(npc => {
            expect(npc).to.be.instanceOf(NPC);
        });
        testRoomDecorator.getRoom().getListOfDoors().forEach(door => {
            expect(door).to.be.instanceOf(Door);
        });
        testRoomDecorator.getRoom().getListOfMapElements().forEach(mapElement => {
            expect(mapElement).to.be.instanceOf(GameObject);
        });

        expect(testRoomDecorator.getRoom()).to.be.eql(testRoom);
        expect(testRoomDecorator.getAssetPaths()).to.be.eql(foodcourtAssetPaths);
    });

    it('Test ReceptionRoomDecorator', () => {
        var testRoom = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH);
        var testRoomDecorator = new ReceptionRoomDecorator(testRoom);
        testRoomDecorator.getRoom().getListOfGameObjects().forEach(gameObject => {
            expect(gameObject).to.be.instanceOf(GameObject);
        });
        testRoomDecorator.getRoom().getListOfNPCs().forEach(npc => {
            expect(npc).to.be.instanceOf(NPC);
        });
        testRoomDecorator.getRoom().getListOfDoors().forEach(door => {
            expect(door).to.be.instanceOf(Door);
        });
        testRoomDecorator.getRoom().getListOfMapElements().forEach(mapElement => {
            expect(mapElement).to.be.instanceOf(GameObject);
        });

        expect(testRoomDecorator.getRoom()).to.be.eql(testRoom);
        expect(testRoomDecorator.getAssetPaths()).to.be.eql(receptionAssetPaths);
    });

});

describe('test OccMap Init', function () {

    before(function () {
        testRoomFoyer = new Room(Settings.FOYER_ID, TypeOfRoom.FOYER, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH);
        testRoomFoodcourt = new Room(Settings.FOODCOURT_ID, TypeOfRoom.FOODCOURT, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH);
        testRoomReception = new Room(Settings.RECEPTION_ID, TypeOfRoom.RECEPTION, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH);
        testRoomFoyerDecorator = new FoyerRoomDecorator(testRoomFoyer);
        testRoomFoodcourtDecorator = new FoodcourtRoomDecorator(testRoomFoodcourt);
        testRoomReceptionDecorator = new ReceptionRoomDecorator(testRoomReception);

    });

    it('test OccMap Foyer', function () {
        var objects = testRoomFoyer.getListOfGameObjects();
        for (var i = 0; i < objects.length; i++) {
            var testPos = objects[i].getPosition();
            assert.equal(testRoomFoyer.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testRoomFoyer.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
        var NPCs = testRoomFoyer.getListOfNPCs();
        for (var i = 0; i < NPCs.length; i++) {
            var testPos = NPCs[i].getPosition();
            assert.equal(testRoomFoyer.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testRoomFoyer.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
    });

    it('test OccMap FoodCourt', function () {
        var objects = testRoomFoodcourt.getListOfGameObjects();
        for (var i = 0; i < objects.length; i++) {
            var testPos = objects[i].getPosition();
            assert.equal(testRoomFoodcourt.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testRoomFoodcourt.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
        var NPCs = testRoomFoodcourt.getListOfNPCs();
        for (var i = 0; i < NPCs.length; i++) {
            var testPos = NPCs[i].getPosition();
            assert.equal(testRoomFoodcourt.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testRoomFoodcourt.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
    });

    it('test OccMap Reception', function () {
        var objects = testRoomReception.getListOfGameObjects();
        for (var i = 0; i < objects.length; i++) {
            var testPos = objects[i].getPosition();
            assert.equal(testRoomReception.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testRoomReception.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
        var NPCs = testRoomReception.getListOfNPCs();
        for (var i = 0; i < NPCs.length; i++) {
            var testPos = NPCs[i].getPosition();
            assert.equal(testRoomReception.getOccMap()[testPos.getCordX()][testPos.getCordY()], 1);
            expect(testRoomReception.checkForCollision(testPos)).to.be.true; //doppelt gemoppelt
        }
    });



})