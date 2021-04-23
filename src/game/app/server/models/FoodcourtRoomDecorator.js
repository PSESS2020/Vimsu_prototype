const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');
const Room = require('./Room.js');
const TypeChecker = require('../../client/shared/TypeChecker');
const DoorClosedMessages = require('../utils/messages/DoorClosedMessages.js');
const RoomDimensions = require('../utils/RoomDimensions.js');


/**
 * The Food Court Room Decorator Model
 * @module FoodcourtRoomDecorator
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class FoodcourtRoomDecorator extends RoomDecorator {
    #room;


    #assetPaths = {
        "tile_default": "../client/assets/tiles/tile_default.png",
        "leftwall_default": "../client/assets/walls/wall1.png",
        "rightwall_default": "../client/assets/walls/wall2.png",
        "leftfoyerdoor_default": "../client/assets/doors/door_foyer.png",
        "rightreceptiondoor_default": "../client/assets/doors/door_reception.png",                 /* Needed because Escape Room Door currently uses this asset */
        "rightwindow_default0": "../client/assets/windows/right_small_window_default0.png",
        "leftconferencelogo_default0": "../client/assets/logos/conferencelogo1.png",
        "leftconferencelogo_default1": "../client/assets/logos/conferencelogo2.png",
        "leftconferencelogo_default2": "../client/assets/logos/conferencelogo3.png",
        "leftconferencelogo_default3": "../client/assets/logos/conferencelogo4.png",
        "leftconferencelogo_default4": "../client/assets/logos/conferencelogo5.png",
        "righttable_default": "../client/assets/tables/dinnerTableRight.png",
        "leftchair_default": "../client/assets/chairs/chair_left.png",
        "rightchair_default": "../client/assets/chairs/chair_right.png",
        "leftchairback_default": "../client/assets/chairs/chair_left_back.png",
        "rightchairback_default": "../client/assets/chairs/chair_right_back.png",
        "smalldinnertable_default": "../client/assets/tables/smallDinnerTable.png",
        "canteencounter_default": "../client/assets/other/canteenCounter.png",
        "drinks_default": "../client/assets/other/Drinks.png",
        "koeriWurst_bothSides": "../client/assets/food/koeriWurscht_bothSides.png",
        "koeriWurst_upperSide": "../client/assets/food/koeriWurscht_upperSide.png",
        "koeriWurst_lowerSide": "../client/assets/food/koeriWurscht_lowerSide.png",
        "tea_default": "../client/assets/food/tea.png",
    }

    /**
     * Creates a RoomDecorator instance for Food Court
     * @constructor module:FoodcourtRoomDecorator 
     * 
     * @param {Room} room food court room instance
     */
    constructor(room) {
        super();

        TypeChecker.isInstanceOf(room, Room)
        this.#room = room;

        let objService = new GameObjectService();

        /* Get all map elements from service */

        //Get tiles
        let listOfMapElements = [];

        for (var i = 0; i < this.#room.getLength(); i++) {
            for (var j = 0; j < this.#room.getWidth(); j++) {
                listOfMapElements.push(objService.createDefaultTile(Settings.FOODCOURT_ID, i, j, false, false));
            }
        }

        //Get left walls
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(objService.createDefaultLeftWall(Settings.FOODCOURT_ID, 1, 1, i, -1, false, false));
        }

        //Get right walls
        for (var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(objService.createDefaultRightWall(Settings.FOODCOURT_ID, 1, 1, this.#room.getLength(), j, false, false));
        }

        //Get all gameObjects from service
        let listOfGameObjects = [];

        for (var i = 2; i <= 12; i += 5) {
            listOfGameObjects.push(objService.createRightDinnerTable(Settings.FOODCOURT_ID, 1, 3, i, 3, true, false),
                objService.createRightDinnerTable(Settings.FOODCOURT_ID, 1, 3, i, 9, true, false),
                objService.createSmallDinnerTable(Settings.FOODCOURT_ID, i, 16, true, false),
                objService.createLeftChair(Settings.FOODCOURT_ID, i, 15, true, false),
                objService.createLeftChairBack(Settings.FOODCOURT_ID, i, 17, true, false));
        }

        //food
        listOfGameObjects.push(objService.createBothSidesKoeriWurst(Settings.FOODCOURT_ID, 2, 3, true, false), 
            objService.createUpperSideKoeriWurst(Settings.FOODCOURT_ID, 2, 5, true, false),
            objService.createBothSidesKoeriWurst(Settings.FOODCOURT_ID, 2, 10, true, false),
            objService.createTea(Settings.FOODCOURT_ID, 2, 11, true, false),
            objService.createTea(Settings.FOODCOURT_ID, 7, 3, true, false),
            objService.createLowerSideKoeriWurst(Settings.FOODCOURT_ID, 7, 4, true, false),
            objService.createBothSidesKoeriWurst(Settings.FOODCOURT_ID, 7, 9, true, false),
            objService.createTea(Settings.FOODCOURT_ID, 7, 11, true, false),
            objService.createTea(Settings.FOODCOURT_ID, 7, 16, true, false),
            objService.createUpperSideKoeriWurst(Settings.FOODCOURT_ID, 12, 3, true, false),
            objService.createBothSidesKoeriWurst(Settings.FOODCOURT_ID, 12, 4, true, false), 
            objService.createLowerSideKoeriWurst(Settings.FOODCOURT_ID, 12, 9, true, false),
            objService.createBothSidesKoeriWurst(Settings.FOODCOURT_ID, 12, 10, true, false),
            objService.createTea(Settings.FOODCOURT_ID, 12, 16, true, false));

        for (var i = 1; i <= 11; i += 5) {
            listOfGameObjects.push(
                objService.createRightChairBack(Settings.FOODCOURT_ID, i, 3, true, false),
                objService.createRightChairBack(Settings.FOODCOURT_ID, i, 4, true, false),
                objService.createRightChairBack(Settings.FOODCOURT_ID, i, 5, true, false),
                objService.createRightChairBack(Settings.FOODCOURT_ID, i, 9, true, false),
                objService.createRightChairBack(Settings.FOODCOURT_ID, i, 10, true, false),
                objService.createRightChairBack(Settings.FOODCOURT_ID, i, 11, true, false),
                objService.createRightChairBack(Settings.FOODCOURT_ID, i, 16, true, false));
        }

        for (var i = 3; i <= 13; i += 5) {
            listOfGameObjects.push(
                objService.createRightChair(Settings.FOODCOURT_ID, i, 3, true, false),
                objService.createRightChair(Settings.FOODCOURT_ID, i, 4, true, false),
                objService.createRightChair(Settings.FOODCOURT_ID, i, 5, true, false),
                objService.createRightChair(Settings.FOODCOURT_ID, i, 9, true, false),
                objService.createRightChair(Settings.FOODCOURT_ID, i, 10, true, false),
                objService.createRightChair(Settings.FOODCOURT_ID, i, 11, true, false),
                objService.createRightChair(Settings.FOODCOURT_ID, i, 16, true, false));
        }

        listOfGameObjects.push(objService.createCanteenCounter(Settings.FOODCOURT_ID, 1, 3, this.#room.getLength() - 2, 8, true, false));

        listOfGameObjects.push(objService.createDrinkingMachine(Settings.FOODCOURT_ID, 1, 2, this.#room.getLength() - 1, 0, true, false));

        let conferenceLogos = objService.createLeftConferenceLogo(Settings.FOODCOURT_ID, 1, 5, 8, -1, false, false);
        conferenceLogos.forEach(conferenceLogo => {
            listOfMapElements.push(conferenceLogo);
        });

        for (i = 3; i <= 4; i++) {
            for (j = 0; j <= 11; j += 11) {
                listOfMapElements.push(objService.createRightWindowDefault(Settings.FOODCOURT_ID, 1, 1, this.#room.getLength(), i + j, false, false))
            }
        }

        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        listOfNPCs.push(npcService.createChefNPC(Settings.FOODCOURT_ID, this.#room.getLength() - 1, 9, Direction.DOWNLEFT));

        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        listOfDoors.push(doorService.createFoyerDoor(new Position(Settings.FOODCOURT_ID, 2, -1), new Position(Settings.FOYER_ID, 24, 9), Direction.DOWNLEFT, false, DoorClosedMessages.FOODCOURTDOORCLOSED),
            doorService.createEscapeRoomDoor(new Position(Settings.FOODCOURT_ID, this.#room.getLength(), this.#room.getWidth() - 2), 
                new Position(Settings.ESCAPEROOM_ID, RoomDimensions.ESCAPEROOM_LENGTH - 1, RoomDimensions.ESCAPEROOM_WIDTH - 5), Direction.DOWNLEFT, false, DoorClosedMessages.STANDARDDOORCLOSED, '42'));

        listOfMapElements.push(objService.createDefaultLeftTile(Settings.FOODCOURT_ID, 2, -2, false, false), 
            objService.createDefaultRightTile(Settings.FOODCOURT_ID, this.#room.getLength() + 1, this.#room.getWidth() - 2, false, false));


        //Assign lists to room and build occupation map
        this.#room.setMapElements(listOfMapElements);
        this.#room.setGameObjects(listOfGameObjects);
        this.#room.setNPCs(listOfNPCs);
        this.#room.setDoors(listOfDoors);
        this.#room.buildOccMap();
    }

    /**
     * Gets food court room
     * @method module:FoodcourtRoomDecorator#getRoom
     * 
     * @return {Room} room
     */
    getRoom() {
        return this.#room;
    }

    /**
     * Gets asset paths of food court room objects
     * @method module:FoodcourtRoomDecorator#getAssetPaths
     * 
     * @return {Object} assetPaths
     */
    getAssetPaths() {
        return this.#assetPaths;
    }
}