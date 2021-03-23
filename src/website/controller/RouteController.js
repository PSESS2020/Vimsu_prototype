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
const Account = require('../models/Account');

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
                response.render('home', this.#getLoggedInParameters({}, username));
            } else {
                response.render('home');
            }
        });

        this.#app.get('/about-us', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                response.render('about-us', this.#getLoggedInParameters({}, username));
            } else {
                response.render('about-us');
            }
        });

        this.#app.get('/tutorial', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                response.render('tutorial', this.#getLoggedInParameters({}, username));
            } else {
                response.render('tutorial');
            }
        });

        this.#app.get('/contact-us', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                response.render('contact-us', this.#getLoggedInParameters({}, username));
            } else {
                response.render('contact-us');
            }
        });

        this.#app.get('/privacy-policy', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                response.render('privacy-policy', this.#getLoggedInParameters({}, username));
            } else {
                response.render('privacy-policy');
            }
        });

        /* Only needed when video storage is required for this conference */
        if (Settings.VIDEOSTORAGE_ACTIVATED) {
            this.#app.get('/upload', (request, response) => {
                if (request.session.loggedin === true) {
                    username = request.session.username;
                    response.render('upload', this.#getLoggedInParameters({}, username));
                } else {
                    response.render('page-not-found');
                }
            });


            this.#app.post('/upload', (request, response) => {
                if (!request.files || Object.keys(request.files).length === 0) {
                    response.render('upload', this.#getLoggedInParameters({ noFilesUploaded: true }, username));
                }

                var maxParticipants = parseInt(request.body.maxParticipants);
                if (maxParticipants % 1 !== 0 || !(isFinite(maxParticipants))) {
                    response.render('upload', this.#getLoggedInParameters({ notInt: true }, username));
                }

                var startingTime = new Date(request.body.startingTime);
                if (startingTime == "Invalid Date") {
                    response.render('upload', this.#getLoggedInParameters({ notDate: true }, username));
                }

                var lectureTitle = request.body.title;
                var remarks = request.body.remarks;
                var oratorId = request.session.accountId;
                var video = request.files.video;

                if (path.parse(video.name).ext === '.mp4') {
                    if (video.size > 50 * 1024 * 1024) {
                        response.render('upload', this.#getLoggedInParameters({ fileSizeExceeded: true }, username));
                    }
                    else {
                        response.render('upload', this.#getLoggedInParameters({ uploading: true }, username))
                        return SlotService.storeVideo(video, this.#blob).then(videoData => {
                            if (videoData) {
                                return SlotService.createSlot(videoData.fileId, videoData.duration, Settings.CONFERENCE_ID, lectureTitle, remarks, startingTime, oratorId, maxParticipants, this.#db).then(res => {
                                    response.end();
                                })
                            }
                        })
                    }
                } else {
                    response.render('upload', this.#getLoggedInParameters({ unsupportedFileType: true }, username));
                }
            });
        }

        this.#app.get('/login', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                response.render('page-not-found', this.#getLoggedInParameters({}, username));
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
                response.render('page-not-found');
            }
        })

        this.#app.post('/login', (request, response) => {
            return AccountService.verifyLoginData(request.body.username, request.body.password, Settings.CONFERENCE_ID, this.#db).then(user => {

                if (user) {
                    request.session.loggedin = true;
                    request.session.accountId = user.getAccountID();
                    request.session.username = user.getUsername();
                    request.session.forename = user.getForename();
                    response.redirect('/');
                }
                else {
                    response.render('login', { wrongLoginData: true });
                }
                response.end();
            })
        });

        this.#app.get('/register', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                response.render('page-not-found', this.#getLoggedInParameters({}, username));
            } else {
                response.render('register');
            }
        });

        this.#app.post('/register', (request, response) => {
            const usernameRegex = /^(?=[a-zA-Z0-9._-]{1,10}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/;

            if (!usernameRegex.test(request.body.username)) {
                response.render('register', { invalidUsernameString: true });
            }

            return AccountService.createAccount(request.body.username, request.body.forename, request.body.password, Settings.CONFERENCE_ID, this.#db).then(res => {
                if (res instanceof Account) {
                    request.session.accountId = res.getAccountID();
                    request.session.registerValid = false;
                    request.session.loggedin = true;
                    request.session.forename = res.getForename();

                    //Needed for creating business card during entering the conference.
                    request.session.username = res.getUsername();
                    response.redirect('/');
                    response.end();
                } else if (res && res.username) {
                    response.render('register', { usernameTaken: true });
                } else {
                    response.render('register', { registerFailed: true });
                }
            })
        });

        this.#app.get('/logout', (request, response) => {
            if (request.session.loggedin === true) {
                request.session.destroy();
                response.redirect('/');
            } else {
                response.render('page-not-found');
            }
        });

        this.#app.get('/account-settings', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                forename = request.session.forename;
                response.render('account-settings', this.#getLoggedInParameters({ forename: forename }, username))
            }
            else {
                response.render('page-not-found');
            }
        })

        this.#app.post('/account-settings', (request, response) => {
            var clickedButton = request.body.accountSettingsButton;
            var accountId = request.session.accountId;
            
            if (clickedButton === "saveChangesButton") {
                const usernameRegex = /^(?=[a-zA-Z0-9._-]{1,10}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/;

                if (!usernameRegex.test(request.body.username)) {
                    response.render('account-settings', this.#getLoggedInParameters({ forename: forename, invalidUsernameString: true }, username));
                }
    
                return AccountService.updateAccountData(accountId, request.body.username, request.body.forename, Settings.CONFERENCE_ID, this.#db).then(res => {
                    if (res instanceof Account) {
                        request.session.accountId = res.getAccountID();
                        request.session.forename = res.getForename();
                        request.session.username = res.getUsername();
                        response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, editAccountSuccess: true }, request.session.username))
                    } else if (res && res.username) {
                        response.render('account-settings', this.#getLoggedInParameters({ usernameTaken: true, forename: forename }, username));
                    } else {
                        response.render('account-settings', this.#getLoggedInParameters({ editAccountFailed: true, forename: forename }, username));
                    }
                })
            } else if (clickedButton === "deleteAccountButton") {
                return AccountService.deleteAccountAndParticipant(accountId, Settings.CONFERENCE_ID, this.#db).then (res => {
                    if (res) {
                        response.redirect('/logout');
                    } else {
                        response.render('account-settings', this.#getLoggedInParameters({ deleteAccountFailed: true, forename: forename }, username));
                    }
                })
            } else if (clickedButton === "changePasswordButton") {
                return AccountService.changePassword(request.session.username, request.body.oldPassword, request.body.newPassword, Settings.CONFERENCE_ID, this.#db).then(res => {
                    if (res) {
                        response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, changePasswordSuccess: true }, request.session.username))
                    } else {
                        response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, changePasswordFailed: true }, request.session.username))
                    }
                })
            }
        })

        this.#app.get('*', (request, response) => {
            if (request.session.loggedin === true) {
                username = request.session.username;
                response.render('page-not-found', this.#getLoggedInParameters({}, username));
            } else {
                response.render('page-not-found');
            }
        });
    }

    #getLoggedInParameters = function (otherParameters, username) {
        return { ...otherParameters, videoStorageActivated: Settings.VIDEOSTORAGE_ACTIVATED, loggedIn: true, username: username }
    }
}