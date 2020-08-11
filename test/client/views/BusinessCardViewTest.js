const chai = require('chai');
const {expect} = require('chai');
const helper = require('./Utils/TestHelper')
const BusinessCardView = require('../../../game/app/client/views/js/BusinessCardView')
const BusinessCardClient = require('../../../game/app/client/models/BusinessCardClient')

var businessCard1 = new BusinessCardClient("53f", "maxmust", "Prof.", "Mustermann", "Max", "Professor", "KIT", "maxmustermann@kit.edu");
var businessCard2 = new BusinessCardClient("53a", "maxmust", "Prof.", "Mustermann", "Max", "Professor", "KIT", "maxmustermann@kit.edu");
var businessCardView1 = new BusinessCardView(businessCard1, true, 5);
var businessCardView2 = new BusinessCardView(businessCard2, false, 3)

describe('DoorView test', function() {

    it('test draw method friend', function() {
        businessCardView1.draw();
    });

    it('test draw method not friend', function() {
        businessCardView2.draw();
    });
})