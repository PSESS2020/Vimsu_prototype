const chai = require('chai');
const {expect} = require('chai');
const helper = require('./Utils/TestHelper')
const InviteFriendsView = require('../../../game/app/client/views/js/InviteFriendsView')
const BusinessCardClient = require('../../../game/app/client/models/BusinessCardClient')

var businessCard1 = new BusinessCardClient("53f", "maxmust", "Prof.", "Mustermann", "Max", "Professor", "KIT", "maxmustermann@kit.edu");
var businessCard2 = new BusinessCardClient("53a", "maxmust", "Prof.", "Mustermann", "Max", "Professor", "KIT", "maxmustermann@kit.edu");
var businessCards = [businessCard1, businessCard2];

var inviteFriendsView = new InviteFriendsView();

describe('InviteFriendsView test', function() {

    it('test draw method businessCards not empty', function() {
        inviteFriendsView.draw([], "Test1", 5, "asdf0");
    });

    it('test draw method businessCards not empty', function() {
        inviteFriendsView.draw(businessCards, "Test2", 10, "asdf1");
    });

    it('test draw method businessCards empty', function() {
        inviteFriendsView.draw(undefined, "Test3", undefined, undefined);
    });
})