const ServiceTestData = require('./server/services/TestData/ServiceTestData.js');

require('dotenv').config();
const db = require('../src/config/db');
const database = new db();
database.connectDB()

    after(function() {

        setTimeout(function(){ 
            process.exit(0); 
        }, 3000);
})