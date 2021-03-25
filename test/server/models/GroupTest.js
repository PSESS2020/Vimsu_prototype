const Group = require('../../../src/game/app/server/models/Group.js');
const ShirtColor = require('../../../src/game/app/client/shared/ShirtColor.js');
const TestUtil = require('./utils/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');
const GroupChat = require('../../../src/game/app/server/models/GroupChat.js');
const Meeting = require('../../../src/game/app/server/models/Meeting.js');

var name;
var shirtColor;
var groupMemberIDs;
var groupChat;

describe('test Group class functionality', function() {

    //test data
    beforeEach(function () {
        name = TestUtil.randomString();
        shirtColor = TestUtil.randomObjectValue(ShirtColor);
        groupMemberIDs = TestUtil.randomStringList();
        groupChat = new GroupChat('chatId', 'ownerId', 'chatName', [], [], 42, 42);
        groupMeeting = new Meeting('meetingId', name, groupMemberIDs, 'thepassword');
    });

    it('test constructor and getters', function() {
        let group = new Group(name, shirtColor, groupMemberIDs, groupChat, groupMeeting);

        expect(group.getName()).to.equal(name);
        expect(group.getShirtColor()).to.equal(shirtColor);
        expect(group.getGroupMemberIDs()).to.equal(groupMemberIDs);
        expect(group.getGroupChat()).to.equal(groupChat);
        expect(group.getMeeting()).to.equal(groupMeeting);
    });

    it('test add, remove and includes group members', function() {
        let group = new Group(name, shirtColor, [], groupChat, groupMeeting);
        let memberID = TestUtil.randomString();

        expect(group.includesGroupMember(memberID)).to.equal(false);

        group.addGroupMember(memberID);
        group.addGroupMember(memberID);
        expect(group.includesGroupMember(memberID)).to.equal(true);

        group.removeGroupMember('wrongMemberID');
        group.removeGroupMember(memberID);
        expect(group.includesGroupMember(memberID)).to.equal(false);
    });
});