const Position = require('../../../../game/app/server/models/Position.js');

class TestUtil {
    
    static randomInt() {
        return Math.floor((Math.random() * 1000000) - 500000);
    };

    static randomPosition() {
        return (new Position(this.randomInt(), this.randomInt(), this.randomInt()));
    };
    
    static randomPositionList() {
        var listToReturn = [];
        var amount = Math.floor(Math.random() * 100);
        for (var i = 0; i < amount; i++) {
           listToReturn.push(this.randomPosition()); 
        }
        return listToReturn;
    };

    static randomObjectValue(object) {
        return Object.values(object)[Math.floor(Math.random() * Object.values(object).length)];
    };
    
}

module.exports = TestUtil
