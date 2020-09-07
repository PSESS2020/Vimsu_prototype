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
- [Uploading Lectures](#uploading-lectures)
- [Granting participants moderator rights](#granting-participants-moderator-rights)
- [Moderator privileges](#moderator-privileges)
- [Decorating room](#decorating-room)
- [Adding new rooms](#adding-new-rooms)
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
You need an Azure storage account to store uploaded video files before hosting VIMSU. Please follow the tutorial on how to create a storage account on the [official Microsoft website](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal).

## Installation
Use the following command to create a local copy of this software on your computer.

    $ git clone https://github.com/PSESS2020/Vimsu_prototype.git

## Usage
Before you can host VIMSU, you will need to set up the databases.

### Database configuration

First, you will need to store the database configuration in a `.env` file. Use the following command to create this file in root directory.

    $ cd path/to/Vimsu_prototype/
    $ touch .env

In this `.env` file, you will need to store the connection string of the databases. 

- Azure Blob Storage

    Please follow the tutorial on how to generate the Azure Storage connection string on the [official Microsoft website](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal).

- MongoDB

    You can get the mongoDB connection string by pressing the `Connect` button of your cluster and afterwards the `Connect your application` button. From there, you can just copy the mongoDB connection string. Don’t forget to replace `password` with the password of your database and `dbname` with the name of your database.
    For more information about generating the mongoDB connection string, please visit the [official mongoDB website](https://docs.mongodb.com/manual/reference/connection-string/).

After generating the connection strings, save the strings into the `.env` file using the following command.

    $ echo $'AZURE_STORAGE_CONNECTION_STRING = <your_azure_storage_connection_string>' > .env
    $ echo $'MONGODB_CONNECTION_STRING = <your_mongoDB_connection_string>' >> .env

You should now see the following lines in the `.env` file.

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
You can grant yourself moderator rights by following the steps below:

1. Go to the VIMSU homepage and log into your account.
2. Press the `Enter Conference` button.

At this point, your participant entry should have been saved in the database as a normal participant.

3. Go to your created cluster in mongoDB.
4. Press the `Collections` button.
5. Go to the `participants_1` collection.
6. Search for your participant entry and set `isModerator` from `false` to `true`.

After refreshing the page, you should be able to notice the color change on your avatar username and the `Role` on `Profile` should have changed to `Moderator`.

### Moderator and orator privileges
Moderators have certain privileges during a conference. 

1. They have the right to use commands through the `RoomChat` and through the `LectureChat`. 
After you granted yourself moderator rights, you can see all commands by typing in `\help` in the respective chat.

2. They can join every lecture at every time, even if the maximum of listeners is already exceeded.

3. They have the right to post messages in the `LectureChat` after it has opened, with or without the `QuestionToken`.

During their own lecture, orators have the same rights as moderators.

### Decorating room
TODO

### Adding new rooms
TODO
    
## Tests

- To run the unit tests with Mocha and Chai, use the following command.

      $ npm test
    
- To print the test coverage with Istanbul, use the following command.

      $ npm run coverage

## Documentation

To generate the documentation with JSDoc, use the following command.
    
    $ npm run docs
