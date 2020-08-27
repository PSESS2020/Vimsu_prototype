const Position = require('../../../src/game/app/server/models/Position.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

describe('Position class test', function () {
    
    it('test constructor and getters', function () {
        var testRoomID = Math.floor(Math.random() * 100000);
        var testCordX = Math.floor(Math.random() * 100000);
        var testCordY = Math.floor(Math.random() * 100000);
        
        var testPos = new Position(testRoomID, testCordX, testCordY);
        
        assert.strictEqual(testPos.getRoomId(), testRoomID);
        assert.strictEqual(testPos.getCordX(), testCordX);
        assert.strictEqual(testPos.getCordY(), testCordY);
        
    });
    
    it('test id typeError throw', function () {
        expect(() => new Position("fehler", 0, 0)).to.throw(TypeError, 'not an integer');
    });
    
    it('test cordX typeError throw', function () {
        expect(() => new Position(0, "fehler", 0)).to.throw(TypeError, 'not an integer');
    });
    
    it('test cordY typeError throw', function () {
        expect(() => new Position(0, 0, "fehler")).to.throw(TypeError, 'not an integer');
    });
    
});
