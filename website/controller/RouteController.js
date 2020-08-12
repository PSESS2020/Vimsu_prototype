const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const AccountService = require('../services/AccountService');
const SlotService = require('../services/SlotService')
const path = require('path');
const fs = require('fs');
const Settings = require('../../game/app/client/shared/Settings')

module.exports = class RouteController {

    #app;
    #io;
    #db;

    constructor(app, io, db) {
        if (!!RouteController.instance) {
            return RouteController.instance;
        }

        RouteController.instance = this;

        this.#app = app;
        this.#io = io;
        this.#db = db;
        this.init();
    }

    init() {

        var username, title, forename, surname, job, company, email;

        //sets the view engine to ejs, ejs is required to render templates
        this.#app.set('view engine', 'ejs');

        //sets the views directory for rendering the ejs templates
        this.#app.set('views', path.join(__dirname, '../views/'));

        this.#app.use(bodyParser.urlencoded({ extended: true }));
        this.#app.use(bodyParser.json());
        this.#app.use(fileUpload());

        var sessionMiddleware = expressSession({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
        });

        //Allows to access the session from the server side
        this.#io.use(function (socket, next) {
            sessionMiddleware(socket.request, socket.request.res || {}, next)
        });

        this.#app.use(sessionMiddleware);

        /* On receiving a get-Request, the express-Server will deliver the
        * index.html file to the user.
        * - (E) */
        this.#app.get('/', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                email = request.session.email;
                title = request.session.title;
                forename = request.session.forename;
                surname = request.session.surname;
                response.render('index', { loggedIn: true, username: username, email: email, title: title, forename: forename, surname: surname });
            } else {
                response.render('index');
            }

        });

        this.#app.get('/upload', (request, response) => {
            if (request.session.loggedin === true) {
                response.render('upload', { loggedIn: true, username: username, email: email, title: title, forename: forename, surname: surname });
            } else {
                response.redirect('/');
            }
        });

        this.#app.post('/upload', (request, response) => {
            if (!request.files || Object.keys(request.files).length === 0) {
                return response.render('upload', { noFilesUploaded: true });
            }

            var maxParticipants = parseInt(request.body.maxParticipants);
            if (maxParticipants % 1 !== 0 || !(isFinite(maxParticipants))) {
                return response.render('upload', { notInt: true });
            }

            var startingTime = new Date(request.body.startingTime);
            if (startingTime == "Invalid Date") {
                return response.render('upload', { notDate: true });
            }

            var title = request.body.title;
            var remarks = request.body.remarks;
            var oratorId = request.session.accountId;

            var video = request.files.video
            console.log(video)
            var videoName = video.name;
            var videoSize = video.size;

            if (videoName.includes(".mp4")) {
                if (videoSize > 524288000) {
                    return response.render('upload', { fileSizeExceeded: true });
                }
                else {
                    return SlotService.storeVideo(video, this.#db).then(videoData => {
                        if (videoData) {
                            return SlotService.createSlot(videoData.fileId, videoData.duration, Settings.CONFERENCE_ID, title, remarks, startingTime, oratorId, maxParticipants, this.#db).then(res => {
                                response.redirect('/');
                                response.end();
                            }).catch(err => {
                                console.error(err);
                                return response.render('upload', { createSlotFailed: true });
                            })
                        } else {
                            return response.render('upload', { uploadFailed: true });
                        }
                    }).catch(err => {
                        console.error(err);
                        return response.render('upload', { uploadFailed: true });
                    })
                }
            } else {
                return response.render('upload', { unsupportedFileType: true });
            }
        });

        this.#app.get('/login', (request, response) => {
            if (request.session.loggedin === true) {
                response.redirect('/');
            } else {
                response.render('login');
            }

        });

        this.#app.get('/game', (request, response) => {
            if (request.session.loggedin === true) {
                const ServerController = require('../../game/app/server/controller/ServerController');
                new ServerController(this.#io, this.#db);
                response.sendFile(path.join(__dirname + '../../../game/app/client/views/canvas.html'));
            } else {
                response.redirect('/');
            }
        })

        this.#app.get('/game/video/:videoName', (request, response) => {
            if (request.session.loggedin === true) {
                var videoPath = path.join(__dirname + '../../../config/download/' + request.params.videoName);
                const stat = fs.statSync(videoPath);
                const fileSize = stat.size;
                const range = request.headers.range;

                if (range) {
                    const parts = range.replace(/bytes=/, "").split("-")
                    const start = parseInt(parts[0], 10)
                    const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize - 1
                    const chunksize = (end - start) + 1
                    const file = fs.createReadStream(videoPath, { start, end })
                    const head = {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/mp4',
                    }
                    response.writeHead(206, head);
                    file.pipe(response);
                } else {
                    const head = {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                    }
                    response.writeHead(200, head)
                    fs.createReadStream(videoPath).pipe(response)
                }
            } else {
                response.redirect('/');
            }
        })

        this.#app.post('/login', (request, response) => {
            username = request.body.username;
            var password = request.body.password;

            return AccountService.verifyLoginData(username, password, this.#db).then(user => {

                if (user) {
                    request.session.loggedin = true;
                    request.session.accountId = user.getAccountID();
                    console.log(username)
                    request.session.username = username;
                    console.log(request.session.username);
                    request.session.title = user.getTitle();
                    request.session.surname = user.getSurname();
                    request.session.forename = user.getForename();
                    request.session.job = user.getJob();
                    request.session.company = user.getCompany();
                    request.session.email = user.getEmail();
                    response.redirect('/');
                }
                else {
                    return response.render('login', { wrongLoginData: true });
                }
                response.end();
            }).catch(err => {
                console.error(err);
                return response.render('login', { verifyDataFailed: true });
            })
        });

        this.#app.get('/register', (request, response) => {
            if (request.session.registerValid === true) {
                username = request.session.username;
                email = request.session.email;
                response.render('register', { registerValid: true, username: username, email: email });
            }
            else if (request.session.loggedin === true) {
                response.redirect('/');
            }
            else {
                response.render('register', { registerValid: false });
            }
        });

        this.#app.post('/register', (request, response) => {

            if (request.body.username.length > 10) {
                return response.render('register', { invalidUsername: true });
            }

            username = request.body.username;
            email = request.body.email;

            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (emailRegex.test(String(email).toLowerCase())) {

            } else {
                return response.render('register', { invalidEmail: true });
            }

            return AccountService.isUsernameValid(username, this.#db).then(res => {
                if (res) {
                    return AccountService.isEmailValid(email, this.#db).then(res => {
                        if (res) {
                            request.session.registerValid = true;
                            request.session.username = username;
                            request.session.email = email;
                            response.redirect('/register');
                        }
                        else {
                            return response.render('register', { emailTaken: true })
                        }
                        response.end();
                    }).catch(err => {
                        console.error(err);
                        return response.render('register', { verifyDataFailed: true })
                    })
                }
                else {
                    return response.render('register', { usernameTaken: true });
                }
            }).catch(err => {
                console.error(err);
                return response.render('register', { verifyDataFailed: true })
            })
        });

        this.#app.post('/registerValid', (request, response) => {
            username = request.session.username;
            title = request.body.title;

            if (title === "Title") {
                title = "";
            }
            else if (title !== "Mr." && title !== "Mrs." && title !== "Ms." && title !== "Dr." && title !== "Rev." && title !== "Miss" && title !== "Prof.") {
                return response.render('registerValid', { invalidTitle: true });
            }

            surname = request.body.surname;
            forename = request.body.forename;
            job = request.body.job;
            company = request.body.company;
            email = request.session.email;
            var password = request.body.password;

            return AccountService.createAccount(username, title, surname, forename, job, company, email, password, this.#db).then(res => {
                request.session.accountId = res.getAccountID();
                request.session.registerValid = false;
                request.session.loggedin = true;
                request.session.title = res.getTitle();
                request.session.surname = res.getSurname();
                request.session.forename = res.getForename();

                //Needed for creating business card during entering the conference.
                request.session.username = res.getUsername();
                request.session.job = res.getJob();
                request.session.company = res.getCompany();
                request.session.email = res.getEmail();
                response.redirect('/');
                response.end();
            }).catch(err => {
                console.error(err);
                return response.render('registerValid', { registerFailed: true });
            })
        })

        this.#app.post('/editRegistration', (request, response) => {
            request.session.registerValid = false;
            response.redirect('/register');
            response.end();
        })

        this.#app.get('/logout', (request, response) => {
            request.session.destroy();
            response.redirect('/');
        });

        this.#app.get('/account', (request, response) => {
            if (request.session.loggedin = true) {
                username = request.session.username;
                email = request.session.email;
                title = request.session.title;
                forename = request.session.forename;
                surname = request.session.surname;
                job = request.session.job;
                company = request.session.company;
                response.render('account', { loggedIn: true, username: username, email: email, title: title, forename: forename, surname: surname, job: job, company: company });
            }

            else {
                response.render('/');
            }
        })

        this.#app.get('/editAccount', (request, response) => {
            if (request.session.loggedin = true) {
                title = request.session.title;
                forename = request.session.forename;
                surname = request.session.surname;
                job = request.session.job;
                company = request.session.company;
                response.render('editAccount', { loggedIn: true, username: username, email: email, title: title, forename: forename, surname: surname, job: job, company: company })
            }
            else {
                response.render('/');
            }
        })

        this.#app.post('/saveAccountChanges', (request, response) => {
            title = request.body.title;

            if (title === "Title") {
                title = "";
            }
            else if (title !== "Mr." && title !== "Mrs." && title !== "Ms." && title !== "Dr." && title !== "Rev." && title !== "Miss" && title !== "Prof.") {
                return response.render('editAccount', { invalidTitle: true });
            }

            surname = request.body.surname;
            forename = request.body.forename;
            job = request.body.job;
            company = request.body.company;
            var accountId = request.session.accountId;
            username = request.session.username;
            email = request.session.email;

            return AccountService.updateAccountData(accountId, username, title, surname, forename, job, company, email, this.#db).then(res => {
                request.session.accountId = res.getAccountID();
                request.session.title = res.getTitle();
                request.session.surname = res.getSurname();
                request.session.forename = res.getForename();
                request.session.username = res.getUsername();
                request.session.job = res.getJob();
                request.session.company = res.getCompany();
                request.session.email = res.getEmail();
                response.redirect('/account');
            }).catch(err => {
                console.error(err);
                return response.render('editAccount', { editAccountFailed: true });
            })
        })
    }
}