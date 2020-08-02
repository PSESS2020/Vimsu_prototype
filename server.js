/* ############################################################################### */
/* ############################ LOADING REQUIREMENTS ############################# */
/* ############################################################################### */

const express = require('express');

/* This package apparently is meant to make more difficult features of the
 * protocol easier to handle - I am not sure how it would be of use here, but
 * I have included since it was included in the example I am mostly working from,
 * see also below.
 * Add.: Without this, the server won't work.
 * - (E) */
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

/* ############################################################################### */
/* ######################## LOADING VIMSU REQUIREMENTS ########################### */
/* ############################################################################### */



/* ############################################################################### */
/* ######################### SETTING UP THE SERVER ############################### */
/* ############################################################################### */

// TODO: comments

/* Set up port s.t. the app should work both on heroku
 * and on localhost. - (E) */
const PORT = process.env.PORT || 5000;

/* Setting up the server by
 *   (i) Setting up an express server
 *   (ii) Passing that as an argument to create a http-Server (for some reason)
 *   (iii) creating a socket-Server on top of that for real-time interaction
 * - (E) */
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);

app.set('port', PORT);

/* Tbh I don't really know what this does. I copied it from the old server.js.
 * - (E) */
app.use('/website', express.static(path.join(__dirname + '/website')));
app.use('/client', express.static(path.join(__dirname + '/game/app/client')));
app.use('/utils', express.static(path.join(__dirname + '/game/app/utils')));

//Sets the server to websockets only.
io.set("transports", ["websocket"]);

/* The http-Server starts listening on the port.
 * If this does not happen (if the express-instance 'app' listen here),
 * then socket.io will not work, as the GET-request for the client-API
 * will try to fetch the data from the wrong directory, resulting in a
 * 404 NOT FOUND error.
 * I don't know why this is, but thanks StackOverflow!
 * - (E) */
httpServer.listen(PORT, () => console.log(`Vimsu-Server listening on port ${PORT} . . .`));


/* The ServerController is now responsible for initializing the gameState */

/* ########################################################################################## */
/* ################################## REALTIME FUNCTIONALITY ################################ */
/* ########################################################################################## */

/* HAS BEEN MOVED INTO ServerController.js */

const db = require('./config/db')
const database = new db()

database.connectDB().then(result => {
    const ServerController = require('./game/app/server/controller/ServerController.js');
    const RouteController = require('./website/controller/RouteController');
    serverController = new ServerController(io, database);
    routeController = new RouteController(app, io, database);
})









