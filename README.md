# Vimsu

[![coverage](https://img.shields.io/codecov/c/github/PSESS2020/Vimsu_prototype)](https://codecov.io/gh/PSESS2020/Vimsu_prototype)

Welcome to the GitHub repository of Vimsu. The project Vimsu is developed as part of the software engineering practice module in summer 2020 at the Karlsruhe Institute of Technology on the topic 'Virtual conference simulator with telepresence'.

## Requirements

For development, you will only need Node.js installed in your environment.

### Node
You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.18.1

    $ npm --version
    6.14.5

###
## Installing the project

    $ git clone https://github.com/PSESS2020/Vimsu_prototype.git

## Running the project

    $ cd path/to/Vimsu_prototype/
    $ npm install
    $ npm start
    
## Running the test

- To run the unit tests with Mocha and Chai, use the following command.

      $ npm test
    
- To print the test coverage with Istanbul, use the following command.

      $ npm run coverage

- To print the documentation with JSDoc, use the following command.
    
      $ npm run docs