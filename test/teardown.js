const ServiceTestData = require('./server/services/TestData/ServiceTestData.js');
const db = require('../config/db');
const database = new db();

    after(function() {

        setTimeout(function(){ 
            /*database.connectDB().then(result => {
                database.collection("chats_" + ServiceTestData.conferenceId_1).drop();
            }).catch(err => {
                console.log(err);
            })*/

            process.exit(0); 

        }, 3000);
})