const stateManager = require('../../../services/stateManager');

class City {
    constructor(params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.a = params.a || 0;
        this.level = params.level || 0;
        this.type = params.type || 0;
        this.name = params.name || 'no name';
    }
}

City.selectable = true;
City.description = 'This is a City';

module.exports = City;