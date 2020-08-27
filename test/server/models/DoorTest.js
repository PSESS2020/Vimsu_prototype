const Door = require('../../../src/game/app/server/models/Door.js');
const TypeOfDoor = require('../../../src/game/app/client/shared/TypeOfDoor.js');
const Position = require('../../../src/game/app/server/models/Position.js');
const Direction = require('../../../src/game/app/client/shared/Direction.js');
const TestUtil = require('./utils/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testDoorId;
var testDoorType;
var testDoorName;
var testMapPosition;
var testEnterPositions;
var testTargetPosition;
var testDirection;


describe('test Door class functionality', function () {
    
     
    beforeEach( function() {
        testDoorId = TestUtil.randomInt();
        testDoorType = TestUtil.randomObjectValue(TypeOfDoor);
        testDoorName = TestUtil.randomString();
        testMapPosition = TestUtil.randomPosition();
        testEnterPositions = TestUtil.randomPositionList();
        testTargetPosition = TestUtil.randomPosition();
        testDirection = TestUtil.randomObjectValue(Direction);
    });
    
    it('test non-lecture Door constructor', function () {
        
        testDoorType = TypeOfDoor.LEFT_DOOR;

        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                        undefined, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                        testEnterPositions, undefined, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                        testEnterPositions, testTargetPosition, undefined)).to.throw(TypeError);

        testDoorType = TypeOfDoor.RIGHT_DOOR;
        
        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined, 
                        testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                        undefined, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                        testEnterPositions, undefined, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                        testEnterPositions, testTargetPosition, undefined)).to.throw(TypeError);
    });
        
    
    
    it('test LectureDoor constructor', function () {
        testDoorType = TypeOfDoor.LECTURE_DOOR;
        expect(() => new Door(undefined, testDoorType, testDoorName, testMapPosition, 
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, undefined, testDoorName, testMapPosition, 
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, undefined, testMapPosition,
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, undefined,
                    testEnterPositions, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                    undefined, testTargetPosition, testDirection)).to.throw(TypeError);
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                    testEnterPositions, undefined, testDirection)).not.to.throw();
        expect(() => new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                    testEnterPositions, testTargetPosition, undefined)).not.to.throw();            
    });
    
    it('test getters', function () {
        var testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                                    testEnterPositions, testTargetPosition, testDirection);
        assert.strictEqual(testDoor.getId(), testDoorId);
        assert.strictEqual(testDoor.getTypeOfDoor(), testDoorType);
        assert.strictEqual(testDoor.getName(), testDoorName);
        assert.strictEqual(testDoor.getStartingRoomId(), testMapPosition.getRoomId());
        assert.strictEqual(testDoor.getTargetRoomId(), testTargetPosition.getRoomId());
        assert.strictEqual(testDoor.getMapPosition(), testMapPosition);
        assert.strictEqual(testDoor.getTargetPosition(), testTargetPosition);
        assert.strictEqual(testDoor.getEnterPositions(), testEnterPositions);
        assert.strictEqual(testDoor.getDirection(), testDirection);
    });        
    
    it('test ValidEnterPosition check', function () {
        var testIllegalPositions = TestUtil.randomPositionList();
        var testDoor = new Door(testDoorId, testDoorType, testDoorName, testMapPosition, 
                                    testEnterPositions, testTargetPosition, testDirection);
        testIllegalPositions.forEach( (position) => {
            expect(testDoor.isValidEnterPosition(position)).to.be.false;
        });
        testEnterPositions.forEach( (position) => {
            expect(testDoor.isValidEnterPosition(position)).to.be.true;
        });
    });
    
});


