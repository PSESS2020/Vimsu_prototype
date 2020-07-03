var GameObject = require('../models/GameObject.js');
var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('../models/Position.js')
var TypeOfRoom = require('../models/TypeOfRoom.js');

module.exports = class GameObjectService {

    #objects;

    constructor() {
        if(!!ObjectService.instance){
            return ObjectService.instance;
        }

        ObjectService.instance = this;
        this.#objects = [];
    }

    getObjects(roomId, typeOfRoom)
    {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnum(typeOfRoom, TypeOfRoom);

        var roomObjects = [], i;

        this.#initAllObjects(roomId, typeOfRoom);

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

    #initAllObjects = function(roomId, typeOfRoom) 
    {    
        if (typeOfRoom === 'FOYER') {
            for (var i = 1; i < 100; i++) {
                for (var j = 1; j< 100; i++) {
                    this.#objects.push(new GameObject(100*(i-1)+j, "Tile" + (i-1)+j, 1, 1, new Position(roomId, i, j), false));
                }
            }

            //Anderen Objekte für Foyer
        }

        else if (typeOfRoom === 'RECEPTION') {
            //Objekte für Rezeption
        }

        //this.#objects.push(new GameObject(100*100+1, "Wall" + 1, 100, 50, new Position(1, 1, 1), false));
        //this.#objects.push(new GameObject(100*100+2, "Wall" + 2, 100, 50, new Position(1, 100, 1), false));
    }
}