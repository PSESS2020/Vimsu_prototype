const MeetingService = require('../../../src/game/app/server/services/MeetingService');
const ServiceTestData = require('./TestData/ServiceTestData.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require('sinon');
const db = require('../../../src/config/db');
const Meeting = require('../../../src/game/app/server/models/Meeting.js');

var conferenceId = ServiceTestData.conferenceId_1;

