const { expect } = require('chai');
const TestUtil = require('../../server/models/utils/TestUtil.js');
const DirectionClient = require('../../../game/app/client/utils/DirectionClient.js');
const PositionClient = require('../../../game/app/client/models/PositionClient.js');
const ParticipantClient = require('../../../game/app/client/models/ParticipantClient.js');
const Direction = require('../../../game/app/utils/Direction.js');

//test data
var id = TestUtil.randomString();
var username = TestUtil.randomString();
var position = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());
var direction = DirectionClient.DOWNLEFT;
var ppant = new ParticipantClient(id, username, position, direction);

describe('ParticipantClient test', function() {
    it('test getters', function() {
        expect(ppant.getId()).to.be.a('string').and.to.equal(id);
        expect(ppant.getUsername()).to.be.a('string').and.to.equal(username);
        expect(ppant.getPosition()).to.be.instanceOf(PositionClient).and.to.equal(position);
        expect(ppant.getDirection()).to.equal(direction);
    });

    it('test set new valid position', function() {
        let newPosition = new PositionClient(TestUtil.randomInt(), TestUtil.randomInt());
        ppant.setPosition(newPosition);
        expect(ppant.getPosition()).to.be.instanceOf(PositionClient).and.to.equal(newPosition);
    });

    it('test set new valid direction', function() {
        let newDirection = DirectionClient.DOWNRIGHT;
        ppant.setDirection(newDirection);
        expect(ppant.getDirection()).to.equal(newDirection);
    });

    it('test set new invalid position', function() {
        expect(() => ppant.setPosition('newPosition')).to.throw(TypeError);
    });

    it('test set new invalid direction', function() {
        expect(() => ppant.setDirection('newDirection')).to.throw(TypeError);
    });
});