var RankListService = require('../../../src/game/app/server/services/RankListService');
var ParticipantService = require('../../../src/game/app/server/services/ParticipantService')
var Account = require('../../../src/website/models/Account')
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const ServiceTestData = require('./TestData/ServiceTestData.js');

chai.use(chaiAsPromised);
var conferenceId = ServiceTestData.conferenceId_1;
var participantId1, participantId2, participantId3;
var participantId_broken = "1";
const db = require('../../../src/config/db');
const database = new db()
database.connectDB().then(res => {

    const newParticipant1 = async () => {
        var account = new Account("123a", "testuserA", "Mr.", "User", "Test", "Employee", "Abc", "testuserA@test.com")
        return ParticipantService.createParticipant(account, conferenceId, database).then(par => {
            participantId1 = par.getId();
            return ParticipantService.updatePoints(participantId1, conferenceId, 100000, database);
        }).catch(err => {
            console.error(err);
        })
    }

    const newParticipant2 = async () => {
        var account = new Account("123b", "testuserB", "Mr.", "User", "Test", "Employee", "Abc", "testuserB@test.com")
        return ParticipantService.createParticipant(account, conferenceId, database).then(par => {
            participantId2 = par.getId()
            return ParticipantService.updatePoints(participantId2, conferenceId, 5000, database);
        }).catch(err => {
            console.error(err);
        })
    }

    const newParticipant3 = async () => {
        var account = new Account("123c", "testuserC", "Mr.", "User", "Test", "Employee", "Abc", "testuserC@test.com")
        return ParticipantService.createParticipant(account, conferenceId, database).then(par => {
            participantId3 = par.getId()
            return ParticipantService.updatePoints(participantId3, conferenceId, 1000, database);
        }).catch(err => {
            console.error(err);
        })
    }

    const getRank = async () => {
        return RankListService.getRank(participantId1, conferenceId, database).then(rank => {
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

    describe('RankListService getter', function () {
        var globalResults;

        before(async () => {
            var newParticipant1_result = await newParticipant1();
            var newParticipant2_result = await newParticipant2();
            var newParticipant3_result = await newParticipant3();

            var getRank_result = await getRank();
            var getRankListWithUsername_result = await getRankListWithUsername();

            var newParticipantResults = [newParticipant1_result, newParticipant2_result, newParticipant3_result]

            var getterResults = [getRank_result, getRankListWithUsername_result]

            Promise.all(newParticipantResults).then(() => {
                Promise.all(getterResults).then(() => {
                    globalResults = getterResults;
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        })

        it('test getRank', function () {
            expect(globalResults[0]).to.eql(1);
        });

        it('test getRank wrongID', async () => {

            return RankListService.getRank(participantId_broken, conferenceId, database).then(rank => {
                expect(rank).to.equal(undefined);
            });
        })

        it('test getRankListWithUsername', function () {
            expect(globalResults[1]).to.be.an('array').and.to.have.lengthOf.above(1);
        });

        after(async () => {
            ParticipantService.deleteParticipant(participantId1, conferenceId, database);
            ParticipantService.deleteParticipant(participantId2, conferenceId, database);
            ParticipantService.deleteParticipant(participantId3, conferenceId, database);
        })
    });
})


