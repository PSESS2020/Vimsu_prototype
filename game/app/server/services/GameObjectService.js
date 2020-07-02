var GameObject = require('../models/GameObject.js');
var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('../models/Position.js')

module.exports = class GameObjectService {

    #objects = [];

    constructor() 
    {
        if(!!ObjectService.instance){
            return ObjectService.instance
        }
 
        ObjectService.instance = this;
        this.#initAllObjects;
    }

    getAllObjects()
    {
        return this.#objects;
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
        var i, j;
        for (i = 1; i < 101; i++) {
            for (j = 1; j< 101; i++) {
                this.#objects.push(new GameObject(100*(i-1)+j, "Tile" + 100*(i-1)+j, 1, 1, new Position(1, i, j), false));
            }
        }

        this.#objects.push(new GameObject(100*100+1, "Wall" + 1, 100, 50, new Position(1, 1, 1), false));
        this.#objects.push(new GameObject(100*100+2, "Wall" + 2, 100, 50, new Position(1, 100, 1), false));
    
    }
}