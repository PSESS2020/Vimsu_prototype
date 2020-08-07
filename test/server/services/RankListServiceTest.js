var RankListService = require('../../../game/app/server/services/RankListService');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");                             
                                                                                
chai.use(chaiAsPromised);
var conferenceId = "test";
var participantId = "5f2be0d2d135ca621e4f9003"
var participantId2 = "1";
const db = require('../../../config/db');
const database = new db()
database.connectDB().then(res => {

    const getRank = async () => {
        return RankListService.getRank(participantId, conferenceId, database).then(rank => {
            return rank;
        }).catch(err => {
            console.error(err);
        })
    }
    const getRankFailure = async () => {
        return RankListService.getRank(participantId2, conferenceId, database).then(rank => {
            return rank;
        }).catch(err => {
            console.error(err);
        })
    }

    const getRankListWithUsername = async () => {
        return RankListService.getRankListWithUsername(conferenceId, 2, database).then(rankList => {
            return rankList;
        }).catch(err => {
            console.log(err);
        })
    }
    
    describe('RankListService getter', function() {
        var globalResults;

        before(async () => {
            var getRank_result = await getRank();
            var getRankListWithUsername_result = await getRankListWithUsername();
            var getRankFailure_result = await getRankFailure();

            var results = [getRank_result, getRankListWithUsername_result, getRankFailure_result];
            
            Promise.all(results).then( () => {
                globalResults = results;
            }).catch(err => {
                console.log(err);
            })
        })
        
        it('test getRank', function() {
            expect(globalResults[0]).to.eql(1);
        });

        it('test getRank Error', async () => {
            let error = null;
            try {
                await RankListService.getRank(participantId2, conferenceId, database);
            } catch (err) {
                error = err;
            }
            expect(error).to.be.an('Error');
            expect(error.message).to.equal(participantId2 + ' is not in ranklist');

        })

        it('test getRankListWithUsername', function() {
            expect(globalResults[1]).to.be.an('array').and.to.have.lengthOf.above(2);
        });
    });
})
    
    
