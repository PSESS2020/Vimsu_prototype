# VIMSU

[![coverage](https://img.shields.io/codecov/c/github/PSESS2020/Vimsu_prototype)](https://codecov.io/gh/PSESS2020/Vimsu_prototype)

Welcome to the GitHub repository of VIMSU. This software is developed as part of the software engineering practice module in the summer semester 2020 at the Karlsruhe Institute of Technology on the topic 'Virtual conference simulator with telepresence'.

## Description

VIMSU (Virtual Interactive Meeting SimUlator) is a software that was developed in response to the corona pandemic and is intended to allow scientific conferences and similar events to be held virtually with telepresence. This takes place in the form of an interactive virtual event area. The virtual conference participants are represented by virtual avatars that can be controlled in real-time. They can attend lectures, interact with other participants, or explore the site. In addition, some gameplay elements have been implemented to motivate active participation in the event. 

## Requirements

For development, you will need Node.js installed in your environment. You will also need a mongoDB account for the database and Azure storage account for the cloud storage.

### Node
You can download and install Node.js from the [official Node.js website](https://nodejs.org/). After the installation, you should normally be able to run this following command.

    $ node --version
    v12.18.1

    $ npm --version
    6.14.5

If `npm --version` didn't return a version, you need to install NPM separately. To install NPM, type `$ npm install npm@latest -g` into your console. Afterwards, run the above command again to make sure that NPM is now installed successfully. You can visit the [official NPM website](https://npmjs.org/) for more information about the NPM installation.

### MongoDB
You need a mongoDB account and an Atlas cluster to store account and conference data before hosting VIMSU. You can create a mongoDB account on the [official mongoDB registration site](https://account.mongodb.com/account/register/). Please follow the tutorial on how to create and setup an Atlas cluster on the [official mongoDB create new cluster site](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).

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

## Uploading lectures
After VIMSU is sucessfully hosted, you can upload lectures by doing the following steps:

1. Go to the VIMSU homepage and log into your account.
2. Press the `Upload` button.
3. Enter your lecture data and select the video you want to upload.
4. Press the `Create lecture and upload video` button.

At this point, the lecture should have been uploaded successfully, but it still has to be accepted.

5. Go to your created cluster in MongoDB.
6. Press the `Collections` button.
7. Go to the `lectures` collection.
8. Look for the lecture you just uploaded and set `isAccepted` from `false` to `true`.

After restarting the server, the lecture should be displayed on the schedule in VIMSU as long as it hasn't expired. It will start at the time you just selected.


    
## Tests

- To run the unit tests with Mocha and Chai, use the following command.

      $ npm test
    
- To print the test coverage with Istanbul, use the following command.

      $ npm run coverage

## Documentation

To generate the documentation with JSDoc, use the following command.
    
    $ npm run docs
