const Door = require('../../../game/app/server/models/Door.js');
const TypeOfDoor = require('../../../game/app/client/shared/TypeOfDoor.js');
const Position = require('../../../game/app/server/models/Position.js');
const Direction = require('../../../game/app/client/shared/Direction.js');
const TestUtil = require('./utils/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testMapPosition;
var testTargetPosition;
var testEnterPositions;
var testDirection;
var testDoorId;
var testDoorType;

describe('test Door class functionality', function () {
    
     
    beforeEach( function() {
        testMapPosition = TestUtil.randomPosition();
        testTargetPosition = TestUtil.randomPosition();
        testEnterPositions = TestUtil.randomPositionList();
        testDirection = TestUtil.randomObjectValue(Direction);
        testDoorId = TestUtil.randomInt();
        testDoorType = TestUtil.randomObjectValue(TypeOfDoor);
    });
    
    it('test non-lecture Door constructor', function () {
        for(var i = 0; i < --(Object.keys(TypeOfDoor).length); i++) {
            var doorType = Object.values(TypeOfDoor)[i]
            expect(() => new Door(undefined, doorType, testMapPosition, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
            expect(() => new Door(testDoorId, undefined, testMapPosition, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
            expect(() => new Door(testDoorId, doorType, undefined, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
            expect(() => new Door(testDoorId, doorType, testMapPosition, 
                        undefined, testTargetPosition, testDirection)).to.throw(TypeError);
            expect(() => new Door(testDoorId, doorType, testMapPosition, 
                        testEnterPositions, undefined, testDirection)).to.throw(TypeError);
            expect(() => new Door(testDoorId, doorType, testMapPosition, 
                        testEnterPositions, testTargetPosition, undefined)).to.throw(TypeError);
        };
        
    });
    
    it('test LectureDoor constructor', function () {
        var doorType = TypeOfDoor.LECTURE_DOOR;
        expect(() => new Door(undefined, doorType, testMapPosition, 
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testMapPosition, 
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, doorType, undefined, 
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, doorType, testMapPosition, 
                    undefined, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, doorType, testMapPosition, 
                    testEnterPositions, undefined, testDirection)).not.to.throw();
        expect(() => new Door(testDoorId, doorType, testMapPosition, 
                    testEnterPositions, testTargetPosition, undefined)).not.to.throw();            
    });
    
    it('test getters', function () {
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


