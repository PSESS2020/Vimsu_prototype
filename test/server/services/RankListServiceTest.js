var RankListService = require('../../../game/app/server/services/RankListService');
const { expect } = require('chai');
var conferenceId = "1";
var participantId = "5f21c3454578240ed8dba986"
var participantId2 = "1";
const db = require('../../../config/db')
const database = new db()

    describe('RankListService getter', function() {

        it('test getRank', function() {
            database.connectDB().then(res => {
                RankListService.getRank(participantId, conferenceId, database).then(rank => {
                    expect(rank).to.eql(1);
                })

                expect(() => RankListService.getRank(participantId2, conferenceId, database)).to.throw(Error);
            })
        });

        it('test getRankListWithUsername', function() {
            database.connectDB().then(res => {
                RankListService.getRankListWithUsername(conferenceId, 10, database).then(rankList => {
                    expect(rankList).to.be.an('array').and.to.have.lengthOf(10);

                })     
            })
        });

    });
    
