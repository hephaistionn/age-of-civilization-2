const Entity = require('../Entity.js');

class EntityHouse extends Entity {

    constructor(x, z, y, a) {
        super(x, z, y, a);
        this.space = 4;
    }

}

EntityHouse.tile_x = 1;
EntityHouse.tile_z = 1;
EntityHouse.walkable = false;
module.exports = EntityHouse;
