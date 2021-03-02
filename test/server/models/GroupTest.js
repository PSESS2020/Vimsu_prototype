const Group = require('../../../src/game/app/server/models/Group.js');
const ShirtColor = require('../../../src/game/app/client/shared/ShirtColor.js');
const TestUtil = require('./utils/TestUtil.js');
const chai = require('chai');
const { expect } = require('chai');

var name;
var shirtColor;
var groupMemberIDs;


describe('test Group class functionality', function() {

    //test data
    beforeEach(function () {
        name = TestUtil.randomString();
        shirtColor = TestUtil.randomObjectValue(ShirtColor);
        groupMemberIDs = TestUtil.randomStringList();
    });

    it('test constructor and getters', function() {
        let group = new Group(name, shirtColor, groupMemberIDs);

        expect(group.getName()).to.equal(name);
        expect(group.getShirtColor()).to.equal(shirtColor);
        expect(group.getGroupMemberIDs()).to.equal(groupMemberIDs);
    });

    it('test add, remove and includes group members', function() {
        let group = new Group(name, shirtColor, []);
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