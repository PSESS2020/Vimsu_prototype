/* ############################################################################### */
/* ############################ LOADING REQUIREMENTS ############################# */
/* ############################################################################### */

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

/* ############################################################################### */
/* ######################### SETTING UP THE SERVER ############################### */
/* ############################################################################### */

/* Set up port s.t. the app should work both on heroku and on localhost. */
const PORT = process.env.PORT || 5000;

/* Setting up the server */
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer, { pingInterval: 2000, pingTimeout: 10000 });

app.set('port', PORT);
app.use('/website', express.static(path.join(__dirname + '/website')));
app.use('/client', express.static(path.join(__dirname + '/game/app/client')));

/* Sets the server to websockets only. */
io.set("transports", ["websocket"]);

/* The http-Server starts listening on the port. */
httpServer.listen(PORT, () => console.log(`Vimsu-Server listening on port ${PORT} . . .`));

/* ############################################################################### */
/* ######################## LOADING VIMSU REQUIREMENTS ########################### */
/* ############################################################################### */

/* Allows reading from a .env file */
require('dotenv').config();

/* Initializes db and blob instances */
const db = require('./config/db');
const blob = require('./config/blob')

const database = new db();
const blobClient = new blob();

/* Connects to blob and db before initializing the RouteController */
blobClient.connectBlob();
database.connectDB().then(() => {
    const RouteController = require('./website/controller/RouteController');
    new RouteController(app, io, database, blobClient);
})