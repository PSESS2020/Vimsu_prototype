var RankListService = require('../../../game/app/server/services/RankListService');
const { expect } = require('chai');
var conferenceId = "test";
var participantId = "5f2be0d2d135ca621e4f9003"
var participantId2 = "1";
const db = require('../../../config/db');
const database = new db()
database.connectDB().then(res => {
    describe('RankListService getter', function() {

        it('test getRank', function() {
            RankListService.getRank(participantId, conferenceId, database).then(rank => {
                expect(rank).to.eql(1);
            })
        });

        it('test getRank Error', function() {
            try {
                RankListService.getRank(participantId2, conferenceId, database)
            } catch {
                expect(err).to.be.eql(new Error(participantId2 + ' is not in ranklist'));
            }
        })

        it('test getRankListWithUsername', function() {
            RankListService.getRankListWithUsername(conferenceId, 2, database).then(rankList => {
                expect(rankList).to.be.an('array').and.to.have.lengthOf.above(2);
            })
        });
    });
})
    
    
