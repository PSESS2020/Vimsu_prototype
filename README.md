# VIMSU

[![coverage](https://img.shields.io/codecov/c/github/PSESS2020/Vimsu_prototype)](https://codecov.io/gh/PSESS2020/Vimsu_prototype)

Welcome to the GitHub repository of VIMSU. This software is developed as part of the software engineering practice module in the summer semester 2020 at the Karlsruhe Institute of Technology on the topic 'Virtual conference simulator with telepresence'.

## Table of Contents

- [Description](#description)
- [Requirements](#requirements)
    - [Node](#node)
    - [MongoDB](#mongodb)
    - [Azure Blob Storage](#azure-blob-storage)
- [Installation](#installation)
- [Usage](#usage)
    - [Database configuration](#database-configuration)
    - [Hosting](#hosting)
- [Starting a conference with VIMSU](#starting-a-conference-with-vimsu)
    - [Uploading Lectures](#uploading-lectures)
    - [Granting participants moderator rights](#granting-participants-moderator-rights)
    - [Moderator and orator privileges](#moderator-and-orator-privileges)
- [Tests](#tests)
- [Documentation](#documentation)

## Description

VIMSU (Virtual Interactive Meeting SimUlator) is a software that was developed in response to the corona pandemic and is intended to allow scientific conferences and similar events to be held virtually with telepresence. This takes place in the form of an interactive virtual event area. The virtual conference participants are represented by virtual avatars that can be controlled in real-time. They can attend lectures, interact with other participants, or explore the site. In addition, some gameplay elements have been implemented to motivate active participation in the event. 

## Requirements

For development, you will need Node.js installed in your environment. You will also need a mongoDB account for the database and Azure storage account for the cloud storage.

### Node
You can download and install Node.js from the [official Node.js website](https://nodejs.org/). If the installation was successful, you should be able to run this following command.

    $ node -v
    v12.18.1

    $ npm -v
    6.14.8

If you need to update NPM, use `$ npm install npm@latest -g` to update it to the latest version. For more information, please visit the [official NPM website](https://www.npmjs.com/get-npm).

### MongoDB
You need a mongoDB account and an Atlas cluster to store account and conference data before hosting VIMSU. You can create a mongoDB account on the [official mongoDB registration site](https://account.mongodb.com/account/register/). Please follow the tutorial on how to create and setup an Atlas cluster on the [official mongoDB website for creating new cluster](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).

### Azure Blob Storage
You need an Azure Storage account to store uploaded video files before hosting VIMSU. Please follow the tutorial on how to create a storage account on the [official Microsoft website](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal).

## Installation
Use the following command to create a local copy of this software on your computer.

    $ git clone https://github.com/PSESS2020/Vimsu_prototype.git

## Usage
Before you can host VIMSU, you will need to set up the databases.

### Database configuration

You will need to store the connection string of the databases in a file called `.env`.

- Azure Blob Storage

    Please follow the tutorial on how to acquire the Azure Storage connection string from your Azure Storage account on the [official Microsoft website](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal).

- MongoDB

    You can acquire the mongoDB connection string by pressing the `Connect` button of your cluster and afterwards the `Connect your application` button. From there, you can just copy the mongoDB connection string. Don’t forget to replace `password` with the password of your database and `dbname` with the name of your database.
    For more information about acquiring the mongoDB connection string, please visit the [official mongoDB website](https://docs.mongodb.com/manual/reference/connection-string/).

After acquiring both connection strings, save these into the `.env` file using the following command.

- Linux / Mac

      $ cd path/to/Vimsu_prototype/
      $ echo $'AZURE_STORAGE_CONNECTION_STRING = <your_azure_storage_connection_string>' > .env
      $ echo $'MONGODB_CONNECTION_STRING = <your_mongoDB_connection_string>' >> .env

- Windows

      $ cd path/to/Vimsu_prototype/
      $ echo AZURE_STORAGE_CONNECTION_STRING = <your_azure_storage_connection_string> > .env
      $ echo MONGODB_CONNECTION_STRING = <your_mongoDB_connection_string> >> .env

You should now see the following lines in the `.env` file on root directory.

    AZURE_STORAGE_CONNECTION_STRING = <your_azure_storage_connection_string>
    MONGODB_CONNECTION_STRING = <your_mongoDB_connection_string>

### Hosting
After setting up the databases, use the following command to host VIMSU.

    $ cd path/to/Vimsu_prototype/
    $ npm install
    $ npm start

You should see the following logs if you have successfully hosted VIMSU.

    Connected to blob storage
    Vimsu-Server listening on port 5000 . . .
    Connected to Database

To host VIMSU locally on browser, open your browser and enter `http://localhost:5000/`. The following browsers are currently supported:
- Google Chrome Version 84.0.4147.125 or newer
- Microsoft Edge Version 84.0.522.59 or newer
- Opera Version 70.0.3728.71 or newer

## Starting a conference with VIMSU
After VIMSU is sucessfully hosted, there are certain things you need to know before starting a conference.

### Uploading lectures
You can upload lectures by following the steps below:

1. Go to the VIMSU homepage and log into your account.
2. Press the `Upload` button.
3. Enter your lecture data and select the video you want to upload.
4. Press the `Create lecture and upload video` button.

At this point, the lecture should have been uploaded successfully, but it still has to be accepted.

5. Go to your created cluster in mongoDB.
6. Press the `Collections` button.
7. Go to the `lectures` collection.
8. Search for the lecture you just uploaded and set `isAccepted` from `false` to `true`.

After restarting the server, the lecture should be displayed on the `Schedule` in VIMSU as long as it hasn't expired. It will start at the time you just selected.

### Granting participants moderator rights
You can grant a participant moderator rights by following the steps below:

1. Make sure that the participant has entered the conference before.
2. Go to your created cluster in mongoDB.
3. Press the `Collections` button.
4. Go to the `participants_<conferenceId>` collection.
5. Search for the participant entry and set `isModerator` from `false` to `true`.

After entering the conference, there should be a noticeable change in the color on the avatar username and the `Role` on the `Profile` should have changed to `Moderator`.

### Moderator and orator privileges
Moderators have the following privileges during a conference:

1. They have the right to use commands through the `RoomChat` and through the `LectureChat`. 
After you granted yourself moderator rights, you can see all commands by typing in `\help` in the respective `Chat`.

2. They can join any lectures any time before the lecture ends, even if the maximum number of listeners is already exceeded.

3. They have the right to post messages in the `LectureChat` after it has opened, with or without the `QuestionToken`.

Orators have the following privileges during their own lecture:

1. They have the right to use commands through the `LectureChat`. As an orator, you can see all commands by typing in `\help` in the `LectureChat` of your own lecture.

2. They can join their own lecture any time before the lecture ends, even if the maximum number of listeners is already exceeded.

3. They have the right to post messages in the `LectureChat` of their own lecture after it has opened, with or without the `QuestionToken`.

    
## Tests

- To run the unit tests with Mocha and Chai, use the following command.

      $ npm test
    
- To print the test coverage with Istanbul, use the following command.

      $ npm run coverage

## Documentation

To generate the documentation with JSDoc, use the following command.
    
    $ npm run docs
