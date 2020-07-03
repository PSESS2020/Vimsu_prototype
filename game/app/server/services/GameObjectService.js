var GameObject = require('../models/GameObject.js');
var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('../models/Position.js')

module.exports = class GameObjectService {

    #objects = [];
    #roomId;
    #roomWidth;
    #roomLength;

    constructor(roomId, roomWidth, roomLength) 
    {
        if(!!ObjectService.instance){
            return ObjectService.instance
        }
 
        ObjectService.instance = this;

        TypeChecker.isInt(roomId);
        TypeChecker.isInt(roomWidth);
        TypeChecker.isInt(roomLength);
        this.#roomId = roomId;
        this.#roomWidth = roomWidth;
        this.#roomLength = roomLength;

        this.initAllObjects();
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
        var max = Math.max(this.#roomWidth, this.#roomLength);
        
        for (var i = 1; i < this.#roomWidth+1; i++) {
            for (var j = 1; j< this.#roomLength+1; i++) {
                this.#objects.push(new GameObject(max*(i-1)+j, "Tile" + max*(i-1)+j, 1, 1, new Position(this.#roomId, i, j), false));
            }
        }

        //this.#objects.push(new GameObject(100*100+1, "Wall" + 1, 100, 50, new Position(1, 1, 1), false));
        //this.#objects.push(new GameObject(100*100+2, "Wall" + 2, 100, 50, new Position(1, 100, 1), false));
    
    }
}