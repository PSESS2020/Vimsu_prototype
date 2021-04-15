const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession);
const bodyParser = require('body-parser');
const AccountService = require('../services/AccountService');
const ParticipantService = require('../../game/app/server/services/ParticipantService')
const SlotService = require('../services/SlotService')
const path = require('path');
const Settings = require('../../game/app/server/utils/Settings.js');
const TypeChecker = require('../../game/app/client/shared/TypeChecker');
const dbClient = require('../../config/db');
const blobClient = require('../../config/blob');
const Account = require('../models/Account');
const nodemailer = require("nodemailer");
const ServerController = require('../../game/app/server/controller/ServerController');

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
    #serverController;

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

        this.#serverController = new ServerController(this.#io, this.#db, this.#blob);
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
                response.render('home', this.#getLoggedInParameters({ conferenceId: Settings.CONFERENCE_ID }, request.session.username));
            } else {
                response.render('home');
            }
        });

        this.#app.get('/about-us', (request, response) => {
            if (request.session.loggedin === true) {
                response.render('about-us', this.#getLoggedInParameters({}, request.session.username));
            } else {
                response.render('about-us');
            }
        });

        this.#app.get('/tutorial', (request, response) => {
            if (request.session.loggedin === true) {
                response.render('tutorial', this.#getLoggedInParameters({}, request.session.username));
            } else {
                response.render('tutorial');
            }
        });

        this.#app.get('/contact-us', (request, response) => {
            if (request.session.loggedin === true) {
                response.render('contact-us', this.#getLoggedInParameters({ email: '', message: '' }, request.session.username));
            } else {
                response.render('contact-us', { email: '', message: '' });
            }
        });

        this.#app.post('/contact-us', (request, response) => {
            const vimsuEmail = process.env.VIMSU_EMAIL;

            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (request.body.email && !emailRegex.test(String(request.body.email).toLowerCase())) {
                if (request.session.loggedin === true) {
                    return response.render('contact-us', this.#getLoggedInParameters({ invalidEmail: true, email: request.body.email, message: request.body.message }, request.session.username));
                } else {
                    return response.render('contact-us', { invalidEmail: true, email: request.body.email, message: request.body.message });
                }
            }

            if (!request.body.message) {
                if (request.session.loggedin === true) {
                    return response.render('contact-us', this.#getLoggedInParameters({ invalidMessage: true, email: request.body.email, message: request.body.message }, request.session.username));
                } else {
                    return response.render('contact-us', { invalidMessage: true, email: request.body.email, message: request.body.message });
                }
            }

            const mailOptions = {
                from: vimsuEmail,
                to: vimsuEmail,
                subject: "New message from contact us form",
                html: `
                    <p>From: <a href="mailto:${request.body.email}">${request.body.email}</a></p>
                    <p>Message: ${request.body.message}</p>
                `
            }

            return this.#sendMail(mailOptions).then(result => {
                if (result === true) {
                    if (request.session.loggedin === true) {
                        response.render('contact-us', this.#getLoggedInParameters({ messageSent: true, email: '', message: '' }, request.session.username));
                    } else {
                        response.render('contact-us', { messageSent: true, email: '', message: '' });
                    }
                } else {
                    if (request.session.loggedin === true) {
                        response.render('contact-us', this.#getLoggedInParameters({ sendMessageFailed: true, email: request.body.email, message: request.body.message }, request.session.username));
                    } else {
                        response.render('contact-us', { sendMessageFailed: true, email: request.body.email, message: request.body.message });
                    }
                }
            })
        })

        this.#app.get('/privacy-policy', (request, response) => {
            if (request.session.loggedin === true) {
                response.render('privacy-policy', this.#getLoggedInParameters({}, request.session.username));
            } else {
                response.render('privacy-policy');
            }
        });

        /* Only needed when video storage is required for this conference */
        if (Settings.VIDEOSTORAGE_ACTIVATED) {
            this.#app.get('/upload', (request, response) => {
                if (request.session.loggedin === true) {
                    response.render('upload', this.#getLoggedInParameters({ title: '', startingTime: '', remarks: '', maxParticipants: '' }, request.session.username));
                } else {
                    response.render('page-not-found');
                }
            });


            this.#app.post('/upload', (request, response) => {
                if (!request.files || Object.keys(request.files).length === 0) {
                    return response.render('upload', this.#getLoggedInParameters({ noFilesUploaded: true, title: request.body.title, startingTime: request.body.startingTime, remarks: request.body.remarks, maxParticipants: request.body.maxParticipants }, request.session.username));
                }

                var maxParticipants = parseInt(request.body.maxParticipants);
                if (maxParticipants % 1 !== 0 || !(isFinite(maxParticipants))) {
                    return response.render('upload', this.#getLoggedInParameters({ notInt: true, title: request.body.title, startingTime: request.body.startingTime, remarks: request.body.remarks, maxParticipants: request.body.maxParticipants }, request.session.username));
                }

                var startingTime = new Date(request.body.startingTime);
                if (startingTime == "Invalid Date") {
                    return response.render('upload', this.#getLoggedInParameters({ notDate: true, title: request.body.title, startingTime: request.body.startingTime, remarks: request.body.remarks, maxParticipants: request.body.maxParticipants }, request.session.username));
                }

                if (!request.body.title) {
                    return response.render('upload', this.#getLoggedInParameters({ invalidLectureTitle: true, title: request.body.title, startingTime: request.body.startingTime, remarks: request.body.remarks, maxParticipants: request.body.maxParticipants }, request.session.username));
                }

                var oratorId = request.session.accountId;
                var video = request.files.video;

                if (path.parse(video.name).ext === '.mp4') {
                    if (video.size > 50 * 1024 * 1024) {
                        return response.render('upload', this.#getLoggedInParameters({ fileSizeExceeded: true, title: request.body.title, startingTime: request.body.startingTime, remarks: request.body.remarks, maxParticipants: request.body.maxParticipants }, request.session.username));
                    }
                    else {
                        response.render('upload', this.#getLoggedInParameters({ uploading: true, title: '', startingTime: '', remarks: '', maxParticipants: '' }, request.session.username))
                        return SlotService.storeVideo(video, this.#blob).then(videoData => {
                            if (videoData) {
                                return SlotService.createSlot(videoData.fileId, videoData.duration, Settings.CONFERENCE_ID, request.body.title, request.body.remarks, startingTime, oratorId, maxParticipants, this.#db).then(res => {
                                    response.end();
                                })
                            }
                        })
                    }
                } else {
                    return response.render('upload', this.#getLoggedInParameters({ unsupportedFileType: true, title: request.body.title, startingTime: request.body.startingTime, remarks: request.body.remarks, maxParticipants: request.body.maxParticipants }, request.session.username));
                }
            });
        }

        this.#app.get('/login', (request, response) => {
            if (request.session.loggedin === true) {
                response.render('page-not-found', this.#getLoggedInParameters({}, request.session.username));
            } else {
                response.render('login', { username: '' });
            }

        });

        this.#app.get('/conference/:id', (request, response) => {
            if (request.session.loggedin === true && request.params.id === Settings.CONFERENCE_ID) {

                return response.sendFile(path.join(__dirname + '../../../game/app/client/views/html/canvas.html'));

            } else {
                response.render('page-not-found');
            }
        })

        this.#app.post('/login', (request, response) => {
            if (!request.body.username || !request.body.password) {
                return response.render('login', { fieldEmpty: true, username: request.body.username });
            }

            return AccountService.verifyLoginData(request.body.username, request.body.password, Settings.CONFERENCE_ID, this.#db).then(user => {

                if (user) {
                    request.session.loggedin = true;
                    request.session.accountId = user.getAccountID();
                    request.session.username = user.getUsername();
                    request.session.forename = user.getForename();
                    response.redirect('/');
                }
                else {
                    response.render('login', { wrongLoginData: true, username: request.body.username });
                }
                response.end();
            })
        });

        this.#app.get('/register', (request, response) => {
            if (request.session.loggedin === true) {
                response.render('page-not-found', this.#getLoggedInParameters({}, request.session.username));
            } else {
                response.render('register', { username: '', forename: '' });
            }
        });

        this.#app.post('/register', (request, response) => {
            const usernameRegex = /^(?=[a-zA-Z0-9._-]{1,10}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/;

            if (!usernameRegex.test(request.body.username)) {
                return response.render('register', { invalidUsernameString: true, username: request.body.username, forename: request.body.forename });
            }

            if (!request.body.password) {
                return response.render('register', { invalidPassword: true, username: request.body.username, forename: request.body.forename });
            }

            if (request.body.password !== request.body.retypedPassword) {
                return response.render('register', { passwordsDontMatch: true, username: request.body.username, forename: request.body.forename });
            }

            if (!request.body.forename) {
                return response.render('register', { invalidForename: true, username: request.body.username, forename: request.body.forename });
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
                    response.render('register', { usernameTaken: true, username: request.body.username, forename: request.body.forename });
                } else {
                    response.render('register', { registerFailed: true, username: request.body.username, forename: request.body.forename });
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
                response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename }, request.session.username))
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
                    return response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, invalidUsernameString: true }, request.session.username));
                }

                if (!request.body.forename) {
                    return response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, invalidForename: true }, request.session.username));
                }

                return AccountService.updateAccountData(accountId, request.body.username, request.body.forename, Settings.CONFERENCE_ID, this.#db).then(res => {
                    if (res instanceof Account) {
                        request.session.accountId = res.getAccountID();
                        request.session.forename = res.getForename();
                        request.session.username = res.getUsername();
                        response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, editAccountSuccess: true }, request.session.username))
                    } else if (res && res.username) {
                        response.render('account-settings', this.#getLoggedInParameters({ usernameTaken: true, forename: request.session.forename }, request.session.username));
                    } else {
                        response.render('account-settings', this.#getLoggedInParameters({ editAccountFailed: true, forename: request.session.forename }, request.session.username));
                    }
                })
            } else if (clickedButton === "deleteAccountButton") {
                return ParticipantService.deleteAccountAndParticipant(accountId, request.session.username, Settings.CONFERENCE_ID, this.#db).then(ppantIdOfDeletedAcc => {
                    if (ppantIdOfDeletedAcc) {
                        this.#serverController.deleteParticipantReferences(ppantIdOfDeletedAcc, request.session.username);
                        response.redirect('/logout');
                    } else {
                        response.render('account-settings', this.#getLoggedInParameters({ deleteAccountFailed: true, forename: request.session.forename }, request.session.username));
                    }
                })
            } else if (clickedButton === "changePasswordButton") {
                if (!request.body.oldPassword || !request.body.newPassword) {
                    return response.render('account-settings', this.#getLoggedInParameters({ changingPassword: true, invalidPassword: true, forename: request.session.forename }, request.session.username))
                }

                if (request.body.newPassword !== request.body.retypedNewPassword) {
                    return response.render('account-settings', this.#getLoggedInParameters({ changingPassword: true, passwordsDontMatch: true, forename: request.session.forename }, request.session.username))
                }

                return AccountService.changePassword(request.session.username, request.body.oldPassword, request.body.newPassword, Settings.CONFERENCE_ID, this.#db).then(res => {
                    if (res === true) {
                        response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, changingPassword: true, changePasswordSuccess: true }, request.session.username))
                    } else if (res === null) {
                        response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, changingPassword: true, oldPasswordWrong: true }, request.session.username))
                    } else {
                        response.render('account-settings', this.#getLoggedInParameters({ forename: request.session.forename, changingPassword: true, changePasswordFailed: true }, request.session.username))
                    }
                })
            }
        })

        this.#app.get('*', (request, response) => {
            if (request.session.loggedin === true) {
                response.render('page-not-found', this.#getLoggedInParameters({}, request.session.username));
            } else {
                response.render('page-not-found');
            }
        });
    }

    #sendMail = async function (mailOptions) {
        return new Promise(function (resolve, reject) {
            const smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                port: 465,
                secure: true,
                auth: {
                    user: mailOptions.from,
                    pass: process.env.VIMSU_EMAIL_PASSWORD
                }
            });

            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error)
                    resolve(false);
                } else {
                    console.log("message sent");
                    resolve(true);
                }
            });
        });
    }

    #getLoggedInParameters = function (otherParameters, username) {
        return { ...otherParameters, videoStorageActivated: Settings.VIDEOSTORAGE_ACTIVATED, loggedIn: true, username: username }
    }
}