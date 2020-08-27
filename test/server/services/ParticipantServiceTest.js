const AccountService = require('../../../src/website/services/AccountService');
const ParticipantService = require('../../../src/game/app/server/services/ParticipantService');
const ServiceTestData = require('./TestData/ServiceTestData.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { assert } = require('chai');

var conferenceId = ServiceTestData.conferenceId_1;

var account = {
    username: "maxmust",
    title: "Prof.",
    surname: "Mustermann",
    forename: "Max",
    job: "Professor",
    company: "KIT",
    email: "maxmustermann@kit.edu",
    password: "maxpassword"
}


const db = require('../../../src/config/db');
const database = new db()
database.connectDB().then(res => {
    describe('Participant Service Test', () => {
        it('test createParticipant', () => {
            expect("asdf").to.eql("fdsd");
    
        });
    
        it('test getUsername', () => {
            
        })
    
        it('test getBusinessCard', () => {
            
        })
    
        it('test updateParticipantPosition', () => {
            
        })
    
        it('test updateParticipantDirection', () => {
            
        })
    
        it('test getPoints', () => {
            
        })
    
        it('test updatePoints', () => {
            
        })
    
        it('test deleteAchievement', () => {
            
        })
    
        it('test getAchievements', () => {
            
        })
    
        it('test updateAchievementLevel', () => {
            
        })
    
        it('test updateTaskCounts', () => {
            
        })
    
        it('test getTaskCount', () => {
            
        })
    
        it('test updateTaskCount', () => {
            
        })
    
        it('test addChatID', () => {
            
        })
    
        it('test deleteAllParticipants', () => {
            
        })
    
        it('test deleteParticipant', () => {
            
        })
    });
});

