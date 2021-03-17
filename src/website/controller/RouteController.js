const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession);
const bodyParser = require('body-parser');
const AccountService = require('../services/AccountService');
const SlotService = require('../services/SlotService')
const path = require('path');
const Settings = require('../../game/app/server/utils/Settings.js');
const TypeChecker = require('../../game/app/client/shared/TypeChecker');
const dbClient = require('../../config/db');
const blobClient = require('../../config/blob');
const UAParser = require('ua-parser-js');

/**
 * The Route Controller
 * @module RouteController
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class RouteController {

    #app;
    #io;
    #db;
    #blob;

    /**
     * Creates an instance of RouteController
     * @constructor module:RouteController
     * 
     * @param {Express} app Express server
     * @param {SocketIO} io Socket.io instance
     * @param {dbClient} db db instance
     * @param {blobClient || undefined} blob blob instance if video storage is required, otherwise undefined
     */
    constructor(app, io, db, blob) {
        if (!!RouteController.instance) {
            return RouteController.instance;
        }

        RouteController.instance = this;

        TypeChecker.isInstanceOf(db, dbClient);

        if (Settings.VIDEOSTORAGE_ACTIVATED)
            TypeChecker.isInstanceOf(blob, blobClient);

        this.#app = app;
        this.#io = io;
        this.#db = db;
        this.#blob = blob;
        this.#init();
    }

    /**
     * @private Initialize the GET and POST methods. 
     * On receiving a GET request, the express server will render the corresponding ejs file.
     * On receiving a POST request, this will call the corresponding service method and
     * the express server will render the appropriate views depending on the failure/success status.
     * @method module:RouteController#init
     */
    #init = function () {

        /* Only needed when video storage is required for this conference */
        if (Settings.VIDEOSTORAGE_ACTIVATED) {
            //creates video container in blob storage at the beginning as we will need it to store lecture videos
            SlotService.createVideoContainer(this.#blob);
        }

        var username, forename;

        //sets the view engine to ejs, ejs is required to render templates
        this.#app.set('view engine', 'ejs');

        //sets the views directory for rendering the ejs templates
        this.#app.set('views', path.join(__dirname, '../views/ejs'));

        this.#app.use(bodyParser.urlencoded({ extended: true }));
        this.#app.use(bodyParser.json());

        /* Only needed when video storage is required for this conference */
        if (Settings.VIDEOSTORAGE_ACTIVATED) {
            this.#app.use(fileUpload({
                useTempFiles: true,
                tempFileDir: '/tmp/'
            }));
        }

        var sessionMiddleware = expressSession({
            secret: 'secret',
            store: new MemoryStore({
                checkPeriod: 86400000 // prune expired entries every 24h
            }),
            resave: true,
            saveUninitialized: true
        });

        //Allows to access the session from the server side
        this.#io.use(function (socket, next) {
            sessionMiddleware(socket.request, socket.request.res || {}, next)
        });

        this.#app.use(sessionMiddleware);

        this.#app.get('/', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                forename = request.session.forename;
                response.render('index', { videoStorageActivated: Settings.VIDEOSTORAGE_ACTIVATED, loggedIn: true, username: username, forename: forename });
            } else {
                response.render('index');
            }

        });

        /* Only needed when video storage is required for this conference */
        if (Settings.VIDEOSTORAGE_ACTIVATED) {
            this.#app.get('/upload', (request, response) => {
                if (request.session.loggedin === true) {
                    response.render('upload', { loggedIn: true, username: username, forename: forename, videoStorageActivated: Settings.VIDEOSTORAGE_ACTIVATED });
                } else {
                    response.redirect('/');
                }
            });


            this.#app.post('/upload', (request, response) => {
                if (!request.files || Object.keys(request.files).length === 0) {
                    return response.render('upload', { noFilesUploaded: true, loggedIn: true, username: username, forename: forename });
                }

                var maxParticipants = parseInt(request.body.maxParticipants);
                if (maxParticipants % 1 !== 0 || !(isFinite(maxParticipants))) {
                    return response.render('upload', { notInt: true, loggedIn: true, username: username, forename: forename });
                }

                var startingTime = new Date(request.body.startingTime);
                if (startingTime == "Invalid Date") {
                    return response.render('upload', { notDate: true, loggedIn: true, username: username, forename: forename });
                }

                var lectureTitle = request.body.title;
                var remarks = request.body.remarks;
                var oratorId = request.session.accountId;
                var video = request.files.video;

                if (path.parse(video.name).ext === '.mp4') {
                    if (video.size > 50 * 1024 * 1024) {
                        return response.render('upload', { fileSizeExceeded: true, loggedIn: true, username: username, forename: forename });
                    }
                    else {
                        response.render('upload', { uploading: true, loggedIn: true, username: username, forename: forename })
                        return SlotService.storeVideo(video, this.#blob).then(videoData => {
                            if (videoData) {
                                return SlotService.createSlot(videoData.fileId, videoData.duration, Settings.CONFERENCE_ID, lectureTitle, remarks, startingTime, oratorId, maxParticipants, this.#db).then(res => {
                                    response.end();
                                }).catch(err => {
                                    console.error(err);
                                })
                            }
                        }).catch(err => {
                            console.error(err);
                        })
                    }
                } else {
                    return response.render('upload', { unsupportedFileType: true, loggedIn: true, username: username, forename: forename });
                }
            });
        }

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
                new ServerController(this.#io, this.#db, this.#blob);
                response.sendFile(path.join(__dirname + '../../../game/app/client/views/html/canvas.html'));
               
            } else {
                response.redirect('/');
            }
        })

        this.#app.post('/login', (request, response) => {
            username = request.body.username;
            var password = request.body.password;

            return AccountService.verifyLoginData(username, password, Settings.CONFERENCE_ID, this.#db).then(user => {

                if (user) {
                    request.session.loggedin = true;
                    request.session.accountId = user.getAccountID();
                    request.session.username = username;
                    request.session.forename = user.getForename();
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
                response.render('register', { registerValid: true, username: username });
            }
            else if (request.session.loggedin === true) {
                response.redirect('/');
            }
            else {
                response.render('register', { registerValid: false });
            }
        });

        this.#app.post('/register', (request, response) => {
            const usernameRegex = /^(?=[a-zA-Z0-9._-]{1,10}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/;

            if (!usernameRegex.test(request.body.username)) {
                return response.render('register', { invalidUsernameString: true });
            }

            username = request.body.username

            return AccountService.isUsernameValid(username, Settings.CONFERENCE_ID, this.#db).then(res => {
                if (res) {
                    request.session.registerValid = true;
                    request.session.username = username;
                    response.redirect('/register');

                    response.end();
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
            forename = request.body.forename;
            var password = request.body.password;

            return AccountService.createAccount(username, forename, password, Settings.CONFERENCE_ID, this.#db).then(res => {
                if (res) {
                    request.session.accountId = res.getAccountID();
                    request.session.registerValid = false;
                    request.session.loggedin = true;
                    request.session.forename = res.getForename();

                    //Needed for creating business card during entering the conference.
                    request.session.username = res.getUsername();
                }

                response.redirect('/');
                response.end();
            }).catch(err => {
                console.error(err);
                return response.render('register', { registerFailed: true });
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
            if (request.session.loggedin === true) {
                username = request.session.username;
                forename = request.session.forename;
                response.render('account', { loggedIn: true, username: username, forename: forename, videoStorageActivated: Settings.VIDEOSTORAGE_ACTIVATED });
            }

            else {
                response.redirect('/');
            }
        })

        this.#app.get('/editAccount', (request, response) => {
            if (request.session.loggedin === true) {
                forename = request.session.forename;
                response.render('editAccount', { loggedIn: true, username: username, forename: forename, videoStorageActivated: Settings.VIDEOSTORAGE_ACTIVATED })
            }
            else {
                response.redirect('/');
            }
        })

        this.#app.post('/saveAccountChanges', (request, response) => {

            forename = request.body.forename;
            var accountId = request.session.accountId;
            username = request.session.username;

            return AccountService.updateAccountData(accountId, username, forename, Settings.CONFERENCE_ID, this.#db).then(res => {
                request.session.accountId = res.getAccountID();
                request.session.forename = res.getForename();
                request.session.username = res.getUsername();
                response.redirect('/account');
            }).catch(err => {
                console.error(err);
                return response.render('editAccount', { editAccountFailed: true, loggedIn: true, username: username, forename: forename });
            })
        })
    }
}