
const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../utils/TestUtil.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');

describe('PositionClient test', function() {

    it('test constructor and getters', function() {
        var testCordX = TestUtil.randomInt();
        var testCordY = TestUtil.randomInt();

        var testPos = new PositionClient(testCordX, testCordY);

        assert.equal(testCordX, testPos.getCordX());
        assert.equal(testCordY, testPos.getCordY());
    });

    it('test cordX invalid input', function () {
        expect(() => new PositionClient('fehler', 0)).to.throw(TypeError, 'fehler or 0 is not a number!');
    });

    it('test cordY invalid input', function () {
        expect(() => new PositionClient(0, 'fehler')).to.throw(TypeError, '0 or fehler is not a number!');
    });
})