const Entity = require('../Entity.js');

class EntityHouse extends Entity {

    constructor(x, z, a) {
        super(x, z, a);
        this.space = 4;
    }

}

EntityHouse.tile_x = 1;
EntityHouse.tile_z = 1;
EntityHouse.type = 'building';
module.exports = EntityHouse;
