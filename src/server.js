/**
 * The main file on server
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */

/* ############################################################################### */
/* ############################ LOADING REQUIREMENTS ############################# */
/* ############################################################################### */

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

/* Allows reading from a .env file */
require('dotenv').config();
const Settings = require('./game/app/server/utils/' + process.env.SETTINGS_FILENAME);

/* ############################################################################### */
/* ######################### SETTING UP THE SERVER ############################### */
/* ############################################################################### */

/* Set up port s.t. the app should work both on heroku and on localhost. */
const PORT = process.env.PORT || 5000;

/* Setting up the server */
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer, { pingInterval: 2000, pingTimeout: 5000 });

app.set('port', PORT);
app.use('/website', express.static(path.join(__dirname + '/website')));
app.use('/client', express.static(path.join(__dirname + '/game/app/client')));

app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

/* Sets the server to websockets only. */
io.set("transports", ["websocket"]);

/* The http-Server starts listening on the port. */
httpServer.listen(PORT, () => console.log(`Vimsu-Server listening on port ${PORT} . . .`));

/* ############################################################################### */
/* ######################## LOADING VIMSU REQUIREMENTS ########################### */
/* ############################################################################### */



/* Initializes blob instance if video storage is needed for this conference */
var blob;
var blobClient;

if (Settings.VIDEOSTORAGE_ACTIVATED) {
    blob = require('./config/blob');

    blobClient = new blob();

    /* Connects to blob */
    blobClient.connectBlob();
}

/* Initializes db instance */
const db = require('./config/db');

const database = new db();

/* Connects to db before initializing the RouteController */
database.connectDB().then(() => {
    const RouteController = require('./website/controller/RouteController');
    new RouteController(app, io, database, blobClient);
});