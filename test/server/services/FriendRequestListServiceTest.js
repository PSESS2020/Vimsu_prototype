const chai = require("chai");
const expect = chai.expect;
const sinon = require('sinon');
const FriendRequestListService = require('../../../src/game/app/server/services/FriendRequestListService');
const ServiceTestData = require('./TestData/ServiceTestData.js');                       


const db = require('../../../src/config/db');

var conferenceId = ServiceTestData.conferenceId_1;
var sendFriendRequestListIds;
var receivedFriendRequestListIds;
var usedCollectionName = "participants_" + conferenceId;
var friendRequestListOwner = "42";
var newSentRequestId = "37";
var newReceivedRequestId = "1337";

const dbStub = sinon.createStubInstance(db);
dbStub.findOneInCollection = (collectionName, query, projection) => {
    if (collectionName === usedCollectionName && query.participantId === friendRequestListOwner) {

        //Promise needed for .then{} block in Service
        if (projection.hasOwnProperty("friendRequestIds.sent")) {

            return Promise.resolve( {friendRequestId: {sent: ["123", "456", "678"]} } );
        } else if (projection.hasOwnProperty("friendRequestIds.received")) {

            return Promise.resolve( {friendRequestId: {received: ["96", "85", "74"]} } );
        }
    } else  return Promise.resolve(false);
};

dbStub.insertToArrayInCollection = (collectionName, query, queryToPush) => {
    if (collectionName === usedCollectionName && query.participantId === friendRequestListOwner) {

        if (queryToPush.hasOwnProperty("friendRequestIds.sent")) {

            sendFriendRequestListIds.push(queryToPush["friendRequestIds.sent"]);

            return Promise.resolve(true);
        } else if (queryToPush.hasOwnProperty("friendRequestIds.received")) {
            receivedFriendRequestListIds.push(queryToPush["friendRequestIds.received"]);

            return Promise.resolve(true);
        }
    } else 
        return Promise.resolve(false);
};

dbStub.deleteFromArrayInCollection = (collectionName, query, queryToPull) => {
    let result = false;

    if (collectionName === usedCollectionName && query.participantId === friendRequestListOwner) {
            
            if (queryToPull.hasOwnProperty("friendRequestIds.sent")) {
                if (queryToPull["friendRequestIds.sent"]["$exists"] === true) {
                    sendFriendRequestListIds = [];

                    result = true;
                } else {
                    let idx = sendFriendRequestListIds.findIndex( x => x === queryToPull["friendRequestIds.sent"]);

                    //-1 indicates that no index was found.
                    if (idx !== -1) {
                        sendFriendRequestListIds.splice(idx, 1);
    
                        result = true;
                    }
                }
            } else if(queryToPull.hasOwnProperty("friendRequestIds.received")) {
                if (queryToPull["friendRequestIds.received"]["$exists"] === true) {
                    receivedFriendRequestListIds = [];

                    result = true;
                } else {
                    let idx = receivedFriendRequestListIds.findIndex( x => x === queryToPull["friendRequestIds.received"]);

                    //-1 indicates that no index was found.
                    if (idx !== -1) {
                        receivedFriendRequestListIds.splice(idx, 1);
    
                        result = true;
                    }
                }
            } 
        }
    return Promise.resolve(result);
};

describe("FriendRequestListService Test", () => {
    beforeEach( () => {
        sendFriendRequestListIds = ["456", "678"];
        receivedFriendRequestListIds = ["322", "0815"];
    });

    it('Test getSentRequestList', async () => {
        var sendFriendRequestList = await FriendRequestListService.getSentRequestList(friendRequestListOwner, conferenceId, dbStub);
        expect(sendFriendRequestList).to.be.instanceOf(Object);

        expect(sendFriendRequestList).to.be.an('array').and.to.have.members(["123", "456", "678"]).and.to.have.lengthOf(3);
    });

    it('Test getSentRequestList with invalid friend request list owner id', async () => {
        var receivedFriendRequestList = await FriendRequestListService.getSentRequestList("111", conferenceId, dbStub);
        expect(receivedFriendRequestList).to.be.a('boolean').and.to.be.false;
    });

    it('Test store SentFriendRequest with valid conferenceId', async () => {
        //await needed for casting from Promise to boolean
        var result = await FriendRequestListService.storeSentFriendRequest(friendRequestListOwner, newSentRequestId, conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(sendFriendRequestListIds).to.have.members( ["456", "678", newSentRequestId] ).and.to.have.lengthOf(3);
    });

    it('Test store SentFriendRequest with invalid conferenceId', async() => {
        var result = await FriendRequestListService.storeSentFriendRequest(friendRequestListOwner, newSentRequestId, '0', dbStub);

        expect(result).to.be.a('boolean').and.to.be.false;
        expect(sendFriendRequestListIds).to.have.members( ["456", "678"] ).and.to.have.lengthOf(2);
    });

    it('Test remove SentFriendRequest with valid requestId', async () => {
        var result = await FriendRequestListService.removeSentFriendRequest(friendRequestListOwner, "678", conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(sendFriendRequestListIds).to.have.members( ["456"] ).and.to.have.lengthOf(1);
    });

    it('Test remove AllSentFriendRequests', async () => {
        var result = await FriendRequestListService.removeAllSentFriendRequests(friendRequestListOwner, conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(sendFriendRequestListIds).to.have.members([]).and.to.have.lengthOf(0);
    });

    it('Test getReceivedRequestList', async () => {
        var receivedFriendRequestList = await FriendRequestListService.getReceivedRequestList(friendRequestListOwner, conferenceId, dbStub);
        expect(receivedFriendRequestList).to.be.instanceOf(Object);

        expect(receivedFriendRequestList).to.be.an('array').and.to.have.members(["96", "85", "74"]).and.to.have.lengthOf(3);
    });
    
    it('Test getReceivedRequestList with invalid friend request list owner id', async () => {
        var receivedFriendRequestList = await FriendRequestListService.getReceivedRequestList("111", conferenceId, dbStub);
        expect(receivedFriendRequestList).to.be.a('boolean').and.to.be.false;
    });

    it('Test store ReceivedFriendRequest with valid conferenceId', async () => {
        var result = await FriendRequestListService.storeReceivedFriendRequest(friendRequestListOwner, newReceivedRequestId, conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(receivedFriendRequestListIds).to.have.members( ["322", "0815", newReceivedRequestId] ).and.to.have.lengthOf(3);
    });

    it('Test store ReceivedFriendRequest with invalid conferenceId', async () => {
        var result = await FriendRequestListService.storeReceivedFriendRequest(friendRequestListOwner, newReceivedRequestId, '0', dbStub);

        expect(result).to.be.a('boolean').and.to.be.false;
        expect(receivedFriendRequestListIds).to.have.members( ["322", "0815"] ).and.to.have.lengthOf(2);
    });

    it('Test remove ReceivedFriendRequest with valid requestId', async () => {
        var result = await FriendRequestListService.removeReceivedFriendRequest(friendRequestListOwner, "322", conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(receivedFriendRequestListIds).to.have.members( ["0815"] ).and.to.have.lengthOf(1);
    });

    it('Test remove AllReceivedFriendRequests', async () => {
        var result = await FriendRequestListService.removeAllReceivedFriendRequests(friendRequestListOwner, conferenceId, dbStub);

        expect(result).to.be.a('boolean').and.to.be.true;
        expect(receivedFriendRequestListIds).to.have.members([]).and.to.have.lengthOf(0);
    });

})