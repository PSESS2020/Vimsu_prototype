const chai = require('chai');
const expect = chai.expect;

const GroupService = require('../../../src/game/app/server/services/GroupService.js');
const Group = require('../../../src/game/app/server/models/Group.js');
const GroupChat = require('../../../src/game/app/server/models/GroupChat.js');
const TestUtil = require('../models/utils/TestUtil.js');

const db = require('../../../src/config/db');
const database = new db();
const sinon = require('sinon');
const ShirtColor = require('../../../src/game/app/client/shared/ShirtColor.js');
const Settings = require('../../../src/game/app/server/utils/Settings.js');
const ServiceTestData = require('./TestData/ServiceTestData.js');

const dbStub = sinon.createStubInstance(db);
const conferenceId = ServiceTestData.conferenceId_1;

const groupCollectionName = "groups_" + conferenceId;
const chatCollectionName = "chats_" + conferenceId;

/* DB STUB SETUP */

var data = [];

dbStub.insertOneToCollection = (collectionName, object) => {
    if (collectionName === groupCollectionName) {
        data.push(object);
        return Promise.resolve(true);
    } else {
        return Promise.resolve(false);
    }
}

dbStub.findAllInCollection = (collectionName) => {
    if (collectionName === groupCollectionName) {
        return Promise.resolve(data);
    } else {
        return Promise.resolve(undefined)
    }
}

dbStub.findOneInCollection = (collectionName, query, projection) => {
    if (collectionName === groupCollectionName) {
        for (let i = 0; i < data.length; i++) {
            if (query.groupName === data[i].groupName) {
                return Promise.resolve(data[i]);
            }
        }
    } else if (collectionName === chatCollectionName && query.chatId === 'chatID1') {
        return Promise.resolve({ chatId: 'chatID1',
                                 ownerId: 'owner1',
                                 name: 'name1',
                                 memberId: [],
                                 messageList: [],
                                });
    } else if (collectionName === chatCollectionName && query.chatId === 'chatID2') {
        return Promise.resolve({ chatId: 'chatID2',
                                 ownerId: 'owner2',
                                 name: 'name2',
                                 memberId: [],
                                 messageList: [],
                                });
    } else {
        return Promise.resolve(undefined);
    } 
}

dbStub.deleteFromArrayInCollection = (collectionName, query, query2) => {
    if (collectionName === groupCollectionName) {
        for (let i = 0; i < data.length; i++) {
            if (query.groupName === data[i].groupName) {
                for (let j = 0; j < data[i].memberIDs.length; j++) {
                    if (query2.memberIDs === data[i].memberIDs[j]) {
                        data[i].memberIDs.splice(j, 1);
                        return Promise.resolve(true);
                    }
                }
            }
        }
    } else {
        return Promise.resolve(false);
    }
}

dbStub.insertToArrayInCollection = (collectionName, query, query2) => {
    if (collectionName === groupCollectionName) {
        for (let i = 0; i < data.length; i++) {
            if (query.groupName === data[i].groupName) {
                data[i].memberIDs.push(query2.memberIDs);
                return Promise.resolve(true);
            }
        }
    } else
        return Promise.resolve(false);
};

dbStub.deleteOneFromCollection = (collectionName, query) => {
    if (collectionName === groupCollectionName) {
        for (let i = 0; i < data.length; i++) {
            if (query.groupName === data[i].groupName) {
                data.splice(i, 1);
                return Promise.resolve(true);
            }
        }
    } else {
        return Promise.resolve(false);
    }
}

/* TEST DATA */ 

var name1;
var shirtColor1;
var groupMemberIDs1;
var groupChat1 = new GroupChat('chatID1', 'owner1', 'name1', [], [], Settings.MAXGROUPPARTICIPANTS, Settings.MAXNUMMESSAGES_GROUPCHAT);
var name2;
var shirtColor2;
var groupMemberIDs2;
var groupChat2 = new GroupChat('chatID2', 'owner2', 'name2', [], [], Settings.MAXGROUPPARTICIPANTS, Settings.MAXNUMMESSAGES_GROUPCHAT);

/* TESTS */

describe('GroupServiceTest', () => {
    beforeEach(() => {
        name1 = TestUtil.randomString();
        shirtColor1 = TestUtil.randomObjectValue(ShirtColor);
        groupMemberIDs1 = TestUtil.randomStringList();
       
        name2 = name1 + '2';
        shirtColor2 = TestUtil.randomObjectValue(ShirtColor);
        groupMemberIDs2 = TestUtil.randomStringList();
    });
    
    it('test create groups, load and delete them', async() => {
        let group1 = await GroupService.createGroup(name1, shirtColor1, groupMemberIDs1, groupChat1, conferenceId, dbStub);
        let group2 = await GroupService.createGroup(name2, shirtColor2, groupMemberIDs2, groupChat2, conferenceId, dbStub);

        let groupMap = await GroupService.getGroupMap(conferenceId, dbStub);
        
        expect(group1).to.be.instanceOf(Group);
        expect(group2).to.be.instanceOf(Group);
        expect(groupMap.get(name1)).to.eql(group1);
        expect(groupMap.get(name2)).to.eql(group2);
        expect(groupMap.size).to.equal(2);
        
        let deletionSuccess1 = await GroupService.deleteGroup(name1, conferenceId, dbStub);
        let deletionSuccess2 = await GroupService.deleteGroup(name2, conferenceId, dbStub);
        let newGroupMap = await GroupService.getGroupMap(conferenceId, dbStub);

        expect(deletionSuccess1).to.be.true;
        expect(deletionSuccess2).to.be.true;
        expect(newGroupMap.size).to.equal(0);
    });

    it('test add and remove members', async() => {
        await GroupService.createGroup(name1, shirtColor1, groupMemberIDs1, groupChat1, conferenceId, dbStub);
        await GroupService.createGroup(name2, shirtColor2, groupMemberIDs2, groupChat2, conferenceId, dbStub);

        let addSuccess = await GroupService.addGroupMember(name1, 'member1', conferenceId, dbStub);
        let groupMap = await GroupService.getGroupMap(conferenceId, dbStub);
        let group = groupMap.get(name1);
        expect(addSuccess).to.be.true;
        expect(group.includesGroupMember('member1')).to.be.true;

        let removeSuccess = await GroupService.removeGroupMember(name1, 'member1', conferenceId, dbStub);
        let newGroupMap = await GroupService.getGroupMap(conferenceId, dbStub);
        let newGroup = newGroupMap.get(name1);
        expect(removeSuccess).to.be.true;
        expect(newGroup.includesGroupMember('member1')).to.be.false;

        GroupService.deleteGroup(name1, conferenceId, dbStub);
        GroupService.deleteGroup(name2, conferenceId, dbStub);   
    });
})