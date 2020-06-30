var MapView = require('./MapView.js')
var TypeChecker = require('../../../utils/TypeChecker.js')

module.exports = class FoyerView extends MapView {
    constructor() {
        super();
    }

    draw() {
        
    }

    #drawGameObjects(objectType) {
        TypeChecker.isInt(objectType);
    }

}