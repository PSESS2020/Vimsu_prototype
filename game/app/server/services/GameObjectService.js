var GameObject = require('../models/GameObject.js');
const TypeChecker = require('../../../../config/TypeChecker.js');
var Position = require('../models/Position.js')
var TypeOfRoom = require('../../utils/TypeOfRoom.js');
const Settings = require('../../utils/Settings.js');

module.exports = class GameObjectService {

    #objects;

    constructor() {
        if(!!GameObjectService.instance){
            return GameObjectService.instance;
        }

        GameObjectService.instance = this;
        this.#objects = [];
        this.initAllObjects();
    }

    getObjects(roomId)
    {
        TypeChecker.isInt(roomId);
        
        var roomObjects = [], i;

        for(i = 0; i < this.#objects.length; i++){
            if (this.#objects[i].getPosition().getRoomId() === roomId) {
                roomObjects.push(this.#objects[i]);
            }
        }

        if (roomObjects.length < 1) {
            throw new Error("there are no objects in this " + roomId)
        }

        return roomObjects;
    }

    getObject(id)
    {
        TypeChecker.isInt(id);

        let index = this.#objects.findIndex(object => object.getId() === id);

        if (index < 0) 
        {
            throw new Error(id + " is not in list of objects")
        }

        return this.#objects[index];
    }

    initAllObjects()
    {    
        
        //FOYER OBJECTS
        for (var i = 4; i < 9; i++)
            this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.FOYER_ID, i, 0), true));

        //RECEPTION OBJECTS
        for (var i = 3; i <= 9; i++) {
            this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.RECEPTION_ID, 10, i), true));
        }
        this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.RECEPTION_ID, 11, 9), true));
        this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.RECEPTION_ID, 12, 9), true));
        this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.RECEPTION_ID, 11, 3), true));
        this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.RECEPTION_ID, 12, 3), true));
        

        //FOOD COURT OBJECTS
        for (var i = 2; i <= 10; i++) {
            this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.FOODCOURT_ID, 10, i), true));
            this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.FOODCOURT_ID, 8, i), true));
            this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.FOODCOURT_ID, 6, i), true));
            this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.FOODCOURT_ID, 4, i), true));
            this.#objects.push(new GameObject(1, "table" + 1, 1, 1, new Position(Settings.FOODCOURT_ID, 2, i), true));
        }
    }
}
