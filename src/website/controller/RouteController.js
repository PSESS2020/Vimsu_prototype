const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const MemoryStore = require('memorystore')(expressSession);
const bodyParser = require('body-parser');
const AccountService = require('../services/AccountService');
const ParticipantService = require('../../game/app/server/services/ParticipantService');
const SlotService = require('../services/SlotService')
const path = require('path');
const Settings = require('../../game/app/server/utils/' + process.env.SETTINGS_FILENAME);
const TypeChecker = require('../../game/app/client/shared/TypeChecker');
const dbClient = require('../../config/db');
const blobClient = require('../../config/blob');
const Account = require('../models/Account');
const nodemailer = require("nodemailer");
const ServerController = require('../../game/app/server/controller/ServerController');
const TypeOfRole = require('../utils/TypeOfRole');
const handlebars = require("handlebars");
const fs = require("fs");
const LectureService = require('../../game/app/server/services/LectureService');

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
    #languagePackages;

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

        //Load all available language files from language folder
        this.#languagePackages = new Map();
        fs.readdirSync(__dirname + "/../views/language").forEach(file => {
            let lang = file.replace('.json', '');
            this.#languagePackages.set(lang, require("../views/language/" + file));
        });

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
        const dbSuffix = Settings.ACCOUNTDB_SUFFIX;

        /* Only needed when video storage is required for this conference */
        if (Settings.VIDEOSTORAGE_ACTIVATED) {
            //creates video container in blob storage at the beginning as we will need it to store lecture videos
            SlotService.createVideoContainer(this.#blob);
        }

        const titleOptions = ["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof.", "Rev."];

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
        this.#app.use(cookieParser());

        this.#app.get('/', (request, response) => {
            const viewToRender = 'home'
            this.#renderGeneralView(request, response, viewToRender, { conferenceId: Settings.CONFERENCE_ID }, viewToRender, {})
        });

        this.#app.get('/language', (request, response) => {
            const selectedLanguage = request.query.type

            if (!selectedLanguage || ![...this.#languagePackages.keys()].includes(selectedLanguage)) {
                const viewToRender = 'page-not-found'
                return this.#renderGeneralView(request, response, viewToRender, {}, viewToRender, {})
            }

            response.cookie('language', request.query.type)
            response.redirect(request.header('Referer') || "/")
        });

        this.#app.get('/about-us', (request, response) => {
            const viewToRender = 'about-us'
            this.#renderGeneralView(request, response, viewToRender, {}, viewToRender, {})
        });

        this.#app.get('/tutorial', (request, response) => {
            const viewToRender = 'tutorial'
            this.#renderGeneralView(request, response, viewToRender, {}, viewToRender, {})
        });

        this.#app.get('/contact-us', (request, response) => {
            const vimsuDefaultEmail = process.env.VIMSU_DEFAULT_EMAIL;

            const viewToRender = 'contact-us'
            const parameter = { email: '', message: '', vimsu_default_email: vimsuDefaultEmail }

            this.#renderGeneralView(request, response, viewToRender, parameter, viewToRender, parameter)
        });

        this.#app.post('/contact-us', (request, response) => {
            const vimsuEmail = process.env.VIMSU_NOREPLY_EMAIL;
            const vimsuDefaultEmail = process.env.VIMSU_DEFAULT_EMAIL;

            const viewToRender = 'contact-us'
            let defaultParameters = { email: request.body.email, message: request.body.message, vimsu_default_email: vimsuDefaultEmail }

            let parameter = undefined;

            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            const invalidEmail = { name: 'invalidEmail', value: request.body.email && !emailRegex.test(String(request.body.email).toLowerCase()) }
            const invalidMessage = { name: 'invalidMessage', value: !request.body.message }

            const errors = [invalidEmail, invalidMessage]
            const isError = errors.some((error) => error.value === true);

            if (isError) {
                parameter = this.#getErrorParameter(defaultParameters, errors)
                return this.#renderGeneralView(request, response, viewToRender, parameter, viewToRender, parameter)
            }

            const filteredMessage = request.body.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br/>');

            const mailOptions = {
                from: vimsuEmail,
                to: vimsuDefaultEmail,
                subject: "New message from contact us form",
                html: `
                    <p>From: <a href="mailto:${request.body.email}">${request.body.email}</a></p>
                    <p>Message:<br>${filteredMessage}</p>
                `
            }

            return this.#sendMail(mailOptions, vimsuEmail, process.env.VIMSU_NOREPLY_EMAIL_PASSWORD).then(result => {
                if (result === true) {
                    defaultParameters.email = ''
                    defaultParameters.message = ''
                    parameter = { ...defaultParameters, messageSent: true }

                    if (request.body.email) {
                        const from = vimsuEmail;
                        const subject = "Your message to VIMSU";
                        const message = `
                            This is a confirmation message that we have received your message and will get back to you as soon as possible.<br><br>
                            <small>Your message:<br>${filteredMessage}</small>
                        `;
                        const messageReason = "we received a message from the contact us form";

                        const mailOptions = this.#getMailOptionsWithDefaultTemplate("there", from, request.body.email, { show: false }, subject, message, messageReason)
                        this.#sendMail(mailOptions, from, process.env.VIMSU_NOREPLY_EMAIL_PASSWORD);
                    }
                } else {
                    parameter = { ...defaultParameters, sendMessageFailed: true }
                }

                this.#renderGeneralView(request, response, viewToRender, parameter, viewToRender, parameter)
            })
        })

        if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
            this.#app.get('/verify-account/:token', (request, response) => {
                let viewToRender = 'verify-account'

                return AccountService.getAccountByVerificationToken(request.params.token, dbSuffix, this.#db).then(account => {
                    if (account /* TODO Production && !account.isActive*/) {
                        return AccountService.activateAccount(account.accountId, request.params.token, dbSuffix, this.#db).then(result => {
                            const parameter = { verifySuccess: result }
                            this.#renderGeneralView(request, response, viewToRender, parameter, viewToRender, parameter)
                        })
                    } else {
                        viewToRender = 'page-not-found'
                        this.#renderGeneralView(request, response, viewToRender, {}, viewToRender, {})
                    }
                })

            })
        }

        this.#app.get('/privacy-policy', (request, response) => {
            const viewToRender = 'privacy-policy'
            this.#renderGeneralView(request, response, viewToRender, {}, viewToRender, {})
        });

        /* Only needed when video storage is required for this conference */
        if (Settings.VIDEOSTORAGE_ACTIVATED) {
            this.#app.get('/my-dashboard/upload', (request, response) => {
                this.#renderGeneralView(request, response, 'upload', { title: '', startingTime: '', remarks: '', maxParticipants: '' }, 'page-not-found', {})
            });

            this.#app.post('/my-dashboard/upload', (request, response) => {
                if (Settings.ADVANCED_REGISTRATION_SYSTEM && request.session.role !== TypeOfRole.ADMIN) return;

                const viewToRender = 'upload'

                let defaultParameters = { title: request.body.title, startingTime: request.body.startingTime, remarks: request.body.remarks, maxParticipants: request.body.maxParticipants }
                let parameter = undefined

                const noFilesUploaded = { name: 'noFilesUploaded', value: !request.files || Object.keys(request.files).length === 0 }

                const maxParticipants = parseInt(request.body.maxParticipants);
                const notInt = { name: 'notInt', value: maxParticipants % 1 !== 0 || !(isFinite(maxParticipants)) }

                const startingTime = new Date(request.body.startingTime);
                const notDate = { name: 'notDate', value: startingTime == "Invalid Date" }

                const invalidLectureTitle = { name: 'invalidLectureTitle', value: !request.body.title };

                const oratorId = request.session.accountId;
                const video = request.files.video;

                const unsupportedFileType = { name: 'unsupportedFileType', value: path.parse(video.name).ext === '.mp4' }

                const fileSizeExceeded = { name: 'fileSizeExceeded', value: !unsupportedFileType && video.size > 50 } * 1024 * 1024

                const errors = [noFilesUploaded, notInt, notDate, invalidLectureTitle, unsupportedFileType, fileSizeExceeded]
                const isError = errors.some((error) => error.value === true);

                if (isError) {
                    parameter = this.#getErrorParameter(defaultParameters, errors)
                    return this.#renderLoggedInView(request, response, viewToRender, parameter)
                }

                defaultParameters = { title: '', startingTime: '', remarks: '', maxParticipants: '' }

                this.#renderLoggedInView(request, response, viewToRender, { ...defaultParameters, uploading: true })

                if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                    const from = process.env.VIMSU_NOREPLY_EMAIL
                    const subject = "Your lecture has been submitted";
                    const message = `
                        This is a confirmation message that you have successfully submitted your lecture:<br><br><small>
                        Title: ${request.body.title}<br>
                        Starting time: ${request.body.startingTime}<br>
                        Max participants: ${request.body.maxParticipants}<br>
                        Remarks: ${request.body.remarks}<br>
                        Video: ${video.name}
                        </small>
                    `;
                    const messageReason = "we received a request to submit a lecture with your account";

                    const mailOptions = this.#getMailOptionsWithDefaultTemplate(request.session.username, from, request.session.email, { show: false }, subject, message, messageReason)

                    this.#sendMail(mailOptions, from, process.env.VIMSU_NOREPLY_EMAIL_PASSWORD);
                }

                return SlotService.storeVideo(video, this.#blob).then(videoData => {
                    if (videoData) {
                        return SlotService.createSlot(videoData.fileId, videoData.duration, Settings.CONFERENCE_ID, request.body.title, request.body.remarks, startingTime, oratorId, maxParticipants, this.#db).then(res => {
                            response.end();
                        })
                    }
                })
            });
        }

        this.#app.get('/login', (request, response) => {
            this.#renderGeneralView(request, response, 'page-not-found', {}, 'login', { usernameOrEmail: '' })
        });

        this.#app.get('/conference/:id', (request, response) => {
            if (request.session.loggedin === true && request.params.id === Settings.CONFERENCE_ID) {
                request.session.languageData = this.#languagePackages.get(this.#getLanguage(request, response));
                return response.sendFile(path.join(__dirname + '../../../game/app/client/views/html/canvas.html'));
            } else {
                this.#renderNotLoggedInView(request, response, 'page-not-found', {});
            }
        })

        this.#app.post('/login', (request, response) => {
            const viewToRender = 'login'

            let defaultParameters = { usernameOrEmail: request.body.usernameOrEmail }
            let parameter = undefined

            const fieldEmpty = { name: 'fieldEmpty', value: !request.body.usernameOrEmail || !request.body.password }

            const errors = [fieldEmpty]
            const isError = errors.some((error) => error.value === true);

            if (isError) {
                parameter = this.#getErrorParameter(defaultParameters, errors)
                return this.#renderNotLoggedInView(request, response, viewToRender, parameter);
            }

            return AccountService.verifyLoginData(request.body.usernameOrEmail, request.body.password, dbSuffix, this.#db).then(user => {

                if (user) {
                    request.session.loggedin = true;
                    request.session.accountId = user.getAccountID();
                    request.session.username = user.getUsername();
                    request.session.forename = user.getForename();

                    if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                        request.session.title = user.getTitle();
                        request.session.surname = user.getSurname();
                        request.session.job = user.getJob();
                        request.session.company = user.getCompany();
                        request.session.email = user.getEmail();
                        request.session.role = user.getRole();
                    }

                    response.redirect('/');
                } else {
                    this.#renderNotLoggedInView(request, response, viewToRender, { ...defaultParameters, wrongLoginData: true });
                }

                response.end();
            })
        });

        if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
            this.#app.get('/reset-password/:token', (request, response) => {
                return AccountService.getAccountByForgotPasswordToken(request.params.token, dbSuffix, this.#db).then(account => {
                    let viewToRender = 'reset-password'

                    if (!account) {
                        viewToRender = 'page-not-found'
                    }

                    this.#renderGeneralView(request, response, viewToRender, {}, viewToRender, {});
                })
            });


            this.#app.post('/reset-password/:token', (request, response) => {
                const viewToRender = 'reset-password'

                let defaultParameters = {}
                let parameter = undefined

                const invalidPassword = { name: 'invalidPassword', value: !request.body.newPassword }
                const passwordsDontMatch = { name: 'passwordsDontMatch', value: request.body.newPassword !== request.body.retypedNewPassword }

                const errors = [invalidPassword, passwordsDontMatch]
                const isError = errors.some((error) => error.value === true);

                if (isError) {
                    parameter = this.#getErrorParameter(defaultParameters, errors)
                    return this.#renderGeneralView(request, response, viewToRender, parameter, viewToRender, parameter)
                }

                return AccountService.resetPassword(request.params.token, request.body.newPassword, dbSuffix, this.#db).then(({ username, email, success }) => {
                    if (username && email && success) {
                        parameter = { ...defaultParameters, changePasswordSuccess: true }

                        const from = process.env.VIMSU_NOREPLY_EMAIL
                        const subject = "Your password has been changed";
                        const message = "This is a confirmation message that you have successfully changed your password.";
                        const messageReason = "we received a request to change your password for your account";

                        const mailOptions = this.#getMailOptionsWithDefaultTemplate(username, from, email, { show: false }, subject, message, messageReason)

                        this.#sendMail(mailOptions, from, process.env.VIMSU_NOREPLY_EMAIL_PASSWORD);
                    } else {
                        parameter = { ...defaultParameters, changePasswordFailed: true }
                    }

                    this.#renderGeneralView(request, response, viewToRender, parameter, viewToRender, parameter)
                })
            });

            this.#app.get('/forgot-password', (request, response) => {
                this.#renderGeneralView(request, response, 'page-not-found', {}, 'forgot-password', { email: '' })
            });

            this.#app.post('/forgot-password', (request, response) => {
                const viewToRender = 'forgot-password'

                let defaultParameters = { email: request.body.email }
                let parameter = undefined

                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const invalidEmail = { name: 'invalidEmail', value: !emailRegex.test(String(request.body.email).toLowerCase()) }

                const errors = [invalidEmail]
                const isError = errors.some((error) => error.value === true);

                if (isError) {
                    parameter = this.#getErrorParameter(defaultParameters, errors)
                    return this.#renderNotLoggedInView(request, response, viewToRender, parameter);
                }

                return AccountService.generateForgotPasswordToken(request.body.email, dbSuffix, this.#db).then(({ username, token }) => {
                    if (username && token) {
                        const from = process.env.VIMSU_NOREPLY_EMAIL;
                        const subject = "Reset your VIMSU password";
                        const message = "We received a request to reset your VIMSU password. Please click on the link below to set a new password for your account. Your password will not be changed if you ignore this message.";
                        const messageReason = "we received a request to reset your password for your account";
                        const button = {
                            show: true,
                            name: "Reset Password",
                            url: `${process.env.VIMSU_DOMAIN}/reset-password/${token}`
                        }

                        const mailOptions = this.#getMailOptionsWithDefaultTemplate(username, from, request.body.email, button, subject, message, messageReason)

                        return this.#sendMail(mailOptions, from, process.env.VIMSU_NOREPLY_EMAIL_PASSWORD).then(result => {
                            if (result === true) {
                                defaultParameters.email = ''
                                parameter = { ...defaultParameters, messageSent: true, sentTo: request.body.email }
                            } else {
                                parameter = { ...defaultParameters, sendMessageFailed: true }
                            }

                            this.#renderNotLoggedInView(request, response, viewToRender, parameter);
                        })
                    }

                    this.#renderNotLoggedInView(request, response, viewToRender, parameter);
                })
            });
        }

        this.#app.get('/register', (request, response) => {
            if (request.session.loggedin === true) {
                this.#renderLoggedInView(request, response, 'page-not-found', {})
            } else {
                const viewToRender = 'register'
                let parameter = { advancedRegistrationSystem: Settings.ADVANCED_REGISTRATION_SYSTEM, username: '', forename: '' }

                if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                    parameter = { ...parameter, email: '', surname: '', title: '', job: '', company: '', titleOptions: titleOptions }
                }

                this.#renderNotLoggedInView(request, response, viewToRender, parameter);
            }
        });

        this.#app.post('/register', (request, response) => {
            const viewToRender = 'register'

            let defaultParameters = { advancedRegistrationSystem: Settings.ADVANCED_REGISTRATION_SYSTEM, username: request.body.username, forename: request.body.forename }

            if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                defaultParameters = { ...defaultParameters, email: request.body.email, surname: request.body.surname, title: request.body.title, job: request.body.job, company: request.body.company, titleOptions: titleOptions }
            }

            let parameter = undefined

            const usernameRegex = /^(?=[a-zA-Z0-9._-]{1,32}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/;
            const invalidUsernameString = { name: 'invalidUsernameString', value: !usernameRegex.test(request.body.username) }

            const invalidPassword = { name: 'invalidPassword', value: !request.body.password }
            const passwordsDontMatch = { name: 'passwordsDontMatch', value: request.body.password !== request.body.retypedPassword }
            const invalidForename = { name: 'invalidForename', value: !request.body.forename }

            let errors = [invalidUsernameString, invalidPassword, passwordsDontMatch, invalidForename]

            if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const invalidEmail = { name: 'invalidEmail', value: !emailRegex.test(String(request.body.email).toLowerCase()) }

                const title = request.body.title
                const invalidTitle = { name: 'invalidTitle', value: title && !titleOptions.includes(title) }

                errors.push(invalidEmail, invalidTitle)
            }

            const isError = errors.some((error) => error.value === true);

            if (isError) {
                parameter = this.#getErrorParameter(defaultParameters, errors)
                return this.#renderNotLoggedInView(request, response, viewToRender, parameter);
            }

            const accountData = {
                title: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.title : undefined,
                surname: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.surname : undefined,
                job: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.job : undefined,
                company: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.company : undefined,
                email: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.email : undefined,
                role: Settings.ADVANCED_REGISTRATION_SYSTEM ? TypeOfRole.PARTICIPANT : undefined
            }

            return AccountService.createAccount(request.body.username, accountData.title, accountData.surname, request.body.forename, accountData.job, accountData.company, accountData.email, request.body.password, accountData.role, dbSuffix, this.#db).then(res => {
                if (Settings.ADVANCED_REGISTRATION_SYSTEM && res && res.token) {
                    const from = process.env.VIMSU_NOREPLY_EMAIL;
                    const subject = "Verify your email address for VIMSU";
                    const message = "Thanks for signing up for VIMSU! Before we get started, we need to confirm that it's you. Please click on the link below to verify your email address.";
                    const messageReason = "we received a request to activate your account";
                    const button = {
                        show: true,
                        name: "Verify Email",
                        url: `${process.env.VIMSU_DOMAIN}/verify-account/${res.token}`
                    }

                    const mailOptions = this.#getMailOptionsWithDefaultTemplate(request.body.username, from, request.body.email, button, subject, message, messageReason)

                    return this.#sendMail(mailOptions, from, process.env.VIMSU_NOREPLY_EMAIL_PASSWORD).then(result => {
                        if (result === true) {
                            defaultParameters.forename = ""
                            defaultParameters.username = ""
                            defaultParameters.email = ""
                            defaultParameters.surname = ""
                            defaultParameters.title = ""
                            defaultParameters.job = ""
                            defaultParameters.company = ""

                            parameter = { ...defaultParameters, registerSuccess: true, sentTo: request.body.email }
                        } else {
                            parameter = { ...defaultParameters, registerFailed: true }
                        }

                        this.#renderNotLoggedInView(request, response, viewToRender, parameter);
                    })
                } else if (!Settings.ADVANCED_REGISTRATION_SYSTEM && res instanceof Account) {
                    request.session.accountId = res.getAccountID();
                    request.session.registerValid = false;
                    request.session.loggedin = true;
                    request.session.forename = res.getForename();

                    //Needed for creating business card during entering the conference.
                    request.session.username = res.getUsername();
                    return response.redirect('/');
                }

                if (res && res.username) {
                    parameter = { ...defaultParameters, usernameTaken: true }
                } else if (Settings.ADVANCED_REGISTRATION_SYSTEM && res && res.email) {
                    parameter = { ...defaultParameters, emailTaken: true }
                } else {
                    parameter = { ...defaultParameters, registerFailed: true }
                }

                this.#renderNotLoggedInView(request, response, viewToRender, parameter);
            })

        });

        this.#app.get('/logout', (request, response) => {
            if (request.session.loggedin === true) {
                request.session.destroy((err) => {
                    if (!err) {
                        response.redirect('/');
                    }
                });
            } else {
                this.#renderNotLoggedInView(request, response, 'page-not-found', {});
            }
        });

        this.#app.get('/:username/account-settings', (request, response) => {
            if (request.session.loggedin === true && request.params.username === request.session.username) {
                let defaultParameters = { forename: request.session.forename }
                let parameter = undefined;

                if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                    parameter = { ...defaultParameters, email: request.session.email, title: request.session.title, surname: request.session.surname, job: request.session.job, company: request.session.company, titleOptions: titleOptions }
                } else {
                    parameter = defaultParameters
                }

                this.#renderLoggedInView(request, response, 'account-settings', parameter)
            }
            else {
                this.#renderNotLoggedInView(request, response, 'page-not-found', {});
            }
        })

        this.#app.post('/:username/account-settings', (request, response) => {
            const clickedButton = request.body.accountSettingsButton;

            const accountId = request.session.accountId;

            const viewToRender = 'account-settings'

            let defaultParameters = { forename: request.session.forename }

            if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                defaultParameters = { ...defaultParameters, email: request.session.email, title: request.session.title, surname: request.session.surname, job: request.session.job, company: request.session.company, titleOptions: titleOptions }
            }

            let parameter = undefined

            if (clickedButton === "saveChangesButton") {
                const usernameRegex = /^(?=[a-zA-Z0-9._-]{1,32}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/;
                const invalidUsernameString = { name: 'invalidUsernameString', value: !usernameRegex.test(request.body.username) }
                const invalidForename = { name: 'invalidForename', value: !request.body.forename }

                let errors = [invalidUsernameString, invalidForename]

                if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    const invalidEmail = { name: 'invalidEmail', value: !emailRegex.test(String(request.body.email).toLowerCase()) }

                    const title = request.body.title
                    const invalidTitle = { name: 'invalidTitle', value: title && !titleOptions.includes(title) }

                    errors.push(invalidEmail, invalidTitle)
                }

                const isError = errors.some((error) => error.value === true);

                if (isError) {
                    parameter = this.#getErrorParameter(defaultParameters, errors)
                    return this.#renderLoggedInView(request, response, viewToRender, parameter)
                }

                const accountData = {
                    title: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.title : undefined,
                    surname: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.surname : undefined,
                    job: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.job : undefined,
                    company: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.company : undefined,
                    email: Settings.ADVANCED_REGISTRATION_SYSTEM ? request.body.email : undefined
                }

                return AccountService.updateAccountData(accountId, request.body.username, accountData.title, accountData.surname, request.body.forename, accountData.job, accountData.company, accountData.email, dbSuffix, this.#db).then(res => {
                    if (res instanceof Account) {
                        request.session.accountId = res.getAccountID();
                        defaultParameters.forename = request.session.forename = res.getForename();
                        request.session.username = res.getUsername();

                        if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                            defaultParameters.title = request.session.title = res.getTitle();
                            defaultParameters.surname = request.session.surname = res.getSurname();
                            defaultParameters.job = request.session.job = res.getJob();
                            defaultParameters.company = request.session.company = res.getCompany();
                            defaultParameters.email = request.session.email = res.getEmail();
                            request.session.role = res.getRole();
                        }

                        parameter = { ...defaultParameters, editAccountSuccess: true }
                    } else if (res && res.username) {
                        parameter = { ...defaultParameters, usernameTaken: true }
                    } else if (Settings.ADVANCED_REGISTRATION_SYSTEM && res && res.email) {
                        parameter = { ...defaultParameters, emailTaken: true }
                    } else {
                        parameter = { ...defaultParameters, editAccountFailed: true }
                    }

                    this.#renderLoggedInView(request, response, viewToRender, parameter)
                })
            } else if (clickedButton === "deleteAccountButton") {
                return ParticipantService.deleteAccountAndParticipant(accountId, request.session.username, Settings.ACCOUNTDB_SUFFIX, this.#db).then(ppantIdOfDeletedAcc => {
                    if (ppantIdOfDeletedAcc !== false) {
                        if (Settings.VIDEOSTORAGE_ACTIVATED) {
                            LectureService.deleteLecturesByOratorId(this.#db, this.#blob, accountId);
                        }
                        if (ppantIdOfDeletedAcc !== "")
                            this.#serverController.deleteParticipantReferences(ppantIdOfDeletedAcc, request.session.username);

                        if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                            const from = process.env.VIMSU_NOREPLY_EMAIL
                            const subject = "Your account has been deleted";
                            const message = "This is a confirmation message that you have successfully deleted your VIMSU account.";
                            const messageReason = "we received a request to delete your account";

                            const mailOptions = this.#getMailOptionsWithDefaultTemplate(request.session.username, from, request.session.email, { show: false }, subject, message, messageReason)

                            this.#sendMail(mailOptions, from, process.env.VIMSU_NOREPLY_EMAIL_PASSWORD);
                        }

                        response.redirect('/logout');
                    } else {
                        this.#renderLoggedInView(request, response, viewToRender, { ...defaultParameters, deleteAccountFailed: true })
                    }
                })
            } else if (clickedButton === "changePasswordButton") {
                defaultParameters = { ...defaultParameters, changingPassword: true }

                const invalidPassword = { name: 'invalidPassword', value: !request.body.oldPassword || !request.body.newPassword }
                const passwordsDontMatch = { name: 'passwordsDontMatch', value: request.body.newPassword !== request.body.retypedNewPassword }

                const errors = [invalidPassword, passwordsDontMatch]
                const isError = errors.some((error) => error.value === true);

                if (isError) {
                    parameter = this.#getErrorParameter(defaultParameters, errors)
                    return this.#renderLoggedInView(request, response, viewToRender, parameter)
                }

                return AccountService.changePassword(request.session.username, request.body.oldPassword, request.body.newPassword, dbSuffix, this.#db).then(res => {
                    if (res === true) {
                        parameter = { ...defaultParameters, changePasswordSuccess: true }

                        if (Settings.ADVANCED_REGISTRATION_SYSTEM) {
                            const from = process.env.VIMSU_NOREPLY_EMAIL
                            const subject = "Your password has been changed";
                            const message = "This is a confirmation message that you have successfully changed your password.";
                            const messageReason = "we received a request to change your password for your account";

                            const mailOptions = this.#getMailOptionsWithDefaultTemplate(request.session.username, from, request.session.email, { show: false }, subject, message, messageReason)

                            this.#sendMail(mailOptions, from, process.env.VIMSU_NOREPLY_EMAIL_PASSWORD);
                        }
                    } else if (res === null) {
                        parameter = { ...defaultParameters, oldPasswordWrong: true }
                    } else {
                        parameter = { ...defaultParameters, changePasswordFailed: true }
                    }

                    this.#renderLoggedInView(request, response, viewToRender, parameter)
                })
            }
        })

        this.#app.get('*', (request, response) => {
            const viewToRender = 'page-not-found'
            this.#renderGeneralView(request, response, viewToRender, {}, viewToRender, {})
        });
    }

    /**
     * @private Get mail options with default template
     * @method module:RouteController#getMailOptionsWithDefaultTemplate
     */
    #getMailOptionsWithDefaultTemplate = function (username, senderEmail, receiverEmail, button, subject, message, messageReason) {
        const htmlTemplatePath = path.join(__dirname, '../views/email-template/default-template.html');
        const source = fs.readFileSync(htmlTemplatePath, 'utf-8').toString();
        const htmlTemplate = handlebars.compile(source);
        const replacements = {
            username: username,
            vimsu_domain: process.env.VIMSU_DOMAIN,
            vimsu_default_email: process.env.VIMSU_DEFAULT_EMAIL,
            sent_to: receiverEmail,
            button: button.show,
            button_name: button.name,
            action_url: button.url,
            message: message,
            message_reason: messageReason
        };
        const htmlToSend = htmlTemplate(replacements);

        return {
            from: senderEmail,
            to: receiverEmail,
            subject: subject,
            attachments: [{
                filename: 'vimsu_logo_schrift_transparent.png',
                path: path.join(__dirname, '../assets/vimsu_logo_schrift_transparent.png'),
                cid: 'logo'
            }],
            html: htmlToSend
        }
    }

    /**
     * @private Handle sending email with Nodemailer
     * @method module:RouteController#sendMail
     */
    #sendMail = async function (mailOptions, email, emailPassword) {
        return new Promise(function (resolve, reject) {
            const smtpTransport = nodemailer.createTransport({
                service: process.env.VIMSU_NOREPLY_EMAIL_SMTP_SERVICE,
                port: process.env.VIMSU_NOREPLY_EMAIL_SMTP_PORT,
                secure: true,
                auth: {
                    user: email,
                    pass: emailPassword
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

    /**
     * @private Get logged in parameters for rendering view
     * @method module:RouteController#getLoggedInParameters
     */
    #getLoggedInParameters = function (request, response, otherParameters) {
        const languageData = this.#languagePackages.get(this.#getLanguage(request, response));
        const availableLanguages = Array.from(this.#languagePackages.keys());
        return { ...otherParameters, videoStorageActivated: Settings.VIDEOSTORAGE_ACTIVATED, advancedRegistrationSystem: Settings.ADVANCED_REGISTRATION_SYSTEM, loggedIn: true, 
                    availableLanguages: availableLanguages, languageData: languageData, username: request.session.username }
    }

    /**
     * @private Get not logged in parameters for rendering view
     * @method module:RouteController#getNotLoggedInParameters
     */
    #getNotLoggedInParameters = function (request, response, otherParameters) {
        const languageData = this.#languagePackages.get(this.#getLanguage(request, response));
        const availableLanguages = Array.from(this.#languagePackages.keys());
        return { ...otherParameters, availableLanguages: availableLanguages, languageData: languageData, advancedRegistrationSystem: Settings.ADVANCED_REGISTRATION_SYSTEM }
    }

    /**
     * @private Get error parameters for rendering view
     * @method module:RouteController#getErrorParameter
     */
    #getErrorParameter = function (defaultParameters, errors) {
        for (const error of errors) {
            if (error.value === true) {
                return { ...defaultParameters, [error.name]: true }
            }
        }

        return undefined
    }

    /**
     * @private Render view for logged in and not logged in case. 
     * @method module:RouteController#renderGeneralView
     */
    #renderGeneralView = function (request, response, loggedInViewToRender, loggedInParameter, notLoggedInViewToRender, notLoggedInParameter) {
        if (request.session.loggedin === true) {
            return this.#renderLoggedInView(request, response, loggedInViewToRender, loggedInParameter)
        } else {
            return this.#renderNotLoggedInView(request, response, notLoggedInViewToRender, notLoggedInParameter);
        }
    }

    /**
     * @private Render view for logged in case. 
     * @method module:RouteController#renderLoggedInView
     */
    #renderLoggedInView = function (request, response, viewToRender, parameter) {
        return response.render(viewToRender, this.#getLoggedInParameters(request, response, parameter));
    }

    /**
     * @private Render view for not logged in case. 
     * @method module:RouteController#renderNotLoggedInView
     */
    #renderNotLoggedInView = function (request, response, viewToRender, parameter) {
        return response.render(viewToRender, this.#getNotLoggedInParameters(request, response, parameter));
    }

    /**
     * @private Get session language. If not set, then get default language
     * @method module:RouteController#getLanguage
     */
    #getLanguage = function (request, response) {
        let language = request.cookies['language'];

        if (!language) {
            language = request.acceptsLanguages(...[...this.#languagePackages.keys()]);
            if (!language) {
                language = Settings.DEFAULT_LANGUAGE;
            }
            response.cookie('language', language);
        }

        return language;
    }
}