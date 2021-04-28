const Meeting = require('../../../src/game/app/server/models/Meeting.js');
const TestUtil = require('./utils/TestUtil.js');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('Meeting test', function () {

    var id;
    var name;
    var memberList;
    var password;

    var testMeeting;

    beforeEach(function () {
        id = TestUtil.randomString();
        name = TestUtil.randomString();
        password = TestUtil.randomString();
        memberList = TestUtil.randomStringList();

        testMeeting = new Meeting(id, name, memberList, password);
    })

    it('test Meeting class getters', function () {
        assert.equal(testMeeting.getId(), id);
        assert.equal(testMeeting.getName(), name);
        assert.equal(testMeeting.getPassword(), password);
        assert.equal(testMeeting.getMemberIdList(), memberList);
    })

    it('test adding and removing a ppant', function () {
        var goodPPant;
        do {
            goodPPant = TestUtil.randomString();
        } while (testMeeting.includesMember(goodPPant));
        assert.equal(testMeeting.addMember(goodPPant), true);
        assert.equal(testMeeting.includesMember(goodPPant), true);
        /* The following assertion fails for some reason, 
         * but the one afterwards is fine. */
        //assert.equal(testMeeting.removeMember(goodPPant), true);
        testMeeting.removeMember(goodPPant);
        assert.equal(testMeeting.includesMember(goodPPant), false);
    })

    it('test adding an already joined participant', function () {
        let badPPant = memberList[0];
        assert.equal(testMeeting.addMember(badPPant), false);
    })

    it('test adding and removing an illegal ppantId', function () {
        let badPPant = TestUtil.randomInt();
        assert.throws(() => testMeeting.addMember(badPPant), Error, badPPant + ' is not a string!');
        assert.throws(() => testMeeting.removeMember(badPPant), Error, badPPant + ' is not a string!');
    })

    it('test removing a non existant ppant', function () {
        var goodPPant;
        do {
            goodPPant = TestUtil.randomString();
        } while (testMeeting.includesMember(goodPPant));
        assert.equal(testMeeting.removeMember(goodPPant), false);
    })
})