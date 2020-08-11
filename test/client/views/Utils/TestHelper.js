const chai = require('chai');
chai.use(require('chai-dom'))
const jquery = require('jquery');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = jquery( window );
const chaiJquery = require('chai-jquery');
global.window = window
global.document = window.document
global.$ = $