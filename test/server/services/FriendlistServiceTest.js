const chai = require("chai");
const expect = chai.expect;
const sinon = require('sinon');
const FriendListService = require('../../../src/game/app/server/services/FriendListService');
const Settings = require('../../../src/game/app/server/utils/' + process.env.SETTINGS_FILENAME);
const ServiceTestData = require('./TestData/ServiceTestData.js');

const db = require('../../../src/config/db');
const FriendList = require("../../../src/game/app/server/models/FriendList");
var conferenceId = ServiceTestData.conferenceId_1;
var friendListIds;
var usedCollectionName = "participants_" + conferenceId;
var friendListOwner = "42";
var newFriend = "37";

var participants = {
    "123": { participantId: "123", accountId: "accountID123" },
    "456": { participantId: "456", accountId: "accountID456" },
    "678": { participantId: "678", accountId: "accountID678" }
}

var accounts = {
    accountID123: {
        username: "maxmust",
        title: "Prof.",
        surname: "Mustermann",
        forename: "Max",
        job: "Professor",
        company: "KIT",
        email: "maxmustermann@kit.edu",
        password: "maxpassword"
    },

    accountID456: {
        username: "alice",
        title: "Prof.",
        surname: "Alice",
        forename: "Alice",
        job: "Professor",
        company: "KIT",
        email: "alice@kit.edu",
        password: "alice"
    },

    accountID678: {
        username: "bob",
        title: "Prof.",
        surname: "Bob",
        forename: "Bob",
        job: "Professor",
        company: "KIT",
        email: "bob@kit.edu",
        password: "bob"
    }
}

const dbStub = sinon.createStubInstance(db);
dbStub.findOneInCollection = (collectionName, query, projection) => {
    if (collectionName === usedCollectionName && query.participantId === friendListOwner) {

        //Promise needed for .then{} block in Service
        return Promise.resolve({ friendIds: ["123", "456", "678"] });
    } else if (collectionName === usedCollectionName && query.participantId === newFriend) {

        return Promise.resolve(true);
    } else if (collectionName.startsWith("accounts")) {

        return Promise.resolve(accounts[query.accountId]);
    } else if (projection === "") {

        return Promise.resolve(participants[query.participantId]);
    } else return Promise.resolve(false);
};

dbStub.insertToArrayInCollection = (collectionName, query, queryToPush) => {
    if (collectionName === usedCollectionName && query.participantId === friendListOwner) {
        friendListIds.push(queryToPush.friendIds);

        return Promise.resolve(true);
    } else
        return Promise.resolve(false);
};

dbStub.deleteFromArrayInCollection = (collectionName, query, queryToPull) => {
    let result = false;

    if (collectionName === usedCollectionName && query.participantId === friendListOwner) {
        if (queryToPull.friendIds instanceof Object &&
            queryToPull.friendIds.hasOwnProperty("$exists") &&
            queryToPull.friendIds["$exists"] === true) {

            friendListIds = [];

            result = true;
        } else {

            let idx = friendListIds.findIndex(x => x === queryToPull.friendIds);

            //-1 indicates that no index was found.
            if (idx !== -1) {
                friendListIds.splice(idx, 1);

                result = true;
            }
        }
    }
    return Promise.resolve(result);
};

describe("FriendListService Test", () => {
    beforeEach(() => {
        friendListIds = ["456", "678"];
    });

    it('Test load FriendList', async () => {
        var friendList = await FriendListService.loadFriendList(friendListOwner, conferenceId, dbStub);
        expect(friendList).to.be.instanceOf(FriendList);

        var businessCards = friendList.getAllBusinessCards();
        var businessCardIds = [];

        expect(businessCards).to.be.an('array').and.to.have.lengthOf(3);

        businessCards.forEach(card => {
            businessCardIds.push(card.getParticipantId());
        });
        expect(businessCardIds).to.be.an('array').and.to.have.members(["123", "456", "678"]).and.to.have.lengthOf(3);
    });

    it('Test load FriendList with invalid owner id', async () => {
        var friendList = await FriendListService.loadFriendList("111", conferenceId, dbStub);
        expect(friendList).to.be.a('boolean').and.to.be.false;
    });

    it('Test store Friend with valid conferenceId', async () => {
        //await needed for casting from Promise to boolean
        var result = await FriendListService.storeFriend(friendListOwner, newFriend, conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(friendListIds).to.have.members(["456", "678", newFriend]).and.to.have.lengthOf(3);
    });

    it('Test store Friend with invalid conferenceId', async () => {
        var result = await FriendListService.storeFriend(friendListOwner, newFriend, '0', dbStub);

        expect(result).to.be.a('boolean').and.to.be.false;
        expect(friendListIds).to.have.members(friendListIds).and.to.have.lengthOf(2);
    });

    it('Test remove Friend with valid friendId', async () => {
        var result = await FriendListService.removeFriend(friendListOwner, "678", conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(friendListIds).to.have.members(["456"]).and.to.have.lengthOf(1);
    });

    it('Test remove all Friends from friendlist', async () => {
        var result = await FriendListService.removeAllFriends(friendListOwner, conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(friendListIds).to.have.members([]).and.to.have.lengthOf(0);
    });
})
