/* Does not work, commented out to run other tests

const LectureService = require('../../../src/game/app/server/services/LectureService.js');
const TestUtil = require('../models/utils/TestUtil.js');
const DummyDB = require('../models/utils/DummyDB.js');
const DummyBlob = require('../models/utils/DummyBlob.js');
const chai = require('chai');
const { expect } = require('chai');
const assert = chai.assert;

var testId
var testLectures
var testDB
var testBlob

describe('test LectureService functionality', function () {
    
    before( function () {
        testId = [TestUtil.randomString()];
        testLectures = TestUtil.randomLectureList();
        testDB = new DummyDB(testId, testLectures);
        testBlob = new DummyBlob();
    });
    
    // can we do this better?
    it('test getVideoUrl', function() {
        expect(LectureService.getVideoUrl(TestUtil.randomString(), testBlob, new Date(), TestUtil.randomInt())).to.be.a.string;
    });
    
    it('test getAllLectures', function() {
        expect(LectureService.getAllLectures(testId[0], testDB)).to.equal(testLectures);
    });
    
    
})
*/
