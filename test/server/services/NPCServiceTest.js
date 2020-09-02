const { expect } = require('chai');
const NPCService = require('../../../src/game/app/server/services/NPCService');
const NPC = require('../../../src/game/app/server/models/NPC');
const TestUtil = require('../models/utils/TestUtil');
const Direction = require('../../../src/game/app/client/shared/Direction');


describe('NPCService test', function () {
    it('test create FoyerHelperNPC', function () {
        let npcService = new NPCService();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let direction = Direction.DOWNRIGHT;
        let foyerNPC = npcService.createFoyerHelperNPC(roomId, cordX, cordY, direction);

        expect(foyerNPC).to.be.instanceOf(NPC);
        expect(foyerNPC.getPosition().getRoomId()).to.equal(roomId);
        expect(foyerNPC.getPosition().getCordX()).to.equal(cordX);
        expect(foyerNPC.getPosition().getCordY()).to.equal(cordY);
        expect(foyerNPC.getDirection()).to.equal(direction);
        expect(foyerNPC.getId()).to.be.a('number');
        expect(foyerNPC.getStory()).to.be.an('array');
        foyerNPC.getStory().forEach(line => {
            expect(line).to.be.a('string');
        });
    });

    it('test create BasicTutorialNPC', function () {
        let npcService = new NPCService();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let direction = Direction.DOWNRIGHT;
        let tutorialNPC = npcService.createBasicTutorialNPC(roomId, cordX, cordY, direction);

        expect(tutorialNPC).to.be.instanceOf(NPC);
        expect(tutorialNPC.getPosition().getRoomId()).to.equal(roomId);
        expect(tutorialNPC.getPosition().getCordX()).to.equal(cordX);
        expect(tutorialNPC.getPosition().getCordY()).to.equal(cordY);
        expect(tutorialNPC.getDirection()).to.equal(direction);
        expect(tutorialNPC.getId()).to.be.a('number');
        expect(tutorialNPC.getStory()).to.be.an('array');
        tutorialNPC.getStory().forEach(line => {
            expect(line).to.be.a('string');
        });
    });

    it('test create ChefNPC', function () {
        let npcService = new NPCService();
        let roomId = TestUtil.randomIntWithMin(0);
        let cordX = TestUtil.randomIntWithMin(0);
        let cordY = TestUtil.randomIntWithMin(0);
        let direction = Direction.DOWNRIGHT;
        let chefNPC = npcService.createChefNPC(roomId, cordX, cordY, direction);

        expect(chefNPC).to.be.instanceOf(NPC);
        expect(chefNPC.getPosition().getRoomId()).to.equal(roomId);
        expect(chefNPC.getPosition().getCordX()).to.equal(cordX);
        expect(chefNPC.getPosition().getCordY()).to.equal(cordY);
        expect(chefNPC.getDirection()).to.equal(direction);
        expect(chefNPC.getId()).to.be.a('number');
        expect(chefNPC.getStory()).to.be.an('array');
        chefNPC.getStory().forEach(line => {
            expect(line).to.be.a('string');
        });
    });
});