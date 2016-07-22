const Entity = require('../Entity.js');

module.exports = class EntityTree extends Entity {

    constructor(x, z, y, a) {
        super(x, z, a);
        this.y = y;
        this.wood = 100;
    }

};