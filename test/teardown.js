const ServiceTestData = require('./server/services/TestData/ServiceTestData.js');

require('dotenv').config();
const db = require('../config/db');
const database = new db();
database.connectDB()

    after(function() {

        setTimeout(function(){ 
            /*.then(result => {
                database.collection("chats_" + ServiceTestData.conferenceId_1).drop();
            }).catch(err => {
                console.log(err);
            })*/
            //sdatabase.chats_test_1.drop();
            process.exit(0); 

        }, 3000);
})