# VIMSU

[![coverage](https://img.shields.io/codecov/c/github/PSESS2020/Vimsu_prototype)](https://codecov.io/gh/PSESS2020/Vimsu_prototype)

Welcome to the GitHub repository of VIMSU. This project is developed as part of the software engineering practice module in summer 2020 at the Karlsruhe Institute of Technology on the topic 'Virtual conference simulator with telepresence'.

## Requirements

For development, you will need Node.js installed in your environment. You will also need a mongoDB account for the database and Azure storage account for the cloud storage.

### Node
You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.18.1

    $ npm --version
    6.14.5

### MongoDB
You need a mongoDB account and an Atlas cluster to store account and conference data before hosting VIMSU. You can find more information about creating a cluster on the [official mongoDB website](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).

### Azure Blob Storage
You need an Azure storage account to store uploaded video files before hosting VIMSU. You can find more information about creating a storage account on the [official Microsoft website](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal).

## Installing the project
Use the following command to clone this repository.

    $ git clone https://github.com/PSESS2020/Vimsu_prototype.git

## Setting up the project
Before you can host VIMSU, you will need to set up the databases by creating a `.env` file. Use the following command to create this file.

    $ cd path/to/Vimsu_prototype/
    $ touch .env

In this `.env` file, you will have to store the connection string of the databases. 

- Azure Blob Storage

    You can find more information about how to generate the Azure Storage connection string on the [official Microsoft website](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal).

- MongoDB

    You can get the mongoDB connection string by pressing the `Connect` button of your cluster and afterwards the `Connect your application` button. From there, you can just copy the mongoDB connection string. Don’t forget to replace `password` with the password of your database and `dbname` with the name of your database.
    For more information about how to generate the mongoDB connection string, please visit the [official mongoDB website](https://docs.mongodb.com/manual/reference/connection-string/).

After generating the connection strings, save the strings into the `.env` file using the following command.

    $ echo $'AZURE_STORAGE_CONNECTION_STRING = <your_azure_storage_connection_string>' > .env
    $ echo $'MONGODB_CONNECTION_STRING = <your_mongoDB_connection_string>' >> .env

## Running the project
After setting up the project, use the following command to host VIMSU.

    $ cd path/to/Vimsu_prototype/
    $ npm install
    $ npm start

You should see the following logs if you have successfully hosted VIMSU.

    Connected to blob storage
    Vimsu-Server listening on port 5000 . . .
    Connected to Database

To run VIMSU locally on browser, open your browser and enter `http://localhost:5000/`. The following browsers are currently supported:
- Google Chrome Version 84.0.4147.125 or newer
- Microsoft Edge Version 84.0.522.59 or newer
- Opera Version 70.0.3728.71 or newer
    
## Running the test

- To run the unit tests with Mocha and Chai, use the following command.

      $ npm test
    
- To print the test coverage with Istanbul, use the following command.

      $ npm run coverage

## Generating the documentation

To generate the documentation with JSDoc, use the following command.
    
    $ npm run docs