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
const { deleteParticipant, deleteAllParticipants, updateTaskCount } = require('../../../src/game/app/server/services/ParticipantService');

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
            points: 10
         });
    } else if (collectionName === "accounts" && query.accountId === "accountId") {
        return Promise.resolve({
            username: account.getUsername(),
            title: account.getTitle(),
            surname: account.getSurname(),
            forename: account.getForename(),
            job: account.getJob(),
            company: account.getCompany(),
            email: account.getEmail()
        })
    }
    return Promise.resolve(undefined);
};

dbStub.updateOneToCollection = (collectionName, query, update) => {
    if (collectionName === participantCollectionName && query.participantId === "asdf12345") {
        return Promise.resolve(true);
    }
}

dbStub.insertToArrayInCollection = (collectionName, query, queryToPush) => {
    if (collectionName === participantCollectionName && query.participantId === "asdf12345") {
        return Promise.resolve(true);
    } else 
        return Promise.resolve(false);
};

dbStub.deleteFromArrayInCollection = (collectionName, query, toDelete) => {
    if (collectionName === participantCollectionName && query.participantId === "asdf12345") {
        return Promise.resolve(true);
    } else {
        return Promise.resolve(false);
    }
}

dbStub.deleteOneFromCollection = (collectionName, query) => {
    if (collectionName === participantCollectionName && query.participantId === "asdf12345") {
        return Promise.resolve(true);
    } else {
        return Promise.resolve(false);
    }
}

dbStub.deleteAllFromCollection = (collectionName) => {
    if (collectionName === participantCollectionName) {
        return Promise.resolve(true);
    } else {
        return Promise.resolve(false);
    }
}


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
        var businessCard = await ParticipantService.getBusinessCard("asdf12345", conferenceId, dbStub);
        expect(businessCard).to.eql(new BusinessCard("asdf12345", "asdf", "prof", "", "", "", "", ""));     
    })

    it('test updateParticipantPosition', async () => {
        var updatedParticipant = await ParticipantService.updateParticipantPosition("asdf12345", conferenceId, new Position(2, 2, 2), dbStub);
        expect(updatedParticipant).to.eql(true);
    })

    it('test updateParticipantDirection', async () => {
       var updatedParticipant = await ParticipantService.updateParticipantDirection("asdf12345", conferenceId, Direction.DOWNLEFT, dbStub);
       expect(updatedParticipant).to.eql(true);
    })

    it('test getPoints', async () => {
        var points = await ParticipantService.getPoints("asdf12345", conferenceId, dbStub);
        expect(points).to.eql(10);
    })

    it('test updatePoints', async () => {
        var updatedPoints = await ParticipantService.updatePoints("asdf12345", conferenceId, 19, dbStub);
        expect(updatedPoints).to.eql(true);

    })

    it('test deleteAchievement', async () => {
        var deletedAchievement = await ParticipantService.deleteAchievement("asdf12345", conferenceId, 0, dbStub);
        expect(deletedAchievement).to.eql(true);
    })

    it('test getAchievements', async () => {
        var achievements = await ParticipantService.getAchievements("asdf12345", conferenceId, dbStub);
        expect(achievements).to.eql(generateAchievements());
        invalidIdAchievments = await ParticipantService.getAchievements("1234", conferenceId, dbStub);
        expect(invalidIdAchievments).to.eql(false);
    })

    it('test updateAchievementLevel', async () => {
        var updatedAchievement = await ParticipantService.updateAchievementLevel("asdf12345", conferenceId, 0, 1, dbStub);
        expect(updatedAchievement).to.eql(true);
    })

    it('test updateTaskCounts', async () => {
        var updatedTaskCounts = await ParticipantService.updateTaskCounts("asdf12345", conferenceId, [new Task(0, TypeOfTask.FOODCOURTVISIT, 10)], dbStub);
        expect(updatedTaskCounts).to.eql(true);
    })

    it('test getTaskCount', async () => {
        taskCount = await ParticipantService.getTaskCount("asdf12345", conferenceId, TypeOfTask.FOODCOURTVISIT, dbStub);
        expect(taskCount).to.eql(0);
        invalidIdTaskCount =  await ParticipantService.getTaskCount("12345", conferenceId, TypeOfTask.FOODCOURTVISIT, dbStub);
        expect(invalidIdTaskCount).to.eql(false);
    })

    it('test updateTaskCount', async () => {
        var updatedTaskCount = await ParticipantService.updateTaskCount("asdf12345", conferenceId, TypeOfTask.FOODCOURTVISIT, 1, dbStub);
        expect(updatedTaskCount).to.eql(true);
    })

    it('test addChatID', async () => {
        updatesChatId = await ParticipantService.addChatID("asdf12345", "0", conferenceId, dbStub);
        expect(updatesChatId).to.eql(true);
        invalidIdChatId = await ParticipantService.addChatID("12345", "0", conferenceId, dbStub);
        expect(invalidIdChatId).to.eql(false);
    })

    it('test deleteAllParticipants', async () => {
        var deletedAllParticipants = await ParticipantService.deleteAllParticipants(conferenceId, dbStub);
        expect(deletedAllParticipants).to.eql(true);
    })

    it('test deleteParticipant', async () => {
        var deletedParticipant = await ParticipantService.deleteParticipant("asdf12345", conferenceId, dbStub);
        expect(deletedParticipant).to.eql(true);
    })
});