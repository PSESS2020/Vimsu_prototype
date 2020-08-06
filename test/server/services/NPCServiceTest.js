const { expect } = require('chai');
const NPCService = require('../../../game/app/server/services/NPCService');
const NPC = require('../../../game/app/server/models/NPC');
const Settings = require('../../../game/app/utils/Settings');


//Test data
var initNPCService = new NPCService();
//called twice to cover singleton constructor
var npcService = new NPCService();
var foyerID = Settings.FOYER_ID;
var foodCourtID = Settings.FOODCOURT_ID;
var receptionID = Settings.RECEPTION_ID;
var validNPCId = 1;
var invalidNPCId = 42;
var npcName = 'BasicTutorial';

describe('NPCServiceTest getter', function () {
    it('test getNPCs Foyer', function() {
        let foyerNPCs = npcService.getNPCs(foyerID);
        expect(foyerNPCs).to.be.an('array').and.to.have.lengthOf(1);
        foyerNPCs.forEach(npc => {
            expect(npc).to.be.instanceOf(NPC);
        });
    });

    it('test getNPCs Reception', function() {
        let receptionNPCs = npcService.getNPCs(receptionID);
        expect(receptionNPCs).to.be.an('array').and.to.have.lengthOf(1);
        receptionNPCs.forEach(npc => {
            expect(npc).to.be.instanceOf(NPC);
        });
    });

    it('test getNPCs FoodCourt', function() {
        let foodCourtNPCs = npcService.getNPCs(foodCourtID);
        expect(foodCourtNPCs).to.be.an('array').and.to.have.lengthOf(1);
        foodCourtNPCs.forEach(npc => {
            expect(npc).to.be.instanceOf(NPC);
        });
    });

    it('test getNPC valid', function() {
        expect(npcService.getNPC(validNPCId).getName()).equal(npcName);
    });

    it('test getNPC invalid', function() {
        expect(() => npcService.getNPC(invalidNPCId)).to.throw(Error);
    });
});
