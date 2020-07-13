/* ############################################################################### */
/* ############################ LOADING REQUIREMENTS ############################# */
/* ############################################################################### */

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const ServerController = require('./game/app/server/controller/ServerController.js');

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

app.use(express.static(path.join(__dirname + '/website')));
app.use('/client', express.static(path.join(__dirname + '/game/app/client')));
app.use('/utils', express.static(path.join(__dirname + '/game/app/utils')));

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname, '/website/index.html'));
});

httpServer.listen(PORT, () => console.log(`Vimsu-Server listening on port ${PORT} . . .`));


/* The ServerController is now responsible for initializing the gameState */

/* ########################################################################################## */
/* ################################## REALTIME FUNCTIONALITY ################################ */
/* ########################################################################################## */

/* HAS BEEN MOVED INTO ServerController.js */

const controller = new ServerController(io);
controller.init();















