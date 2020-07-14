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

app.use(expressSession({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(fileUpload());

/* On receiving a get-Request, the express-Server will deliver the
 * index.html file to the user.
 * - (E) */
app.get('/', (request, response) => {
    if (request.session.loggedin === true) {
        username = request.session.username;
        response.render('index', {loggedIn: true, username: username});
    } else {
    response.render('index');
    }
});

app.get('/upload', (request, response) => {
    if (request.session.loggedin === true) {
        response.render('upload', {loggedIn: true});
    } else {
        response.send('Please log in first!');
    }
});

app.post('/upload', (request, response) => {
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.send('No files were uploaded.');
    }

    var video = request.files.video
    console.log(video)
    var videoName = video.name;
    var videoSize = video.size;

    if(videoName.includes(".mp4")) {
        if(videoSize > 524288000)
            return response.send('File size exceeded 500 MB')
        else {
            return SlotService.storeVideo(video).then(videoId => {
                request.session.videoId = videoId;
                response.redirect('/');
            }).catch(err => {
                console.error(err);
            })
        }
    } else {
        response.send('File type is not supported!');
    }
    response.end();
});

app.get('/login', (request, response) => {
	response.render('login');
});

app.get('/game', (request, response) => {
    if (request.session.loggedin === true) {
        response.sendFile(path.join(__dirname, '/game/app/client/views/canvas.html'));
    } else {
        response.send('Please log in first!');
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
            response.send('Incorrect Username and/or Password!');
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
    else {
        response.render('register', {registerValid: false});
    }
});

app.post('/register', (request, response) => {
    var username = request.body.username;
    var email = request.body.email;

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
                    //TODO: return error message
                    response.send('Email is already registered!');
                }
                response.end();
            }).catch(err => {
                console.error(err);
            })
        }
        else {
            //TODO: return error message
            response.send('Username is already taken!');
        }
        response.end();
    }).catch(err => {
        console.error(err);
    })
});

app.post('/registerValid', (request, response) => {
        var username = request.session.username;
        if(request.body.title === "Title") {
            var title = "";
        }
        else {
            var title = request.body.title;
        }
        var surname = request.body.surname;
        var forename = request.body.forename;
        var job = request.body.job;
        var company = request.body.company;
        var email = request.session.email;
        var password = request.body.password;
        return AccountService.createAccount(username, title, surname, forename, job, company, email, password).then(res => {
            request.session.accountId = res.getAccountID();
            request.session.loggedin = true;
            response.redirect('/');
            response.end();
        }).catch(err => {
            response.send('Registration failed');
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












