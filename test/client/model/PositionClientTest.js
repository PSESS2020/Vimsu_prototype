const { expect } = require('chai');
const { assert } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const PositionClient = require('../../../src/game/app/client/models/PositionClient.js');

describe('PositionClient test', function () {

    it('test constructor and getters', function () {
        var testCordX = TestUtil.randomInt();
        var testCordY = TestUtil.randomInt();

        var testPos = new PositionClient(testCordX, testCordY);

        assert.equal(testCordX, testPos.getCordX());
        assert.equal(testCordY, testPos.getCordY());
    });

    it('test cordX invalid input', function () {
        expect(() => new PositionClient('fehler', 0)).to.throw(TypeError);
    });

    it('test cordY invalid input', function () {
        expect(() => new PositionClient(0, 'fehler')).to.throw(TypeError);
    });
})