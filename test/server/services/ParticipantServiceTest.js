const AccountService = require('../../../src/website/services/AccountService');
const ParticipantService = require('../../../src/game/app/server/services/ParticipantService');
const TaskService = require('../../../src/game/app/server/services/TaskService.js');
const ServiceTestData = require('./TestData/ServiceTestData.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { assert } = require('chai');
const sinon = require('sinon');

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
const Account = require('../../../src/website/models/Account');
const Participant = require('../../../src/game/app/server/models/Participant');
const BusinessCard = require('../../../src/game/app/server/models/BusinessCard');
const FriendList = require('../../../src/game/app/server/models/FriendList');

function generateTasks() {
    var tasks = {};
    new TaskService().getAllTasks().forEach(x => {
        tasks[x.getTaskType()] = 0
    })
    return tasks;

}


function generateAchievements() {
    var achievements = [];
    for (var i = 1; i <= 10; i++) {
        achievements.push({
            id: i,
            currentLevel: 0
        })
    }
    return achievements;

}


var participantCollectionName = "participants_" + conferenceId;
var chatCollectionName = "chats_" + conferenceId;
var account = new Account("accountId", "asdf", "prof", "", "", "", "", "");
var participant = new Participant("asd", account.getAccountID(), new BusinessCard("", "", "", "", "", "", "", ""), new Position(0, 0, 0), Direction.UPRIGHT, new FriendList([]), new FriendList([]), new FriendList([]), [], [], false, 0, []);

const dbStub = sinon.createStubInstance(db);
dbStub.findOneInCollection = (collectionName, query, projection) => {

    if (collectionName === participantCollectionName && (query.accountId === "accountId" || query.participantId === "asdf12345")) {
        return Promise.resolve({ 
            participantId: "asdf12345",
            chatIDList: [],
            friendIds: [],
            friendRequestIds: {
                sent: [],
                received: []
            },
            accountId: "accountId",
            achievements: generateAchievements(),
            position: {
                roomId: 1,
                cordX: 18,
                cordY: 15
            },
            direction: Direction.DOWNLEFT,
            taskCount: generateTasks(),
            isModerator: false,
            points: 0
         });
    } else if (collectionName === "accounts" && query.accountId === "accountId") {
        return Promise.resolve({username: account.getUsername()})
    }
    return Promise.resolve(undefined);
};


describe('Participant Service Test', () => {
    it('test createParticipant', async () => {
        var participant = await ParticipantService.createParticipant(account, conferenceId, dbStub);
        expect(participant).to.be.instanceOf(Participant);
    });

    it('test getUsername', async () => {
        var username = await ParticipantService.getUsername("asdf12345", conferenceId, dbStub);
        expect(username).to.eql("asdf");

        var noneUser = await ParticipantService.getUsername("1234556", conferenceId, dbStub);
        expect(noneUser).to.eql(false);
    })

    it('test getBusinessCard', async () => {
        var businessCard = await ParticipantService.getBusinessCard(participant.getId(), conferenceId, dbStub);

    })

    it('test updateParticipantPosition', async () => {
        await ParticipantService.updateParticipantPosition(participant.getId(), conferenceId, new Position(1, 10, 10), dbStub)
    })

    it('test updateParticipantDirection', async () => {
        await ParticipantService.updateParticipantDirection(participant.getId(), conferenceId, Direction.DOWNLEFT, dbStub);
    })

    it('test getPoints', async () => {
        await ParticipantService.getPoints(participant.getId(), conferenceId, dbStub);
    })

    it('test updatePoints', async () => {
        await ParticipantService.updatePoints(participant.getId(), conferenceId, 19, dbStub);
    })

    it('test deleteAchievement', async () => {
        await ParticipantService.deleteAchievement(participant.getId(), conferenceId, 0, dbStub);
    })

    it('test getAchievements', async () => {
        await ParticipantService.getAchievements(participant.getId(), conferenceId, dbStub);
    })

    it('test updateAchievementLevel', async () => {
        await ParticipantService.updateAchievementLevel(participant.getId(), conferenceId, 0, 1, dbStub);
    })

    it('test updateTaskCounts', async () => {
        await ParticipantService.updateTaskCounts(participant.getId(), conferenceId, [new Task(0, TypeOfTask.FOODCOURTVISIT, 10)], dbStub);
    })

    it('test getTaskCount', async () => {
        await ParticipantService.getTaskCount(participant.getId(), conferenceId, TypeOfTask.FOODCOURTVISIT, dbStub);
    })

    it('test updateTaskCount', async () => {
        await ParticipantService.updateTaskCount(participant.getId(), conferenceId, TypeOfTask.FOODCOURTVISIT, 1, dbStub);
    })

    it('test addChatID', async () => {
        await ParticipantService.addChatID(participant.getId(), "0", conferenceId, dbStub);
    })

    it('test deleteAllParticipants', async () => {
        //
    })

    it('test deleteParticipant', async () => {
        //
    })
});