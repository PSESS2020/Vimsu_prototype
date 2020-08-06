const Door = require('../../../game/app/server/models/Door.js');
const TypeOfDoor = require('../../../game/app/utils/TypeOfDoor.js');
const Position = require('../../../game/app/server/models/Position.js');
const Direction = require('../../../game/app/utils/Direction.js');
const TestUtil = require('./TestData/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testMapPosition;
var testTargetPosition;
var testEnterPositions;
var testDirection;

describe('test Door class functionality', function () {
    
     
    beforeEach( function() {
        testMapPosition = TestUtil.randomPosition();
        testTargetPosition = TestUtil.randomPosition();
        testEnterPositions = TestUtil.randomPositionList();
        testDirection = TestUtil.randomObjectValue(Direction);
    });
    
    it('test non-lecture Door constructor', function () {
        for(var i = 0; i < --(Object.keys(TypeOfDoor).length); i++) {
            var doorType = Object.values(TypeOfDoor)[i]
            expect(() => new Door(undefined, doorType, testMapPosition, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
            expect(() => new Door(TestUtil.randomInt(), undefined, testMapPosition, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
            expect(() => new Door(TestUtil.randomInt(), doorType, undefined, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
            expect(() => new Door(TestUtil.randomInt(), doorType, testMapPosition, 
                        undefined, testTargetPosition, testDirection)).to.throw(TypeError);
            expect(() => new Door(TestUtil.randomInt(), doorType, testMapPosition, 
                        testEnterPositions, undefined, testDirection)).to.throw(TypeError);
            expect(() => new Door(TestUtil.randomInt(), doorType, testMapPosition, 
                        testEnterPositions, testTargetPosition, undefined)).to.throw(TypeError);
        };
        
    });
    
    it('test LectureDoor constructor', function () {
        var doorType = TypeOfDoor.LECTUREDOOR;
        expect(() => new Door(undefined, doorType, testMapPosition, 
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(TestUtil.randomInt(), doorType, undefined, 
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(TestUtil.randomInt(), doorType, testMapPosition, 
                    undefined, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(TestUtil.randomInt(), doorType, testMapPosition, 
                    testEnterPositions, undefined, testDirection)).to.throw(TypeError);
    });
    
    it('test getters', function () {
        var testDoorId = TestUtil.randomInt();
        var testDoorType = TestUtil.randomObjectValue(TypeOfDoor);
        var testDoor = new Door(testDoorId, testDoorType, testMapPosition, 
                                    testEnterPositions, testTargetPosition, testDirection);
        assert.strictEqual(testDoor.getId(), testDoorId);
        assert.strictEqual(testDoor.getTypeOfDoor(), testDoorType);
        assert.strictEqual(testDoor.getStartingRoomId(), testMapPosition.getRoomId());
        assert.strictEqual(testDoor.getTargetRoomId(), testTargetPosition.getRoomId());
        assert.strictEqual(testDoor.getMapPosition(), testMapPosition);
        assert.strictEqual(testDoor.getTargetPosition(), testTargetPosition);
        assert.strictEqual(testDoor.getEnterPositions(), testEnterPositions);
        assert.strictEqual(testDoor.getDirection(), testDirection);
    });        
    
    it('test ValidEnterPosition check', function () {
        var testIllegalPositions = TestUtil.randomPositionList();
        var testDoor = new Door(testDoorId, testDoorType, testMapPosition, 
                                    testEnterPositions, testTargetPosition, testDirection);
        testIllegalPositions.forEach( (position) => {
            expect(testDoor.isValidEnterPosition(position)).to.be.false;
        });
        testEnterPositions.forEach( (position) => {
            expect(testDoor.isValidEnterPosition(position)).to.be.true;
        });
    });
    
});


