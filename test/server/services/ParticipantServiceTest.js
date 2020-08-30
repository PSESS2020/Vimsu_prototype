const AccountService = require('../../../src/website/services/AccountService');
const ParticipantService = require('../../../src/game/app/server/services/ParticipantService');
const ServiceTestData = require('./TestData/ServiceTestData.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { assert } = require('chai');

var conferenceId = ServiceTestData.conferenceId_1;

var account;
var account1 = {
    username: "maxmustertaler",
    title: "Prof.",
    surname: "Mustermann",
    forename: "Max",
    job: "Professor",
    company: "KIT",
    email: "maxmustertaler@kit.edu",
    password: "maxpassword1234"
}
var suffix = "_test"
var participant;


const db = require('../../../src/config/db');
const Position = require('../../../src/game/app/server/models/Position');
const Direction = require('../../../src/game/app/client/shared/Direction');
const Task = require('../../../src/game/app/server/models/Task');
const TypeOfTask = require('../../../src/game/app/server/utils/TypeOfTask');
const database = new db()
database.connectDB().then(res => {
    describe('Participant Service Test', () => {
        before(async () => {
            account = await AccountService.createAccount(account1.username, account1.title, account1.surname,
                account1.forename, account1.job, account1.company, account1.email, account1.password, suffix, database);
        });

        it('test createParticipant', async () => {
            participant = await ParticipantService.createParticipant(account, conferenceId, database);
            assert.notEqual(participant, "asd")
        });
    
        it('test getUsername', async (done) => {
            // TODO: check with working account
            var username = await ParticipantService.getUsername(participant.getId(), conferenceId, database);

            var failedTest = await ParticipantService.getUsername("asdf", conferenceId, database);
            assert.equal(failedTest, false)
            done();
        })
    
        it('test getBusinessCard', async (done) => {
            var businessCard = await ParticipantService.getBusinessCard(participant.getId(), conferenceId, database);
            done();
        })
    
        it('test updateParticipantPosition', async (done) => {
            await ParticipantService.updateParticipantPosition(participant.getId(), conferenceId, new Position(1, 10, 10), database)
            done();
        })
    
        it('test updateParticipantDirection', async () => {
            await ParticipantService.updateParticipantDirection(participant.getId(), conferenceId, Direction.DOWNLEFT, database);
        })
    
        it('test getPoints', async () => {
            await ParticipantService.getPoints(participant.getId(), conferenceId, database);
        })
    
        it('test updatePoints', async () => {
            await ParticipantService.updatePoints(participant.getId(), conferenceId, 19, database);
        })
    
        it('test deleteAchievement', async () => {
            await ParticipantService.deleteAchievement(participant.getId(), conferenceId, 0, database);
        })
    
        it('test getAchievements', async () => {
            await ParticipantService.getAchievements(participant.getId(), conferenceId, database);
        })
    
        it('test updateAchievementLevel', async () => {
            await ParticipantService.updateAchievementLevel(participant.getId(), conferenceId, 0, 1, database);
        })
    
        it('test updateTaskCounts', async () => {
            await ParticipantService.updateTaskCounts(participant.getId(), conferenceId, [new Task(0, TypeOfTask.FOODCOURTVISIT, 10)], database);
        })
    
        it('test getTaskCount', async () => {
            await ParticipantService.getTaskCount(participant.getId(), conferenceId, TypeOfTask.FOODCOURTVISIT, database);
        })
    
        it('test updateTaskCount', async () => {
            await ParticipantService.updateTaskCount(participant.getId(), conferenceId, TypeOfTask.FOODCOURTVISIT, 1, database);
        })
    
        it('test addChatID', async () => {
            await ParticipantService.addChatID(participant.getId(), "0", conferenceId, database);
        })
    
        it('test deleteAllParticipants', async () => {
            //
        })
    
        it('test deleteParticipant', async () => {
            //
        })

        after(async () => {
            ParticipantService.deleteParticipant(participant.getId(), conferenceId, database);
            AccountService.deleteAccount(account.getAccountID(), suffix, database);
        })
    });
});

