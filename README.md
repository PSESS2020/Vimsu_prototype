# VIMSU

[![coverage](https://img.shields.io/codecov/c/github/PSESS2020/Vimsu_prototype)](https://codecov.io/gh/PSESS2020/Vimsu_prototype)

Welcome to the GitHub repository of VIMSU. This software was developed as a part of the module 'Practice of Software Engineering' during the summer semester 2020 at the Karlsruhe Institute of Technology on the topic 'Virtual conference simulator with telepresence'.

## Table of Contents

- [Description](#description)
- [Requirements](#requirements)
    - [Node](#node)
    - [MongoDB](#mongodb)
    - [Azure Blob Storage](#azure-blob-storage)
- [Installation](#installation)
- [Usage](#usage)
    - [Database configuration](#database-configuration)
    - [Locally Hosted Databases](#locally-hosted-databases)
    - [Hosting](#hosting)
- [Starting a Conference with VIMSU](#starting-a-conference-with-vimsu)
    - [Creating an Account and Accessing the Conference](#creating-an-account-and-accessing-the-conference)
    - [Uploading Lectures](#uploading-lectures)
    - [Granting Participants Moderator Rights](#granting-participants-moderator-rights)
    - [Moderator and Orator Privileges](#moderator-and-orator-privileges)
- [Tests](#tests)
- [Documentation](#documentation)

## Description

VIMSU (Virtual Interactive Meeting SimUlator) is a software that was developed in response to the corona pandemic and is intended to allow scientific conferences and similar events to be held virtually with telepresence. This takes place in the form of an interactive virtual event area. The virtual conference participants are represented by virtual avatars that can be controlled in real-time. They can attend lectures, interact with other participants, or explore the site. In addition, some gameplay elements have been implemented to motivate active participation in the event. 

## Requirements

For develop- or deployment, Node.js needs to be installed in your environment. You will also need a MongoDB account for the database and an Azure Storage account for the cloud storage.

### Node
You can download and install Node.js from the [official Node.js website](https://nodejs.org/). If the installation was successful, you should be able to run the following commands.

    $ node -v
    v12.18.1

    $ npm -v
    6.14.8

If you need to update NPM, use `$ npm install npm@latest -g` to update it to the latest version. For more information, please visit the [official NPM website](https://www.npmjs.com/get-npm).

### MongoDB
In order to host a conference using VIMSU, some data, such as accounts, lecture times etc., needs to be saved in a MongoDB database. Therefore, you need a MongoDB account and an Atlas cluster to store account and conference data before hosting VIMSU. You can create a MongoDB account on the [official MongoDB registration site](https://account.mongodb.com/account/register/). Please follow the tutorial on how to create and setup an Atlas cluster on the [official MongoDB website for creating a new cluster](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).

### Azure Blob Storage
VIMSU does not offer live stream for talks and lectures. Instead, they are pre-recorded and uploaded before the conference is set to start. Due to this, you need an Azure Storage account to store uploaded video files before hosting VIMSU. Please follow the tutorial on how to create a storage account on the [official Microsoft website](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal).

## Installation
Use the following command to create a local copy of VIMSU on your machine.

    $ git clone https://github.com/PSESS2020/Vimsu_prototype.git

This will create a copy of this repository in whatever folder you're executing the command in. Alternatively, you can download the code as a `.zip` by clicking the `Code` button above the repository. Now you just need to extract the `.zip` file into a location of your liking.

## Usage
Before you can host VIMSU, you will need to properly set up the database and the cloud storage.

### Database configuration

You will need to store connection strings for both the database and the cloud storage in a file called `.env`. First, create a copy of `.env.example` file and rename it into `.env`. Next, replace the sample connection strings in this file with your connection strings.

- Azure Blob Storage

    Please follow the tutorial on how to acquire the Azure Storage connection string from your Azure Storage account on the [official Microsoft website](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal).

- MongoDB

    You can acquire the MongoDB connection string by pressing the `Connect` button of your cluster and afterwards the `Connect your application` button. From there, you can just copy the MongoDB connection string. Don’t forget to replace `password` with the password of your database and `dbname` with the name of your database.
    For more information about acquiring the MongoDB connection string, please visit the [official MongoDB website](https://docs.mongodb.com/manual/reference/connection-string/).
    
### Locally Hosted Databases

If you want to try out VIMSU without creating an Azure Storage or a MongoDB account, you can use [Azurite](https://github.com/Azure/Azurite) and host [MongoDB locally](https://docs.mongodb.com/guides/server/install/). Note that this configuration has not been exhaustively tested, so while it should work without issues on at least a small scale, we can not guarantee complete functionality. We advise against using this configuration to host a complete conference.

- Azurite

    Please follow the installation instructions on the [official Azurite GitHub-page.](https://github.com/Azure/Azurite/blob/master/README.md) Note that VIMSU uses the [AzureSDK](https://azure.github.io/azure-sdk/), so you need to setup Azurite for HTTPS connections. This will require the use of additional third-party software such as [mkcert](https://github.com/FiloSottile/mkcert) or [OpenSSL](https://www.openssl.org/) to create your own signed certificates. In the process of installing that software, you might be required to install additional third-party software. Please understand that this software is not supplied by us and we can therefore only offer superficial support for this installation process.
    
    After you have successfully installed Azurite and started a properly configured instance, paste the default HTTPS-connection string (you can use both either the full one or the Blob-only one) into the `.env` file as explained in the section above. You can also create custom connection strings. Please refer to the [Azurite readme](https://github.com/Azure/Azurite/blob/master/README.md) for further instruction on how to do this.
    
- MongoDB

    Please follow the installation instructions for your operating system in the official [MongoDB-documentation](https://docs.mongodb.com/guides/server/install/). After you have successfully installed MongoDB, set up [proper authentification and create an account](https://docs.mongodb.com/guides/server/auth/) for your local instance. Finally, create a connection string according to the [official guideline](https://docs.mongodb.com/manual/reference/connection-string/). Add that string to your `.env` file as described in the section above.

### Hosting
After setting up the database and the cloud storage, use the following command to host VIMSU on your local machine.

    $ cd path/to/Vimsu_prototype/
    $ npm install
    $ npm start

You should see the following logs if you have successfully hosted VIMSU.

    Connected to blob storage
    Vimsu-Server listening on port 5000 . . .
    Connected to Database

To access your locally hosted VIMSU instance, open your browser and enter `http://localhost:5000/`. The following browsers are currently supported:
- Google Chrome Version 84.0.4147.125 or newer
- Microsoft Edge Version 84.0.522.59 or newer
- Opera Version 70.0.3728.71 or newer

## Starting a Conference with VIMSU
After VIMSU is sucessfully hosted, there are certain things you need to know before starting a conference.

### Creating an Account and Accessing the Conference
You can create an account and access the conference by following the steps below:

1. Go to the VIMSU homepage.
2. Click the `Register` button.
3. Fill out the registration form and click the `Register Now` button.
4. Click the button that says `Enter Conference`.

After you have created an account, you will be able to use it to log into any VIMSU instance that uses the same database as the one you created your account on.

### Uploading Lectures
You can upload lectures by following the steps below:

1. Go to the VIMSU homepage and log into your account.
2. Press the `Upload` button.
3. Enter your lecture data and select the video you want to upload.
4. Press the `Create lecture` button.

At this point, the lecture should have been uploaded successfully, but it still has to be accepted.

5. Go to your created cluster in mongoDB.
6. Press the `Collections` button.
7. Go to the `lectures` collection.
8. Search for the lecture you just uploaded and set `isAccepted` from `false` to `true`.

After restarting the server, the lecture should be displayed on the `Schedule` in VIMSU as long as it hasn't expired. It will start at the time you just selected.

### Granting Participants Moderator Rights
You can grant a participant moderator rights by following the steps below:

1. Make sure that the participant has accessed the conference before.
2. Go to your created cluster in mongoDB.
3. Press the `Collections` button.
4. Go to the `participants_<conferenceId>` collection.
5. Search for the participant entry and set `isModerator` from `false` to `true`.

After entering the conference, there should be a noticeable change in the color on the avatar username and the `Role` on the `Profile` should have changed to `Moderator`.

### Moderator and Orator Privileges
Moderators have the following privileges during a conference:

1. They have the right to use commands through the `RoomChat` and through the `LectureChat`. 
After you granted yourself moderator rights, you can see all commands available to you by typing in `\help` in the respective chat.

2. They can join any lecture at any time before the lecture ends, even if the maximum number of listeners has already been exceeded.

3. They have the right to post messages in the `LectureChat` after it has opened, with or without the `QuestionToken`.

Orators have the following privileges during their own lecture:

1. They have the right to use commands through the `LectureChat`. As an orator, you can see all commands available to you by typing in `\help` in the `LectureChat` of your own lecture.

2. They can join their own lecture any time before the lecture ends, even if the maximum number of listeners has already been exceeded.

3. They have the right to post messages in the `LectureChat` of their own lecture after it has opened, with or without the `QuestionToken`.

    
## Tests

- To run the unit tests with Mocha and Chai, use the following command.

      $ npm test
    
- To print the test coverage with Istanbul, use the following command.

      $ npm run coverage

## Documentation

To generate the documentation with JSDoc, use the following command.
    
    $ npm run docs

## Credits

- Audio files from [Mixkit](https://mixkit.co/)