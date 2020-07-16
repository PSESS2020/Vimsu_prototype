/* ############################################################################### */
/* ############################ LOADING REQUIREMENTS ############################# */
/* ############################################################################### */

const express = require('express');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const bodyParser = require('body-parser');


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

const ServerController = require('./game/app/server/controller/ServerController.js');
const AccountService = require('./website/services/AccountService');
const SlotService = require('./website/services/SlotService')
const { response } = require('express');

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
//sets the view engine to ejs, ejs is required to render templates
app.set('view engine', 'ejs');
//sets the views directory for rendering the ejs templates
app.set('views',path.join(__dirname, '/website/views'));
const httpServer = http.createServer(app);
const io = socketio(httpServer);

app.set('port', PORT);

/* Tbh I don't really know what this does. I copied it from the old server.js.
 * - (E) */
app.use('/website', express.static(path.join(__dirname + '/website')));
app.use('/client', express.static(path.join(__dirname + '/game/app/client')));
app.use('/utils', express.static(path.join(__dirname + '/game/app/utils')));

var sessionMiddleware = expressSession({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
});

//Sets the server to websockets only.
io.set("transports", ["websocket"]);

//Allows to access the session from the server side
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res || {}, next)
});

app.use(sessionMiddleware);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(fileUpload());

/* On receiving a get-Request, the express-Server will deliver the
 * index.html file to the user.
 * - (E) */
app.get('/', (request, response) => {
    if (request.session.loggedin === true) {
        username = request.session.username;
        email = request.session.email;
        title = request.session.title;
        forename = request.session.forename;
        surname = request.session.surname;
        response.render('index', {loggedIn: true, username: username, email: email, title: title, forename: forename, surname: surname});
    } else {
    response.render('index');
    }
});

app.get('/upload', (request, response) => {
    if (request.session.loggedin === true) {
        response.render('upload', {loggedIn: true});
    } else {
        response.redirect('/');
    }
});

app.post('/upload', (request, response) => {
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.send('No files were uploaded. <a href="/upload">Back to page</a>');
    }

    var maxParticipants = parseInt(request.body.maxParticipants);
    if (maxParticipants % 1 !== 0 || !(isFinite(maxParticipants))) {
        return response.send('Max participants must be integer. <a href="/upload">Try again</a>')
    }

    var startingTime = new Date(request.body.startingTime);
    if (startingTime == "Invalid Date") {
        return response.send('Starting time must be a valid date. <a href="/upload">Try again</a>')
    }
    
    var title = request.body.title;
    var remarks = request.body.remarks;
    var oratorId = request.session.accountId;

    var video = request.files.video
    console.log(video)
    var videoName = video.name;
    var videoSize = video.size;

    if(videoName.includes(".mp4")) {
        if(videoSize > 524288000)
            return response.send('File size exceeded 500 MB. <a href="/upload">Back to page</a>')
        else {
            return SlotService.storeVideo(video).then(videoId => {
                return SlotService.createSlot(videoId, "1", title, remarks, startingTime, oratorId, maxParticipants).then(res => {
                    response.redirect('/');
                    response.end();
                }).catch(err => {
                    console.error(err);
                })
            }).catch(err => {
                console.error(err);
            })
        }
    } else {
        response.send('File type is not supported. <a href="/upload">Back to page</a>');
    }
});

app.get('/login', (request, response) => {
    if (request.session.loggedin === true) {
        response.redirect('/');
    } else {
        response.render('login');
    }
	
});

app.get('/game', (request, response) => {
    if (request.session.loggedin === true) {

        response.sendFile(path.join(__dirname, '/game/app/client/views/canvas.html'));
    } else {
        response.redirect('/');
    }
})

app.post('/login', (request, response) => {
    var username = request.body.username;
    var password = request.body.password;

    return AccountService.verifyLoginData(username, password).then(user => {
        
        if(user) {
            request.session.loggedin = true;
            request.session.accountId = user.getAccountID();
            request.session.username = username;
            request.session.title = user.getTitle();
            request.session.surname = user.getSurname();
            request.session.forename = user.getForename();
            request.session.job = user.getJob();
            request.session.company = user.getCompany();
            request.session.email = user.getEmail();
            response.redirect('/');
        }
        else {
            response.send('Incorrect Username and/or Password. <a href="/login">Try again</a>');
        }
        response.end();
    }).catch(err => {
        console.error(err);
    })
});

app.get('/register', (request, response) => {
    if (request.session.registerValid === true) {
        var username = request.session.username;
        var email = request.session.email;
        response.render('register', {registerValid: true, username: username, email: email});
    }
    else if (request.session.loggedin === true) {
        response.redirect('/');
    }
    else {
        response.render('register', {registerValid: false});
    }
});

app.post('/register', (request, response) => {

    if (request.body.username.length > 10) {
        return response.send('Max. username length is 10 characters. <a href="/register">Try again</a>');
    }

    var username = request.body.username;
    var email = request.body.email;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(String(email).toLowerCase())) {

    } else {
        return response.send('Invalid Email Address. <a href="/register">Try again</a>')
    }

    return AccountService.isUsernameValid(username).then(res => {
        if(res) {
            return AccountService.isEmailValid(email).then(res => {
                if(res) {
                    request.session.registerValid = true;
                    request.session.username = username;
                    request.session.email = email;
                    response.redirect('/register');
                }
                else {
                    response.send('Email is already registered. <a href="/register">Try again</a>');
                }
                response.end();
            }).catch(err => {
                console.error(err);
            })
        }
        else {
            response.send('Username is already taken. <a href="/register">Try again</a>');
        }
        response.end();
    }).catch(err => {
        console.error(err);
    })
});

app.post('/registerValid', (request, response) => {
    var username = request.session.username;
    var title = request.body.title;

    if(title === "Title") {
        var title = "";
    }
    else if(title !== "Mr." || title !== "Mrs." || title !== "Ms." || title !== "Dr." || title !== "Rev." || title !== "Miss" || title !== "Prof."){
        return response.send('Invalid title. <a href="/register">Try again</a>')
    }

    var surname = request.body.surname;
    var forename = request.body.forename;
    var job = request.body.job;
    var company = request.body.company;
    var email = request.session.email;
    var password = request.body.password;

    return AccountService.createAccount(username, title, surname, forename, job, company, email, password).then(res => {
        request.session.accountId = res.getAccountID();
        request.session.registerValid = false;
        request.session.loggedin = true;
        response.redirect('/');
        response.end();
    }).catch(err => {
        response.send('Registration failed. <a href="/register">Try again</a>');
        console.error(err);
    })
})

app.post('/editRegistration', (request, response) => {
    request.session.registerValid = false;
    response.redirect('/register');
    response.end();
})

app.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/');
});

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

const controller = new ServerController(io);
controller.init();












